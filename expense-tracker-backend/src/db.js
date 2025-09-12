// src/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Récupère l'URL de la DB depuis .env
const DATABASE_URL = process.env.DATABASE_URL || `sqlite:${path.join(__dirname, "..", "database.sqlite")}`;

// Configuration Sequelize
const sequelize = new Sequelize(DATABASE_URL, {
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  dialectOptions:
    DATABASE_URL.startsWith("postgres")
      ? { ssl: { require: process.env.DB_SSL === "true", rejectUnauthorized: false } }
      : {},
});

export default sequelize;
