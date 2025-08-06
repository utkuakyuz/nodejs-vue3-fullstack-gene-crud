const Variant = require("../models/Variant");
const { Op } = require("sequelize");

class VariantController {
  // Get all variants
  async getAllVariants(req, res) {
    try {
      const { search } = req.query;
      let whereClause = {};
      if (search) {
        whereClause.gene = { [Op.iLike]: `%${search}%` };
      }

      const variants = await Variant.findAll({
        where: whereClause,
        order: [["created_at", "DESC"]],
      });

      res.json({
        success: true,
        data: variants,
      });
    } catch (error) {
      console.error("Error fetching variants:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  // Get single variant
  async getVariantById(req, res) {
    try {
      const { id } = req.params;
      const variant = await Variant.findByPk(id);

      if (!variant) {
        return res.status(404).json({
          success: false,
          message: "Variant not found",
        });
      }

      res.json({
        success: true,
        data: variant,
      });
    } catch (error) {
      console.error("Error fetching variant:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  // Create new variant
  async createVariant(req, res) {
    try {
      const variantData = req.body;

      if (
        !variantData.gene ||
        !variantData.variant_type ||
        !variantData.clinical_significance
      ) {
        return res.status(400).json({
          success: false,
          message: "Gene, variant type, and clinical significance are required",
        });
      }

      const variant = await Variant.create(variantData);

      res.status(201).json({
        success: true,
        message: "Variant created",
        data: variant,
      });
    } catch (error) {
      console.error("Error creating variant:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  // Delete variant
  async deleteVariant(req, res) {
    try {
      const { id } = req.params;
      const variant = await Variant.findByPk(id);

      if (!variant) {
        return res.status(404).json({
          success: false,
          message: "Variant not found",
        });
      }

      await variant.destroy();

      res.json({
        success: true,
        message: "Variant deleted",
      });
    } catch (error) {
      console.error("Error deleting variant:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
}

module.exports = new VariantController();
