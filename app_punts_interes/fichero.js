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

            //intrudir el codigo para leer la informacion
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

    const imatge = document.createElement("img");

    imatge.src = "https://files.oaiusercontent.com/file-9xrs9yp8Mo2R54JMKTUEup?se=2025-03-19T19%3A51%3A32Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D39aa5666-55a3-4805-81aa-71ff92900400.webp&sig=UCQ%2BRl4dGw3ACXucBznHCqyxZIAYdhCbUWBvgnpaLfE%3D"
    imatge.style.width = "700px";
    imatge.style.margin = "700px";
    contenedor.style.display = "none"; // lo que me hara sera que se me bloqueara el contenedor y se me mostrara la imagen

    const fotoContenedor = document.getElementById("foto");
      if(fotoContenedor){ // verificamos que exista

        fotoContenedor.style.display = "block";

        fotoContenedor.appendChild(imatge);

      }

  }