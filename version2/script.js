// JSON que contiene el contenido de los tres HTML
const paginas = {
  "pagina1": `
    <div class="container">
       <div id="start">
         <h1>Tic Tac Toe</h1>
          <button onclick = "cargarHTML('pagina3')">1 vs 1</button>
          <button onclick = "cargarHTML('pagina2')">1 vs CPU</button>
       </div>
     </div>
     <footer>
      <p>  Si quieres apoyarme, <span id="link">haz click aquí.</span></p><span id="author">Hecho por: Hugo Gil Tejero</span>
    </footer>
            `,
  "pagina2": `
        <div class="container">
        <div class="settings">
        <h1 class="juego">Tic Tac Toe</h1>
            <div id="nivelesBtns" class="inicio">
                <button class="niveles inicio">Fácil</button>
                <button class="niveles inicio">Medio</button>
                <button class="niveles inicio">Difícil</button>
                <button class="niveles inicio">Imposible</button>
            </div>
            <div id="fichasBtns">
                <button class="ficha inicio">X</button>
                <button class="ficha inicio">O</button>
            </div>
            <button id= "jugarbtn" class="inicio">Jugar</button>
          </div>
          <button id= "volverArrow"><img src="../img/left_arrow.png" alt="Volver atrás"></button>
    </div>
    <footer>
      <p>  Si quieres apoyarme, <span id="link">haz click aquí.</span></p><span id="author">Hecho por: Hugo Gil Tejero</span>
    </footer>
            `,
  "pagina3": `
    <div class="container">
        <div class="settings">
            <h1 class="juego">Tic Tac Toe</h1>
            <div class= "settingsDisplay"></div>
        </div>
        <div class="board juego">
            <div class="cell juego" data-index="0"></div>
            <div class="cell juego" data-index="1"></div>
            <div class="cell juego" data-index="2"></div>
            <div class="cell juego" data-index="3"></div>
            <div class="cell juego" data-index="4"></div>
            <div class="cell juego" data-index="5"></div>
            <div class="cell juego" data-index="6"></div>
            <div class="cell juego" data-index="7"></div>
            <div class="cell juego" data-index="8"></div>
        </div>
        <div id="enlaces">
            <button id="ajustesbtn" class="juego">Ajustes</button>
            <button id="reiniciarbtn" class="juego"> Reiniciar </button>
            <button id="iniciobtn" class="juego">Inicio</button>
        </div>
        <div class="win-line"></div>
        <!-- Modal -->
        <div id="resultadoModal" class="modal" onclick="closeModal()">
            <div class="modal-content">
                <p id="resultadoMensaje"></p>
            </div>
        </div>
    </div>
    <footer>
      <p>  Si quieres apoyarme, <span id="link">haz click aquí.</span></p><span id="author">Hecho por: Hugo Gil Tejero</span>
    </footer>
            `
};

//Variables
let nivelElegido = undefined;
let fichaElegida = undefined;
const difficultyTextInicio = 'Elige el nivel de dificultad:';
const difficultyTextJuego = 'Nivel de dificultad: ';
const playerChoiceTextInicio = 'Elige tu ficha:';
const playerChoiceTextJuego = 'Tu ficha: ';
let empiezaMedio;
let empiezaEsquina;
let empiezaLado;
let casillasMarcadas = 0;
let player = '';
let playerMaquina = '';
let turnoPlayer = 0;
let turnoPlayerText;
let color;
let modo; //El modo 0 es PvP
const botonesNiveles = document.getElementsByClassName('niveles');
const botonesFicha = document.getElementsByClassName('ficha');
const settings = document.getElementsByClassName('settings');
const casillas = document.getElementsByClassName('cell');
let partidaEnMarcha = false;


// Función que cambia el contenido según la clave del JSON
function cargarHTML(pagina) {
  //-------------------------------------PAGINA 1-------------------------------------
  if (paginas[pagina] && pagina === "pagina1") {
    document.body.innerHTML = paginas[pagina];
    //-------------------------------------PAGINA 2-------------------------------------
  } else if (paginas[pagina] && pagina === "pagina2") {
    document.body.innerHTML = paginas[pagina]
    resetearBotones();;
    document.querySelector('#volverArrow').onclick = () => { cargarHTML('pagina1'); modo = 0; };
    const fichaSinElegir = document.createElement('p');
    const nivelSinElegir = document.createElement('p');

    // Función para manejar la activación de botones en la sección de settings
    for (let boton of botonesNiveles) {
      boton.onclick = (e) => {
        for (boton of botonesNiveles) {
          boton.disabled = false;
        }
        e.currentTarget.disabled = true;
        nivelSinElegir.remove();
      }
    }

    for (let boton of botonesFicha) {
      boton.onclick = (e) => {
        for (boton of botonesFicha) {
          boton.disabled = false;
        }
        e.currentTarget.disabled = true;
        fichaSinElegir.remove();
      }
    }
    const jugarbtn = document.querySelector('#jugarbtn');
    document.querySelector('#jugarbtn').onclick = () => {
      let check1 = false;
      let check2 = false;
      for (let boton of botonesNiveles) {
        if (boton.disabled === true) {
          check1 = true;
          boton.id = 'nivelElegido'
        }
      }
      for (let boton of botonesFicha) {
        if (boton.disabled === true) {
          check2 = true;
          boton.id = 'fichaElegida'
        }
      }
      if (check1 && check2) {
        nivelElegido = document.querySelector('#nivelElegido');
        fichaElegida = document.querySelector('#fichaElegida');
        nivelSinElegir.remove();
        fichaSinElegir.remove();
        modo = 1;
        cargarHTML('pagina3');
        check1 = false; check2 = false;
      } else {
        if (!check1 && campoVacio(botonesNiveles[0])) {
          nivelSinElegir.textContent = 'Debes elegir un nivel para continuar'
          nivelSinElegir.style.color = '#FF817A';
          nivelSinElegir.id = 'imHere'
          nivelSinElegir.classList.add('inicio')
          document.querySelector('#nivelesBtns').after(nivelSinElegir)
        } else if (check1) {
          nivelSinElegir.remove();
        }
        if (!check2 && campoVacio(botonesFicha[0])) {
          fichaSinElegir.textContent = 'Debes elegir una ficha para continuar'
          fichaSinElegir.style.color = '#FF817A';
          fichaSinElegir.id = 'imHere'
          fichaSinElegir.classList.add('inicio')
          document.querySelector('#fichasBtns').after(fichaSinElegir)
        } else if (check2) {
          fichaSinElegir.remove();
        }
      }
    }
    //-------------------------------------PAGINA 3-------------------------------------
  } else if ((paginas[pagina] && pagina === "pagina3")) {
    document.body.innerHTML = paginas[pagina];


    for (let setting of settings) {
      setting.style.gridRow = "1";
      setting.style.alignSelf = "center";
    }
    document.querySelector('#reiniciarbtn').onclick = reiniciar;
    document.querySelector('#ajustesbtn').onclick = () => { cargarHTML('pagina2'); };
    document.querySelector('#iniciobtn').onclick = () => { cargarHTML('pagina1'); modo = 0; };
    if (modo) {
      reiniciar();

      const divCPU = document.querySelector('.settingsDisplay');

      //Inserto estos dos párrafos que no serán los mismos en el modo PvP
      const difficulty = document.createElement('p');
      difficulty.id = 'difficulty';
      difficulty.textContent = difficultyTextJuego + nivelElegido.textContent;
      divCPU.appendChild(difficulty);

      const playerChoice = document.createElement('p');
      playerChoice.id = 'player-choice';
      playerChoice.textContent = playerChoiceTextJuego + fichaElegida.textContent;
      difficulty.insertAdjacentElement('afterend', playerChoice);


      

      player = fichaElegida.textContent;
      playerMaquina = player === 'X' ? 'O' : 'X';
      if (nivelElegido.textContent === "Fácil") {
        facil();
      } else if (nivelElegido.textContent === "Medio") {
        medio();
      } else if (nivelElegido.textContent === "Difícil") {
        dificil();
      } else if (nivelElegido.textContent === "Imposible") {
        imposible();
      }
    } else {
      document.querySelector('#ajustesbtn').remove();
      document.querySelector('#enlaces').style.gridTemplateColumns = '130px 130px';
      document.querySelector('#reiniciarbtn').style.justifySelf = 'end';

      turnoPlayerText = document.createElement('p');
      turnoPlayerText.id = 'turno-player-text';
      turnoPlayerText.textContent = 'Turno de: ' + (turnoPlayer === 0 ? 'Player 1' : 'Player 2');

      const divTurnoPlayer = document.createElement('div');

      const players = document.querySelector('.settingsDisplay');
      for (let elem of settings) {
        elem.appendChild(divTurnoPlayer);
      }

      divTurnoPlayer.appendChild(turnoPlayerText);

      const player1Choice = document.createElement('p');
      player1Choice.id = 'player1-choice';
      player1Choice.textContent = 'Player 1: X';
      players.appendChild(player1Choice);

      const player2Choice = document.createElement('p');
      player2Choice.id = 'player2-choice';
      player2Choice.textContent = 'Player 2: O';
      players.appendChild(player2Choice);





      PvP();
    }
  } else {
    console.error('Página no encontrada');
  }

}

function campoVacio(lugar) {
  if (lugar.parentElement.querySelector('#imHere') === null) {
    return true;
  } else {
    return false;
  }
}

function resetearBotones() {
  for (let boton of botonesNiveles) {
    boton.disabled = false;
    boton.id = '';
    nivelElegido = null;
  }

  for (let boton of botonesFicha) {
    boton.disabled = false;
    boton.id = '';
    fichaElegida = null;
  }
  for (let casilla of casillas) {
    casilla.onclick = null;
  }
}

function reiniciar() {
  empiezaMedio = false;
  empiezaEsquina = false;
  empiezaLado = false;
  casillasMarcadas = 0;
  const line = document.querySelector('.win-line')
  line.style.display = 'none';
  for (let casilla of casillas) {
    casilla.textContent = '';
  }
  if (modo) {
    if (nivelElegido.textContent === "Fácil") {
      facil();
    } else if (nivelElegido.textContent === "Medio") {
      medio();
    } else if (nivelElegido.textContent === "Difícil") {
      dificil();
    } else if (nivelElegido.textContent === "Imposible") {
      imposible();
    }
  } else {
    turnoPlayer = 0;
    turnoPlayerText.textContent = 'Turno de: Player 1';
    turnoPlayerText.style.color = '#6EBB6E';
    PvP();
  }
}

function showWinLine(cells, color = '#FF817A') {
  const board = document.querySelector('.board');
  const cellElements = document.querySelectorAll('.cell');

  // Clear previous win line if any
  const previousLine = document.querySelector('.win-line');
  if (previousLine) {
    previousLine.remove();
  }

  // Create the line
  const line = document.createElement('div');
  line.classList.add('win-line');
  line.style.backgroundColor = color;

  // Function to calculate line position
  const calculateLinePosition = () => {
    const [firstCell, secondCell, thirdCell] = cells.map(index => cellElements[index]);
    const boardRect = board.getBoundingClientRect();
    const firstRect = firstCell.getBoundingClientRect();
    const thirdRect = thirdCell.getBoundingClientRect();

    let x1 = firstRect.left + firstRect.width / 2 - boardRect.left;
    let y1 = firstRect.top + firstRect.height / 2 - boardRect.top;
    let x2 = thirdRect.left + thirdRect.width / 2 - boardRect.left;
    let y2 = thirdRect.top + thirdRect.height / 2 - boardRect.top;

    if (x1 === x2) {
      // Vertical line
      line.style.width = '5px';
      line.style.height = '100%';
      line.style.top = '0';
      line.style.left = `${x1 - 2.5}px`;
      line.style.transform = `translateY(0px)`;
    } else if (y1 === y2) {
      // Horizontal line
      line.style.width = '100%';
      line.style.height = '5px';
      line.style.top = `${y1 - 2.5}px`;
      line.style.left = '0';
      line.style.transform = `translateX(0px)`;
    } else {
      // Diagonal line
      line.style.width = `${Math.sqrt(Math.pow(boardRect.width, 2) + Math.pow(boardRect.height, 2))}px`;
      line.style.height = '5px';
      line.style.top = '0';
      line.style.left = '0';
      line.style.transformOrigin = '0 0';
      if (cells.includes(0) && cells.includes(4) && cells.includes(8)) {
        // Top-left to bottom-right
        const scaleFactor = 0.99; // Factor para #FF817Aucir la longitud de la línea a la mitad
        line.style.width = `${Math.sqrt(Math.pow(boardRect.width, 2) + Math.pow(boardRect.height, 2)) * scaleFactor}px`;
        line.style.transform = 'rotate(45deg) translate(-5px, -5px)';
      } else if (cells.includes(2) && cells.includes(4) && cells.includes(6)) {
        // Top-right to bottom-left
        const scaleFactor = 0.98; // Factor para #FF817Aucir la longitud de la línea a la mitad
        line.style.width = `${Math.sqrt(Math.pow(boardRect.width, 2) + Math.pow(boardRect.height, 2)) * scaleFactor}px`;
        line.style.transform = `rotate(-45deg) translate(-${boardRect.width * 0.69}px, ${boardRect.height * 0.69}px)`; // Move left one and a half cells, down one and a half cells
      }
    }
  };

  // Initial calculation
  calculateLinePosition();

  // Append the line to the board
  board.appendChild(line);

  // Recalculate line position on window resize
  window.addEventListener('resize', calculateLinePosition);
}

// Función para mostrar el modal con un mensaje específico
function showModal(mensaje) {
  var modal = document.getElementById("resultadoModal");
  var mensajeElemento = document.getElementById("resultadoMensaje");
  mensajeElemento.textContent = mensaje;
  modal.style.display = "block";
}

// Función para cerrar el modal
function closeModal() {
  var modal = document.getElementById("resultadoModal");
  modal.style.display = "none";
}

// Ejemplo de llamada a la función showModal cuando el juego termina
function checkGameStatus(resultado) {
  // Lógica para verificar el estado del juego
  // Dependiendo del resultado, muestra un mensaje diferente:
  if (resultado === 'empate') {
    showModal("¡Es un empate!");
  } else if (resultado === 'victoria') {
    showModal("¡Has ganado!");
  } else if (resultado === 'derrota') {
    showModal("¡Has perdido!");
  } else if (resultado === 'X') {
    showModal("¡Gana player 1!");
  } else if (resultado === 'O') {
    showModal("¡Gana player 2!");
  }
}

//Juego

function getRandomInt(max) {
  return Math.floor(Math.random() * max); //si le paso un 9 devolverá de 0 a 8
}

// Genera un número aleatorio que sea 0 o 1
function random0to1() {
  return Math.floor(Math.random() * 2);
}

function imposible() {
  for (let casilla of casillas) {
    casilla.onclick = (e) => {
      // casilla.style.fontSize = '40px'
      casilla.textContent = player;
      casilla.style.color = '#8DDA8D'
      casillasMarcadas++;
      e.currentTarget.onclick = null; //CUANDO MARCA UNA CASILLA, NO PUEDE VOLVER A MARCARLA
      if (saberSiGanaJugador()) {
        empiezaMedio = false;
        empiezaEsquina = false;
        empiezaLado = false;
      }
      else {
        if (casillasMarcadas != 1) {
          maquinaIntentaGanar();
        }
        if (casillasMarcadas == 1) {
          if (casillas[4].textContent === player) {
            empiezaMedio = true;
            let random = getRandomInt(4);
            if (random == 0) {
              responder(0);
            }
            else if (random == 1) {
              responder(2);
            }
            else if (random == 2) {
              responder(6);
            }
            else if (random == 3) {
              responder(8);
            }

          }
          else if (casillas[0].textContent === player || casillas[2].textContent === player || casillas[6].textContent === player || casillas[8].textContent === player) {
            empiezaEsquina = true;
            responder(4);
          }
          else if (casillas[1].textContent === player || casillas[3].textContent === player || casillas[5].textContent === player || casillas[7].textContent === player) {
            empiezaLado = true;
            responder(4);
          }
        }
        else if (empiezaMedio) {
          let random = random0to1();
          if (defenderseSinAleatorio()) { }
          //COMPROBAR SI RESPONDE EN UNA ESQUINA CONTRARIA
          else if (((casillas[0].textContent === playerMaquina && casillas[8].textContent === player) || (casillas[8].textContent === playerMaquina && casillas[0].textContent === player))) {
            if (random == 0 && casillas[2].textContent === '') {
              responder(2);
            }
            else if (random == 1 && casillas[6].textContent === '') {
              responder(6);
            }
            else {
              defenderse();
            }
          }
          else if ((casillas[2].textContent === playerMaquina && casillas[6].textContent === player) || (casillas[6].textContent === playerMaquina && casillas[2].textContent === player)) {
            if (random == 0 && casillas[0].textContent === '') {
              responder(0);
            }
            else if (random == 1 && casillas[8].textContent === '') {
              responder(8);
            }
            else {
              defenderse();
            }
          }
          else { //DEFENDERSE
            defenderse();
          }
        }
        else if (empiezaEsquina) {
          let random = random0to1();
          if (defenderseSinAleatorio()) { }
          //COMPROBAR SI RESPONDE //EN UNA ESQUINA CONTRARIA
          else if ((casillas[0].textContent === player && casillas[8].textContent === player) || (casillas[2].textContent === player && casillas[6].textContent === player)) {
            if (random == 0 && casillas[1].textContent === '') {
              responder(1);
            }
            else if (random == 1 && casillas[7].textContent === '') {
              responder(7);
            }
            else {
              defenderse();
            }
            //COMPROBAR SI RESPONDE EN UN MEDIO OPUESTO A LA ESQUINA DONDE HAYA EMPEZADO
          } else if ((casillas[0].textContent === player && casillas[7].textContent === player) && casillas[6].textContent === '') {
            responder(6);
          } else if ((casillas[0].textContent === player && casillas[5].textContent === player) && casillas[2].textContent === '') {
            responder(2);
          } else if ((casillas[2].textContent === player && casillas[7].textContent === player) && casillas[8].textContent === '') {
            responder(8);
          } else if ((casillas[2].textContent === player && casillas[3].textContent === player) && casillas[0].textContent === '') {
            responder(0);
          } else if ((casillas[6].textContent === player && casillas[1].textContent === player) && casillas[0].textContent === '') {
            responder(0);
          } else if ((casillas[6].textContent === player && casillas[5].textContent === player) && casillas[8].textContent === '') {
            responder(8);
          } else if ((casillas[8].textContent === player && casillas[1].textContent === player) && casillas[2].textContent === '') {
            responder(2);
          } else if ((casillas[8].textContent === player && casillas[3].textContent === player) && casillas[6].textContent === '') {
            responder(6);
          } else { //DEFENDERSE
            defenderse();
          }
        }
        else if (empiezaLado) {

          if (defenderseSinAleatorio()) { }
          else if (casillas[1].textContent === player && casillas[3].textContent === player && casillas[0].textContent === '') {
            responder(0);
          }
          else if (casillas[1].textContent === player && casillas[5].textContent === player && casillas[2].textContent === '') {
            responder(2);
          }
          else if (casillas[3].textContent === player && casillas[7].textContent === player && casillas[6].textContent === '') {
            responder(6);
          }
          else if (casillas[7].textContent === player && casillas[5].textContent === player && casillas[8].textContent === '') {
            responder(8);
          }
          //Aqui empieza lo de Noor
          else if (casillas[7].textContent === player && casillas[2].textContent === player && casillas[8].textContent === '') {
            responder(8);
          }
          else if (casillas[7].textContent === player && casillas[0].textContent === player && casillas[6].textContent === '') {
            responder(6);
          }
          else if (casillas[3].textContent === player && casillas[2].textContent === player && casillas[0].textContent === '') {
            responder(0);
          }
          else if (casillas[3].textContent === player && casillas[8].textContent === player && casillas[6].textContent === '') {
            responder(6);
          }
          else if (casillas[1].textContent === player && casillas[6].textContent === player && casillas[0].textContent === '') {
            responder(0);
          }
          else if (casillas[1].textContent === player && casillas[8].textContent === player && casillas[2].textContent === '') {
            responder(2);
          }
          else if (casillas[5].textContent === player && casillas[0].textContent === player && casillas[2].textContent === '') {
            responder(2);
          }
          else if (casillas[5].textContent === player && casillas[6].textContent === player && casillas[8].textContent === '') {
            responder(8);
          }
          else {
            defenderse();
          }
        }
      }
    }
  }
}

function responder(num) {
  if (casillas[num].textContent === '') {
    casillas[num].onclick = null;
    casillas[num].style.color = '#FF817A'
    if (player === 'X') {
      casillas[num].textContent = 'O';
    }
    else {
      casillas[num].textContent = 'X';
    }

  }
  else {
    alert('Estás intentando responder sobre una casilla ocupada, revisa el código')
  }
}

function maquinaIntentaGanar() {
  let out = true;
  if (casillas[0].textContent === playerMaquina && casillas[1].textContent === playerMaquina && casillas[2].textContent === '') {
    responder(2);
    ganaMaquina([0, 1, 2]);

  }
  else if (casillas[1].textContent === playerMaquina && casillas[2].textContent === playerMaquina && casillas[0].textContent === '') {
    responder(0);
    ganaMaquina([0, 1, 2]);
  }
  else if (casillas[3].textContent === playerMaquina && casillas[4].textContent === playerMaquina && casillas[5].textContent === '') {
    responder(5);
    ganaMaquina([3, 4, 5]);

  }
  else if (casillas[4].textContent === playerMaquina && casillas[5].textContent === playerMaquina && casillas[3].textContent === '') {
    responder(3);
    ganaMaquina([4, 5, 3]);
  }
  else if (casillas[6].textContent === playerMaquina && casillas[7].textContent === playerMaquina && casillas[8].textContent === '') {
    responder(8);
    ganaMaquina([6, 7, 8]);
  }
  else if (casillas[7].textContent === playerMaquina && casillas[8].textContent === playerMaquina && casillas[6].textContent === '') {
    responder(6);
    ganaMaquina([6, 7, 8]);

  }
  else if (casillas[0].textContent === playerMaquina && casillas[3].textContent === playerMaquina && casillas[6].textContent === '') {
    responder(6);
    ganaMaquina([0, 3, 6]);
  }
  else if (casillas[3].textContent === playerMaquina && casillas[6].textContent === playerMaquina && casillas[0].textContent === '') {
    responder(0);
    ganaMaquina([0, 3, 6]);
  }
  else if (casillas[1].textContent === playerMaquina && casillas[4].textContent === playerMaquina && casillas[7].textContent === '') {
    responder(7);
    ganaMaquina([1, 4, 7]);
  }
  else if (casillas[4].textContent === playerMaquina && casillas[7].textContent === playerMaquina && casillas[1].textContent === '') {
    responder(1);
    ganaMaquina([1, 4, 7]);
  }
  else if (casillas[2].textContent === playerMaquina && casillas[5].textContent === playerMaquina && casillas[8].textContent === '') {
    responder(8);
    ganaMaquina([2, 5, 8]);
  }
  else if (casillas[5].textContent === playerMaquina && casillas[8].textContent === playerMaquina && casillas[2].textContent === '') {
    responder(2);
    ganaMaquina([2, 5, 8]);
  }
  else if (casillas[0].textContent === playerMaquina && casillas[4].textContent === playerMaquina && casillas[8].textContent === '') {
    responder(8);
    ganaMaquina([0, 4, 8]);

  }
  else if (casillas[4].textContent === playerMaquina && casillas[8].textContent === playerMaquina && casillas[0].textContent === '') {
    responder(0);
    ganaMaquina([0, 4, 8]);
  }
  else if (casillas[2].textContent === playerMaquina && casillas[4].textContent === playerMaquina && casillas[6].textContent === '') {
    responder(6);
    ganaMaquina([2, 4, 6]);
  }
  else if (casillas[4].textContent === playerMaquina && casillas[6].textContent === playerMaquina && casillas[2].textContent === '') {
    responder(2);
    ganaMaquina([2, 4, 6]);
  }
  else if (casillas[0].textContent === playerMaquina && casillas[2].textContent === playerMaquina && casillas[1].textContent === '') {
    responder(1);
    ganaMaquina([0, 1, 2]);

  }
  else if (casillas[3].textContent === playerMaquina && casillas[5].textContent === playerMaquina && casillas[4].textContent === '') {
    responder(4);
    ganaMaquina([3, 4, 5]);
  }
  else if (casillas[6].textContent === playerMaquina && casillas[8].textContent === playerMaquina && casillas[7].textContent === '') {
    responder(7);
    ganaMaquina([6, 7, 8]);
  }
  else if (casillas[0].textContent === playerMaquina && casillas[6].textContent === playerMaquina && casillas[3].textContent === '') {

    responder(3);
    ganaMaquina([0, 3, 6]);
  }
  else if (casillas[1].textContent === playerMaquina && casillas[7].textContent === playerMaquina && casillas[4].textContent === '') {
    responder(4);
    ganaMaquina([1, 4, 7]);
  }
  else if (casillas[2].textContent === playerMaquina && casillas[8].textContent === playerMaquina && casillas[5].textContent === '') {
    responder(5);
    ganaMaquina([2, 5, 8]);

  }
  else if (casillas[0].textContent === playerMaquina && casillas[8].textContent === playerMaquina && casillas[4].textContent === '') {
    responder(4);
    ganaMaquina([0, 4, 8]);

  }
  else if (casillas[2].textContent === playerMaquina && casillas[6].textContent === playerMaquina && casillas[4].textContent === '') {
    responder(4);
    ganaMaquina([2, 4, 6]);

  } else {
    out = false;
  }
  return out;
}

function ganaMaquina(casillasGanadoras) {
  empiezaMedio = false;
  empiezaEsquina = false;
  empiezaLado = false;
  for (let casilla of casillas) {
    casilla.onclick = null;
  }
  showWinLine(casillasGanadoras, '#FF817A')
  checkGameStatus('derrota');
  document.querySelector('.modal').style.backgroundColor = 'rgba(128,0,0,0.4)'
}

function defenderse() {
  if (casillas[0].textContent === player && casillas[1].textContent === player && casillas[2].textContent === '') {
    responder(2);

  }
  else if (casillas[1].textContent === player && casillas[2].textContent === player && casillas[0].textContent === '') {
    responder(0);
  }
  else if (casillas[3].textContent === player && casillas[4].textContent === player && casillas[5].textContent === '') {
    responder(5);
  }
  else if (casillas[4].textContent === player && casillas[5].textContent === player && casillas[3].textContent === '') {
    responder(3);
  }
  else if (casillas[6].textContent === player && casillas[7].textContent === player && casillas[8].textContent === '') {
    responder(8);
  }
  else if (casillas[7].textContent === player && casillas[8].textContent === player && casillas[6].textContent === '') {
    responder(6);
  }
  else if (casillas[0].textContent === player && casillas[3].textContent === player && casillas[6].textContent === '') {
    responder(6);
  }
  else if (casillas[3].textContent === player && casillas[6].textContent === player && casillas[0].textContent === '') {
    responder(0);
  }
  else if (casillas[1].textContent === player && casillas[4].textContent === player && casillas[7].textContent === '') {
    responder(7);
  }
  else if (casillas[4].textContent === player && casillas[7].textContent === player && casillas[1].textContent === '') {
    responder(1);
  }
  else if (casillas[2].textContent === player && casillas[5].textContent === player && casillas[8].textContent === '') {
    responder(8);
  }
  else if (casillas[5].textContent === player && casillas[8].textContent === player && casillas[2].textContent === '') {
    responder(2);
  }
  else if (casillas[0].textContent === player && casillas[4].textContent === player && casillas[8].textContent === '') {
    responder(8);
  }
  else if (casillas[4].textContent === player && casillas[8].textContent === player && casillas[0].textContent === '') {
    responder(0);
  }
  else if (casillas[2].textContent === player && casillas[4].textContent === player && casillas[6].textContent === '') {
    responder(6);
  }
  else if (casillas[4].textContent === player && casillas[6].textContent === player && casillas[2].textContent === '') {
    responder(2);
  }
  else if (casillas[0].textContent === player && casillas[2].textContent === player && casillas[1].textContent === '') {
    responder(1);
  }
  else if (casillas[3].textContent === player && casillas[5].textContent === player && casillas[4].textContent === '') {
    responder(4);
  }
  else if (casillas[6].textContent === player && casillas[8].textContent === player && casillas[7].textContent === '') {
    responder(7);
  }
  else if (casillas[0].textContent === player && casillas[6].textContent === player && casillas[3].textContent === '') {
    responder(3);
  }
  else if (casillas[1].textContent === player && casillas[7].textContent === player && casillas[4].textContent === '') {
    responder(4);
  }
  else if (casillas[2].textContent === player && casillas[8].textContent === player && casillas[5].textContent === '') {
    responder(5);
  }
  else if (casillas[0].textContent === player && casillas[8].textContent === player && casillas[4].textContent === '') {
    responder(4);
  }
  else if (casillas[2].textContent === player && casillas[6].textContent === player && casillas[4].textContent === '') {
    responder(4);
  }
  //preparar ataque
  else if (casillas[0].textContent === playerMaquina && casillas[1].textContent === '' && casillas[2].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(1);
    }
    else if (random == 1) {
      responder(2);
    }
  }
  else if (casillas[0].textContent === playerMaquina && casillas[4].textContent === '' && casillas[8].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(4);
    }
    else if (random == 1) {
      responder(8);
    }
  }
  else if (casillas[0].textContent === playerMaquina && casillas[3].textContent === '' && casillas[6].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(3);
    }
    else if (random == 1) {
      responder(6);
    }
  }
  else if (casillas[1].textContent === playerMaquina && casillas[0].textContent === '' && casillas[2].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(0);
    }
    else if (random == 1) {
      responder(2);
    }
  }
  else if (casillas[1].textContent === playerMaquina && casillas[4].textContent === '' && casillas[7].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(4);
    }
    else if (random == 1) {
      responder(7);
    }
  }
  else if (casillas[2].textContent === playerMaquina && casillas[1].textContent === '' && casillas[0].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(1);
    }
    else if (random == 1) {
      responder(0);
    }
  }
  else if (casillas[2].textContent === playerMaquina && casillas[5].textContent === '' && casillas[8].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(5);
    }
    else if (random == 1) {
      responder(8);
    }
  }
  else if (casillas[2].textContent === playerMaquina && casillas[4].textContent === '' && casillas[6].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(4);
    }
    else if (random == 1) {
      responder(6);
    }
  }
  else if (casillas[3].textContent === playerMaquina && casillas[0].textContent === '' && casillas[6].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(0);
    }
    else if (random == 1) {
      responder(6);
    }
  }
  else if (casillas[3].textContent === playerMaquina && casillas[4].textContent === '' && casillas[5].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(4);
    }
    else if (random == 1) {
      responder(5);
    }
  }
  else if (casillas[4].textContent === playerMaquina && casillas[0].textContent === '' && casillas[8].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(0);
    }
    else if (random == 1) {
      responder(8);
    }
  }
  else if (casillas[4].textContent === playerMaquina && casillas[1].textContent === '' && casillas[7].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(1);
    }
    else if (random == 1) {
      responder(7);
    }
  }
  else if (casillas[4].textContent === playerMaquina && casillas[2].textContent === '' && casillas[6].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(2);
    }
    else if (random == 1) {
      responder(6);
    }
  }
  else if (casillas[4].textContent === playerMaquina && casillas[3].textContent === '' && casillas[5].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(3);
    }
    else if (random == 1) {
      responder(5);
    }
  }
  else if (casillas[5].textContent === playerMaquina && casillas[3].textContent === '' && casillas[8].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(3);
    }
    else if (random == 1) {
      responder(8);
    }
  }
  else if (casillas[5].textContent === playerMaquina && casillas[4].textContent === '' && casillas[3].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(4);
    }
    else if (random == 1) {
      responder(3);
    }
  }
  else if (casillas[6].textContent === playerMaquina && casillas[0].textContent === '' && casillas[3].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(0);
    }
    else if (random == 1) {
      responder(3);
    }
  }
  else if (casillas[6].textContent === playerMaquina && casillas[4].textContent === '' && casillas[2].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(4);
    }
    else if (random == 1) {
      responder(2);
    }
  }
  else if (casillas[6].textContent === playerMaquina && casillas[7].textContent === '' && casillas[8].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(7);
    }
    else if (random == 1) {
      responder(8);
    }
  }
  else if (casillas[7].textContent === playerMaquina && casillas[6].textContent === '' && casillas[8].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(6);
    }
    else if (random == 1) {
      responder(8);
    }
  }
  else if (casillas[7].textContent === playerMaquina && casillas[4].textContent === '' && casillas[1].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(1);
    }
    else if (random == 1) {
      responder(4);
    }
  }
  else if (casillas[8].textContent === playerMaquina && casillas[4].textContent === '' && casillas[0].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(4);
    }
    else if (random == 1) {
      responder(0);
    }
  }
  else if (casillas[8].textContent === playerMaquina && casillas[5].textContent === '' && casillas[2].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(5);
    }
    else if (random == 1) {
      responder(2);
    }
  }
  else if (casillas[8].textContent === playerMaquina && casillas[7].textContent === '' && casillas[6].textContent === '') {
    let random = random0to1();
    if (random == 0) {
      responder(7);
    }
    else if (random == 1) {
      responder(6);
    }
  }

  else {
    responderAleatoriamente();
  }
}

function defenderseSinAleatorio() {
  let out = true;
  if (casillas[0].textContent === player && casillas[1].textContent === player && casillas[2].textContent === '') {
    responder(2);
  }
  else if (casillas[1].textContent === player && casillas[2].textContent === player && casillas[0].textContent === '') {
    responder(0);
  }
  else if (casillas[3].textContent === player && casillas[4].textContent === player && casillas[5].textContent === '') {
    responder(5);
  }
  else if (casillas[4].textContent === player && casillas[5].textContent === player && casillas[3].textContent === '') {
    responder(3);
  }
  else if (casillas[6].textContent === player && casillas[7].textContent === player && casillas[8].textContent === '') {
    responder(8);
  }
  else if (casillas[7].textContent === player && casillas[8].textContent === player && casillas[6].textContent === '') {
    responder(6);
  }
  else if (casillas[0].textContent === player && casillas[3].textContent === player && casillas[6].textContent === '') {
    responder(6);
  }
  else if (casillas[3].textContent === player && casillas[6].textContent === player && casillas[0].textContent === '') {
    responder(0);
  }
  else if (casillas[1].textContent === player && casillas[4].textContent === player && casillas[7].textContent === '') {
    responder(7);
  }
  else if (casillas[4].textContent === player && casillas[7].textContent === player && casillas[1].textContent === '') {
    responder(1);
  }
  else if (casillas[2].textContent === player && casillas[5].textContent === player && casillas[8].textContent === '') {
    responder(8);
  }
  else if (casillas[5].textContent === player && casillas[8].textContent === player && casillas[2].textContent === '') {
    responder(2);
  }
  else if (casillas[0].textContent === player && casillas[4].textContent === player && casillas[8].textContent === '') {
    responder(8);
  }
  else if (casillas[4].textContent === player && casillas[8].textContent === player && casillas[0].textContent === '') {
    responder(0);
  }
  else if (casillas[2].textContent === player && casillas[4].textContent === player && casillas[6].textContent === '') {
    responder(6);
  }
  else if (casillas[4].textContent === player && casillas[6].textContent === player && casillas[2].textContent === '') {
    responder(2);
  }
  else if (casillas[0].textContent === player && casillas[2].textContent === player && casillas[1].textContent === '') {
    responder(1);
  }
  else if (casillas[3].textContent === player && casillas[5].textContent === player && casillas[4].textContent === '') {
    responder(4);
  }
  else if (casillas[6].textContent === player && casillas[8].textContent === player && casillas[7].textContent === '') {
    responder(7);
  }
  else if (casillas[0].textContent === player && casillas[6].textContent === player && casillas[3].textContent === '') {
    responder(3);
  }
  else if (casillas[1].textContent === player && casillas[7].textContent === player && casillas[4].textContent === '') {
    responder(4);
  }
  else if (casillas[2].textContent === player && casillas[8].textContent === player && casillas[5].textContent === '') {
    responder(5);
  }
  else if (casillas[0].textContent === player && casillas[8].textContent === player && casillas[4].textContent === '') {
    responder(4);
  }
  else if (casillas[2].textContent === player && casillas[6].textContent === player && casillas[4].textContent === '') {
    responder(4);
  }
  else {
    out = false;
  }
  return out;
}

function ganaJugador(casillasGanadoras) {
  for (let casilla of casillas) {
    casilla.onclick = null;
  }
  showWinLine(casillasGanadoras, '#8DDA8D');
  checkGameStatus('victoria');
  document.querySelector('.modal').style.backgroundColor = 'rgba(0,128,0,0.4)'
}

function saberSiGanaJugador() {
  let out = true;
  if ((casillas[0].textContent === player && casillas[1].textContent === player && casillas[2].textContent === player)) {
    ganaJugador([0, 1, 2]);
  } else if ((casillas[3].textContent === player && casillas[4].textContent === player && casillas[5].textContent === player)) {
    ganaJugador([3, 4, 5]);
  } else if ((casillas[6].textContent === player && casillas[7].textContent === player && casillas[8].textContent === player)) {
    ganaJugador([6, 7, 8]);
  } else if ((casillas[0].textContent === player && casillas[3].textContent === player && casillas[6].textContent === player)) {
    ganaJugador([0, 3, 6]);
  } else if ((casillas[1].textContent === player && casillas[4].textContent === player && casillas[7].textContent === player)) {
    ganaJugador([1, 4, 7]);
  } else if ((casillas[2].textContent === player && casillas[5].textContent === player && casillas[8].textContent === player)) {
    ganaJugador([2, 5, 8]);
  } else if ((casillas[0].textContent === player && casillas[4].textContent === player && casillas[8].textContent === player)) {
    ganaJugador([0, 4, 8]);
  } else if ((casillas[2].textContent === player && casillas[4].textContent === player && casillas[6].textContent === player)) {
    ganaJugador([2, 4, 6]);
  } else {
    out = false;
  }
  return out;
}

function saberSiGanaMaquina() {
  let out = true;
  if ((casillas[0].textContent === playerMaquina && casillas[1].textContent === playerMaquina && casillas[2].textContent === playerMaquina)) {
    ganaMaquina([0, 1, 2]);
  } else if ((casillas[3].textContent === playerMaquina && casillas[4].textContent === playerMaquina && casillas[5].textContent === playerMaquina)) {
    ganaMaquina([3, 4, 5]);
  } else if ((casillas[6].textContent === playerMaquina && casillas[7].textContent === playerMaquina && casillas[8].textContent === playerMaquina)) {
    ganaMaquina([6, 7, 8]);
  } else if ((casillas[0].textContent === playerMaquina && casillas[3].textContent === playerMaquina && casillas[6].textContent === playerMaquina)) {
    ganaMaquina([0, 3, 6]);
  } else if ((casillas[1].textContent === playerMaquina && casillas[4].textContent === playerMaquina && casillas[7].textContent === playerMaquina)) {
    ganaMaquina([1, 4, 7]);
  } else if ((casillas[2].textContent === playerMaquina && casillas[5].textContent === playerMaquina && casillas[8].textContent === playerMaquina)) {
    ganaMaquina([2, 5, 8]);
  } else if ((casillas[0].textContent === playerMaquina && casillas[4].textContent === playerMaquina && casillas[8].textContent === playerMaquina)) {
    ganaMaquina([0, 4, 8]);
  } else if ((casillas[2].textContent === playerMaquina && casillas[4].textContent === playerMaquina && casillas[6].textContent === playerMaquina)) {
    ganaMaquina([2, 4, 6]);
  } else {
    out = false;
  }
  return out;
}

function responderAleatoriamente() {
  let num;
  if (saberSiEsEmpate()) {
    empiezaMedio = false;
    empiezaEsquina = false;
    empiezaLado = false;
    checkGameStatus('empate');
    document.querySelector('.modal').style.backgroundColor = 'rgba(0,0,0,0.4)'
  }
  else {
    do {
      num = getRandomInt(9);
    } while (casillas[num].textContent !== '')

    responder(num);

    if (nivelElegido !== botonesNiveles[3]) {
      //No es necesario saber si con esa tirada ha ganado la máquina
      //en el modo imposible ya que en dicho modo antes de llegar aqui
      //ya ha intentado ganar.
      saberSiGanaMaquina();
    }
  }
}

function facil() {
  for (const casilla of casillas) {
    casilla.onclick = (e) => {
      casilla.textContent = player;
      casilla.style.color = '#8DDA8D'
      casillasMarcadas++;
      e.currentTarget.onclick = null; //CUANDO MARCA UNA CASILLA, NO PUEDE VOLVER A MARCARLA
      //SABER SI GANA EL JUGADOR
      if (saberSiGanaJugador()) { }
      //RESPONDER DE FORMA ALEATORIA EN UNA CASILLA LIBRE
      else {
        responderAleatoriamente();
      }
    }
  }
}

function medio() {
  for (const casilla of casillas) {
    casilla.onclick = (e) => {
      casilla.textContent = player;
      casilla.style.color = '#8DDA8D'
      casillasMarcadas++;
      e.currentTarget.onclick = null; //CUANDO MARCA UNA CASILLA, NO PUEDE VOLVER A MARCARLA
      //SABER SI GANA EL JUGADOR
      if (saberSiGanaJugador()) { }
      else if (maquinaIntentaGanar()) { }
      else if (defenderseSinAleatorio()) { }
      else {
        responderAleatoriamente();
      }
    }
  }
}

function dificil() {
  for (const casilla of casillas) {
    casilla.onclick = (e) => {
      casilla.textContent = player;
      casilla.style.color = '#8DDA8D'
      casillasMarcadas++;
      e.currentTarget.onclick = null; //CUANDO MARCA UNA CASILLA, NO PUEDE VOLVER A MARCARLA
      //SABER SI GANA EL JUGADOR
      if (saberSiGanaJugador()) {
        empiezaMedio = false;
        empiezaEsquina = false;
        empiezaLado = false;
      }
      else {
        if (casillasMarcadas != 1) {
          maquinaIntentaGanar();
        }
        if (casillasMarcadas == 1) {
          let randomDecision = getRandomInt(3);
          if (casillas[4].textContent === player) {
            empiezaMedio = true;
            if (randomDecision == 0 || randomDecision == 1) {
              let random = getRandomInt(4);
              if (random == 0) {
                responder(0);
              }
              else if (random == 1) {
                responder(2);
              }
              else if (random == 2) {
                responder(6);
              }
              else if (random == 3) {
                responder(8);
              }
            }
            else if (randomDecision == 2) {
              let random = getRandomInt(4);
              if (random == 0) {
                responder(1);
              }
              else if (random == 1) {
                responder(3);
              }
              else if (random == 2) {
                responder(5);
              }
              else if (random == 3) {
                responder(7);
              }
            }

          }
          else if (casillas[0].textContent === player || casillas[2].textContent === player || casillas[6].textContent === player || casillas[8].textContent === player) {
            empiezaEsquina = true;
            if (randomDecision == 0 || randomDecision == 1) {
              responder(4);
            }
            else if (randomDecision == 2) {
              let casillaOcupada;
              let casillasDisponibles = [casillas[0], casillas[1], casillas[2], casillas[3], casillas[5], casillas[6], casillas[7], casillas[8]]
              if (casillas[0].textContent === player) {
                casillaOcupada = casillas[0];
              } else if (casillas[2].textContent === player) {
                casillaOcupada = casillas[2];
              } else if (casillas[6].textContent === player) {
                casillaOcupada = casillas[6];
              } else if (casillas[8].textContent === player) {
                casillaOcupada = casillas[8];
              }
              casillasDisponibles = casillasDisponibles.filter(item => item !== casillaOcupada);
              let random = getRandomInt(7);
              responder(casillas.indexOf(casillasDisponibles[random]));

            }

          }
          else if (casillas[1].textContent === player || casillas[3].textContent === player || casillas[5].textContent === player || casillas[7].textContent === player) {
            empiezaLado = true;
            responder(4);
          }
        }
        else if (empiezaMedio) {
          let random = random0to1();
          if (defenderseSinAleatorio()) { }
          //COMPROBAR SI RESPONDE EN UNA ESQUINA CONTRARIA
          else if (((casillas[0].textContent === playerMaquina && casillas[8].textContent === player) || (casillas[8].textContent === playerMaquina && casillas[0].textContent === player))) {
            if (random == 0 && casillas[2].textContent === '') {
              responder(2);
            }
            else if (random == 1 && casillas[6].textContent === '') {
              responder(6);
            }
            else {
              defenderse();
            }
          }
          else if ((casillas[2].textContent === playerMaquina && casillas[6].textContent === player) || (casillas[6].textContent === playerMaquina && casillas[2].textContent === player)) {
            if (random == 0 && casillas[0].textContent === '') {
              responder(0);
            }
            else if (random == 1 && casillas[8].textContent === '') {
              responder(8);
            }
            else {
              defenderse();
            }
          }
          else { //DEFENDERSE
            defenderse();
          }
        }
        else if (empiezaEsquina) {
          let random = random0to1();
          if (defenderseSinAleatorio()) { }
          //COMPROBAR SI RESPONDE EN UNA ESQUINA CONTRARIA
          else if ((casillas[0].textContent === player && casillas[8].textContent === player) || (casillas[2].textContent === player && casillas[6].textContent === player)) {
            if (random == 0 && casillas[1].textContent === '') {
              responder(1);
            }
            else if (random == 1 && casillas[7].textContent === '') {
              responder(7);
            }
            else {
              defenderse();
            }
          }
          else { //DEFENDERSE
            defenderse();
          }
        }
        else if (empiezaLado) {
          if (defenderseSinAleatorio()) { }
          else if (casillas[1].textContent === player && casillas[3].textContent === player && casillas[0].textContent === '') {
            responder(0);
          }
          else if (casillas[1].textContent === player && casillas[5].textContent === player && casillas[2].textContent === '') {
            responder(2);
          }
          else if (casillas[3].textContent === player && casillas[7].textContent === player && casillas[6].textContent === '') {
            responder(6);
          }
          else if (casillas[7].textContent === player && casillas[5].textContent === player && casillas[8].textContent === '') {
            responder(8);
          }
          else if (casillas[7].textContent === player && casillas[2].textContent === player && casillas[8].textContent === '') {
            responder(8);
          }
          else if (casillas[7].textContent === player && casillas[0].textContent === player && casillas[6].textContent === '') {
            responder(6);
          }
          else if (casillas[3].textContent === player && casillas[2].textContent === player && casillas[0].textContent === '') {
            responder(0);
          }
          else if (casillas[3].textContent === player && casillas[8].textContent === player && casillas[6].textContent === '') {
            responder(6);
          }
          else if (casillas[1].textContent === player && casillas[6].textContent === player && casillas[0].textContent === '') {
            responder(0);
          }
          else if (casillas[1].textContent === player && casillas[8].textContent === player && casillas[2].textContent === '') {
            responder(2);
          }
          else if (casillas[5].textContent === player && casillas[0].textContent === player && casillas[2].textContent === '') {
            responder(2);
          }
          else if (casillas[5].textContent === player && casillas[6].textContent === player && casillas[8].textContent === '') {
            responder(8);
          }
          else {
            defenderse();
          }
        }
      }
    }
  }
}




//1 VS 1

function checkWinner() {
  let out = true;
  if (!turnoPlayer) { //COMPROBACIÓN PARA PLAYER 1
    if ((casillas[0].textContent === "X" && casillas[1].textContent === "X" && casillas[2].textContent === "X")) {
      ganaPlayer([0, 1, 2]);
    } else if ((casillas[3].textContent === "X" && casillas[4].textContent === "X" && casillas[5].textContent === "X")) {
      ganaPlayer([3, 4, 5]);
    } else if ((casillas[6].textContent === "X" && casillas[7].textContent === "X" && casillas[8].textContent === "X")) {
      ganaPlayer([6, 7, 8]);
    } else if ((casillas[0].textContent === "X" && casillas[3].textContent === "X" && casillas[6].textContent === "X")) {
      ganaPlayer([0, 3, 6]);
    } else if ((casillas[1].textContent === "X" && casillas[4].textContent === "X" && casillas[7].textContent === "X")) {
      ganaPlayer([1, 4, 7]);
    } else if ((casillas[2].textContent === "X" && casillas[5].textContent === "X" && casillas[8].textContent === "X")) {
      ganaPlayer([2, 5, 8]);
    } else if ((casillas[0].textContent === "X" && casillas[4].textContent === "X" && casillas[8].textContent === "X")) {
      ganaPlayer([0, 4, 8]);
    } else if ((casillas[2].textContent === "X" && casillas[4].textContent === "X" && casillas[6].textContent === "X")) {
      ganaPlayer([2, 4, 6]);
    } else {
      out = false;
    }
  } else {
    if ((casillas[0].textContent === "O" && casillas[1].textContent === "O" && casillas[2].textContent === "O")) {
      ganaPlayer([0, 1, 2]);
    } else if ((casillas[3].textContent === "O" && casillas[4].textContent === "O" && casillas[5].textContent === "O")) {
      ganaPlayer([3, 4, 5]);
    } else if ((casillas[6].textContent === "O" && casillas[7].textContent === "O" && casillas[8].textContent === "O")) {
      ganaPlayer([6, 7, 8]);
    } else if ((casillas[0].textContent === "O" && casillas[3].textContent === "O" && casillas[6].textContent === "O")) {
      ganaPlayer([0, 3, 6]);
    } else if ((casillas[1].textContent === "O" && casillas[4].textContent === "O" && casillas[7].textContent === "O")) {
      ganaPlayer([1, 4, 7]);
    } else if ((casillas[2].textContent === "O" && casillas[5].textContent === "O" && casillas[8].textContent === "O")) {
      ganaPlayer([2, 5, 8]);
    } else if ((casillas[0].textContent === "O" && casillas[4].textContent === "O" && casillas[8].textContent === "O")) {
      ganaPlayer([0, 4, 8]);
    } else if ((casillas[2].textContent === "O" && casillas[4].textContent === "O" && casillas[6].textContent === "O")) {
      ganaPlayer([2, 4, 6]);
    } else {
      out = false;
    }
  }
  return out;
}

function saberSiEsEmpate() {
  if (modo) { //Si juega contra la máquina
    if (casillasMarcadas === 5) {
      return true;
    }
  } else {
    if (casillasMarcadas === 9) {
      return true;
    }
  }
}

function ganaPlayer(casillasGanadoras) {
  for (let casilla of casillas) {
    casilla.onclick = null;
  }
  showWinLine(casillasGanadoras, color)
  checkGameStatus(player);
  let bgColorModal = color === '#FF817A' ? 'rgba(128,0,0,0.4)' : 'rgba(0,128,0,0.4)';
  document.querySelector('.modal').style.backgroundColor = bgColorModal;

}

function PvP() {
  partidaEnMarcha = true;
  casillasMarcadas = 0;
  turnoPlayer = 0;
  turnoPlayerText.textContent = 'Turno de: Player 1';
  turnoPlayerText.style.color = (turnoPlayer === 0 ? '#6EBB6E' : '#D86E6D');
  for (const casilla of casillas) {
    casilla.onclick = (e) => {
      player = turnoPlayer === 0 ? 'X' : 'O';
      casilla.textContent = player;
      color = turnoPlayer === 0 ? '#8DDA8D' : '#FF817A'
      casilla.style.color = color;
      e.currentTarget.onclick = null; //CUANDO MARCA UNA CASILLA, NO PUEDE VOLVER A MARCARLA
      casillasMarcadas++;
      //SABER SI GANA EL JUGADOR
      if (checkWinner()) {partidaEnMarcha = false;}
      //SABER SI ES EMPATE
      else if (saberSiEsEmpate()) {
        checkGameStatus('empate');
        document.querySelector('.modal').style.backgroundColor = 'rgba(0,0,0,0.4)'
        casilla.onclick = null;
        partidaEnMarcha = false;
      }
      if (partidaEnMarcha) {
        turnoPlayer = turnoPlayer === 0 ? 1 : 0;
        turnoPlayerText.textContent = 'Turno de: ' + (turnoPlayer === 0 ? 'Player 1' : 'Player 2');
        turnoPlayerText.style.color = (turnoPlayer === 0 ? '#6EBB6E' : '#D86E6D');
      }
    }
  }
}

//Donaciones






