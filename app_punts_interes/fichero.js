let llistaObjectes = [];
let tipusSet = new Set(); // Set para almacenar tipos únicos
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

  
    const fileContentDisplay = document.getElementById("file-content");
    const messageDisplay = document.getElementById("message");

    const file = event.target.files[0];
    fileContentDisplay.textContent = "";
    messageDisplay.textContent = "";

    if (!file.name.toLowerCase().endsWith(".csv")) { 
        showMessage("Archivo no soportado. Seleccione un archivo CSV.", "error");
        return;
    }

    //siguiente codigo me va a leer el archivo con filereader, me extraera su contenido, divide el cont el linea y lo procesa

    const reader = new FileReader();
    reader.onload = async () => {
        const contenido = reader.result;
        fileContentDisplay.textContent = contenido;

        const lineas = contenido.split("\n").map(line => line.trim());
        llistaObjectes = [];
        tipusSet.clear();

        for (let i = 1; i < lineas.length; i++) {
            if (lineas[i] === "") continue;

            const columnas = lineas[i].split(",");
            const tipus = columnas[0]?.trim();
            if (tipus) tipusSet.add(tipus);

            let objecto = null;
            const id = columnas[1]?.trim() || Date.now().toString();
            const pais = columnas[2]?.trim() || "";
            const ciutat = columnas[3]?.trim() || "";
            const nom = columnas[4]?.trim() || "";
            const direccio = columnas[5]?.trim() || "";
            let latitud = columnas[6] ? parseFloat(columnas[6].trim()) : null;
            let longitud = columnas[7] ? parseFloat(columnas[7].trim()) : null;

            if (tipus === "Espai") {
                objecto = new PuntInteres(id, pais, ciutat, nom, direccio);
                objecto.tipus = "Espai";
            } else if (tipus === "Atraccio") {
                const horari = columnas[6]?.trim() || "";
                const preu = parseFloat(columnas[7]?.trim() || "0");
                const moneda = columnas[8]?.trim() || "EUR";
                objecto = new Atraccio(id, pais, ciutat, nom, direccio, horari, preu, moneda);
                objecto.tipus = "Atraccio";
                latitud = columnas[9] ? parseFloat(columnas[9].trim()) : null;
                longitud = columnas[10] ? parseFloat(columnas[10].trim()) : null;
            } else if (tipus === "Museu") {
                const horaris = columnas[6]?.trim() || "";
                const preu = parseFloat(columnas[7]?.trim() || "0");
                const moneda = columnas[8]?.trim() || "EUR";
                objecto = new Museu(id, pais, ciutat, nom, direccio, horaris, preu, moneda);
                objecto.tipus = "Museu";
                latitud = columnas[9] ? parseFloat(columnas[9].trim()) : null;
                longitud = columnas[10] ? parseFloat(columnas[10].trim()) : null;
            }

            if (objecto) {
                llistaObjectes.push(objecto);
                
                if (!latitud || !longitud) { 
                    // console.log(`Coordenadas faltantes para ${objecto.nom} (${objecto.tipus})`);    
                    await obtenerDatosPais(pais, objecto);
                }
            }
        }

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
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        const data = await response.json();

        // console.log("Respuesta de la API:", data);

        if (!data || data.status === 404) {
            console.warn(`Código de país no encontrado: ${code}`);
            return;
        }

        const country = data[0];
        objecto.bandera = country.flags.svg;
        objecto.latitud = country.latlng[0];
        objecto.longitud = country.latlng[1];

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

//funcion para mostrar imagen de csv no leido
function muestroImagen(contenedor) {

 
  const fotoContenedor = document.getElementById("foto");
if (!fotoContenedor) {
    console.error("Elemento con ID 'foto' no encontrado");
    return;
}

  if ( fotoContenedor && imatge instanceof Node) {
    fotoContenedor.appendChild(imatge);
    //   console.log("No se ha encontrado ninguna foto");
    //   return;
  }
  if (resultsDiv && lista instanceof Node) {
    resultsDiv.appendChild(lista);
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
  const tipusSeleccionat = document.getElementById("tipus").value;
  const ordenacio = document.getElementById("ordenacio").value;
  const textFiltre = document.querySelector("input[type='text']").value.toLowerCase();

   let resultats = llistaObjectes;

   resultats = resultats.filter(obj => {
      if (!obj) return false; 

     
      if (tipusSeleccionat && obj.tipus !== tipusSeleccionat) {
          return false;
      }
      
      if (textFiltre && !obj.nom.toLowerCase().includes(textFiltre)) {
          return false;
      }

      return true;
  });

  
  resultats.sort((a, b) => {
      const nomA = a.nom.toLowerCase();
      const nomB = b.nom.toLowerCase();
    //   console.log(`el total de lugares es : ${llistaObjectes.length}`)

      if (ordenacio === "asc") {
          return nomA.localeCompare(nomB);
      } else {
          return nomB.localeCompare(nomA);
      }
  });


  // Mostrar resultados
  mostrarResultats(resultats);


  // Actualizar contador

  if(!tipusSeleccionat && !textFiltre){
    document.getElementById("numeroTotal").textContent = `Numero total: ${llistaObjectes.length}`;

  }else{
    document.getElementById("numeroTotal").textContent = `Numero total: ${resultats.length}`;

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

    resultats.forEach(obj => {
        if (!obj || !obj.nom || !obj.ciutat || !obj.pais) return;

        const item = document.createElement("li");
        item.className = `item-${obj.tipus.toLowerCase()}`;

        const titulo = document.createElement("h3");
        titulo.textContent = obj.nom;
        item.appendChild(titulo);

        // Contenedor para país, ciudad y bandera
        const paisCiutatContainer = document.createElement("div");
        paisCiutatContainer.style.display = "flex";
        paisCiutatContainer.style.alignItems = "center";
        paisCiutatContainer.style.gap = "10px";

        const info = document.createElement("p");
        info.textContent = `${obj.ciutat}, ${obj.pais}`;
        paisCiutatContainer.appendChild(info);

        // Añadir bandera si existe
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
        if (obj.latitud && obj.longitud) {
         
            const descripcion = `${obj.nom} (${obj.tipus})`;
            mapa.mostrarPunt(obj.latitud, obj.longitud, descripcion);
        }
    });
    const primerConCoordenadas = resultats.find(obj => obj.latitud && obj.longitud);
    if (primerConCoordenadas) {
        mapa.actulizarPosInitMapa(primerConCoordenadas.latitud, primerConCoordenadas.longitud);
    }
}


function mostrarEnMapa(obj) {

    if (!mapa || !obj.latitud || !obj.longitud) return;
    
    mapa.actulizarPosInitMapa(obj.latitud, obj.longitud);
}