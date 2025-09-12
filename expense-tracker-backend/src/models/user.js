import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../db.js";

const User = sequelize.define("User", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  darkMode: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: "users",
  timestamps: true,
});

// Hook avant création pour hasher le mot de passe
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

// Méthode d'instance pour vérifier le mot de passe
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default User;
