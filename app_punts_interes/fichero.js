function dropHandler(ev) {
    console.log("Fichero(s) arrastrados");
    // Evitar el comportamiendo por defecto (Evitar que el fichero se abra/ejecute)
    ev.preventDefault();

    const contenedor = document.querySelector(".container"); // NO DEBO USAR EL DOCUMENTGETELEMETNBYCLASS, YA QUE SI NO ME ES MAS LENTO
    if(!contenedor){
      console.error("no se encontro el contenedor")
      return;
    }


  
    if (ev.dataTransfer.items) {
      // Usar la interfaz DataTransferItemList para acceder a el/los archivos)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // Si los elementos arrastrados no son ficheros, rechazarlos
        if (ev.dataTransfer.items[i].kind === "file") {
         
          const file = ev.dataTransfer.items[i].getAsFile();
          const nombrearchivo= file.name;
          const archivoExtencion = nombrearchivo.split(".").pop().toLowerCase();
          
          if(archivoExtencion !== "csv"){  

            muestroImagen(contenedor);

          }else{
            console.log("-----Archivo CSV aceptado-----" , nombrearchivo);

              const fileInput = document.getElementById("file-input");
             

              fileInput.addEventListener("change", handleFileSelection);

              handleFileSelection({ target: { files: [file] } }); // funcion cambiada
          }
        }
      }
      
    }
  
    // Pasar el evento a removeDragData para limpiar
    removeDragData(ev);
  }
  

function dragOverHandler(ev) {
    console.log("File(s) in drop zone");
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault(); //evita que el navegador habra el archivo  
  }


  function removeDragData(ev) {
    console.log("Removing drag data");
  
    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to remove the drag data
      ev.dataTransfer.items.clear();
    } else {
      // Use DataTransfer interface to remove the drag data
      ev.dataTransfer.clearData();
    }
  }

 function muestroImagen(contenedor){

  const fotoContenedor = document.getElementById("foto");
  if(!fotoContenedor) {
    console.log("No se ha encontrado ninguna foto");
    return;
  }
  


  if(!fotoContenedor.querySelector("img")){ // verificamos que exista
  const imatge = document.createElement("img");
    imatge.src = "img/nocsv.webp";
    imatge.style.width = "700px";
    imatge.style.margin = "700px";

    contenedor.style.display = "none"; // lo que me hara sera que se me bloqueara el contenedor y se me mostrara la imagen
    fotoContenedor.style.display = "block";

    fotoContenedor.appendChild(imatge);

  }
       
  }

  let llistaObjectes = [];
  let tipusSet = new setInterval(); // esto me servira para guardar los tipos



   function handleFileSelection(event){

    const fileContentDisplay = document.getElementById("file-content");
    const messagediplay = document.getElementById("message");

    const file = event.target.files[0];
    fileContentDisplay.textContent = "";
    messagediplay.textContent = "";

    if(!file.type.startsWith("text")){
      showMessage("Unsupported file type. Please select a text file.", "error");
    return;

    }

    const reader = new FileReader();

    reader.onload = () => {
      const contenido = reader.result;
      // fileContentDisplay.textContent = reader.result;
      fileContentDisplay.textContent = contenido;

      const lineas = contenido.split("\n").map(line => line.trim()); // Divide en líneas
         llistaObjectes = [];

        for (let i = 1; i < lineas.length; i++) { // Saltamos la cabecera
          if (lineas[i] === "") continue; // Evita líneas vacías

            const columnas = lineas[i].split(",");

            const tipus = columnas[0].trim(); // Tipus de lloc
            const nom = columnas[1].trim();
            const ubicacio = columnas[2].trim();
            const descripcio = columnas[3].trim();

            tipusSet.add(tipus); // aqui lo que hace es añadir el tipo set


            let objecte;
            if (tipus === "Espai") {
                objecte = new PuntInteres(nom, ubicacio, descripcio);
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
        console.log("Tipus disponibles :" , tipusSet);

        actualizarMenuDesplegable(tipusSet);

      
    };

        reader.onerror = () => { // Ahora maneja errores correctamente
            showMessage("Error al leer el archivo, intentalo mas tardes");
        };

        reader.readAsText(file);  

  }

  function showMessage(message, type) {
    messageDisplay.textContent = message;
    messageDisplay.style.color = type === "error" ? "red" : "green";
  }


function actualizarMenuDesplegable(tipos){
  const selectmenu = document.getElementById("tipus");

  if(!selectmenu){
    console.log("---ese menu no existe----");
    return;

  }


  selectmenu.innerHTML = "";

  

}