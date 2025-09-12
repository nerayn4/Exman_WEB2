import sequelize from "../db.js";
import User from "./user.js";
import Category from "./category.js";
import Expense from "./expense.js";
import Income from "./income.js";

// Associations
User.hasMany(Category, { foreignKey: "userId" });
Category.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(User, { foreignKey: "userId" });

Category.hasMany(Expense, { foreignKey: "categoryId" });
Expense.belongsTo(Category, { foreignKey: "categoryId" });

User.hasMany(Income, { foreignKey: "userId" });
Income.belongsTo(User, { foreignKey: "userId" });

export { sequelize, User, Category, Expense, Income };
