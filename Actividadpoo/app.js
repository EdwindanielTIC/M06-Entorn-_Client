
class app{

    #tasques = [];


    afegirTasca(tasca){
        this.#tasques.push(tasca);

        console.log(`Tasca añadida: ${tasca.mostrarInfoTaca()}`);
    }

    completaTasca(){
        
        console.log(`La tasca am id: ${tasca.id}`);
    }

    elimnarTasca(){
        console.log(`Elimar Tasca amb id: ${tasca.id}`);

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

