import { db } from "./index";
import { pokemons } from "./schema";

async function seed() {
    console.log("Seeding started...");

    const batchSize = 50;
    const totalPokemon = 151;
    const pokemonData = [];

    for (let i = 1; i <= totalPokemon; i++) {
        // Fetch name from PokeAPI or just generate properly formatted data
        // To be fast and reliable without depending on external API rate limits during seed, 
        // we can fetch names or just use a placeholder if fetch fails, but let's try to be nice.
        // Actually, for a robust seed, let's just hardcode a few or fetch simple list.
        // Let's trying fetching the list of 151 first.

        // Constructing the data based on ID
        const paddedId = i.toString().padStart(3, "0");
        const numPokedex = `#${paddedId}`;
        const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${i}.gif`;

        // We will update names later or just use "Pokemon #i" if we want to avoid 151 requests.
        // Better strategy: Fetch the list of 151 pokemon once.
        pokemonData.push({
            numPokedex,
            nome: "Loading...", // Will update
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
        console.error("Failed to fetch names from PokeAPI, using placeholders.");
        pokemonData.forEach(p => p.nome = `Pokemon ${p.numPokedex}`);
    }

    // Insert in batches
    const values = pokemonData.map(p => ({
        numPokedex: p.numPokedex,
        nome: p.nome,
        sprite: p.sprite
    }));

    await db.insert(pokemons).values(values);

    console.log("Seeding completed!");
}

seed().catch((err) => {
    console.error("Seeding failed", err);
    process.exit(1);
});
