function dropHandler(ev) {
  console.log("Fichero(s) arrastrados");
  // Evitar el comportamiendo por defecto (Evitar que el fichero se abra/ejecute)
  ev.preventDefault();

  const contenedor = document.querySelector(".container"); // NO DEBO USAR EL DOCUMENTGETELEMETNBYCLASS, YA QUE SI NO ME ES MAS LENTO
  if(!contenedor){
    console.error("No se encontró el contenedor");
    return;
  }

  if (ev.dataTransfer.items) {
    // Usar la interfaz DataTransferItemList para acceder a el/los archivos)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // Si los elementos arrastrados no son ficheros, rechazarlos
      if (ev.dataTransfer.items[i].kind === "file") {
       
        const file = ev.dataTransfer.items[i].getAsFile();
        const nombrearchivo = file.name;
        const archivoExtension = nombrearchivo.split(".").pop().toLowerCase();
        
        if(archivoExtension !== "csv"){  
          muestroImagen(contenedor);
        } else {
          console.log("-----Archivo CSV aceptado-----", nombrearchivo);
          const fileInput = document.getElementById("file-input");
          
          // Solo añade el event listener si no está ya añadido
          const clonedInput = fileInput.cloneNode(true);
          fileInput.parentNode.replaceChild(clonedInput, fileInput);
          
          handleFileSelection({ target: { files: [file] } });
        }
      }
    }
  }

  // Pasar el evento a removeDragData para limpiar
  removeDragData(ev);
}

function dragOverHandler(ev) {
  console.log("Archivo(s) en zona de drop");
  // Evitar el comportamiento por defecto (Evitar que el archivo se abra)
  ev.preventDefault();
}

function removeDragData(ev) {
  console.log("Eliminando datos de arrastre");

  if (ev.dataTransfer.items) {
    // Usar la interfaz DataTransferItemList para eliminar los datos de arrastre
    ev.dataTransfer.items.clear();
  } else {
    // Usar la interfaz DataTransfer para eliminar los datos de arrastre
    ev.dataTransfer.clearData();
  }
}

function muestroImagen(contenedor){
  const fotoContenedor = document.getElementById("foto");
  if(!fotoContenedor) {
      console.error("No se encontró el contenedor de foto");
      return;
  }

  if(!fotoContenedor.querySelector("img")){ // verificamos que exista
      const imatge = document.createElement("img");
      imatge.src = "img/nocsv.webp";
      imatge.style.width = "700px";
      imatge.style.margin = "20px"; // Corregido de 700px a 20px para evitar problemas de visualización

      contenedor.style.display = "none"; // lo que me hará será que se me bloqueará el contenedor y se me mostrará la imagen
      fotoContenedor.style.display = "block";

      fotoContenedor.appendChild(imatge);
  }
}

// Definición de clases
class PuntsInteres {
  constructor(nom, ubicacio, descripcio) {
      this.nom = nom;
      this.ubicacio = ubicacio;
      this.descripcio = descripcio;
  }
}

class Atraccio extends PuntsInteres {
  constructor(nom, ubicacio, descripcio, alturaMinima) {
      super(nom, ubicacio, descripcio);
      this.alturaMinima = alturaMinima;
  }
}

class Museu extends PuntsInteres {
  constructor(nom, ubicacio, descripcio, horari) {
      super(nom, ubicacio, descripcio);
      this.horari = horari;
  }
}

let llistaObjectes = [];

function handleFileSelection(event){
  const fileContentDisplay = document.getElementById("file-content");
  const messageDisplay = document.getElementById("message"); // Corregido nombre de variable

  const file = event.target.files[0];
  if (!file) {
      console.error("No se seleccionó ningún archivo");
      return;
  }

  fileContentDisplay.textContent = "";
  messageDisplay.textContent = "";

  if(!file.type.startsWith("text")){
      showMessage("Tipo de archivo no soportado. Por favor, selecciona un archivo de texto.", "error");
      return;
  }

  const reader = new FileReader();

  reader.onload = () => {
      const contenido = reader.result; // Definimos la variable contenido
      fileContentDisplay.textContent = contenido;

      const lineas = contenido.split("\n").map(line => line.trim()); // Divide en líneas
      llistaObjectes = [];

      for (let i = 1; i < lineas.length; i++) { // Saltamos la cabecera
          if (lineas[i] === "") continue; // Evita líneas vacías

          const columnas = lineas[i].split(","); // Asumiendo CSV separado por comas

          const tipus = columnas[0].trim(); // Tipus de lloc
          const nom = columnas[1].trim();
          const ubicacio = columnas[2].trim();
          const descripcio = columnas[3].trim();

          let objecte;
          if (tipus === "Espai") {
              objecte = new PuntsInteres(nom, ubicacio, descripcio);
          } else if (tipus === "Atraccio" && columnas.length >= 5) {
              const alturaMinima = columnas[4].trim();
              objecte = new Atraccio(nom, ubicacio, descripcio, alturaMinima);
          } else if (tipus === "Museu" && columnas.length >= 5) {
              const horari = columnas[4].trim();
              objecte = new Museu(nom, ubicacio, descripcio, horari);
          }

          if (objecte) llistaObjectes.push(objecte);
      }

      console.log("Llista d'objectes creada:", llistaObjectes);
  };

  reader.onerror = () => {
      showMessage("Error al leer el archivo. Por favor, inténtalo de nuevo.", "error");
  };

  reader.readAsText(file);  
}

function showMessage(message, type) {
  const messageDisplay = document.getElementById("message"); // Añadido para acceder correctamente
  if (!messageDisplay) {
      console.error("No se encontró el elemento de mensaje");
      return;
  }
  messageDisplay.textContent = message;
  messageDisplay.style.color = type === "error" ? "red" : "green";
}