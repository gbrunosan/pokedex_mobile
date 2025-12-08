import { db } from "./index";
import { pokemons } from "./schema";

async function seed() {
    console.log("Iniciando seed...");

    const batchSize = 50;
    const totalPokemon = 151;
    const pokemonData = [];

    for (let i = 1; i <= totalPokemon; i++) {
        const paddedId = i.toString().padStart(3, "0");
        const numPokedex = `#${paddedId}`;
        const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${i}.gif`;

        pokemonData.push({
            numPokedex,
            nome: "Carregando...",
            sprite,
            originalId: i
        });
    }

    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const data = await response.json();

        if (data.results) {
            data.results.forEach((p: any, index: number) => {
                if (pokemonData[index]) {
                    pokemonData[index].nome = p.name.charAt(0).toUpperCase() + p.name.slice(1);
                }
            });
        }
    } catch (error) {
        console.error("Falha ao buscar nomes na PokeAPI, usando placeholders.");
        pokemonData.forEach(p => p.nome = `Pokemon ${p.numPokedex}`);
    }

    const values = pokemonData.map(p => ({
        numPokedex: p.numPokedex,
        nome: p.nome,
        sprite: p.sprite
    }));

    await db.insert(pokemons).values(values);

    console.log("Seed concluído!");
}

seed().catch((err) => {
    console.error("Falha no seed", err);
    process.exit(1);
});
