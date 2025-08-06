import { Request, Response} from 'express';

export default function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
): void {
  console.error('Error:', error);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
} 