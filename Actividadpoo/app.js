
class app{

    #tasques = [];


    afegirTasca(tasca){
        this.#tasques.push(tasca);

    }

    completaTasca(id){
        
      let tasca = null;

      for (let i =0; i<this.#tasques; i++){
        if(this.#tasques[i].getId() == id ){
            this.#tasques[i].completaTasca();
            console.log(`Tasca ${id} completada`);
            return;

        }
      }
      console.log(`Tasca ${id} NO completada`)
    }

    elimnarTasca(){
        
        
        

    }
    
    modificaNomTasca(){
        const tasca = this.#tasques.find(t => t.id === id);
        if (tasca) {
            tasca.nom = nouNom;
            console.log(`Nom de la tasca modificat: ${tasca.mostrarInfoTasca()}`);
        } else {
            console.log(`Tasca amb ID ${id} no trobada.`);
        }
    }

    actualizarLista(){
        console.log("Llista de tasques actualitzada:");
        this.#tasques.forEach(tasca => console.log(tasca.mostrarInfoTasca()));
    }

    mostrarTotalTasques() {
        console.log(`Total de tasques: ${Tasca.obtenirTotalTasques()}`);
    }

}

