const express = require('express');
var cors = require('cors');

const db = require("../Pokedex/pokedex.json");

function findPokemonByName(name) {
    const data = db.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (!data) {
        return null;
    }
    return data;
}

function findPokemonPorTipo(tipo) {
    const data = db.find((p) => p.types[0].toLowerCase() === tipo.toLowerCase());
    if (!data) {
        return null;
    }
    return data;
}

function getPokemonInformations(req, res) {
    const pokemon = req.body.pokemon;
    const pokemonInfos = findPokemonByName(pokemon);
    if (!pokemonInfos) {
        res.json({
            replies: [{
                type: "text",
                content: `no conozco el pokemon llamado ${pokemon} :(`,
            }, ],
        });
    } else {
        res.json({
            replies: [
                { type: "text", content: `*${pokemonInfos.name}*` },
                {
                    type: "text",
                    content: `${pokemonInfos.types.join(" and ")}`,
                },
                {
                    type: "text",
                    content: ` ${pokemonInfos.height}`,
                },
                {
                    type: "text",
                    content: ` ${pokemonInfos.weight}`,
                },
                {
                    type: "text",
                    content: ` ${pokemonInfos.base_experience}`,
                },
                { type: "text", content: pokemonInfos.description },
                { type: "picture", content: pokemonInfos.image },
            ],
        });
    }
};

function getPokemonEvolutions(req, res) {
    const pokemon = req.body.pokemon;
    const pokemonInfos = findPokemonByName(pokemon.value);
    if (!pokemonInfos) {
        res.json({
            replies: [{
                type: "text",
                content: `no conozco el pokemon llamado ${pokemon} :(`,
            }, ],
        });
    } else if (pokemonInfos.evolutions.length === 1) {
        res.json({
            replies: [
                { type: "text", content: `${pokemonInfos.name} has no evolutions.` },
            ],
        });
    } else {
        res.json({
            replies: [
                { type: "text", content: `${pokemonInfos.name} family` },
                {
                    type: "text",
                    content: pokemonInfos.evolutions

                },
                {
                    type: "card",
                    content: {
                        title: "Ver mas de este",
                        buttons: pokemonInfos.evolutions
                            .filter((p) => p.id !== pokemonInfos.id) // Remove initial pokemon from list
                            .map((p) => ({
                                type: "postback",
                                title: p.name,
                                value: `Dime mas de ${p.name}`,
                            })),
                    },
                },
            ],
        });
    }
};
//fin de funciones

const app = express();

//se usa en vez de body-parse
app.use(express.json());

//construye las rutas de servicio
app.use(cors());
app.options('*', cors());
app.post('/pokemon-informations', getPokemonInformations);
app.post('/pokemon-evolutions', getPokemonEvolutions);
app.post('/errors', function(req, res) {
    console.error(req.body, res);
    res.sendStatus(200);
});
app.get('/', function(req, res) {
    res.send('Saludos desde pokeAPI' + req.body.user_en);
});

//iniciar el server est
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App iniciado en ${PORT}`));