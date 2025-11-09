import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { auth } from "./middleware/auth";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// CORS
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:3000"]),
    credentials: true,
  })
);
app.use(express.json());

// Health
app.get("/health", (_req, res) => {
  res.json({ ok: true, message: "API funcionando!" });
});

const registerSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Inclua 1 letra maiúscula")
    .regex(/[0-9]/, "Inclua 1 número")
    .regex(/[@$!%*?&]/, "Inclua 1 caractere especial (@$!%*?&)"),
  city: z.string().optional(),
  age: z.number().int().positive().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// gera token
function signToken(payload: { id: number; email: string }) {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

// Registrar
app.post("/auth/register", async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { name, email, password, city, age } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ error: "E-mail já cadastrado" });

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const hash = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: { name, email, password: hash, city, age },
    });

    const token = signToken({ id: user.id, email: user.email });
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, city: user.city, age: user.age, level: user.level },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao registrar" });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });

    const token = signToken({ id: user.id, email: user.email });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, city: user.city, age: user.age, level: user.level },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro no login" });
  }
});

// Perfil autenticado
app.get("/me", auth, async (req, res) => {
  try {
    const me = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, city: true, age: true, level: true, createdAt: true },
    });
    res.json(me);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao obter perfil" });
  }
});

app.get("/items", async (_req, res) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true } } },
    });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar itens" });
  }
});

// Protegido: criar
app.post("/items", auth, async (req, res) => {
  try {
    const { title, description, type, imageUrl } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: "Campos obrigatórios: title, type" });
    }

    const item = await prisma.item.create({
      data: {
        title,
        description,
        type,
        imageUrl,
        userId: req.user!.id,
      },
    });

    res.status(201).json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao criar item" });
  }
});

const updateItemSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  type: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
  usageTime: z.string().optional().nullable(),
  reason: z.string().optional().nullable(),
  openToTrade: z.boolean().optional().nullable(),
  price: z.number().nonnegative().optional().nullable(),
});

app.put("/items/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });

    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: "Item não encontrado" });
    if (item.userId !== req.user!.id) return res.status(403).json({ error: "Sem permissão" });

    const parsed = updateItemSchema.safeParse(req.body);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const first =
        Object.values(flat.fieldErrors).flat()[0] ||
        flat.formErrors[0] ||
        "Dados inválidos.";
      return res.status(400).json({ error: first });
    }

    const updated = await prisma.item.update({
      where: { id },
      data: parsed.data,
    });

    res.json(updated);
  } catch (e) {
    console.error("Erro ao atualizar item:", e.message, e.stack);
  }
});

app.get("/test-db", async (_req, res) => {
  try {
    const items = await prisma.item.findMany({ take: 1 });
    res.json({ ok: true, count: items.length });
  } catch (e: any) {
    console.error("Erro DB:", e.message, e.stack);
    res.status(500).json({ error: e.message });
  }
});


const updateMeSchema = z.object({
  name: z.string().min(2, "Nome muito curto").optional(),
  city: z.string().optional().nullable(),
  age: z.number().int().positive().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(), // remova esta linha se não tiver o campo no Prisma
});

app.patch("/me", auth, async (req, res) => {
  try {
    const parsed = updateMeSchema.safeParse(req.body);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      const first =
        Object.values(flat.fieldErrors).flat()[0] ||
        flat.formErrors[0] ||
        "Dados inválidos.";
      return res.status(400).json({ error: first });
    }

    const data = parsed.data;

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        name: data.name ?? undefined,
        city: data.city ?? undefined,
        age: data.age ?? undefined,
      },
      select: {
        id: true, name: true, email: true, city: true, age: true,
        level: true, createdAt: true,
      },
    });

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

// Porta
const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
