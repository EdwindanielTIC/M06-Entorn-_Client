const formularioObj = document.getElementById("juego");
let paraulaForm = "";
let palabraSecreta = [];
let palabraOculta = [];
let intentos = 10;
let cambiar = false;
let contador = 0;
let totalpartidas = 0;
let totalPeridad = 0;
let porcentajesPartidas = 0;

function funcionBoton() {
    if (!cambiar) {
        iniciarjuego();
    } else {
        ReiniciarJuego();
    }
}

function iniciarjuego() {
    try {
        paraulaForm = formularioObj.value;
        if (paraulaForm === "") {
            window.alert("Has d'agefir una paraula per poder comença");
            return;
        }

        if (!isNaN(paraulaForm)) {
            window.alert("Debes introducir solo letras");
            return;
        }

        if (paraulaForm.length <= 3) {
            window.alert("Debes introducir una palabra con más de 3 caracteres");
            return;
        }

        palabraSecreta = paraulaForm.toUpperCase().split("");
        palabraOculta = new Array(palabraSecreta.length).fill("_");

        document.getElementById("Mostrar").innerHTML = palabraOculta.join(" ");

        document.getElementById("juego").disabled = true;
        document.getElementById("boton").textContent = "Reiniciar juego";
        cambiar = true; // Juego en curso
    } catch (error) {
        window.alert("Ha habido un error");
    }
}

function adivinar(boton) {
    const caracter = boton.textContent.toUpperCase();
    let encontrado = false;

    // Verificar si la letra está en la palabra secreta
    palabraSecreta.forEach((letra, index) => {
        if (letra === caracter) {
            palabraOculta[index] = letra;
             contador++;
             document.getElementById("puntos").textContent = "Puntos totales " +  contador ;
            encontrado = true;
        }
        
    });

    // Actualizar palabra oculta
    document.getElementById("Mostrar").innerHTML = palabraOculta.join(" ");

    // Cambiar estado del botón
    boton.disabled = true;
    
    // Manejo de aciertos y fallos
    if (encontrado) {
        console.log(`La letra ${caracter} está en la palabra`);
    } else {
        intentos--;
        //document.getElementById("puntos").textContent = "Puntos " + intentos; aqui debe de ir las imagenes

        if (intentos === 0) {
            document.getElementById("puntos").textContent =
                "HAS PERDIDO, NO TIENES MÁS VIDAS";
            document.getElementById("body").style.backgroundColor = "red";
            totalPeridad++;

            deshabilitarBotones();
        }
        console.log(
            `La letra ${caracter} no está en la palabra. Intentos restantes: ${intentos}`
        );
    }


    if (!palabraOculta.includes("_")) {
        document.getElementById("body").style.backgroundColor = "green";
        window.alert("¡Felicidades! Has ganado.");
        totalpartidas++;
        porcentajesPartidas = (totalPeridad/totalpartidas)*100;
        document.getElementById("total-partidas").textContent = "total partidas realizadas : "+totalpartidas;
        document.getElementById("total-partidas").textContent = "total partidas realizadas : "+ porcentajesPartidas;
        
        deshabilitarBotones();
    }

//    porcentajesPartidas = (totalPeridad/totalpartidas)*100;

//     document.getElementById("total-partidas").textContent = "total partidas realizadas : "+ porcentajesPartidas;
}

function deshabilitarBotones() {
    const botones = document.querySelectorAll(".boton-letra");
    botones.forEach((boton) => (boton.disabled = true));
}

function ReiniciarJuego() {
    // Restablecer variables
    palabraSecreta = [];
    palabraOculta = [];
    intentos = 5;

    

    // Reiniciar elementos del DOM
    document.getElementById("Mostrar").innerHTML = "";
    document.getElementById("puntos").textContent = "Puntos " + intentos;
    document.getElementById("juego").value = "";
    document.getElementById("juego").disabled = false;
    document.getElementById("boton").textContent = "Iniciar juego";
    document.getElementById("body").style.backgroundColor = "white";

    // Habilitar botones
    const botones = document.querySelectorAll(".boton-letra");
    botones.forEach((boton) => (boton.disabled = false));

    cambiar = false; // Preparado para iniciar de nuevo
}
