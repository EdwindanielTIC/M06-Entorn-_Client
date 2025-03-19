function dropHandler(ev) {
    console.log("Fichero(s) arrastrados");
    const imatge = document.createElement("img");
    imatge.src = "https://th.bing.com/th/id/OIP.1wUtwRMDnPYheibmx8t4owAAAA?rs=1&pid=ImgDetMain";
    // Evitar el comportamiendo por defecto (Evitar que el fichero se abra/ejecute)
    ev.preventDefault();
  
    if (ev.dataTransfer.items) {
      // Usar la interfaz DataTransferItemList para acceder a el/los archivos)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // Si los elementos arrastrados no son ficheros, rechazarlos
        if (ev.dataTransfer.items[i].kind === "file") {
          // var file = ev.dataTransfer.items[i].getAsFile();
          // console.log("... fichero[" + i + "].nombre = " + file.name);
          const contenedor = document.getElementById("container");
          
          contenedor.appendChild(imatge);
        }
      }
    } else {
      // Usar la interfaz DataTransfer para acceder a los archivos
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log(
          "... fichero[" + i + "].nombre = " + ev.dataTransfer.files[i].name,
        );
      }
    }
  
    // Pasar el evento a removeDragData para limpiar
    // removeDragData(ev);
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