class Tasca{

    #id ;
    #nom ;
    #completada;
    prioritat ;
    tipus ;
    static totalTasques = 0;// inicio las tasca a valor 0

    Tasca(id, nom, prioritat, tipus){
        this.#id = id;
        this.#nom = nom;
        this.#completada = false; // le pongo false porque aun no he completado la tarea
        this.prioritat = prioritat;
        this.tipus = tipus;
        totalTasques++; // se incrementara la tasca cada vez

    }

    get getid() {

        return this.#id;

    }

    set setid(id){
        
        this.#id = id;
    }

    get getnom(){
        return this.#nom;
    }

    set setnom(nombre){
        this.#nom = nombre;
    }

   set completada(completa){ 

        this.#completada = completa;
    }

    estaCompletada(){ //boolean

        return this.#completada;
    }




    mostrarInfoTaca(){ //Stirng

        return `nom ${this.#nom}, tipus: ${this.tipus}, prioritat: ${this.prioritat}, completa: ${this.#completada}`

    }

    static obtenirTotalTasques(){ // number

        return Tasca.totalTasques;

    }

}