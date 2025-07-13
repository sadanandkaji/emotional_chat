// types/AuthenticatedRequest.ts
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  id: string; // The user ID added by middleware
}
