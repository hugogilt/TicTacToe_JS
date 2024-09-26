function showWinLine(cells, color = 'red') {
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
                const scaleFactor = 0.99; // Factor para reducir la longitud de la línea a la mitad
                line.style.width = `${Math.sqrt(Math.pow(boardRect.width, 2) + Math.pow(boardRect.height, 2)) * scaleFactor}px`;
                line.style.transform = 'rotate(45deg) translate(-5px, -5px)';
            } else if (cells.includes(2) && cells.includes(4) && cells.includes(6)) {
                // Top-right to bottom-left
                const scaleFactor = 0.98; // Factor para reducir la longitud de la línea a la mitad
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

// showWinLine([2,4,6], 'red')
// showWinLine([0,1,2], 'red')
// showWinLine([0,3,6], 'red')
// showWinLine([0,4,8], 'red')



const difficultyTextInicio = 'Elige el nivel de dificultad:'
const difficultyTextJuego = 'Nivel de dificultad: ';
const playerChoiceTextInicio = 'Elige tu ficha:';
const playerChoiceTextJuego = 'Tu ficha: ';

let empiezaMedio;
let empiezaEsquina;
let empiezaLado;
let casillasMarcadas = 0;
let player = '';
let playerMaquina = '';
const botonesNiveles = document.querySelectorAll('.niveles');
const botonesFicha = document.querySelectorAll('.ficha');
const casillas = Array.from(document.querySelectorAll('.cell'));
const fichaSinElegir = document.createElement('p');
const nivelSinElegir = document.createElement('p');
let nivelElegido = undefined;
let fichaElegida = undefined;


cambioPantallaInicio();

for(let boton of botonesNiveles){
    boton.onclick = (e) => {
    for(boton of botonesNiveles){
        boton.disabled = false;
    }
    e.currentTarget.disabled = true;
}
}

for(let boton of botonesFicha){
    boton.onclick = (e) => {
    for(boton of botonesFicha){
        boton.disabled = false;
    }
    e.currentTarget.disabled = true;
}
}


document.querySelector('#jugarbtn').onclick = () => {
    let check1 = false;
    let check2 = false;
    for(let boton of botonesNiveles) {
        if (boton.disabled === true) {
            check1 = true;
            boton.id = 'nivelElegido'
        }
    }
    for(let boton of botonesFicha){
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
        cambioPantallaJuego(nivelElegido, fichaElegida);
        check1 = false; check2 = false;
    } else{
        if (!check1 && campoVacio(botonesNiveles[0])) {
            nivelSinElegir.textContent = 'Debes elegir un nivel para continuar'
            nivelSinElegir.style.color = 'red';
            nivelSinElegir.id = 'imHere'
            nivelSinElegir.classList.add('inicio')
            document.querySelector('#nivelesBtns').after(nivelSinElegir)
        } else if(check1) {
            nivelSinElegir.remove();
        }
         if(!check2 && campoVacio(botonesFicha[0])) {
            fichaSinElegir.textContent = 'Debes elegir una ficha para continuar'
            fichaSinElegir.style.color = 'red';
            fichaSinElegir.id = 'imHere'
            fichaSinElegir.classList.add('inicio')
            document.querySelector('#fichasBtns').after(fichaSinElegir)
        } else if(check2) {
            fichaSinElegir.remove();
        }
    }
}

function cambioPantallaInicio() {
    const elementosJuego = document.querySelectorAll('.juego');
    const elementosInicio = document.querySelectorAll('.inicio');
    for(let elementoJuego of elementosJuego){
        elementoJuego.classList.add('hidden')
    }
    for(let elementoInicio of elementosInicio){
        elementoInicio.classList.remove('hidden')
    }
    document.querySelector('#difficulty').textContent = difficultyTextInicio;
    document.querySelector('#player-choice').textContent = playerChoiceTextInicio;
    resetearBotones();
    reiniciar();
}

function cambioPantallaJuego(){
    const elementosJuego = document.querySelectorAll('.juego');
    const elementosInicio = document.querySelectorAll('.inicio');
    for(let elementoJuego of elementosJuego){
        elementoJuego.classList.remove('hidden')
    }
    for(let elementoInicio of elementosInicio){
        elementoInicio.classList.add('hidden')
    }
    document.querySelector('#difficulty').textContent = difficultyTextJuego+nivelElegido.textContent;
    document.querySelector('#player-choice').textContent = playerChoiceTextJuego+fichaElegida.textContent;
    player = fichaElegida.textContent;
    playerMaquina = player === 'X' ? 'O' : 'X';
    if (botonesNiveles[0] === nivelElegido) {
        facil();
    } else if (botonesNiveles[1] === nivelElegido) { 
        medio();
    } else if (botonesNiveles[2] === nivelElegido) { 
        dificil();
    } else if (botonesNiveles[3] === nivelElegido) { 
        imposible();
    }
}

function resetearBotones() {
    for(let boton of botonesNiveles){
        boton.disabled = false;
        boton.id = '';
        nivelElegido = null;
    }

    for(let boton of botonesFicha){
        boton.disabled = false;
        boton.id = '';
        fichaElegida = null;
    }
    for(let casilla of casillas){
        casilla.onclick = null;
    }
}

function reiniciar(){
    empiezaMedio=false;
    empiezaEsquina=false;
    empiezaLado=false;
    casillasMarcadas = 0;
    const line = document.querySelector('.win-line')
    line.style.display = 'none';
    for(let casilla of casillas){
        casilla.textContent = '';
    }
    if (botonesNiveles[0] === nivelElegido) {
        facil();
    } else if (botonesNiveles[1] === nivelElegido) { 
        medio();
    } else if (botonesNiveles[2] === nivelElegido) { 
        dificil();
    } else if (botonesNiveles[3] === nivelElegido) { 
        imposible();
    }
}

document.querySelector('#reiniciarbtn').onclick = reiniciar;
document.querySelector('#iniciobtn').onclick = cambioPantallaInicio;

function campoVacio(lugar){
    if (lugar.parentElement.querySelector('#imHere') === null) {
      return true;
    } else {
      return false;
    }
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

function imposible(){
    for(const casilla of casillas){
        casilla.onclick = (e) => {
        // casilla.style.fontSize = '40px'
        casilla.textContent = player;
        casilla.style.color = 'green'
        casillasMarcadas++;
        e.currentTarget.onclick = null; //CUANDO MARCA UNA CASILLA, NO PUEDE VOLVER A MARCARLA
        if (saberSiGanaJugador()) {
            empiezaMedio=false;
            empiezaEsquina=false;
            empiezaLado=false;
        }
        else {
                if (casillasMarcadas!=1) {
                    maquinaIntentaGanar();
                }
                if (casillasMarcadas==1) {
                    if (casillas[4].textContent === player) {
                        empiezaMedio=true;
                        let random = getRandomInt(4);
                        if (random==0) {
                            responder(0);
                        }
                        else if (random==1) {
                            responder(2);
                        }
                        else if (random==2) {
                            responder(6);
                        }
                        else if (random==3) {
                            responder(8);
                        }

                    }
                    else if (casillas[0].textContent === player||casillas[2].textContent === player||casillas[6].textContent === player||casillas[8].textContent === player) {
                        empiezaEsquina=true;
                        responder(4);
                    }
                    else if (casillas[1].textContent === player||casillas[3].textContent === player||casillas[5].textContent === player||casillas[7].textContent === player) {
                        empiezaLado=true;
                        responder(4);
                    }
                }
                else if (empiezaMedio) {
                    let random = random0to1(); 
                    if (defenderseSinAleatorio()){}
                    //COMPROBAR SI RESPONDE EN UNA ESQUINA CONTRARIA
                    else if (((casillas[0].textContent === playerMaquina &&casillas[8].textContent === player)||(casillas[8].textContent === playerMaquina &&casillas[0].textContent === player))) {
                        if (random==0&&casillas[2].textContent === '') {
                            responder(2);
                        }
                        else if (random==1&&casillas[6].textContent === '') {
                            responder(6);
                        }
                        else {
                            defenderse();
                        }
                    }					
                    else if ((casillas[2].textContent === playerMaquina &&casillas[6].textContent === player)||(casillas[6].textContent === playerMaquina &&casillas[2].textContent === player)) {
                        if (random==0&&casillas[0].textContent === '') {
                            responder(0);
                        }
                        else if (random==1&&casillas[8].textContent === '') {
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
                    if(defenderseSinAleatorio()) {}
                    //COMPROBAR SI RESPONDE //EN UNA ESQUINA CONTRARIA
                    else if ((casillas[0].textContent === player&&casillas[8].textContent === player)||(casillas[2].textContent === player&&casillas[6].textContent === player)) {
                        if (random==0&&casillas[1].textContent === '') {
                            responder(1);
                        }
                        else if (random==1&&casillas[7].textContent === '') {
                            responder(7);
                        }
                        else {
                            defenderse();
                        }
                    //COMPROBAR SI RESPONDE EN UN MEDIO OPUESTO A LA ESQUINA DONDE HAYA EMPEZADO
                    } else if ((casillas[0].textContent === player&&casillas[7].textContent === player)) {
                        responder(6);
                    } else if((casillas[0].textContent === player&&casillas[5].textContent === player)) {
                        responder(2);
                    } else if((casillas[2].textContent === player&&casillas[7].textContent === player)) {
                        responder(8);
                    } else if((casillas[2].textContent === player&&casillas[3].textContent === player)) {
                        responder(0);
                    } else if((casillas[6].textContent === player&&casillas[1].textContent === player)) {
                        responder(0);
                    } else if((casillas[6].textContent === player&&casillas[5].textContent === player)) {
                        responder(8);
                    } else if((casillas[8].textContent === player&&casillas[1].textContent === player)) {
                        responder(2);
                    } else if((casillas[8].textContent === player&&casillas[3].textContent === player)) {
                        responder(6);
                    } else { //DEFENDERSE
                        defenderse();
                    }
                }
                else if (empiezaLado) {
                    
                    if(defenderseSinAleatorio()){}
                    else if (casillas[1].textContent === player&&casillas[3].textContent === player&&casillas[0].textContent === '') {
                        responder(0);
                    }
                    else if (casillas[1].textContent === player&&casillas[5].textContent === player&&casillas[2].textContent === '') {
                        responder(2);
                    }
                    else if (casillas[3].textContent === player&&casillas[7].textContent === player&&casillas[6].textContent === '') {
                        responder(6);
                    }
                    else if (casillas[7].textContent === player&&casillas[5].textContent === player&&casillas[8].textContent === '') {
                        responder(8);
                    }
                    //Aqui empieza lo de Noor
                    else if (casillas[7].textContent === player && casillas[2].textContent === player && casillas[8].textContent === ''){
                        responder(8);
                    }
                    else if (casillas[7].textContent === player && casillas[0].textContent === player && casillas[6].textContent === '') {
                        responder(6);
                    }
                    else if (casillas[3].textContent === player && casillas[2].textContent === player && casillas[0].textContent === ''){
                        responder(0);
                    }
                    else if (casillas[3].textContent === player && casillas[8].textContent === player && casillas[6].textContent === ''){
                        responder(6);
                    }
                    else if (casillas[1].textContent === player && casillas[6].textContent === player && casillas[0].textContent === ''){
                        responder(0);
                    }
                    else if (casillas[1].textContent === player && casillas[8].textContent === player && casillas[2].textContent === ''){
                        responder(2);
                    }
                    else if (casillas[5].textContent === player && casillas[0].textContent === player && casillas[2].textContent === ''){
                        responder(2);
                    }
                    else if (casillas[5].textContent === player && casillas[6].textContent === player && casillas[8].textContent === ''){
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

function responder(num){
    if (casillas[num].textContent === '') {
        casillas[num].onclick = null;
        casillas[num].style.color = 'red'
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

function maquinaIntentaGanar(){
    let out = true;
    if (casillas[0].textContent === playerMaquina &&casillas[1].textContent === playerMaquina &&casillas[2].textContent === '') {
        responder(2);
        ganaMaquina([0,1,2]);
        
    }
    else if (casillas[1].textContent === playerMaquina &&casillas[2].textContent === playerMaquina &&casillas[0].textContent === '') {
        responder(0);
        ganaMaquina([0,1,2]);
    }
    else if (casillas[3].textContent === playerMaquina &&casillas[4].textContent === playerMaquina &&casillas[5].textContent === '') {
        responder(5);
        ganaMaquina([3,4,5]);

    }
    else if (casillas[4].textContent === playerMaquina &&casillas[5].textContent === playerMaquina &&casillas[3].textContent === '') {
        responder(3);
        ganaMaquina([4,5,3]);
    }
    else if (casillas[6].textContent === playerMaquina &&casillas[7].textContent === playerMaquina &&casillas[8].textContent === '') {
        responder(8);
        ganaMaquina([6,7,8]);
    }
    else if (casillas[7].textContent === playerMaquina &&casillas[8].textContent === playerMaquina &&casillas[6].textContent === '') {
        responder(6);
        ganaMaquina([6,7,8]);

    }
    else if (casillas[0].textContent === playerMaquina &&casillas[3].textContent === playerMaquina &&casillas[6].textContent === '') {
        responder(6);
        ganaMaquina([0,3,6]);
    }
    else if (casillas[3].textContent === playerMaquina &&casillas[6].textContent === playerMaquina &&casillas[0].textContent === '') {
        responder(0);
        ganaMaquina([0,3,6]);
    }
    else if (casillas[1].textContent === playerMaquina &&casillas[4].textContent === playerMaquina &&casillas[7].textContent === '') {
        responder(7);
        ganaMaquina([1,4,7]);
    }
    else if (casillas[4].textContent === playerMaquina &&casillas[7].textContent === playerMaquina &&casillas[1].textContent === '') {
        responder(1);
        ganaMaquina([1,4,7]);
    }
    else if (casillas[2].textContent === playerMaquina &&casillas[5].textContent === playerMaquina &&casillas[8].textContent === '') {
        responder(8);
        ganaMaquina([2,5,8]);
    }
    else if (casillas[5].textContent === playerMaquina &&casillas[8].textContent === playerMaquina &&casillas[2].textContent === '') {
        responder(2);
        ganaMaquina([2,5,8]);
    }
    else if (casillas[0].textContent === playerMaquina &&casillas[4].textContent === playerMaquina &&casillas[8].textContent === '') {
        responder(8);
        ganaMaquina([0,4,8]);

    }
    else if (casillas[4].textContent === playerMaquina &&casillas[8].textContent === playerMaquina &&casillas[0].textContent === '') {
        responder(0);
        ganaMaquina([0,4,8]);
    }
    else if (casillas[2].textContent === playerMaquina &&casillas[4].textContent === playerMaquina &&casillas[6].textContent === '') {
        responder(6);
        ganaMaquina([2,4,6]);
    }
    else if (casillas[4].textContent === playerMaquina &&casillas[6].textContent === playerMaquina &&casillas[2].textContent === '') {
        responder(2);
        ganaMaquina([2,4,6]);
    }
    else if (casillas[0].textContent === playerMaquina &&casillas[2].textContent === playerMaquina &&casillas[1].textContent === '') {
        responder(1);
        ganaMaquina([0,1,2]);

    }
    else if (casillas[3].textContent === playerMaquina &&casillas[5].textContent === playerMaquina &&casillas[4].textContent === '') {
        responder(4);
        ganaMaquina([3,4,5]);
    }
    else if (casillas[6].textContent === playerMaquina &&casillas[8].textContent === playerMaquina &&casillas[7].textContent === '') {
        responder(7);
        ganaMaquina([6,7,8]);
    }
    else if (casillas[0].textContent === playerMaquina &&casillas[6].textContent === playerMaquina &&casillas[3].textContent === '') {

        responder(3);
        ganaMaquina([0,3,6]);
    }
    else if (casillas[1].textContent === playerMaquina &&casillas[7].textContent === playerMaquina &&casillas[4].textContent === '') {
        responder(4);
        ganaMaquina([1,4,7]);
    }
    else if (casillas[2].textContent === playerMaquina &&casillas[8].textContent === playerMaquina &&casillas[5].textContent === '') {
        responder(5);
        ganaMaquina([2,5,8]);

    }
    else if (casillas[0].textContent === playerMaquina &&casillas[8].textContent === playerMaquina &&casillas[4].textContent === '') {
        responder(4);
        ganaMaquina([0,4,8]);

    }
    else if (casillas[2].textContent === playerMaquina &&casillas[6].textContent === playerMaquina &&casillas[4].textContent === '') {
        responder(4);
        ganaMaquina([2,4,6]);

    } else {
        out = false;
    }
    return out;
}

function ganaMaquina(casillasGanadoras) {
    empiezaMedio=false;
    empiezaEsquina=false;
    empiezaLado=false;
    for(let casilla of casillas) {
        casilla.onclick = null;
    }
    showWinLine(casillasGanadoras, 'red')
    checkGameStatus('derrota');
    document.querySelector('.modal').style.backgroundColor = 'rgba(128,0,0,0.4)'
}

function defenderse() {
    if (casillas[0].textContent === player&&casillas[1].textContent === player&&casillas[2].textContent === '') {
        responder(2);

    }
    else if (casillas[1].textContent === player&&casillas[2].textContent === player&&casillas[0].textContent === '') {
        responder(0);
    }
    else if (casillas[3].textContent === player&&casillas[4].textContent === player&&casillas[5].textContent === '') {
        responder(5);
    }
    else if (casillas[4].textContent === player&&casillas[5].textContent === player&&casillas[3].textContent === '') {
        responder(3);
    }
    else if (casillas[6].textContent === player&&casillas[7].textContent === player&&casillas[8].textContent === '') {
        responder(8);
    }
    else if (casillas[7].textContent === player&&casillas[8].textContent === player&&casillas[6].textContent === '') {
        responder(6);
    }
    else if (casillas[0].textContent === player&&casillas[3].textContent === player&&casillas[6].textContent === '') {
        responder(6);
    }
    else if (casillas[3].textContent === player&&casillas[6].textContent === player&&casillas[0].textContent === '') {
        responder(0);
    }
    else if (casillas[1].textContent === player&&casillas[4].textContent === player&&casillas[7].textContent === '') {
        responder(7);
    }
    else if (casillas[4].textContent === player&&casillas[7].textContent === player&&casillas[1].textContent === '') {
        responder(1);
    }
    else if (casillas[2].textContent === player&&casillas[5].textContent === player&&casillas[8].textContent === '') {
        responder(8);
    }
    else if (casillas[5].textContent === player&&casillas[8].textContent === player&&casillas[2].textContent === '') {
        responder(2);
    }
    else if (casillas[0].textContent === player&&casillas[4].textContent === player&&casillas[8].textContent === '') {
        responder(8);
    }
    else if (casillas[4].textContent === player&&casillas[8].textContent === player&&casillas[0].textContent === '') {
        responder(0);
    }
    else if (casillas[2].textContent === player&&casillas[4].textContent === player&&casillas[6].textContent === '') {
        responder(6);
    }
    else if (casillas[4].textContent === player&&casillas[6].textContent === player&&casillas[2].textContent === '') {
        responder(2);
    }
    else if (casillas[0].textContent === player&&casillas[2].textContent === player&&casillas[1].textContent === '') {
        responder(1);
    }
    else if (casillas[3].textContent === player&&casillas[5].textContent === player&&casillas[4].textContent === '') {
        responder(4);
    }
    else if (casillas[6].textContent === player&&casillas[8].textContent === player&&casillas[7].textContent === '') {
        responder(7);
    }
    else if (casillas[0].textContent === player&&casillas[6].textContent === player&&casillas[3].textContent === '') {
        responder(3);
    }
    else if (casillas[1].textContent === player&&casillas[7].textContent === player&&casillas[4].textContent === '') {
        responder(4);
    }
    else if (casillas[2].textContent === player&&casillas[8].textContent === player&&casillas[5].textContent === '') {
        responder(5);
    }
    else if (casillas[0].textContent === player&&casillas[8].textContent === player&&casillas[4].textContent === '') {
        responder(4);
    }
    else if (casillas[2].textContent === player&&casillas[6].textContent === player&&casillas[4].textContent === '') {
        responder(4);
    }
    //preparar ataque
    else if (casillas[0].textContent === playerMaquina &&casillas[1].textContent === ''&&casillas[2].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(1);
        }
        else if (random==1) {
            responder(2);
        }
    }
    else if (casillas[0].textContent === playerMaquina &&casillas[4].textContent === ''&&casillas[8].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(4);
        }
        else if (random==1) {
            responder(8);
        }
    }
    else if (casillas[0].textContent === playerMaquina &&casillas[3].textContent === ''&&casillas[6].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(3);
        }
        else if (random==1) {
            responder(6);
        }
    }
    else if (casillas[1].textContent === playerMaquina &&casillas[0].textContent === ''&&casillas[2].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(0);
        }
        else if (random==1) {
            responder(2);
        }
    }
    else if (casillas[1].textContent === playerMaquina &&casillas[4].textContent === ''&&casillas[7].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(4);
        }
        else if (random==1) {
            responder(7);
        }
    }
    else if (casillas[2].textContent === playerMaquina &&casillas[1].textContent === ''&&casillas[0].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(1);
        }
        else if (random==1) {
            responder(0);
        }
    }
    else if (casillas[2].textContent === playerMaquina &&casillas[5].textContent === ''&&casillas[8].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(5);
        }
        else if (random==1) {
            responder(8);
        }
    }
    else if (casillas[2].textContent === playerMaquina &&casillas[4].textContent === ''&&casillas[6].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(4);
        }
        else if (random==1) {
            responder(6);
        }
    }
    else if (casillas[3].textContent === playerMaquina &&casillas[0].textContent === ''&&casillas[6].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(0);
        }
        else if (random==1) {
            responder(6);
        }
    }
    else if (casillas[3].textContent === playerMaquina &&casillas[4].textContent === ''&&casillas[5].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(4);
        }
        else if (random==1) {
            responder(5);
        }
    }
    else if (casillas[4].textContent === playerMaquina &&casillas[0].textContent === ''&&casillas[8].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(0);
        }
        else if (random==1) {
            responder(8);
        }
    }
    else if (casillas[4].textContent === playerMaquina &&casillas[1].textContent === ''&&casillas[7].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(1);
        }
        else if (random==1) {
            responder(7);
        }
    }
    else if (casillas[4].textContent === playerMaquina &&casillas[2].textContent === ''&&casillas[6].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(2);
        }
        else if (random==1) {
            responder(6);
        }
    }
    else if (casillas[4].textContent === playerMaquina &&casillas[3].textContent === ''&&casillas[5].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(3);
        }
        else if (random==1) {
            responder(5);
        }
    }
    else if (casillas[5].textContent === playerMaquina &&casillas[3].textContent === ''&&casillas[8].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(3);
        }
        else if (random==1) {
            responder(8);
        }
    }
    else if (casillas[5].textContent === playerMaquina &&casillas[4].textContent === ''&&casillas[3].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(4);
        }
        else if (random==1) {
            responder(3);
        }
    }
    else if (casillas[6].textContent === playerMaquina &&casillas[0].textContent === ''&&casillas[3].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(0);
        }
        else if (random==1) {
            responder(3);
        }
    }
    else if (casillas[6].textContent === playerMaquina &&casillas[4].textContent === ''&&casillas[2].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(4);
        }
        else if (random==1) {
            responder(2);
        }
    }
    else if (casillas[6].textContent === playerMaquina &&casillas[7].textContent === ''&&casillas[8].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(7);
        }
        else if (random==1) {
            responder(8);
        }
    }
    else if (casillas[7].textContent === playerMaquina &&casillas[6].textContent === ''&&casillas[8].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(6);
        }
        else if (random==1) {
            responder(8);
        }
    }
    else if (casillas[7].textContent === playerMaquina &&casillas[4].textContent === ''&&casillas[1].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(1);
        }
        else if (random==1) {
            responder(4);
        }
    }
    else if (casillas[8].textContent === playerMaquina &&casillas[4].textContent === ''&&casillas[0].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(4);
        }
        else if (random==1) {
            responder(0);
        }
    }
    else if (casillas[8].textContent === playerMaquina &&casillas[5].textContent === ''&&casillas[2].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(5);
        }
        else if (random==1) {
            responder(2);
        }
    }
    else if (casillas[8].textContent === playerMaquina &&casillas[7].textContent === ''&&casillas[6].textContent === '') {
        let random = random0to1();
        if (random==0) {
            responder(7);
        }
        else if (random==1) {
            responder(6);
        }
    }

    else {
        responderAleatoriamente();
    }
}

function defenderseSinAleatorio() {
    let out = true;
    if (casillas[0].textContent === player&&casillas[1].textContent === player&&casillas[2].textContent === '') {
        responder(2);
    }
    else if (casillas[1].textContent === player&&casillas[2].textContent === player&&casillas[0].textContent === '') {
        responder(0);
    }
    else if (casillas[3].textContent === player&&casillas[4].textContent === player&&casillas[5].textContent === '') {
        responder(5);
    }
    else if (casillas[4].textContent === player&&casillas[5].textContent === player&&casillas[3].textContent === '') {
        responder(3);
    }
    else if (casillas[6].textContent === player&&casillas[7].textContent === player&&casillas[8].textContent === '') {
        responder(8);
    }
    else if (casillas[7].textContent === player&&casillas[8].textContent === player&&casillas[6].textContent === '') {
        responder(6);
    }
    else if (casillas[0].textContent === player&&casillas[3].textContent === player&&casillas[6].textContent === '') {
        responder(6);
    }
    else if (casillas[3].textContent === player&&casillas[6].textContent === player&&casillas[0].textContent === '') {
        responder(0);
    }
    else if (casillas[1].textContent === player&&casillas[4].textContent === player&&casillas[7].textContent === '') {
        responder(7);
    }
    else if (casillas[4].textContent === player&&casillas[7].textContent === player&&casillas[1].textContent === '') {
        responder(1);
    }
    else if (casillas[2].textContent === player&&casillas[5].textContent === player&&casillas[8].textContent === '') {
        responder(8);
    }
    else if (casillas[5].textContent === player&&casillas[8].textContent === player&&casillas[2].textContent === '') {
        responder(2);
    }
    else if (casillas[0].textContent === player&&casillas[4].textContent === player&&casillas[8].textContent === '') {
        responder(8);
    }
    else if (casillas[4].textContent === player&&casillas[8].textContent === player&&casillas[0].textContent === '') {
        responder(0);
    }
    else if (casillas[2].textContent === player&&casillas[4].textContent === player&&casillas[6].textContent === '') {
        responder(6);
    }
    else if (casillas[4].textContent === player&&casillas[6].textContent === player&&casillas[2].textContent === '') {
        responder(2);
    }
    else if (casillas[0].textContent === player&&casillas[2].textContent === player&&casillas[1].textContent === '') {
        responder(1);
    }
    else if (casillas[3].textContent === player&&casillas[5].textContent === player&&casillas[4].textContent === '') {
        responder(4);
    }
    else if (casillas[6].textContent === player&&casillas[8].textContent === player&&casillas[7].textContent === '') {
        responder(7);
    }
    else if (casillas[0].textContent === player&&casillas[6].textContent === player&&casillas[3].textContent === '') {
        responder(3);
    }
    else if (casillas[1].textContent === player&&casillas[7].textContent === player&&casillas[4].textContent === '') {
        responder(4);
    }
    else if (casillas[2].textContent === player&&casillas[8].textContent === player&&casillas[5].textContent === '') {
        responder(5);
    }
    else if (casillas[0].textContent === player&&casillas[8].textContent === player&&casillas[4].textContent === '') {
        responder(4);
    }
    else if (casillas[2].textContent === player&&casillas[6].textContent === player&&casillas[4].textContent === '') {
        responder(4);
    }
    else {
        out = false;
    }
    return out;
}

function ganaJugador(casillasGanadoras) {
    for(let casilla of casillas) {
        casilla.onclick = null;
    }
    showWinLine(casillasGanadoras, 'green');
    checkGameStatus('victoria');
    document.querySelector('.modal').style.backgroundColor = 'rgba(0,128,0,0.4)'
}

function saberSiGanaJugador() {
    let out = true;
    if ((casillas[0].textContent === player&&casillas[1].textContent === player&&casillas[2].textContent === player)) {
        ganaJugador([0,1,2]);
    } else if((casillas[3].textContent === player&&casillas[4].textContent === player&&casillas[5].textContent === player)) {
        ganaJugador([3,4,5]);
    } else if((casillas[6].textContent === player&&casillas[7].textContent === player&&casillas[8].textContent === player)){
        ganaJugador([6,7,8]);
    } else if((casillas[0].textContent === player&&casillas[3].textContent === player&&casillas[6].textContent === player)){
        ganaJugador([0,3,6]);
    } else if((casillas[1].textContent === player&&casillas[4].textContent === player&&casillas[7].textContent === player)){
        ganaJugador([1,4,7]);
    } else if((casillas[2].textContent === player&&casillas[5].textContent === player&&casillas[8].textContent === player)){
        ganaJugador([2,5,8]);
    } else if((casillas[0].textContent === player&&casillas[4].textContent === player&&casillas[8].textContent === player)){
        ganaJugador([0,4,8]);
    } else if((casillas[2].textContent === player&&casillas[4].textContent === player&&casillas[6].textContent === player)){
        ganaJugador([2,4,6]);
    } else {
        out = false;
    }
    return out;
}

function saberSiGanaMaquina() {
    let out = true;
    if ((casillas[0].textContent === playerMaquina&&casillas[1].textContent === playerMaquina&&casillas[2].textContent === playerMaquina)) {
        ganaMaquina([0,1,2]);
    } else if((casillas[3].textContent === playerMaquina&&casillas[4].textContent === playerMaquina&&casillas[5].textContent === playerMaquina)) {
        ganaMaquina([3,4,5]);
    } else if((casillas[6].textContent === playerMaquina&&casillas[7].textContent === playerMaquina&&casillas[8].textContent === playerMaquina)){
        ganaMaquina([6,7,8]);
    } else if((casillas[0].textContent === playerMaquina&&casillas[3].textContent === playerMaquina&&casillas[6].textContent === playerMaquina)){
        ganaMaquina([0,3,6]);
    } else if((casillas[1].textContent === playerMaquina&&casillas[4].textContent === playerMaquina&&casillas[7].textContent === playerMaquina)){
        ganaMaquina([1,4,7]);
    } else if((casillas[2].textContent === playerMaquina&&casillas[5].textContent === playerMaquina&&casillas[8].textContent === playerMaquina)){
        ganaMaquina([2,5,8]);
    } else if((casillas[0].textContent === playerMaquina&&casillas[4].textContent === playerMaquina&&casillas[8].textContent === playerMaquina)){
        ganaMaquina([0,4,8]);
    } else if((casillas[2].textContent === playerMaquina&&casillas[4].textContent === playerMaquina&&casillas[6].textContent === playerMaquina)){
        ganaMaquina([2,4,6]);
    } else {
        out = false;
    }
    return out;
}

function responderAleatoriamente(){
    let num;
    let count=0;
    for (const casilla of casillas) {
        if(casilla.textContent === '') {
        count++;
        break; //No se si esto lo hace mas eficiente
        }
    }
    if (count==0) {
        empiezaMedio=false;
        empiezaEsquina=false;
        empiezaLado=false;
        checkGameStatus('empate');
        document.querySelector('.modal').style.backgroundColor = 'rgba(0,0,0,0.4)'
    }
    else {
        do{
            num = getRandomInt(9);
        } while(casillas[num].textContent !== '')

        responder(num);

        if (nivelElegido !== botonesNiveles[3] ) {
            //No es necesario saber si con esa tirada ha ganado la máquina
            //en el modo imposible ya que en dicho modo antes de llegar aqui
            //ya ha intentado ganar.
            saberSiGanaMaquina();
        }
    }
}

function facil() {
    for(const casilla of casillas){
        casilla.onclick = (e) => {
            casilla.textContent = player;
            casilla.style.color = 'green'
            casillasMarcadas++;
            e.currentTarget.onclick = null; //CUANDO MARCA UNA CASILLA, NO PUEDE VOLVER A MARCARLA
            //SABER SI GANA EL JUGADOR
            if (saberSiGanaJugador()) {}
            //RESPONDER DE FORMA ALEATORIA EN UNA CASILLA LIBRE
            else {
                responderAleatoriamente();
            }
        }
    }
}

function medio() {
    for(const casilla of casillas){
        casilla.onclick = (e) => {
            casilla.textContent = player;
            casilla.style.color = 'green'
            casillasMarcadas++;
            e.currentTarget.onclick = null; //CUANDO MARCA UNA CASILLA, NO PUEDE VOLVER A MARCARLA
    		//SABER SI GANA EL JUGADOR
            if (saberSiGanaJugador()){}
            else if (maquinaIntentaGanar()) {}
            else if (defenderseSinAleatorio()){}
            else {
                responderAleatoriamente();
            }
        }
    }
}

function dificil() {
    for(const casilla of casillas){
        casilla.onclick = (e) => {
            casilla.textContent = player;
            casilla.style.color = 'green'
            casillasMarcadas++;
            e.currentTarget.onclick = null; //CUANDO MARCA UNA CASILLA, NO PUEDE VOLVER A MARCARLA
            //SABER SI GANA EL JUGADOR
            debugger;
            if (saberSiGanaJugador()) {
                empiezaMedio=false;
                empiezaEsquina=false;
                empiezaLado=false;
            }
            else {
                if (casillasMarcadas != 1) {
                    maquinaIntentaGanar();
                }
                if (casillasMarcadas==1) {
                    let randomDecision = getRandomInt(3);
                    if (casillas[4].textContent === player) {
                        empiezaMedio=true;
                        if (randomDecision == 0 || randomDecision == 1) {
                            let random = getRandomInt(4);
                            if (random==0) {
                                responder(0);
                            }
                            else if (random==1) {
                                responder(2);
                            }
                            else if (random==2) {
                                responder(6);
                            }
                            else if (random==3) {
                                responder(8);
                            }
                        }
                        else if (randomDecision==2) {
                            let random = getRandomInt(4);
                            if (random==0) {
                                responder(1);
                            }
                            else if (random==1) {
                                responder(3);
                            }
                            else if (random==2) {
                                responder(5);
                            }
                            else if (random==3) {
                                responder(7);
                            }
                        }

                    }
                    else if (casillas[0].textContent === player||casillas[2].textContent === player||casillas[6].textContent === player||casillas[8].textContent === player) {
                        empiezaEsquina=true;
                        if (randomDecision==0 || randomDecision==1) {
                            responder(4);
                        }
                        else if (randomDecision==2) {
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
                    else if (casillas[1].textContent === player||casillas[3].textContent === player||casillas[5].textContent === player||casillas[7].textContent === player) {
                        empiezaLado=true;
                        responder(4);
                    }
                }
                else if (empiezaMedio) {
                    let random = random0to1();
                    if (defenderseSinAleatorio()){}
                    //COMPROBAR SI RESPONDE EN UNA ESQUINA CONTRARIA
                    else if (((casillas[0].textContent === playerMaquina&&casillas[8].textContent === player)||(casillas[8].textContent === playerMaquina&&casillas[0].textContent === player))) {
                        if (random==0&&casillas[2].textContent === '') {
                            responder(2);
                        }
                        else if (random==1&&casillas[6].textContent === '') {
                            responder(6);
                        }
                        else {
                            defenderse();
                        }
                    }							
                    else if ((casillas[2].textContent === playerMaquina&&casillas[6].textContent === player)||(casillas[6].textContent === playerMaquina&&casillas[2].textContent === player)) {
                        if (random==0&&casillas[0].textContent === '') {
                            responder(0);
                        }
                        else if (random==1&&casillas[8].textContent === '') {
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
                    if(defenderseSinAleatorio()) {}
                    //COMPROBAR SI RESPONDE EN UNA ESQUINA CONTRARIA
                    else if ((casillas[0].textContent === player&&casillas[8].textContent === player)||(casillas[2].textContent === player&&casillas[6].textContent === player)) {
                        if (random==0&&casillas[1].textContent === '') {
                            responder(1);
                        }
                        else if (random==1&&casillas[7].textContent === '') {
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
                    if (defenderseSinAleatorio()) {}
                    else if (casillas[1].textContent === player&&casillas[3].textContent === player&&casillas[0].textContent === '') {
                        responder(0);
                    }
                    else if (casillas[1].textContent === player&&casillas[5].textContent === player&&casillas[2].textContent === '') {
                        responder(2);
                    }
                    else if (casillas[3].textContent === player&&casillas[7].textContent === player&&casillas[6].textContent === '') {
                        responder(6);
                    }
                    else if (casillas[7].textContent === player&&casillas[5].textContent === player&&casillas[8].textContent === '') {
                        responder(8);
                    }
                    //Aqui empieza lo de Noor
                    else if (casillas[7].textContent === player && casillas[2].textContent === player && casillas[8].textContent === ''){
                        responder(8);
                    }
                    else if (casillas[7].textContent === player && casillas[0].textContent === player && casillas[6].textContent === '') {
                        responder(6);
                    }
                    else if (casillas[3].textContent === player && casillas[2].textContent === player && casillas[0].textContent === ''){
                        responder(0);
                    }
                    else if (casillas[3].textContent === player && casillas[8].textContent === player && casillas[6].textContent === ''){
                        responder(6);
                    }
                    else if (casillas[1].textContent === player && casillas[6].textContent === player && casillas[0].textContent === ''){
                        responder(0);
                    }
                    else if (casillas[1].textContent === player && casillas[8].textContent === player && casillas[2].textContent === ''){
                        responder(2);
                    }
                    else if (casillas[5].textContent === player && casillas[0].textContent === player && casillas[2].textContent === ''){
                        responder(2);
                    }
                    else if (casillas[5].textContent === player && casillas[6].textContent === player && casillas[8].textContent === ''){
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
