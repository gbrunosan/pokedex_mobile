import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { SECRET_KEY } from "../middleware/auth";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Email e senha são obrigatórios");
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        await db.insert(users).values({
            email,
            password: hashedPassword,
        });

        res.status(201).send("Usuário registrado com sucesso");
    } catch (error: any) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(400).send("Email já está em uso");
        }
        res.status(500).send("Erro ao registrar usuário");
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.select().from(users).where(eq(users.email, email)).get();

        if (!user) {
            return res.status(400).send("Credenciais de login inválidas");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send("Credenciais de login inválidas");
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
            expiresIn: "1h",
        });

        res.send({ user: { id: user.id, email: user.email }, token });
    } catch (error) {
        res.status(500).send("Erro ao fazer login");
    }
});
