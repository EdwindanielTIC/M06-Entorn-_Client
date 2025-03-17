class Mapa{
    #map;

    //pintara el mapa
    constructor(){

        //inicializamos la variable que me dibujara el mapa
        this.#map = L.map('map', { center: [51.505, -0.09], zoom: 13 });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        

    L.marker([51.5, -0.09]).addTo(this.#map)
            .bindPopup('Puntos iniciales')
            .openPopup();


    var circle = L.circle([51.508, -0.11], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(this.#map);

    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]).addTo(this.#map);


//Api de geolocalizacion https://www.w3schools.com/JSREF/prop_geo_position.asp   informacion de donde la saque
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                this.#map.setView([lat,lon], 15);

                L.marker([lat, lon]).addTo(this.#map)
                .bindPopup('Puntos iniciales')
                .openPopup();
            },

        (erro)=> {
            console.log("Error en la geolocalizacion", erro);
        }

        )
    }

  



    

        


    }

    mostrarPuntInicial(){

      
    } 

    


    //ActualizarPunt()
    //borrarPunt()
    //#getPocisioActual()
}


const mapa1 = new Mapa();







