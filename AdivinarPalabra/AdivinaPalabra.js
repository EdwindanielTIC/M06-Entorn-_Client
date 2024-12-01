const formularioObj = document.getElementById("juego");

let paraulaForm = "";
let palabraSecreta = [];
let palabraOculta = [];

function myFunction() {
    if (formularioObj.type === "password") {
        formularioObj.type = "text";
    } else {
        formularioObj.type = "password";
    }
}

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

function adivinar(obj) {
    const caracter = obj.textContent.toUpperCase();
    let encontrado = false;

    // Verificamos si la letra está en la palabra secreta
    palabraSecreta.forEach((letra, index) => {
        if (letra === caracter) {
            palabraOculta[index] = letra;
            encontrado = true;
        }
    });

    // Actualiza la palabra escrita que se ha ocultado
    document.getElementById("Mostrar").innerHTML = palabraOculta.join(" ");

    // hago el boton disabled
    obj.disabled = true;

    if (encontrado) {
        console.log("la letra " +caracter +" esta en la palabra");
    } else {
        console.log("la letra " + caracter + " no se encuentra en la palabra ");
    }

    // Verifica si se ha completado la palabra
    if (!palabraOculta.includes("_")) {
        document.getElementById("body").style.backgroundColor = "green";
    }
}
