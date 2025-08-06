const express = require("express");
const router = express.Router();
const variantController = require("../controllers/variantController");

// GET /api/variants - Get all variants
router.get("/", variantController.getAllVariants);

// GET /api/variants/:id - Get variant
router.get("/:id", variantController.getVariantById);

// POST /api/variants - Create variant
router.post("/", variantController.createVariant);

// DELETE /api/variants/:id - Delete variant
router.delete("/:id", variantController.deleteVariant);

module.exports = router;
