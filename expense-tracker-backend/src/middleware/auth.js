import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/index.js"; // Utiliser l'export centralisé Sequelize

dotenv.config();

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Non autorisé : token manquant" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Sequelize: findByPk retourne directement l'instance
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] }, // Exclure le mot de passe
    });

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
