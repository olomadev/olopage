import { DataTypes } from "sequelize";
import { sequelize } from "../db"; // Database connection

export const Post = sequelize.define("Post", {
  postId: {
    type: DataTypes.STRING(36), // CHAR(36) in database
    primaryKey: true, // postId is the primary key
    allowNull: false,
  },
  authorId: {
    type: DataTypes.STRING(36), // CHAR(36) in database
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(220), // VARCHAR(220) in database
    allowNull: false,
  },
  permalink: {
    type: DataTypes.STRING(255), // VARCHAR(255) in database
    allowNull: false,
    unique: true, // Permalink must be unique
  },
  description: {
    type: DataTypes.STRING(255), // VARCHAR(255) in database
    allowNull: true,
  },
  contentJson: {
    type: DataTypes.TEXT, // LONGTEXT in database
    allowNull: true,
  },
  contentHtml: {
    type: DataTypes.TEXT, // LONGTEXT in database
    allowNull: true,
  },
  featuredImageId: {
    type: DataTypes.STRING(36), // CHAR(36) in database
    allowNull: true,
  },
  publishStatus: {
    type: DataTypes.ENUM('published', 'pending', 'draft'), // ENUM type
    defaultValue: 'pending', // Default value for publishStatus
    allowNull: false,
  },
  publishedAt: {
    type: DataTypes.DATE, // DATETIME in database
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE, // DATETIME in database
    defaultValue: DataTypes.NOW, // Default value: current timestamp
    allowNull: false,
  },
}, {
  // Optional: Control automatic date fields
  timestamps: false, // Disable automatic management of createdAt and updatedAt
});

Post.belongsTo(User, { foreignKey: 'userId' });
