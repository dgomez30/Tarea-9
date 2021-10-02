const pokeImg = document.querySelector('[data-poke-img]');

const typeColors = {
    electric: '#FFEA70',
    normal: '#B09398',
    fire: '#FF675C',
    water: '#0596C7',
    ice: '#AFEAFD',
    rock: '#999799',
    flying: '#7AE7C7',
    grass: '#4A9681',
    psychic: '#FFC6D9',
    ghost: '#561D25',
    bug: '#A2FAA3',
    poison: '#795663',
    ground: '#D2B074',
    dragon: '#DA627D',
    steel: '#1D8A99',
    fighting: '#2F2F2F',
    default: '#2A1A1F',
};

const typeBadge = {
    electric: 'warning text-dark',
    normal: 'info text-dark',
    fire: 'danger',
    water: 'primary',
    ice: 'primary',
    rock: 'secundary',
    flying: 'success',
    grass: 'success',
    psychic: 'danger',
    ghost: 'danger',
    bug: 'success',
    poison: 'dark',
    ground: 'warning text-dark',
    dragon: 'danger',
    steel: 'info text-dark',
    fighting: 'secondary',
    default: 'secondary',
};


const buscarPokemon = () => {
    let url = "http://localhost:5000/pokemon-informations"
    let query = document.getElementById('txtPokemon').value.toLowerCase();

    let jsonEnviar = JSON.stringify({
        pokemon: query
    });

    fetch(url, {
            method: 'POST',
            body: jsonEnviar,
            headers: {
                "Content-type": "application/json"
            }
        })
        .then(data => data.json())
        .then(response => mostrarInfoPokemon(response))
        .catch(err => mostrarNoEncontrado())
}

const mostrarInfoPokemon = data => {
    console.log(data.replies);
    const colorBadge = typeBadge[data.replies[1].content];

    if (data.replies.length === 1) {
        mostrarNoEncontrado();
    }

    document.getElementById('lblTitulo').innerHTML = data.replies[0].content;
    document.getElementById('lblDescripcion').innerHTML = data.replies[5].content;
    document.getElementById("lblTipoPokemon").innerHTML = "<span class='badge bg-" + colorBadge + "'>" + data.replies[1].content + "</span><br/>";

    pokeImg.setAttribute('src', data.replies[6].content);
    setColorFondo(data);
    setAtributosPokemon(data);
}

const setColorFondo = data => {
    document.getElementById('divPokemon').style.visibility = 'visible';

    const colorOne = typeColors[data.replies[1].content];
    pokeImg.style.background = `radial-gradient(#ffffff 33%, ${colorOne} 33%)`;
    pokeImg.style.backgroundSize = ' 5px 5px';
}

const setAtributosPokemon = data => {
    let atributosDinamicos = '';
    const colorBadge = typeBadge[data.replies[1].content];

    atributosDinamicos +=
        "<div class='col-12'>Altura: <span class='badge bg-" + colorBadge + "'>" + data.replies[2].content + "</span></div>" +
        "<div class='col-12'>Peso: <span class='badge bg-" + colorBadge + "'>" + data.replies[3].content + "</span></div>" +
        "<div class='col-12'>Experiencia: <span class='badge bg-" + colorBadge + "'>" + data.replies[4].content + "</span></div>";
    document.getElementById('lblAtributos').innerHTML = atributosDinamicos;
}

const mostrarNoEncontrado = () => {
    document.getElementById('divPokemon').style.visibility = 'visible';
    document.getElementById('lblTitulo').innerHTML = "No encontrado";
    document.getElementById('lblDescripcion').innerHTML = "Pokemon desconocido, actualiza tu pokedex...";
    document.getElementById("lblTipoPokemon").innerHTML = "<span class='badge bg-secondary'>Desconocido</span><br/>";
    pokeImg.setAttribute('src', 'assert/poke-shadow.png');
    pokeImg.style.background = '#fff';
    document.getElementById('lblAtributos').innerHTML = '';
}