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

    const reader = new FileReader();
    reader.onload = () => {
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
            
            if (tipus === "Espai") {
                // definimos los punots segun mi estrucutra que tengo 
                const id = columnas[1]?.trim() || Date.now().toString();
                const pais = columnas[2]?.trim() || "";
                const ciutat = columnas[3]?.trim() || "";
                const nom = columnas[4]?.trim() || "";
                const direccio = columnas[5]?.trim() || "";
                
                objecto = new PuntInteres(id, pais, ciutat, nom, direccio);
                objecto.tipus = "Espai";
                
                // He creado una variable puntuacio para poder hacer la puntuacion de los puntos de interes
                if (columnas[6] && columnas[7]) {
                    objecto.latitud = parseFloat(columnas[6].trim());
                    objecto.longitud = parseFloat(columnas[7].trim());
                }
            } 
            else if (tipus === "Atraccio") {
                // Para Atraccio esto es del construcotr: id, pais, ciutat, nom, direccio, horari, preu, moneda
                const id = columnas[1]?.trim() || Date.now().toString();
                const pais = columnas[2]?.trim() || "";
                const ciutat = columnas[3]?.trim() || "";
                const nom = columnas[4]?.trim() || "";
                const direccio = columnas[5]?.trim() || "";
                const horari = columnas[6]?.trim() || "";
                const preu = parseFloat(columnas[7]?.trim() || "0");
                const moneda = columnas[8]?.trim() || "EUR";
                
                objecto = new Atraccio(id, pais, ciutat, nom, direccio, horari, preu, moneda);
                objecto.tipus = "Atraccio";
                
           
                if (columnas[9] && columnas[10]) {
                    objecto.latitud = parseFloat(columnas[9].trim());
                    objecto.longitud = parseFloat(columnas[10].trim());
                }
            } 
            else if (tipus === "Museu") {
                // Para Museu : id, pais, ciutat, nom, direccio, horaris, preu, moneda
                const id = columnas[1]?.trim() || Date.now().toString();
                const pais = columnas[2]?.trim() || "";
                const ciutat = columnas[3]?.trim() || "";
                const nom = columnas[4]?.trim() || "";
                const direccio = columnas[5]?.trim() || "";
                const horaris = columnas[6]?.trim() || "";
                const preu = parseFloat(columnas[7]?.trim() || "0");
                const moneda = columnas[8]?.trim() || "EUR";
                
                objecto = new Museu(id, pais, ciutat, nom, direccio, horaris, preu, moneda);
                objecto.tipus = "Museu";
                
          
                if (columnas[9] && columnas[10]) {
                    objecto.latitud = parseFloat(columnas[9].trim());
                    objecto.longitud = parseFloat(columnas[10].trim());
                }
            }

            if (objecto) llistaObjectes.push(objecto);
        }

        console.log("Llista d'objectes creada:", llistaObjectes);
        console.log("Tipus disponibles:", tipusSet);
        
        updateDropdown(); //Actualizamos el menu desplegable
        aplicarFiltros(); // Mostrar resultados tras cargar el archivo
    };

    reader.onerror = () => {
        showMessage("Error al leer el archivo, inténtalo más tarde.", "error");
    };

    reader.readAsText(file);
}

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
      console.log("No se ha encontrado ninguna foto");
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
  const tipusSeleccionat = document.getElementById("tipus").value;
  const ordenacio = document.getElementById("ordenacio").value;
  const textFiltre = document.querySelector("input[type='text']").value.toLowerCase();

  let resultats = llistaObjectes.filter(obj => {
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

      if (ordenacio === "asc") {
          return nomA.localeCompare(nomB);
      } else {
          return nomB.localeCompare(nomA);
      }
  });


  // Mostrar resultados
  mostrarResultats(resultats);

  // Actualizar contador
  document.getElementById("numeroTotal").textContent = `Numero total: ${resultats.length}`;
}


function mostrarResultats(resultats) {
  const resultsDiv = document.querySelector(".results");

  if (resultats.length === 0) {
      resultsDiv.textContent = "No hi ha informació per mostrar";
      return;
  }

  resultsDiv.innerHTML = "";

// Voy a crear una lista para mostra toods los resultadfos
  const lista = document.createElement("ul");
  lista.className = "lista-resultados";

  
  resultats.forEach(obj => {
      if (!obj) return; 

      const item = document.createElement("li");
      item.className = `item-${obj.tipus.toLowerCase()}`;

      // Crear título con el nombre
      const titulo = document.createElement("h3");
      titulo.textContent = obj.nom;
      item.appendChild(titulo);


      const info = document.createElement("p");
      info.textContent = `${obj.ciutat}, ${obj.pais}`;
      item.appendChild(info);

      const direccion = document.createElement("p");
      direccion.textContent = `Dirección: ${obj.direccio}`;
      item.appendChild(direccion);

   
      if (obj.tipus === "Atraccio" || obj.tipus === "Museu") {
          if (obj.horaris) {
              const horario = document.createElement("p");
              horario.textContent = `Horario: ${obj.horaris}`;
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

  // Actualizar el mapa con todos los elementos filtrados
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