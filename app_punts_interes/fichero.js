let llistaObjectes = [];
let tipusSet = new Set();
let mapa;

document.addEventListener('DOMContentLoaded', () => {

    mapa = new Mapa(); 
    
    // Event listeners para los filtros
    document.getElementById("tipus").addEventListener("change", aplicarFiltros);
    document.getElementById("ordenacio").addEventListener("change", aplicarFiltros);
    document.querySelector("input[type='text']").addEventListener("input", aplicarFiltros);
    document.querySelector(".netejarButon").addEventListener("click", netejarTot);
    document.getElementById("file-input").addEventListener("change", handleFileSelection);
  });

//arrastramos el archivio para que se lea


function dropHandler(ev) {
    console.log("Fichero(s) arrastrados");
    ev.preventDefault();

    const contenedor = document.querySelector(".container");
    if (!contenedor) {
        console.error("No se encontró el contenedor");
        return;
    }

    if (ev.dataTransfer.items) {
        for (let i = 0; i < ev.dataTransfer.items.length; i++) {
            if (ev.dataTransfer.items[i].kind === "file") {
                const file = ev.dataTransfer.items[i].getAsFile();
                const fileName = file.name.toLowerCase();
                const fileExt = fileName.split(".").pop();

                if (fileExt !== "csv") {
                    muestroImagen(contenedor);
                } else {
                    console.log("-----Archivo CSV aceptado-----", fileName);
                    handleFileSelection({ target: { files: [file] } });
                }
            }
        }
    }

    removeDragData(ev);
}

// con la siguiente funcion, voy a subir un archivo csv, me lo va a procesar y me dara info del lugar
function handleFileSelection(event) {
    const file = event.target.files[0];
    const fileContentDisplay = document.getElementById("file-content");
    const messageDisplay = document.getElementById("message");

    fileContentDisplay.textContent = "";
    messageDisplay.textContent = "";

    if (!file.name.toLowerCase().endsWith(".csv")) { 
        showMessage("Archivo no soportado. Seleccione un archivo CSV.", "error");
        return;
    }

    const reader = new FileReader();
    
    reader.onload = async () => {
        const contenido = reader.result;
        fileContentDisplay.textContent = contenido;

        const lineas = contenido.split("\n").map(line => line.trim());
        llistaObjectes = [];
        tipusSet.clear();

        const promesas = []; // Para manejar todas las peticiones a la API

        for (let i = 1; i < lineas.length; i++) {
            if (lineas[i] === "") continue;

            

            const columnas = lineas[i].split(",");
            console.log("Columnas procesadas:", columnas);
            
            const tipus = columnas[0]?.trim();
            if (tipus) tipusSet.add(tipus);

            let objecto = null;
            const id = columnas[1]?.trim() || Date.now().toString();
            const pais = columnas[2]?.trim() || "";
            const ciutat = columnas[3]?.trim() || "";
            const nom = columnas[4]?.trim() || "";
            const direccio = columnas[5]?.trim() || "";
           
            
            
            let latitud = columnas[6] ? parseFloat(columnas[6].trim().replace(/[^0-9.-]/g, '')) : null; //limpio los datos antes de pasarlo
            let longitud = columnas[7] ? parseFloat(columnas[7].trim().replace(/[^0-9.-]/g, '')) : null;
            const descripcio = columnas[11]?.trim() || "";

            if (tipus === "Espai") {
                objecto = new PuntInteres(id, pais, ciutat, nom, direccio);
                objecto.tipus = "Espai";
            } else if (tipus === "Atraccio") {
                const horari = columnas[8]?.trim() || "";
                const preu = parseFloat(columnas[9]?.trim() || "0");
                const moneda = columnas[10]?.trim() || "EUR";
                objecto = new Atraccio(id, pais, ciutat, nom, direccio, horari, preu, moneda);
                objecto.tipus = "Atraccio";
            } else if (tipus === "Museu") {
                const horaris = columnas[8]?.trim() || "";
                const preu = parseFloat(columnas[9]?.trim() || "0");
                const moneda = columnas[10]?.trim() || "EUR";
                const descripcio = columnas[11]?.trim() || "";
                objecto = new Museu(id, pais, ciutat, nom, direccio, horaris, preu, moneda, descripcio);
                objecto.tipus = "Museu";
            }

            if (objecto) {
                if (latitud && longitud) {
                    objecto.latitud = latitud;
                    objecto.longitud = longitud;
                }

                llistaObjectes.push(objecto);
                
                // Siempre obtener la bandera, incluso si hay coordenadas
                promesas.push(obtenerDatosPais(pais, objecto));
            }
        }

        // Esperar a que todas las banderas se carguen
        await Promise.all(promesas);

        console.log("Llista d'objectes creada:", llistaObjectes);
        console.log("Tipus disponibles:", tipusSet);

        updateDropdown();
        aplicarFiltros();
    };

    reader.onerror = () => {
        showMessage("Error al leer el archivo, inténtalo más tarde.", "error");
    };

    reader.readAsText(file);
}

//hacemos una peticion a la api para obtener los datos del pais y asi obtenter la banderas

async function obtenerDatosPais(code, objecto) {
    try {
        if (!code) {
            console.warn("Código de país vacío para objeto:", objecto);
            return;
        }

        const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        if (!response.ok) {
            console.warn(`Error al obtener datos para ${code}. Status: ${response.status}`);
            return;
        }

        const data = await response.json();
        if (!data || data.status === 404 || !data[0]) {
            console.warn(`No se encontraron datos para el código: ${code}`);
            return;
        }

        const country = data[0];
        if (country.flags?.svg) {
            objecto.bandera = country.flags.svg;
        }

        // Solo asignar coordenadas si no existen
        if (!objecto.latitud && !objecto.longitud && country.latlng?.length >= 2) {
            objecto.latitud = country.latlng[0];
            objecto.longitud = country.latlng[1];
        }
    } catch (error) {
        console.error("Error al obtener datos del país:", error);
    }
}



// Actualizar menu desplegabel

function updateDropdown() {
    const select = document.getElementById("tipus");
    select.innerHTML = '<option value="">Tots</option>'; // Restablecer con opción inicial

    tipusSet.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
     
        
        select.appendChild(option);
    });
}



function showMessage(message, type) {
    const messageDisplay = document.getElementById("message");
    messageDisplay.textContent = message;
    messageDisplay.style.color = type === "error" ? "red" : "green";
}

function dragOverHandler(ev) {
    console.log("File(s) in drop zone");
    ev.preventDefault(); 
}

function removeDragData(ev) {
    console.log("Removing drag data");
    if (ev.dataTransfer.items) {
        ev.dataTransfer.items.clear();
    } else {
        ev.dataTransfer.clearData();
    }
}

function muestroImagen(contenedor) {
 
  const fotoContenedor = document.getElementById("foto");

if (!fotoContenedor) {
    console.error("Elemento con ID 'foto' no encontrado");
    return;
}

  if (!fotoContenedor.querySelector("img")) {
      const imatge = document.createElement("img");
      imatge.src = "img/nocsv.webp";
      imatge.style.width = "700px";
      imatge.style.margin = "700px";

      contenedor.style.display = "none"; // Ocultar contenedor y mostrar imagen  tmb lo puedo hacer en el css
      fotoContenedor.style.display = "block";
   
      fotoContenedor.appendChild(imatge);
  }
}





// Funciones para la funcionalidad de filtrado y visualización
function aplicarFiltros() {
    try {
        const tipusSeleccionat = document.getElementById("tipus")?.value || "";
        const ordenacio = document.getElementById("ordenacio")?.value || "asc";
        const textFiltre = document.querySelector("input[type='text']")?.value.toLowerCase() || "";

        if (!llistaObjectes) {
            console.error("llistaObjectes no está definida");
            return;
        }

        let resultats = llistaObjectes.filter(obj => {
            if (!obj || !obj.nom) {
                console.warn("Objeto inválido encontrado:", obj);
                return false;
            }

            if (tipusSeleccionat && obj.tipus !== tipusSeleccionat) return false;
            if (textFiltre && !obj.nom.toLowerCase().includes(textFiltre)) return false;
            return true;
        });

        resultats.sort((a, b) => {
            const nomA = a.nom.toLowerCase();
            const nomB = b.nom.toLowerCase();
            return ordenacio === "asc" ? nomA.localeCompare(nomB) : nomB.localeCompare(nomA);
        });

        mostrarResultats(resultats);

        console.log("Total de objetos en llistaObjectes:", llistaObjectes.length);
        console.log("Objetos filtrados:", resultats.length);
        console.log("Contenido de llistaObjectes:", llistaObjectes);

        const numeroTotalElement = document.getElementById("numeroTotal");
        if (numeroTotalElement) {
            numeroTotalElement.textContent = `Número total: ${resultats.length}`;
        } else {
            console.error("Elemento 'numeroTotal' no encontrado en el DOM");
        }
    } catch (error) {
        console.error("Error en aplicarFiltros:", error);
    }
}






function mostrarResultats(resultats) {
    const resultsDiv = document.querySelector(".results");

    if (resultats.length === 0) {
        resultsDiv.textContent = "No hi ha informació per mostrar";
        return;
    }

    resultsDiv.innerHTML = "";

    const lista = document.createElement("ul");
    lista.className = "lista-resultados";



    //Cada vez qu recorre resultados me crea un li para mostrarme la informacion de una ubicacion
    //guardare el li en una variable llamada item , que sera agregada a la lista lu
   
    //para que me funcione el liminar ubicacion y que se reste el contador, debo de pasar
    //el index como segundo parametro en el foreach poque si no , no se me actuluza

    resultats.forEach((obj, index) => {
        if (!obj || !obj.nom || !obj.ciutat || !obj.pais) return; // Solo requerir nombre, ciudad y país
    
        const item = document.createElement("li");
        item.className = `item-${obj.tipus.toLowerCase()}`;
    
        const titulo = document.createElement("h3");
        titulo.textContent = obj.nom;
        item.appendChild(titulo);
    
        const paisCiutatContainer = document.createElement("div");
        paisCiutatContainer.style.display = "flex";
        paisCiutatContainer.style.alignItems = "center";
        paisCiutatContainer.style.gap = "10px";
    
        const info = document.createElement("p");
        info.textContent = `${obj.ciutat}, ${obj.pais}`;
        paisCiutatContainer.appendChild(info);
    
        if (obj.bandera) {
            const bandera = document.createElement("img");
            bandera.src = obj.bandera;
            bandera.alt = `Bandera de ${obj.pais}`;
            bandera.style.width = "30px";
            bandera.style.height = "20px";
            bandera.style.border = "1px solid #ccc";
            paisCiutatContainer.appendChild(bandera);
        }
    
        item.appendChild(paisCiutatContainer);
    
        const direccion = document.createElement("p");
        direccion.textContent = `Dirección: ${obj.direccio}`;
        item.appendChild(direccion);
    
        if (obj.tipus === "Atraccio" || obj.tipus === "Museu") {
            if (obj.horari || obj.horaris) {
                const horario = document.createElement("p");
                horario.textContent = `Horario: ${obj.horari || obj.horaris}`;
                item.appendChild(horario);
            }
    
            const precio = document.createElement("p");
            precio.textContent = `Precio: ${obj.preu} ${obj.moneda}`;
            item.appendChild(precio);
    
            if (obj.descripcio) { // Corregir: usar obj.descripcio directamente
                const descripcio = document.createElement("p");
                descripcio.textContent = `Descripción: ${obj.descripcio}`;
                item.appendChild(descripcio);
            }
        }
    
        if (obj.latitud && obj.longitud) {
            const botonMapa = document.createElement("button");
            botonMapa.textContent = "Mostrar en mapa";
            botonMapa.className = "boton-mapa";
            botonMapa.onclick = function() {
                mostrarEnMapa(obj);
            };
            item.appendChild(botonMapa);
        }
    
        const botonParaEliminar = document.createElement("button");
        botonParaEliminar.textContent = "Eliminar";
        botonParaEliminar.style.backgroundColor = "red";
        botonParaEliminar.style.color = "white";
    
        botonParaEliminar.onclick = function() {
            resultats.splice(index, 1);
            lista.removeChild(item);
            const numeroTotalElement = document.getElementById("numeroTotal");
            if (numeroTotalElement) {
                numeroTotalElement.textContent = `Número total: ${resultats.length}`;
            }
            actualizarTodosMapa(resultats);
        };
    
        item.appendChild(botonParaEliminar);
        lista.appendChild(item);
    });

    resultsDiv.appendChild(lista);
    actualizarTodosMapa(resultats);
}






function netejarTot() {
    // Me restablece los filtos
    document.getElementById("tipus").value = "";
    document.getElementById("ordenacio").value = "asc";
    document.querySelector("input[type='text']").value = "";
    
    // Mostrar todos los resultados
    aplicarFiltros();
}




function actualizarTodosMapa(resultats) {
    // Esta función actualiza el mapa con todos los resultados filtrados
    
    if (!mapa || resultats.length === 0) return;
    
    resultats.forEach(obj => {
        if (obj.latitud && obj.longitud && obj.nom && obj.direccio) {
         
            const descripcion = `${obj.nom} (${obj.tipus})`;
            mapa.mostrarPunt(obj.latitud, obj.longitud, descripcion , obj.direccio , obj.nom);
        }
    });
    const primerConCoordenadas = resultats.find(obj => obj.latitud && obj.longitud);
    if (primerConCoordenadas) {
        mapa.actualizarPosInitMapa(primerConCoordenadas.latitud, primerConCoordenadas.longitud);
    }
}


function mostrarEnMapa(obj) {
    console.log("Mostrando en mapa:", obj);
    if (!mapa) {
        console.error("Mapa no está definido");
        return;
    }
    if (!obj.latitud || !obj.longitud || isNaN(obj.latitud) || isNaN(obj.longitud)) {
        console.warn("Coordenadas no válidas:", obj.latitud, obj.longitud);
        return;
    }
    
    mapa.actualizarPosInitMapa(obj.latitud, obj.longitud);
    console.log("Mapa actualizado a:", obj.latitud, obj.longitud);
}


function actualizarTodosMapa(resultats) {
    if (!mapa || resultats.length === 0) return;
    
    resultats.forEach(obj => {
        if (obj.latitud && obj.longitud && obj.nom && obj.direccio) {
            
            mapa.mostrarPunt(obj.latitud, obj.longitud,  obj.direccio , obj.nom);
        }
    });
    const primerConCoordenadas = resultats.find(obj => obj.latitud && obj.longitud && obj.nom && obj.direccio);
    if (primerConCoordenadas) {
        mapa.actualizarPosInitMapa(primerConCoordenadas.latitud, primerConCoordenadas.longitud , primerConCoordenadas.nom, primerConCoordenadas.direccio);
    }
}

