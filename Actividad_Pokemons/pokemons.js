let pokemonData = []; // Variable global para almacenar los datos de los Pokémon

async function miprueba() {
  try {
      const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=50");
      if (!respuesta.ok) {
          throw new Error(`Error: ${respuesta.status}`);
      }
      const datos = await respuesta.json();
      pokemonData = datos.results; // Almacenamos los datos en la variable global
      actualizarPokemons(); // Mostramos los Pokémon iniciales
  } catch (error) {
      console.error('Hubo un problema con la petición:', error);
      document.getElementById('contenido').innerHTML = `<p style="color:red;">Error al cargar los datos: ${error.message}</p>`;
  }
}

function actualizarPokemons() {
  const contenedor = document.getElementById("contenido");
  contenedor.innerHTML = ""; // Limpiamos el contenido anterior

  const select = document.getElementById("deplegable");
  const limit = parseInt(select.value); // Obtenemos el valor seleccionado

  for (let i = 0; i < limit && i < pokemonData.length; i++) {
      const pokemon = pokemonData[i];//como anteriormente hemos creado una variable global, entonces le pasamos la i , para luego imprimirlo, esto hace que me recorra toda la api
      mostrarPokemon(pokemon);
  }
}

async function mostrarPokemon(pokemon) {
  const card = document.createElement('div');
  card.className = 'pokemon-card';

  const titulo = document.createElement('h2');
  const foto = document.createElement("img");
  const pokemonRespuesta = await fetch(pokemon.url);
  const pokemonDatos = await pokemonRespuesta.json();
  const boton = document.createElement("button");

  titulo.textContent = `${pokemon.name}`;
  foto.src = pokemonDatos.sprites.front_default;
  boton.textContent = "info";

  
  boton.addEventListener("click", function() {
      window.location.href = `detail.html?name=${pokemon.name}`;
  });

  // si quiero añadir algo dentro de la carta, tengo que utilizar la variable creada card, ya que si lo hago con contendeor, me aparecera en el body
  // asi que debo de hacerlo dentro de la card
  card.appendChild(titulo);
  card.appendChild(foto);
  card.appendChild(boton);
  document.getElementById("contenido").appendChild(card);
}

miprueba(); // Llamamos a la función principal para cargar los datos iniciales