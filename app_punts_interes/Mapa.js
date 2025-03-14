class Mapa{
    #map;

    //pintara el mapa
    constructor(){

        


    }

    mostrarPuntInicial(){

        this.#map = L.map('map', { center: [51.505, -0.09], zoom: 13 });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);


        L.marker([51.5, -0.09]).addTo(this.#map)
            .bindPopup('Puntos iniciales')
            .openPopup();
      
    } 

    


    //ActualizarPunt()
    //borrarPunt()
    //#getPocisioActual()
}


const mapa1 = new Mapa();
mapa1.mostrarPuntInicial()





