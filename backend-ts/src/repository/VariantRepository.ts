import { Op } from 'sequelize';
import { Variant, VariantAttributes, VariantCreationAttributes } from '../models/Variant';

export class VariantRepository {
  // Get all variants from database
  async findAll(search?: string): Promise<Variant[]> {
    const whereClause: any = {};
    
    if (search) {
      whereClause.gene = { [Op.iLike]: `%${search}%` };
    }

    return await Variant.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
    });
  }

  // Get variant by ID from database
  async findById(id: number): Promise<Variant | null> {
    return await Variant.findByPk(id);
  }

  // Create variant 
  async create(variantData: VariantCreationAttributes): Promise<Variant> {
    return await Variant.create(variantData);
  }

 // Update variant 
  async update(id: number, variantData: Partial<VariantAttributes>): Promise<Variant | null> {
    const variant = await Variant.findByPk(id);
    if (!variant) {
      return null;
    }
    
    return await variant.update(variantData);
  }

  // Delete Variant
  async delete(id: number): Promise<boolean> {
    const variant = await Variant.findByPk(id);
    if (!variant) {
      return false;
    }
    
    await variant.destroy();
    return true;
  }
} 