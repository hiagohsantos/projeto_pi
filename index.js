const firebaseConfig = {
  apiKey: 'AIzaSyDFmYi3RhNPeZ77Qb54xpHJkMR7RD8uh0w',
  authDomain: 'dados-projeto-pi.firebaseapp.com',
  databaseURL: 'https://dados-projeto-pi-default-rtdb.firebaseio.com',
  projectId: 'dados-projeto-pi',
  storageBucket: 'dados-projeto-pi.appspot.com',
  messagingSenderId: '217184206244',
  appId: '1:217184206244:web:aa7ccb66f55d1dd1191531',
};

const uid = 'xz0TtNM48jX091mqAwphPzhXo7n1'; // Id de usuario do login/nodeMCU
const email = 'projetopi@ufu.br'; // Usuario de acesso ao firebase
const senha = 'projetoPiUFU'; // Senha de acesso ao firebase

let nPontosGrafico = 72; // Numero de pontos no grafico
let delayDados = 10; // Tempo entre os dados do Firebase

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
firebase
  .auth()
  .signInWithEmailAndPassword(email, senha)
  .then((userCredential) => {
    // Efetua o login no firebase com email e senha
    let user = userCredential.user; // Credenciais do Usuario
  })
  .catch((error) => {
    let errorCode = error.code; // Codigo de erro
    let errorMessage = error.message; // Mensagem de erro
  });

window.onload = function () {
  db.ref(uid)
    .limitToLast(1)
    .on('value', (snapshot1) => {
      // Recebe o valor do ultimo timeStamp
      let timeStamp = parseInt(Object.keys(snapshot1.val()));
      let data = new Date(timeStamp * 1000);
      let pathBase = uid + '/' + timeStamp + '/';

      document.getElementById('ultimoDado').innerHTML =
        'Ultima Atualização: ' +
        data.getDate() +
        '/' +
        (data.getMonth() + 1) +
        '/' +
        data.getFullYear() +
        ' ' +
        data.getHours() +
        ':' +
        data.getMinutes() +
        ':' +
        data.getSeconds();

      document.getElementById('proxLeitura').innerHTML =
        'Proxima Atualização: ';
      db.ref(pathBase + 'TempL401').on('value', (snapshot) => {
        document.getElementById('temperatura1').innerHTML =
          snapshot.val() + '°C'; // Muda o valor da temperatura1 (LAB401) no HTML
        document.getElementById('tS1').style =
          '--clr:rgb(57, 232, 139);--num:' + snapshot.val(); // Muda o valor no estilo do grafico(p/ mudar o tamanho do grafico)
      });

      db.ref(pathBase + 'UmidL401').on('value', (snapshot) => {
        document.getElementById('umidade1').innerHTML =
          snapshot.val() + '%'; // Muda o valor da umidade1 (LAB401) no HTML
        document.getElementById('uS1').style =
          '--clr:rgb(18, 239, 225);--num:' + snapshot.val(); // Muda o valor no estilo do grafico(p/ mudar o tamanho do grafico)
      });

      db.ref(pathBase + 'TempL402').on('value', (snapshot) => {
        document.getElementById('temperatura2').innerHTML =
          snapshot.val() + '°C'; // Muda o valor da temperatura2 (LAB402) no HTML
        document.getElementById('tS2').style =
          '--clr:rgb(57, 232, 139);--num:' + snapshot.val(); // Muda o valor no estilo do grafico(p/ mudar o tamanho do grafico)
      });
      db.ref(pathBase + 'UmidL402').on('value', (snapshot) => {
        document.getElementById('umidade2').innerHTML =
          snapshot.val() + '%'; // Muda o valor da umidade2 (LAB402) no HTML
        document.getElementById('uS2').style =
          '--clr:rgb(18, 239, 225);--num:' + snapshot.val(); // Muda o valor no estilo do grafico(p/ mudar o tamanho do grafico)
      });

      db.ref(pathBase + 'TempL403').on('value', (snapshot) => {
        document.getElementById('temperatura3').innerHTML =
          snapshot.val() + '°C'; // Muda o valor da temperatura3 (LAB403) no HTML
        document.getElementById('tS3').style =
          '--clr:rgb(57, 232, 139);--num:' + snapshot.val(); // Muda o valor no estilo do grafico(p/ mudar o tamanho do grafico)
      });
      db.ref(pathBase + 'UmidL403').on('value', (snapshot) => {
        document.getElementById('umidade3').innerHTML =
          snapshot.val() + '%'; // Muda o valor da umidade3 (LAB403) no HTML
        document.getElementById('uS3').style =
          '--clr:rgb(18, 239, 225);--num:' + snapshot.val(); // Muda o valor no estilo do grafico(p/ mudar o tamanho do grafico)
      });
      db.ref(pathBase + 'TempL404').on('value', (snapshot) => {
        document.getElementById('temperatura4').innerHTML =
          snapshot.val() + '°C'; // Muda o valor da temperatura4 (LAB404) no HTML
        document.getElementById('tS4').style =
          '--clr:rgb(57, 232, 139);--num:' + snapshot.val(); // Muda o valor no estilo do grafico(p/ mudar o tamanho do grafico)
      });
      db.ref(pathBase + 'UmidL404').on('value', (snapshot) => {
        document.getElementById('umidade4').innerHTML =
          snapshot.val() + '%'; // Muda o valor da umidade4 (LAB404) no HTML
        document.getElementById('uS4').style =
          '--clr:rgb(18, 239, 225);--num:' + snapshot.val(); // Muda o valor no estilo do grafico(p/ mudar o tamanho do grafico)
      });

      db.ref(pathBase + 'TempL405').on('value', (snapshot) => {
        document.getElementById('temperatura5').innerHTML =
          snapshot.val() + '°C'; // Muda o valor da temperatura5 (LAB405) no HTML
        document.getElementById('tS5').style =
          '--clr:rgb(57, 232, 139);--num:' + snapshot.val(); // Muda o valor no estilo do grafico(p/ mudar o tamanho do grafico)
      });
      db.ref(pathBase + 'UmidL405').on('value', (snapshot) => {
        document.getElementById('umidade5').innerHTML =
          snapshot.val() + '%'; // Muda o valor da umidade5 (LAB405) no HTML
        document.getElementById('uS5').style =
          '--clr:rgb(18, 239, 225);--num:' + snapshot.val(); // Muda o valor no estilo do grafico(p/ mudar o tamanho do grafico)
      });
    });

  let ctx = document.getElementsByClassName('graficoUmidade'); // Atribui um elemento ao ctx
  let ctx1 = document.getElementsByClassName('graficoTemperatura'); // Atribui um elemento ao ctx1

  let graficoUmidade = new Chart(ctx, {
    // Cria um grafico de umidade
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Sala 401',
          data: [],
          backgroundColor: ['rgba(217, 211, 26, 0.2)'],
          borderColor: ['rgba(217, 211, 26, 1)'],
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: 'Sala 402',
          data: [],
          backgroundColor: ['rgba(12, 247, 165, 0.2)'],
          borderColor: ['rgba(12, 247, 165, 1)'],
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: 'Sala 403',
          data: [],
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)'],
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: 'Sala 404',
          data: [],
          backgroundColor: ['rgba(85, 243, 101, 0.2)'],
          borderColor: ['rgba(85, 243, 101, 1)'],
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: 'Sala 405',
          data: [],
          backgroundColor: ['rgba(214, 42, 174, 0.2)'],
          borderColor: ['rgba(214, 42, 174, 1)'],
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: {
      layout: {},
      elements: {
        point: {
          radius: 1,
        },
      },
      scales: {
        y: {},
      },
    },
  });

  let graficoTemperatura = new Chart(ctx1, {
    // Cria um grafico de temperatura
    type: 'line',
    data: {
      labels: [],

      datasets: [
        {
          label: 'Sala 401',
          data: [],
          backgroundColor: ['rgba(217, 211, 26, 0.2)'],
          borderColor: ['rgba(217, 211, 26, 1)'],
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: 'Sala 402',
          data: [],
          backgroundColor: ['rgba(12, 247, 165, 0.2)'],
          borderColor: ['rgba(12, 247, 165, 1)'],
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: 'Sala 403',
          data: [],
          backgroundColor: ['rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)'],
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: 'Sala 404',
          data: [],
          backgroundColor: ['rgba(85, 243, 101, 0.3)'],
          borderColor: ['rgba(85, 243, 101, 1)'],
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: 'Sala 405',
          data: [],
          backgroundColor: ['rgba(214, 42, 174, 0.3)'],
          borderColor: ['rgba(214, 42, 174,1)'],
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: {
      layout: {},
      elements: {
        point: {
          radius: 1,
        },
      },
      scales: {
        y: {},
      },
    },
  });
  function atualizaGrafico(nPontos) {
    // Funçao para atualizar a quantidade de pontos do grafico
    db.ref(uid)
      .limitToLast(nPontos)
      .on('value', (snapshot) => {
        let arrTL401 = []; // Arr para armazenar os valores dos graficos
        let arrTL402 = [];
        let arrTL403 = [];
        let arrTL404 = [];
        let arrTL405 = [];

        let arrUL401 = [];
        let arrUL402 = [];
        let arrUL403 = [];
        let arrUL404 = [];
        let arrUL405 = [];

        let timeStamp = Object.keys(snapshot.val()); // Monta um Array com os timeStamps que serao mostrados no grafico

        let datas = timeStamp.map(function (time) {
          // Funçao para converter o Array de TimeStamp e Array de Datas
          let data = new Date(time * 1000); // Cria um objeto da classe Date

          let dia = data.getDate(); // Coloca o valor do dia na variavel dia
          let mes = data.getMonth() + 1; // Coloca o mes na variavel mes
          let horas = data.getHours(); // Colocar a hora na variavel hora
          let minutos = data.getMinutes(); // Coloca os minutos na variavel minutos

          if (dia < 10) {
            // Se o dia  for menor que 10, acrescenta um zero antes(Ex.: 01, 02 ...)
            dia = '0' + dia;
          }
          if (mes < 10) {
            // Se o mes  for menor que 10, acrescenta um zero antes(Ex.: 01, 02 ...)
            mes = '0' + mes;
          }
          if (horas < 10) {
            // Se as horas  forem menores que 10, acrescenta um zero antes(Ex.:01, 02 ...)
            horas = '0' + horas;
          }
          if (minutos < 10) {
            // Se os minutos  forem menores que 10, acrescenta um zero antes(Ex.:01, 02 ...)
            minutos = '0' + minutos;
          }
          return dia + '/' + mes + ' - ' + horas + ':' + minutos; // Retorno da funçao com Dia/Mes - Horas:Minutos (Retorna no Arr 'datas')
        });

        snapshot.forEach((childSnapshot) => {
          arrTL401.push(childSnapshot.val().TempL401); // Adiciona no arrTL401(Array de Temperatura do lab 401) os valores de temperatura
          arrTL402.push(childSnapshot.val().TempL402);
          arrTL403.push(childSnapshot.val().TempL403);
          arrTL404.push(childSnapshot.val().TempL404);
          arrTL405.push(childSnapshot.val().TempL405);

          arrUL401.push(childSnapshot.val().UmidL401); // Adiciona no arrUL401(Array de Umidade do lab 401) os valores de umidade
          arrUL402.push(childSnapshot.val().UmidL402);
          arrUL403.push(childSnapshot.val().UmidL403);
          arrUL404.push(childSnapshot.val().UmidL404);
          arrUL405.push(childSnapshot.val().UmidL405);
        });

        graficoTemperatura.data.datasets[0].data = arrTL401; // Muda os valores dos dados no grafico de Temperatura
        graficoTemperatura.data.datasets[1].data = arrTL402;
        graficoTemperatura.data.datasets[2].data = arrTL403;
        graficoTemperatura.data.datasets[3].data = arrTL404;
        graficoTemperatura.data.datasets[4].data = arrTL405;

        graficoUmidade.data.datasets[0].data = arrUL401; // Muda os valores dos dados no grafico de Umidade
        graficoUmidade.data.datasets[1].data = arrUL402;
        graficoUmidade.data.datasets[2].data = arrUL403;
        graficoUmidade.data.datasets[3].data = arrUL404;
        graficoUmidade.data.datasets[4].data = arrUL405;

        graficoTemperatura.data.labels = datas; // Muda os valores das datas no grafico de Temperatura
        graficoUmidade.data.labels = datas; // Muda os valores das datas no grafico de Umidade

        graficoTemperatura.update(); // Atualiza o grafico de temperatura
        graficoUmidade.update(); // Atualiza o grafico de Umidade
      });
  }

  atualizaGrafico(nPontosGrafico);

  let tipoPessoa = document.querySelectorAll(
    'input[name="numPontos"]'
  );

  tipoPessoa.forEach(function (value) {
    value.onclick = function (event) {
      if (value.value == 1) {
        nPontosGrafico = (12 * 60) / delayDados;
        atualizaGrafico(nPontosGrafico);
      }

      if (value.value == 2) {
        nPontosGrafico = (24 * 60) / delayDados;
        atualizaGrafico(nPontosGrafico);
      }

      if (value.value == 3) {
        nPontosGrafico = (7 * 24 * 60) / delayDados;
        atualizaGrafico(nPontosGrafico);
      }
    };
  });
};
