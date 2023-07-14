// DOM VARIABLES
const d = document;
const main = d.querySelector('main');
const searcher = d.getElementById('search');
const links = d.querySelector('#links');
const modal = document.getElementById('modal');

// FUNCTIONAL VARIABLES
let urlApi = 'https://pokeapi.co/api/v2/pokemon/';

// search pokemons
searcher.addEventListener('keyup', e => {
  const inputValue = e.target.value;
  console.log(inputValue)
})

d.addEventListener("DOMContentLoaded", async () => await loadPokemons(urlApi));

const loadPokemons = async (url) => {

  try {
    main.innerHTML = `<img src="img/loader.svg" class="loader">`

    let res = await fetch(url);
    let json = await res.json();
    const data = json.results;
    let template = '';
    let prev;
    let next;
    if(!res.ok) throw {status: res.status, statusTest: res.statusText};
    
    
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      try {
        let res = await fetch(element.url);
        let pokemon = await res.json();

        console.log(pokemon)

        let types = pokemon.types.map((type) => `<p class="${type.type.name}">${type.type.name}</p>`);

        types = types.join('');

        if(!res.ok) throw {status: res.status, statusTest: res.statusText};

        template += `
        <article class="card">
          <div class="card-title">
            <span class="title-name">${pokemon.name}</span>
          </div>
          <div class="card-img">
            <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
          </div>
          <div class="card-types">
            ${types}
          </div>
         
        </article>
        `
      } catch (err) {
        let message = err.statusText || 'Ocurrio un error';
        template += `
        <div>Error  ${err.status}: ${message}</div>
        `
      }
    }
    main.innerHTML = template;
    prev = json.previous? `<a href="${json.previous}">⬅️</a>`: "";
    next = json.next? `<a href="${json.next}">➡️</a>`: "";
    links.innerHTML = `${prev} ${next}`;

  } catch (err) {
    let message = err.statusText || 'Ocurrio un error';
    main.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
  }
}

d.addEventListener("click", async e => {
  if(e.target.matches('#links a')) {
    e.preventDefault();
    loadPokemons(e.target.getAttribute('href'));
  }

  if(e.target.matches('img')) {
    const pokemon = e.target.getAttribute('alt');
    modal.showModal();

    try {
      const response = await fetch(`${urlApi}${pokemon}`);
      const data = await response.json();
      console.log(data.stats[0])
      console.log(data.stats[0].base_stat)
      console.log(data.stats[0].effort)
      console.log(data.stats[0].stat.name)

      let abilities = data.abilities.map((ab) => `<p class="${ab.ability.name}">${ab.ability.name}</p>`);
      abilities = abilities.join('');

      let stats = data.stats.map((st) => 
        `<div>
          <p>${st.stat.name}</p>
          <p>Base: ${st.base_stat}</p>
          <p>Esfuerzo: ${st.effort}</p>
          <hr/>
        </div>`
      );
      stats = stats.join('');
      
      modal.innerHTML = `
        <img src="${data.sprites.other.dream_world.front_default}" alt="${data.name}" />
        <div>
          <h2>${data.name}</h2> 
          <p>Experiencia base ${data.base_experience}</p>
          <p>Altura ${data.height}</p>
          <p>Peso ${data.weight}</p>
        </div>
        <div>
          <h3>Habilidades</h3>
          ${abilities}
        </div>
        <div>
          <h3>Estadísticas</h3>
          ${stats}
        </div>
       
      `
    } catch (error) {
      console.log(error);
    }
  }

  if(e.target.matches('#modal')) modal.close();
})