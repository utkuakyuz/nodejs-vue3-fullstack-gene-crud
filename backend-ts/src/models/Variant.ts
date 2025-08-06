import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// MY MOCK DATA INTERFACES AND REGISTRATION
export interface VariantAttributes {
  id: number;
  gene: string;
  variant_type: 'SNV' | 'INDEL' | 'CNV' | 'SV';
  clinical_significance: 'Pathogenic' | 'Likely_Pathogenic' | 'VUS' | 'Likely_Benign' | 'Benign';
  chromosome?: string;
  position?: number;
  reference_allele?: string;
  alternate_allele?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface VariantCreationAttributes extends Optional<VariantAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class Variant extends Model<VariantAttributes, VariantCreationAttributes> implements VariantAttributes {
  public id!: number;
  public gene!: string;
  public variant_type!: 'SNV' | 'INDEL' | 'CNV' | 'SV';
  public clinical_significance!: 'Pathogenic' | 'Likely_Pathogenic' | 'VUS' | 'Likely_Benign' | 'Benign';
  public chromosome?: string;
  public position?: number;
  public reference_allele?: string;
  public alternate_allele?: string;
  public description?: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Variant.init(
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
      comment: 'Gene name (e.g., BRCA1, TP53)',
    },
    variant_type: {
      type: DataTypes.ENUM('SNV', 'INDEL', 'CNV', 'SV'),
      allowNull: false,
    },
    clinical_significance: {
      type: DataTypes.ENUM('Pathogenic', 'Likely_Pathogenic', 'VUS', 'Likely_Benign', 'Benign'),
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
    sequelize,
    tableName: 'variants',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        fields: ['gene'],
      },
      {
        fields: ['variant_type'],
      },
      {
        fields: ['clinical_significance'],
      },
      {
        fields: ['chromosome', 'position'],
      },
    ],
  }
); 