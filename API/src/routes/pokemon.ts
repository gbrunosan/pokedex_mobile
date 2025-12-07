import express from "express";
import { db } from "../db";
import { pokemons, userFavorites } from "../db/schema";
import { auth, CustomRequest } from "../middleware/auth";
import { and, eq } from "drizzle-orm";

export const pokemonRouter = express.Router();

// Protected route to fetch pokemon
// Protected route to fetch pokemon
pokemonRouter.get("/", auth, async (req, res) => {
    try {
        const userId = (req as CustomRequest).token ? (req as CustomRequest).token.id : null;

        const allPokemon = await db.select({
            id: pokemons.id,
            numPokedex: pokemons.numPokedex,
            nome: pokemons.nome,
            sprite: pokemons.sprite,
            isFavorite: userFavorites.pokemonId
        })
            .from(pokemons)
            .leftJoin(userFavorites, and(eq(userFavorites.pokemonId, pokemons.id), eq(userFavorites.userId, userId || 0)))
            .all();

        // Transform result to boolean
        const result = allPokemon.map(p => ({
            ...p,
            isFavorite: !!p.isFavorite
        }));

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching pokemon");
    }
});

// List Favorites
pokemonRouter.get("/favorites", auth, async (req, res) => {
    try {
        const userId = (req as CustomRequest).token ? (req as CustomRequest).token.id : null;
        if (!userId) return res.status(401).send();

        const favorites = await db.select({
            id: pokemons.id,
            numPokedex: pokemons.numPokedex,
            nome: pokemons.nome,
            sprite: pokemons.sprite
        })
            .from(userFavorites)
            .innerJoin(pokemons, eq(userFavorites.pokemonId, pokemons.id))
            .where(eq(userFavorites.userId, userId))
            .all();

        res.send(favorites);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching favorites");
    }
});

// Toggle Favorite
pokemonRouter.post("/favorite", auth, async (req, res) => {
    try {
        const { pokemonId } = req.body;
        const userId = (req as CustomRequest).token ? (req as CustomRequest).token.id : null;

        if (!userId || !pokemonId) {
            return res.status(400).send("Invalid Request");
        }

        const existing = await db.select()
            .from(userFavorites)
            .where(and(eq(userFavorites.userId, userId), eq(userFavorites.pokemonId, pokemonId)))
            .get();

        if (existing) {
            await db.delete(userFavorites)
                .where(and(eq(userFavorites.userId, userId), eq(userFavorites.pokemonId, pokemonId)));
            return res.send({ message: "Removed from favorites", isFavorite: false });
        } else {
            await db.insert(userFavorites).values({ userId, pokemonId });
            return res.send({ message: "Added to favorites", isFavorite: true });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Error toggling favorite");
    }
});

// Get Single Pokemon by Name
pokemonRouter.get("/name/:name", auth, async (req, res) => {
    try {
        const userId = (req as CustomRequest).token ? (req as CustomRequest).token.id : null;
        const pokemonName = req.params.name.toLowerCase();

        const pokemon = await db.select({
            id: pokemons.id,
            numPokedex: pokemons.numPokedex,
            nome: pokemons.nome,
            sprite: pokemons.sprite,
            isFavorite: userFavorites.pokemonId
        })
            .from(pokemons)
            .leftJoin(userFavorites, and(eq(userFavorites.pokemonId, pokemons.id), eq(userFavorites.userId, userId || 0)))
            .where(eq(pokemons.nome, req.params.name)) // Exact match for now, or case insensitive if needed
            .get();

        // Check for case insensitive match if exact match fails, or just use sql 'like' or lower()
        // For sqlite: simply lower(nome) = lower(param)
        // Let's stick to exact match first based on DB data (Capitalized), but usually API is case insensitive.
        // Let's improve the query to be more robust.

        if (!pokemon) {
            // Try case-insensitive fallback if needed, or better:
            // Since we know names in DB are Capitalized (e.g. "Bulbasaur"), we can try to capitalize the input.
            const capitalized = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1);
            const retry = await db.select({
                id: pokemons.id,
                numPokedex: pokemons.numPokedex,
                nome: pokemons.nome,
                sprite: pokemons.sprite,
                isFavorite: userFavorites.pokemonId
            })
                .from(pokemons)
                .leftJoin(userFavorites, and(eq(userFavorites.pokemonId, pokemons.id), eq(userFavorites.userId, userId || 0)))
                .where(eq(pokemons.nome, capitalized))
                .get();

            if (!retry) return res.status(404).send("Pokemon not found");

            return res.send({
                ...retry,
                isFavorite: !!retry.isFavorite
            });
        }

        res.send({
            ...pokemon,
            isFavorite: !!pokemon.isFavorite
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching pokemon");
    }
});

// Get Single Pokemon
pokemonRouter.get("/:id", auth, async (req, res) => {
    try {
        const userId = (req as CustomRequest).token ? (req as CustomRequest).token.id : null;
        const pokemonId = parseInt(req.params.id);

        if (isNaN(pokemonId)) {
            return res.status(400).send("Invalid ID");
        }

        const pokemon = await db.select({
            id: pokemons.id,
            numPokedex: pokemons.numPokedex,
            nome: pokemons.nome,
            sprite: pokemons.sprite,
            isFavorite: userFavorites.pokemonId
        })
            .from(pokemons)
            .leftJoin(userFavorites, and(eq(userFavorites.pokemonId, pokemons.id), eq(userFavorites.userId, userId || 0)))
            .where(eq(pokemons.id, pokemonId))
            .get();

        if (!pokemon) {
            return res.status(404).send("Pokemon not found");
        }

        res.send({
            ...pokemon,
            isFavorite: !!pokemon.isFavorite
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching pokemon");
    }
});

// List Favorites - MOVEDUP
pokemonRouter.get("/favorites", auth, async (req, res) => {
    try {
        const userId = (req as CustomRequest).token ? (req as CustomRequest).token.id : null;
        if (!userId) return res.status(401).send();

        // Join query to get actual pokemon data
        const favorites = await db.select({
            id: pokemons.id,
            numPokedex: pokemons.numPokedex,
            nome: pokemons.nome,
            sprite: pokemons.sprite
        })
            .from(userFavorites)
            .innerJoin(pokemons, eq(userFavorites.pokemonId, pokemons.id))
            .where(eq(userFavorites.userId, userId))
            .all();

        res.send(favorites);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching favorites");
    }
});

// Toggle Favorite - MOVEDUP
pokemonRouter.post("/favorite", auth, async (req, res) => {
    try {
        const { pokemonId } = req.body;
        const userId = (req as CustomRequest).token ? (req as CustomRequest).token.id : null;

        if (!userId || !pokemonId) {
            return res.status(400).send("Invalid Request");
        }

        const existing = await db.select()
            .from(userFavorites)
            .where(and(eq(userFavorites.userId, userId), eq(userFavorites.pokemonId, pokemonId)))
            .get();

        if (existing) {
            await db.delete(userFavorites)
                .where(and(eq(userFavorites.userId, userId), eq(userFavorites.pokemonId, pokemonId)));
            return res.send({ message: "Removed from favorites", isFavorite: false });
        } else {
            await db.insert(userFavorites).values({ userId, pokemonId });
            return res.send({ message: "Added to favorites", isFavorite: true });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Error toggling favorite");
    }
});
