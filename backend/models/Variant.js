const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * Variant Model
 */
const Variant = sequelize.define(
  "Variant",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    gene: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
      comment: "Gene name (e.g., BRCA1, TP53)",
    },
    variant_type: {
      type: DataTypes.ENUM("SNV", "INDEL", "CNV", "SV"),
      allowNull: false,
    },
    clinical_significance: {
      type: DataTypes.ENUM(
        "Pathogenic",
        "Likely_Pathogenic",
        "VUS",
        "Likely_Benign",
        "Benign"
      ),
      allowNull: false,
    },
    chromosome: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    position: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    reference_allele: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    alternate_allele: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "variants",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["gene"],
      },
      {
        fields: ["variant_type"],
      },
      {
        fields: ["clinical_significance"],
      },
      {
        fields: ["chromosome", "position"],
      },
    ],
  }
);

module.exports = Variant;
