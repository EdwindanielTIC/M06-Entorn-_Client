class Atraccio extends PuntInteres {

    horaris;
    preu;
    moneda;

    constructor(id,pais,ciutat,nom,direccio,horari,preu,moneda){
        super(id,pais,ciutat,nom,direccio);
        this.horaris = horari;
        this.preu = preu;
        this.moneda = moneda;
        
    }

    getPreuIva(ivaPais){

        if(this.preu === 0){
            console.log("Entrada gratuïta");
        }else if(ivaPais === 0){
            console.log(`Precio sin iva :${this.preu} ${this.moneda}`);
        }else{
            let resultadoIva ;

          resultadoIva =  this.preu * (ivaPais/2) ;

          return resultadoIva;

        }
    }


}

//funciona

// const atraccio1 = new Atraccio(123,"España","Barcelona","Alberto","calle murcia","12;23",10,"Euro")

// console.log(atraccio1.getPreuIva(20));