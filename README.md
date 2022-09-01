 Projeto Interdisciplinar - Eng. Eletronica e de Telecomunicaçoes - UFU.
 
 O projeto possui o objetivo de fazer a leitura de temperatura e humidade de 5 laboratorios, o hardware utilizado foram 5 placas NodeMCU, que foram estruturadas da seguinte forma.
 
 ![image](https://user-images.githubusercontent.com/98746083/187809960-46f7cc57-36b9-4f6f-9709-bcff95086d93.png)
 
 Os nós mestres enviam dados para o nó central, utilizando o protocolo ESP-NOW, que  agrupa e envia os dados para o firebase. Com isso a  webpage exibi os ultimos valores armazenados e um grafico com historico de no maximo 7 dias.

Sao 5 sensores, onde 4 utilizam o sensor DHT11 e 1 utiliza o sensor BME280, o esquematico é mostrado abaixo:

![image](https://user-images.githubusercontent.com/98746083/187810591-0fff3302-c695-4206-abf2-756506670d8f.png)
![image](https://user-images.githubusercontent.com/98746083/187810607-8703a47c-605f-4e68-8c7a-5a0a6cd7e75f.png)



![image](https://user-images.githubusercontent.com/98746083/187810655-95ec9d08-cb07-48d7-8b28-427b5d943be1.png)


 


