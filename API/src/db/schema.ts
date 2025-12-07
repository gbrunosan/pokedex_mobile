import { sqliteTable, integer, text, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
});

export const pokemons = sqliteTable("pokemons", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    numPokedex: text("numPokedex").notNull(), // Storing as string to keep "#001" format
    nome: text("nome").notNull(),
    sprite: text("sprite").notNull(),
});

export const userFavorites = sqliteTable("user_favorites", {
    userId: integer("user_id").notNull().references(() => users.id),
    pokemonId: integer("pokemon_id").notNull().references(() => pokemons.id),
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.pokemonId] }),
}));
