import { VariantRepository } from '../repository/VariantRepository';
import { Variant, VariantAttributes, VariantCreationAttributes } from '../models/Variant';

export class VariantService {
  private variantRepository: VariantRepository;

  constructor() {
    this.variantRepository = new VariantRepository();
  }

  // Call all variants from repository
  async getAllVariants(search?: string): Promise<Variant[]> {
    return await this.variantRepository.findAll(search);
  }

  // Get variant by ID from repository
  async getVariantById(id: number): Promise<Variant | null> {
    return await this.variantRepository.findById(id);
  }

  // Create Variant by repository
  async createVariant(variantData: VariantCreationAttributes): Promise<Variant> {
    if (!variantData.gene || !variantData.variant_type || !variantData.clinical_significance) {
      throw new Error('Gene, variant type, and clinical significance are required');
    }

    return await this.variantRepository.create(variantData);
  }

 // Update Variant by repository
  async updateVariant(id: number, variantData: Partial<VariantAttributes>): Promise<Variant | null> {
    const existingVariant = await this.variantRepository.findById(id);
    if (!existingVariant) {
      return null;
    }

    return await this.variantRepository.update(id, variantData);
  }

  // Delete Variant by repository
  async deleteVariant(id: number): Promise<boolean> {
    return await this.variantRepository.delete(id);
  }
} 