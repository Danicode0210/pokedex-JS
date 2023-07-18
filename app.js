import { drawPokemons, pagination, searchPokemon, showPokemon } from "./helpers/functions.js";

// DOM VARIABLES
const d = document;
const main = d.querySelector('main');
const searcher = d.getElementById('search');
const form = d.querySelector('.form');
const links = d.querySelector('#links');
const modal = document.getElementById('modal');
let urlApi = 'https://pokeapi.co/api/v2/pokemon/';

const loadPokemons = async (url) => {
  try {
    main.innerHTML = `<img src="img/loader.svg" class="loader">`;

    let res = await fetch(url);
    let json = await res.json();
    const data = json.results;
    if(!res.ok) throw {status: res.status, statusTest: res.statusText};

    const template = await drawPokemons(data);
    main.innerHTML = template;

    const paginator = pagination(json);
    links.innerHTML = paginator

  } catch (err) {
    console.log(err)
    let message = err.statusText || 'Ocurrio un error';
    main.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
  }
}

(async () => {
  await loadPokemons(urlApi);

  // event click
  d.addEventListener("click", async e => {
    console.log(e.target)
    if(e.target.matches('#clear-search') || 
      e.target.matches('#clear-btn')) 
        location.reload();

    if(e.target.matches('#links a')) {
      e.preventDefault();
      loadPokemons(e.target.getAttribute('href'));
    }

    if(e.target.matches('.img')) {
      const pokemon = e.target.getAttribute('alt');
      modal.showModal();
      modal.innerHTML = '<img src="img/loader.svg" class="loader">';
      
      const contentModal = await showPokemon(pokemon);
      modal.innerHTML = contentModal;
    }

    if(e.target.matches('#modal') || e.target.matches('#close-modal')) modal.close();
  })

  
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    let url = `${urlApi}${searcher.value}`;
    console.log(url)

    try {
      if(searcher.value === '') {
        await loadPokemons(urlApi);
      } 
      else {
        main.innerHTML = `<img src="img/loader.svg" class="loader">`
        links.innerHTML= '';
        const template = await searchPokemon(url);
        main.innerHTML = template;
      }
    } catch (err) {
      main.classList.remove('grid-fluid');
      main.innerHTML = `<p>No se encontraron resultados</p>`;
    }
  })
})();
