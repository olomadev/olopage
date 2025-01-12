import { DataTypes } from "sequelize";
import { sequelize } from "../db"; // Database connection

export const User = sequelize.define("User", {
  userId: {
    type: DataTypes.STRING(36), // CHAR(36) in database
    primaryKey: true, // userId is the primary key
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(160), // VARCHAR(160) in database
    allowNull: false,
    unique: true, // Email must be unique
  },
  password: {
    type: DataTypes.STRING(255), // VARCHAR(255) in database
    allowNull: false,
  },
  firstname: {
    type: DataTypes.STRING(120), // VARCHAR(120) in database
    allowNull: true,
  },
  lastname: {
    type: DataTypes.STRING(120), // VARCHAR(120) in database
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE, // DATETIME in database
    defaultValue: DataTypes.NOW, // Default value is the current timestamp
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE, // DATETIME in database
    allowNull: true,
  },
  lastLogin: {
    type: DataTypes.DATE, // DATETIME in database
    allowNull: true,
  },
  active: {
    type: DataTypes.TINYINT, // TINYINT (1 byte) in database
    defaultValue: 1, // Default value is 1 (active)
    allowNull: false,
  },
  emailActivation: {
    type: DataTypes.TINYINT, // TINYINT (1 byte) in database
    defaultValue: 0, // Default value is 0 (not activated)
    allowNull: false,
  },
  locale: {
    type: DataTypes.STRING(2), // CHAR(2) in database
    allowNull: true,
  },
  themeColor: {
    type: DataTypes.STRING(7), // CHAR(7) in database (usually for color codes like '#FFFFFF')
    allowNull: true,
  },
}, {
  // Optional: Control automatic date fields
  timestamps: false, // We manage createdAt and updatedAt manually
});

// Define the reverse relationship
User.hasMany(Post, { foreignKey: 'userId' });