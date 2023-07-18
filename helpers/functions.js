export const drawPokemons = async (arr) => {
  let template = "";
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];

    try {
      let res = await fetch(element.url);
      let pokemon = await res.json();
      if (!res.ok) throw { status: res.status, statusTest: res.statusText };

      let types = pokemon.types.map(
        (type) => `<p class="${type.type.name}">${type.type.name}</p>`
      );
      types = types.join("");

      template += `
      <article class="card">
        <div class="card-title">
          <span class="title-name">${pokemon.name}</span>
        </div>
        <div class="card-img">
          <img title="Ver más detalles..." class="img" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
        </div>
        <div class="card-types">
          ${types}
        </div>
      </article>
      `;
    } catch (err) {
      let message = err.statusText || "Ocurrio un error";
      template += `
      <div class="error">Error  ${err.status}: ${message}</div>
      `;
    }
  }
  return template;
};

export const pagination = (obj) => {
  let prev = obj.previous ? `<a href="${obj.previous}">&laquo;</a>` : "";
  let next = obj.next ? `<a href="${obj.next}">&raquo;</a>` : "";
  return `${prev} ${next}`;
};

export const showPokemon = async (pokemon) => {
  const urlApi = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;

  try {
    const response = await fetch(urlApi);
    const data = await response.json();

    let abilities = data.abilities.map(
      (ab) =>
        `<span class="${data.types[0].type.name}-text">${ab.ability.name}</span>`
    );
    abilities = abilities.join("");

    let stats = data.stats.map(
      (st, index) =>
        `<div class="stats-container">
          <label>${st.stat.name}&nbsp;&nbsp;&nbsp;&nbsp;<span class="${data.types[0].type.name}-text">${st.base_stat}</span></label>
          <progress id="stat-${index + 1}" value="${st.base_stat}" max="200"></progress>
        </div>`
    );
    stats = stats.join("");

    const contentModal = `
    <div class="modal-content">
      <span id="close-modal" title="Cerrar">X</span>
      <div class="poke-info">
        <div class="poke-img">
          <img src="${data.sprites.other.dream_world.front_default}" alt="${data.name}" />
        </div>
        <h2 class="${data.types[0].type.name}-text">${data.name}</h2> 
        <div class="poke-data">
          <p>
            <span>Experiencia</span> 
            <span class="${data.types[0].type.name}-text">${data.base_experience}</span>
          </p>
          <p>
            <span>Altura</span> 
            <span class="${data.types[0].type.name}-text">${data.height}</span>
          </p>
          <p>
            <span>Peso</span> 
            <span class="${data.types[0].type.name}-text">${data.weight}</span>
          </p>
        </div>
      </div>
      <div class="poke-data-complement">
        <div class="poke-abilities">
          <h2>Habilidades</h2>
          ${abilities}
        </div>
        <div class="poke-stats">
          <h2>Estadísticas</h2>
          ${stats}
        </div>
      </div>
    </div>
    `;
    return contentModal;
  } catch (error) {
    console.log(error);
  }
};

export const searchPokemon = async (url) => {
  let template = "";

  try {
    let res = await fetch(url);
    let pokemon = await res.json();
    let types = pokemon.types.map(
      (type) => `<p class="${type.type.name}">${type.type.name}</p>`
    );
    types = types.join("");

    template += `
      <article class="card" style="width: 260px; margin: auto">
        <div class="card-title">
          <span class="title-name">${pokemon.name}</span>
        </div>
        <div class="card-img">
          <img title="Ver más detalles..." class="img" src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
        </div>
        <div class="card-types">
          ${types}
        </div>
          <i id="clear-search" class='bx bx-arrow-back' title="Volver al inicio"></i>
      </article>
    `;
    return template;
  } catch (error) {
    console.log(error);
    if (error)
      return (template += `
        <div class="error-container">
            <p class="error">No se encontraron resultados</p>
            <button id="clear-btn">Volver</button>
        </div>
      `);
  }
};
