function adivinar(boton) {
    const caracter = boton.textContent.toUpperCase(); 
    let encontrado = false;
    const maxIntentos = 10; 

    for (let i = 0; i < palabraSecreta.length; i++) {
        const letra = palabraSecreta[i];    
        if (letra === caracter) {
            palabraOculta[i] = letra; 
            encontrado = true;
            contador++;
            document.getElementById("puntos").textContent = "Puntos totales: " + contador;
        }
    }

    // Si no se encontró la letra, incrementar intentos y actualizar imagen
    if (!encontrado) {
        intentos++;
        if (intentos <= maxIntentos) {
            document.getElementById("imagenAhorcado").src = `imagenes/img_${intentos}.png`;
        }

        // Si se alcanzan los intentos máximos, finalizar el juego
        if (intentos === maxIntentos) {
            document.getElementById("puntos").textContent = "FI DE LA PARTIDA";
            document.getElementById("body").style.backgroundColor = "red";
            totalpartidas++;
            partidaPerdida++;
            document.getElementById("Mostrar").innerHTML = palabraSecreta.join(" "); 
            deshabilitarBotones(); 
            return;
        }
    }

    let almacenado = localStorage.getItem("puntos");
    let AlmacenarPuntos = almacenado ? JSON.parse(almacenado) : { puntos: 0, fecha: "" };

    if (contador > AlmacenarPuntos.puntos) {
        const ahora = new Date();
        const fechaFormato = `${ahora.toLocaleDateString()} ${ahora.toLocaleTimeString()}`;
        AlmacenarPuntos = {
            puntos: contador,
            fecha: fechaFormato,
        };
        localStorage.setItem("puntos", JSON.stringify(AlmacenarPuntos));
    }

    document.getElementById("partidaConMasPuntos").textContent =
        `Puntuació més alta: ${AlmacenarPuntos.puntos} punts (${AlmacenarPuntos.fecha})`;

    document.getElementById("Mostrar").innerHTML = palabraOculta.join(" ");
    boton.disabled = true;

    if (!palabraOculta.includes("_")) {
        document.getElementById("body").style.backgroundColor = "green";
        window.alert("¡Felicitats! Has guanyat!");
        partidasGanadas++;
        totalpartidas++;
        deshabilitarBotones(); 
        return; 
    }

    document.getElementById("total-partidas").textContent = "Total partides: " + totalpartidas;

    if (totalpartidas > 0) {
        const porcentajesPartidas = (partidasGanadas / totalpartidas) * 100;
        document.getElementById("pganadas").textContent =
            "Percentatge partides guanyades: " + porcentajesPartidas.toFixed(2) + "%";
    }
}

function deshabilitarBotones() {
    const botones = document.querySelectorAll(".boton-letra"); 
    botones.forEach((boton) => (boton.disabled = true)); 
}

function ReiniciarJuego() {
    intentos = 0; // Reiniciar intentos
    document.getElementById("imagenAhorcado").src = "imagenes/img_0.png"; // Cambiar a la primera imagen del ahorcado
    palabraSecreta = [];
    palabraOculta = [];
    document.getElementById("Mostrar").innerHTML = "";
    document.getElementById("puntos").textContent = "Puntos: 0";
    document.getElementById("inputPalabra").value = "";
    document.getElementById("inputPalabra").disabled = false;
    document.getElementById("boton").textContent = "Iniciar juego";
    document.getElementById("body").style.backgroundColor = "white";
    const botones = document.querySelectorAll(".boton-letra");
    botones.forEach((boton) => (boton.disabled = false));
    cambiar = false; 
}
