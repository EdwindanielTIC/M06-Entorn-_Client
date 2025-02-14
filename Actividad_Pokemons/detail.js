// Obtener el nombre del Pokémon desde la URL
const urlParams = new URLSearchParams(window.location.search); 
// con window.location.search obtendre los parametros de la URL
// con new urSearchParams nos permite buscar los parametros indicados
const pokemonName = urlParams.get('name'); // nos devuelve 

// Función para cargar los detalles del Pokémon
async function cargarDetallesPokemon() {
    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!respuesta.ok) {
            throw new Error(`Error: ${respuesta.status}`);
        }
        const pokemon = await respuesta.json(); // convertimos la respuesta a json();

        // Creamos las tablas con table y tr para hacer la separacion
        let habilidadesHTML = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Habilitat</th>
                </tr>
                ${pokemon.abilities.map((ability, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${ability.ability.name}</td>
                    </tr>
                `).join('')}
            </table>
        `;

        // map: recorre el array y me genera las filas con el id y nombre de habilidad
        // Mostrar los detalles del Pokémon
        const detalleDiv = document.getElementById("detalle-pokemon");
        detalleDiv.innerHTML = `
            <h1>Detall del Pokémon</h1>
            <h2>${pokemon.name}</h2>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p><strong>Pes:</strong> ${pokemon.weight}</p>
            <p><strong>Alçada:</strong> ${pokemon.height}</p>
            ${habilidadesHTML}
            <button onclick="window.history.back()">← Torna enrere</button>
        `;
    } catch (error) {
        console.error('Hubo un problema con la petición:', error);
        document.getElementById('detalle-pokemon').innerHTML = `<p style="color:red;">Error al cargar los detalles: ${error.message}</p>`;
    }
}

cargarDetallesPokemon();
