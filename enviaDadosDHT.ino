
#include <ESP8266WiFi.h>
#include <espnow.h>
#include <DHT.h>

#define id 405
#define del 50000
#define canal 3

DHT dht(2,DHT11);

// MAC do slave: 48:55:19:12:68:F6

uint8_t broadcastAddress[] = {0x48, 0x55, 0x19, 0x12, 0x68, 0xF6};
//uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

typedef struct struct_message {
  
  float umidade;
  float temperatura;
  int idSensor;
  
} struct_message;
struct_message myData;

unsigned long lastTime = 0;  
unsigned long timerDelay = 120000;
int tentativas = 3;


void OnDataSent(uint8_t *mac_addr, uint8_t sendStatus) {
  Serial.print("Last Packet Send Status: ");

  if (sendStatus == 0){
    tentativas = 3;
    Serial.println("Delivery success");
  }
  else{
    tentativas--;
    Serial.println("Delivery fail");
    
     if(tentativas != 0){
      esp_now_send(broadcastAddress, (uint8_t *) &myData, sizeof(myData));
      delay(3000);
    }else{
      tentativas = 3;
      Serial.printf("Delivery fail %d times\n", tentativas);
    }
    }
  }
  
void setup() {
  delay(del);
  Serial.begin(9600);
  WiFi.mode(WIFI_STA);
  dht.begin();
  
      if (esp_now_init() != 0) {
        Serial.println("Error initializing ESP-NOW\n");
        return;
      }
      
  wifi_promiscuous_enable(1);
  wifi_set_channel(canal);
  wifi_promiscuous_enable(0);
  
  esp_now_set_self_role(ESP_NOW_ROLE_CONTROLLER);
  esp_now_register_send_cb(OnDataSent);
  esp_now_add_peer(broadcastAddress, ESP_NOW_ROLE_SLAVE,1, NULL, 0);
  
  Serial.print("Configuração  concluida!\n"); 
  Serial.println("-----------------------------------------------");
  WiFi.printDiag(Serial);
}

void loop() {
    if((millis() - lastTime) > timerDelay  || lastTime == 0 ){
       float temp = dht.readTemperature();
       float umid = dht.readHumidity() ;
       
            if (isnan(temp) || isnan(umid)){
              Serial.println("Falha em ler o sensor!");
            }else{
              Serial.print("Umidade: ");
              Serial.println(umid);
              Serial.print("Temperatura: ");
              Serial.println(temp);
              
              myData.umidade = umid;
              myData.temperatura = temp;
              myData.idSensor = id; 
              
              esp_now_send(broadcastAddress, (uint8_t *) &myData, sizeof(myData));
                }
           lastTime = millis();
    }
  }
