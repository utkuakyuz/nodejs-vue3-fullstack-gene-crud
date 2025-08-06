const { sequelize } = require("../config/database");
const Variant = require("../models/Variant");

 const seedData = [
  {
    gene: "GENE001",
    variant_type: "SNV",
    clinical_significance: "Pathogenic",
    chromosome: "1",
    position: 1000000,
    reference_allele: "A",
    alternate_allele: "T",
    description: "Test variant for gene 001",
  },
  {
    gene: "GENE002",
    variant_type: "INDEL",
    clinical_significance: "VUS",
    chromosome: "2",
    position: 2000000,
    reference_allele: "AT",
    alternate_allele: "A",
    description: "Sample variant for testing",
  },
  {
    gene: "GENE003",
    variant_type: "CNV",
    clinical_significance: "Benign",
    chromosome: "3",
    position: 3000000,
    reference_allele: "G",
    alternate_allele: "G",
    description: "Another test variant",
  },
  {
    gene: "GENE004",
    variant_type: "SNV",
    clinical_significance: "Likely_Pathogenic",
    chromosome: "4",
    position: 4000000,
    reference_allele: "C",
    alternate_allele: "G",
    description: "Mock variant data",
  },
];

const setupDatabase = async () => {
  try {
    console.log("Started Setting up DB");

    await sequelize.sync({ force: true }); // create tables


    console.log("SEED STARTING")
    await Variant.bulkCreate(seedData); // Seed data
    console.log("SEED ENDS NOW")

    const count = await Variant.count();
    console.log(`Total variants in database: ${count}`);

    console.log("DB setup completed!");
    process.exit(0);
  } catch (error) {
    console.error("DB Inıt failed:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase, seedData };
