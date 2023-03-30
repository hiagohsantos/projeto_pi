 Projeto Interdisciplinar - Eng. Eletronica e de Telecomunicaçoes - UFU.
 
 O projeto possui o objetivo de fazer a leitura de temperatura e humidade de 5 laboratorios, o hardware utilizado foram 5 placas NodeMCU, que foram estruturadas da seguinte forma:
 
 ![image](https://user-images.githubusercontent.com/98746083/187809960-46f7cc57-36b9-4f6f-9709-bcff95086d93.png)
 
 Os nós mestres enviam dados para o nó central, utilizando o protocolo ESP-NOW, que  agrupa e envia os dados para o firebase. Com isso a  webpage exibi os ultimos valores armazenados e um gráfico com histórico de no máximo 7 dias.

São 5 sensores, onde 4 utilizam o sensor DHT11 e 1 utiliza o sensor BME280, o esquemático é mostrado abaixo:

![image](https://user-images.githubusercontent.com/98746083/187810591-0fff3302-c695-4206-abf2-756506670d8f.png)
![image](https://user-images.githubusercontent.com/98746083/187810607-8703a47c-605f-4e68-8c7a-5a0a6cd7e75f.png)



![image](https://user-images.githubusercontent.com/98746083/187810655-95ec9d08-cb07-48d7-8b28-427b5d943be1.png)
![image](https://user-images.githubusercontent.com/98746083/197430653-5a742685-5bc9-4b5a-971c-f39588b51487.png)


 Para exibir as informações, foi criado uma pagina web, utilizando JS, Html e Css, o resultado é mostrado na figura abaixo:
 


![38472cb0-2dd2-46f3-a4f0-786b963ae508](https://user-images.githubusercontent.com/98746083/197430611-600c6707-4b67-4e33-b224-8314f0634f98.jpg)
![4fa1b09b-2923-41d6-9f90-a9b80e3615ad](https://user-images.githubusercontent.com/98746083/197430615-2656a4d2-8c0c-4da8-ad6b-1fa5f6d00faf.jpg)

No topo da página são exibidos os ultimos valores de temperatura e umidade em cada laboratório, logo abaixo é mostrado um gráfico interativo, onde é possivel ver os históricos, alternando o periodo de exibição entre as opçoãs disponiveis.
