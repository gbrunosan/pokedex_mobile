import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { pokemonRouter } from "./routes/pokemon";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/pokemon", pokemonRouter);

app.get("/", (req, res) => {
    res.send("API da Pokedex está rodando!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
