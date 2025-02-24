const app = new app();

const primeraTasca = new Tasca(1,"ir al carrefour", "mitjana", "Normal");
const segundaTasca = new Critica(2,"ir al gym", "Alta", "2025-04-21", "Entregar el proyecto");
const terceraTasca = new Tasca(3,"Pagar mensualidad gym", "mitjana",  "Recordatori: 10h abans de venciment");


app.afegirTasca(primeraTasca);
app.afegirTasca(segundaTasca);
app.afegirTasca(terceraTasca);


app.modificaNomTasca();
app.actualizarLista();

app.modificaNomTasca(1,"no ir al carrefour");


app.actualizarLista();
app.mostrarTotalTasques();