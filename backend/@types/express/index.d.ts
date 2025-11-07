/**
 * Express type extensions
 */

import { JwtPayload } from '../../src/types/auth';

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
      userId?: number;
      userEmail?: string;
    }
  }
}

export {};
