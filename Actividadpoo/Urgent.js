class Urgent extends Tasca{

    #recordatorio ;

    Urgent(id,nom,prioritat,tipus,recordatorio){
        super(id,nom,completada,prioritat,tipus);
        this.#recordatorio = recordatorio;
    }

    mostrarInfoTaca(){

        
        return `${super.mostrarInfoTaca()}, Recordatorio: ${this.#recordatorio}`

    }


}