import express from "express";
import { db } from "../db";
import { pokemons, userFavorites } from "../db/schema";
import { auth, CustomRequest } from "../middleware/auth";
import { and, eq } from "drizzle-orm";

export const pokemonRouter = express.Router();

// Rota protegida para buscar pokémons
pokemonRouter.get("/", auth, async (req, res) => {
    try {
        const token = (req as CustomRequest).token;
        const userId = (token && typeof token !== 'string') ? token.id : null;

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

        const result = allPokemon.map(p => ({
            ...p,
            isFavorite: !!p.isFavorite
        }));

        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar pokémon");
    }
});

// Lista favoritos
pokemonRouter.get("/favorites", auth, async (req, res) => {
    try {
        const token = (req as CustomRequest).token;
        const userId = (token && typeof token !== 'string') ? token.id : null;
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
        res.status(500).send("Erro ao buscar favoritos");
    }
});

// Alternar favorito
pokemonRouter.post("/favorite", auth, async (req, res) => {
    try {
        const { pokemonId } = req.body;
        const token = (req as CustomRequest).token;
        const userId = (token && typeof token !== 'string') ? token.id : null;

        if (!userId || !pokemonId) {
            return res.status(400).send("Requisição inválida");
        }

        const existing = await db.select()
            .from(userFavorites)
            .where(and(eq(userFavorites.userId, userId), eq(userFavorites.pokemonId, pokemonId)))
            .get();

        if (existing) {
            await db.delete(userFavorites)
                .where(and(eq(userFavorites.userId, userId), eq(userFavorites.pokemonId, pokemonId)));
            return res.send({ message: "Removido dos favoritos", isFavorite: false });
        } else {
            await db.insert(userFavorites).values({ userId, pokemonId });
            return res.send({ message: "Adicionado aos favoritos", isFavorite: true });
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao alterar favorito");
    }
});

// Busca Pokémon por nome
pokemonRouter.get("/name/:name", auth, async (req, res) => {
    try {
        const token = (req as CustomRequest).token;
        const userId = (token && typeof token !== 'string') ? token.id : null;
        const pokemonName = req.params.name.trim();

        let pokemon = await db.select({
            id: pokemons.id,
            numPokedex: pokemons.numPokedex,
            nome: pokemons.nome,
            sprite: pokemons.sprite,
            isFavorite: userFavorites.pokemonId
        })
            .from(pokemons)
            .leftJoin(userFavorites, and(eq(userFavorites.pokemonId, pokemons.id), eq(userFavorites.userId, userId || 0)))
            .where(eq(pokemons.nome, pokemonName))
            .get();

        if (!pokemon) {
            const capitalized = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1).toLowerCase();
            pokemon = await db.select({
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
        }

        if (!pokemon) {
            return res.status(404).send("Pokémon não encontrado");
        }

        res.send({
            ...pokemon,
            isFavorite: !!pokemon.isFavorite
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar pokémon");
    }
});

// Busca Pokémon por ID
pokemonRouter.get("/:id", auth, async (req, res) => {
    try {
        const token = (req as CustomRequest).token;
        const userId = (token && typeof token !== 'string') ? token.id : null;
        const pokemonId = parseInt(req.params.id);

        if (isNaN(pokemonId)) {
            return res.status(400).send("ID inválido");
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
            return res.status(404).send("Pokémon não encontrado");
        }

        res.send({
            ...pokemon,
            isFavorite: !!pokemon.isFavorite
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar pokémon");
    }
});
