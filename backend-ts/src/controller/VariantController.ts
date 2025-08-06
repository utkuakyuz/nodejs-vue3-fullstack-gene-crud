import { Request, Response, Router } from 'express';
import { VariantService } from '../service/VariantService';

export class VariantController {
  public router: Router;
  private variantService: VariantService;

  constructor() {
    this.router = Router();
    this.variantService = new VariantService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.getAllVariants.bind(this));
    this.router.get('/:id', this.getVariantById.bind(this));
    this.router.post('/', this.createVariant.bind(this));
    this.router.delete('/:id', this.deleteVariant.bind(this));
  }

  // Get variants
  private async getAllVariants(req: Request, res: Response): Promise<void> {
    try {
      const { search } = req.query;
      const variants = await this.variantService.getAllVariants(search as string);

      res.json({
        success: true,
        data: variants,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }

  // Get Variant by ID
  private async getVariantById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const variant = await this.variantService.getVariantById(parseInt(id));

      if (!variant) {
        res.status(404).json({
          success: false,
          message: 'Variant not found',
        });
        return;
      }

      res.json({
        success: true,
        data: variant,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }

  // Create Variant
  private async createVariant(req: Request, res: Response): Promise<void> {
    try {
      const variantData = req.body;
      const variant = await this.variantService.createVariant(variantData);

      res.status(201).json({
        success: true,
        message: 'Variant created',
        data: variant,
      });
    } catch (error) {      
      if (error instanceof Error && error.message.includes('required')) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }

  // Delete Variant
  private async deleteVariant(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.variantService.deleteVariant(parseInt(id));

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'deleted',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
      });
    }
  }
} 