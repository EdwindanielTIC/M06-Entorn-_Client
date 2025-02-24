class Critica extends Tasca{
    #dataLimit;
    #descripcio;
    
    Critica(id,nom,prioritat,tipus ,datalimit, descripcio){ // solo debo poner las mimsas instacias que tiene el contructor de la clase padre
        super(id,nom,prioritat,tipus);
        this.#dataLimit = datalimit;
        this.#descripcio = descripcio;
    }

    getdataLimit(){
        return this.#dataLimit;
    }

    setdataLimit(novaData){ // void

        this.#dataLimit = novaData;
    }

    mostrarInfoTaca(){
       
        console.log(`${ super.mostrarInfoTaca()} Hola, la data limit ${this.#dataLimit} ha terminado, ${this.#descripcio}`);

    }


}