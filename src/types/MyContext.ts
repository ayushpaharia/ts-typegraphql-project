import { Request, Response } from "express";

export interface MyContext {
  req: Request;
  res: Response;
}

// Add userId to out SessionData object
declare module "express-session" {
  interface SessionData {
    userId: string | number | null;
  }
}
