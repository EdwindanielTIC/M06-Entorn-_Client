const formularioObj = document.getElementById("inputPalabra");
let paraulaForm = "";
let palabraSecreta = [];
let palabraOculta = [];
let intentos = 10;
let cambiar = false;
let contador = 0;
//let totalpartidas = 0;
//let partidaPerdida = 0;
//let porcentajesPartidas = 0;
//let partidasGanadas= 0;
    

let puntuacion = {
    "totalpartidas" : 0,
    "partidaPerdida" : 0,
    "partidaPerdida": 0,
    "partidaPerdida": 0,
    "porcentajesPartidas" : 0,
    "partidasGanadas" : 0
};
function myFunction(){
    var x = document.getElementById("inputPalabra");
    if(x.type == "password"){
        x.type = "text";
    }
    else{
        x.type = "password";
    }
}
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
        document.getElementById("inputPalabra").disabled = true;
        document.getElementById("boton").textContent = "Reiniciar juego";
        cambiar = true; // Juego en curso
    } catch (error) {
        window.alert("Ha habido un error");
    }
}
function ReiniciarJuego() {
    // Restablecer variables
    palabraSecreta = [];
    palabraOculta = [];
 
    // Reiniciar elementos del DOM
    document.getElementById("Mostrar").innerHTML = "";
    document.getElementById("puntos").textContent = "Puntos " + contador;
    document.getElementById("inputPalabra").value = "";
    document.getElementById("inputPalabra").disabled = false;
    document.getElementById("boton").textContent = "Iniciar juego";
    document.getElementById("body").style.backgroundColor = "white";
    // Habilitar botones
    const botones = document.querySelectorAll(".boton-letra");
    botones.forEach((boton) => (boton.disabled = false));
    intentos = 0;
    document.getElementById("imagenAhorcado").src = "imagenes/img_0.jpg";

    cambiar = false; // Preparado para iniciar de nuevo
}