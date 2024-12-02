const formularioObj = document.getElementById("juego");
let paraulaForm = "";
let palabraSecreta = [];
let palabraOculta = [];
let intentos = 5;

function funcionBoton() {
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
        document.getElementById("boton").disabled = true;

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
            encontrado = true;
        }
    });

    // Actualizar palabra oculta
    document.getElementById("Mostrar").innerHTML = palabraOculta.join(" ");

    // Cambiar estado del botón
    //boton.className = "boton-letra desactivado";
    boton.disabled = true;

    // Manejo de aciertos y fallos
    if (encontrado) {
        console.log(`La letra ${caracter} está en la palabra`);
    } else {
        intentos--;
        document.getElementById("puntos").textContent = "Puntos " + intentos;
        console.log(`La letra ${caracter} no está en la palabra. Intentos restantes: ${intentos}`);
    }

    // Verificar si se ganó o perdió
    if (!palabraOculta.includes("_")) {
        document.getElementById("body").style.backgroundColor = "green";
        window.alert("¡Felicidades! Has ganado.");
       
        deshabilitarBotones();
    } else if (intentos <= 0) {
        intentos--;
        document.getElementById("body").style.backgroundColor = "red";
        window.alert("¡Has perdido la partida!");
        deshabilitarBotones();
    }
}

function deshabilitarBotones() {
    const botones = document.querySelectorAll(".boton-letra");
    botones.forEach((boton) => (boton.disabled = true));
}
