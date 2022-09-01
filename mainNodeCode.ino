/*
  Projeto PI - Monitoramento de temperatura e Umidade nos Laboratorios de eletronica da UFU - Patos de Minas
  Autores:

  Dayane Cristina
  Gustavo Teixeira
  Hiago Santos

  Ver. 1.2 (21/07/22)
*/

//Bibliotecas
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include <ESP8266Ping.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <espnow.h>

#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

#define WIFI_SSID "*******"                                                               // SSID da rede 
#define WIFI_PASSWORD "*******"                                                          // Senha da rede

//#define SEALEVELPRESSURE_HPA (1013.25)                                                  // Pressao relativa

// Dados de conexao do Firebase
#define API_KEY "*****"                                 // Chave da API do Firebase
#define USER_EMAIL "*****"                                                     // Usuario  no Firebase
#define USER_PASSWORD "*****"                                                      // Senha do usuario no Firebase
#define DATABASE_URL "*****"              // Link do banco de dados Firebase


// Objetos do Firebase
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
FirebaseJson json;

WiFiUDP ntpUDP;                                                                           // Inicia o cliente NTP para receber o horario
NTPClient timeClient(ntpUDP, "pool.ntp.org");                                             // Passa o endereço do server NTP
Adafruit_BME280 bme;                                                                      // I2C             
                                                         
// Variaveis
String uid;                                                                               // Armazena o ID do usuario
String databasePath;                                                                      // Caminho principal de armazenamento dos dados
int timeStamp;                                                                            // Armazena o carimbo de tempo atual
bool statusEnvio = false;                                                                 // Status do envio JSON
unsigned long tempoAnterior = 0;                                                          // Armzena o  tempo do ultimo envio em ms
unsigned long tempoEnvio = 600000;                                                         // Armazena o delay  entre envios em ms(600.000 = 10min)
unsigned long delayTime;

int tL41, tL42, tL43, tL44, tL45;                                                         // Armazenamento de temperaturas
int uL41, uL42, uL43, uL44, uL45;                                                         // Armazenamento de umidades
int pressao;

typedef struct struct_message {
  float umidade;
  float temperatura;
  int sensorID;
} struct_message;

struct_message myData;

void setup() {
  Serial.begin(9600);
  delay(2000);                                                                            // Aguarda 2 seg antes de iniciar (evita o corte  no monitor serial)
  iniciaWiFi();
  configuraFirebase();
  //iniciaBMP();

  if (esp_now_init() != 0) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }
  esp_now_set_self_role(ESP_NOW_ROLE_SLAVE);
  esp_now_register_recv_cb(recebeDadosEsp);
}

void loop() {

  if (Firebase.ready() && (millis() - tempoAnterior > tempoEnvio || tempoAnterior == 0)) {
    tempoAnterior = millis();
    timeStamp = recebeCarimboTempo();
    //pressao = (int)bme.readPressure() / 100.0F;
    //tL42 = (int)bme.readTemperature();
    //uL42 = (int)bme.readHumidity();

//    tL41 = tL43 + random(-3,3);
//    tL42 = tL43 + random(-3,3);
//    tL43 = tL43 + random(-3,3);
//    tL44 = tL43 + random(-3,3);
//    tL45 = tL43 + random(-3,3);
//
//    uL41 = uL43 + random(-5,5);
//    uL42 = uL43 + random(-5,5);
//    uL43 = uL43 + random(-5,5);
//    uL44 = uL43 + random(-5,5);
//    uL45 = uL43 + random(-5,5);
    
    enviaJSON(tL41, tL42, tL43, tL44, tL45, uL41, uL42, uL43, uL44, uL45, pressao, (String)timeStamp);
       tL41 = 0;
       tL42 = 0;
       tL43 = 0;
       tL44 = 0;
       tL45 = 0;
       uL41 = 0;
       uL42 = 0;
       uL43 = 0;
       uL44 = 0;
       uL45 = 0;
  }
}

void enviaJSON(int tL401, int tL402, int tL403, int tL404, int tL405, int uL401, int uL402, int uL403, int uL404, int uL405, int pres,  String stamp)
{
  do {
    json.set("/TempL401", tL401);
    json.set("/UmidL401", uL401);

    json.set("/TempL402", tL402);
    json.set("/UmidL402", uL402);

    json.set("/TempL403", tL403);
    json.set("/UmidL403", uL403);

    json.set("/TempL404", tL404);
    json.set("/UmidL404", uL404);

    json.set("/TempL405", tL405);
    json.set("/UmidL405", uL405);

    json.set("/Pressao", pres);

    statusEnvio = Firebase.RTDB.setJSON(&fbdo, "/" + uid + "/" + stamp, &json);

    if (statusEnvio) {
      Serial.println("\nJSON enviado\n");
      Serial.printf("\nCarimbo de Tempo: %i \n", timeStamp);
      json.toString(Serial, true);
      Serial.println("");
    } else
    {
      Serial.printf( "Erro: %s , tentando novamente...", fbdo.errorReason().c_str());
      delay(2000);
    }
  } while (!statusEnvio);

  json.iteratorEnd();                                                                     // Limpa o JSON
}

unsigned long recebeCarimboTempo()
{
  timeClient.update();
  unsigned long now = timeClient.getEpochTime();
  return now;
}

void iniciaWiFi()                                                                         // Conecta a rede Wifi e testa a conexao com a internet
{
  WiFi.mode(WIFI_AP_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  
  Serial.printf("Conectando a \"%s\" , aguarde.", WIFI_SSID);
  while (WiFi.status() != WL_CONNECTED)                                                   // Aguarda a conexao com a rede Wifi
  {
    Serial.print('.');
    delay(1000);
  }
  Serial.println("\nConectado ao WiFi! ");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  
  Serial.print("Canal Wifi: "); 
  Serial.println(WiFi.channel());
  
  Serial.println("Testando conexao com a internet...");
  Ping.ping("www.google.com.br") ? Serial.println("Conectado a internet :)") : Serial.println("Sem acesso a internet :/");

  Serial.println("-----------------------------------------------");
}

void configuraFirebase()
{
  do {
    config.api_key = API_KEY;                                                             // Atribui a API key do banco de dados
    auth.user.email = USER_EMAIL;                                                         // Atribui o email do usuario
    auth.user.password = USER_PASSWORD;                                                   // Atribui a senha do usuario
    config.database_url = DATABASE_URL;                                                   // Atribui o link do banco de dados

    Firebase.reconnectWiFi(true);

    fbdo.setResponseSize(4096);
    Serial.println("Status do Token:");
    config.token_status_callback = tokenStatusCallback;                                   // Retorna o status do token
    config.max_token_generation_retry = 5;                                                // Numero maximo de geraçao de token
    Firebase.begin(&config, &auth);                                                       // Inicializa o Firebase com as configuraçoes e autenticaçao
    delay(3000);
  } while (!Firebase.ready());                                                            // Confere se a conexao foi bem sucedida

  Serial.print("Recebendo o ID do usuario(UID), aguarde.");
  while ((auth.token.uid) == "")                                                          // Aguarda um UID valido
  {
    Serial.print('.');
    delay(1000);
  }
  uid = auth.token.uid.c_str();                                                           // Coloca o UID recebido na String uid
  Serial.print("\nUID:  ");
  Serial.println(uid);
  Serial.println("-----------------------------------------------");

}

void recebeDadosEsp(uint8_t * mac, uint8_t *incomingData, uint8_t len) {
  memcpy(&myData, incomingData, sizeof(myData));

  if (myData.sensorID == 401) {
    tL41 = (int)myData.temperatura;
    uL41 = (int)myData.umidade;
  }
   else if (myData.sensorID == 402) {
    tL42 = (int)myData.temperatura;
    uL42 = (int)myData.umidade;
  }
  else if (myData.sensorID == 403) {
    tL43 = (int)myData.temperatura;
    uL43 = (int)myData.umidade;
  }
  else if (myData.sensorID == 404) {
    tL44 = (int)myData.temperatura;
    uL44 = (int)myData.umidade;
  }
  else if (myData.sensorID == 405) {
    tL45 = (int)myData.temperatura;
    uL45 = (int)myData.umidade;
  }
  else  {
    Serial.println("ID desconhecido");
  }
  Serial.printf("Dados recebidos do Sensor: ID%d ->T: %d | U:%d\n", (int)myData.sensorID, (int)myData.temperatura, (int)myData.umidade);

}

void iniciaBMP()
{
  while (!bme.begin(0x76)) {
    Serial.println("Erro ao ler o BMP280!");
    delay(2000);
    Serial.println("Tentando Novamente!");
  }
}
