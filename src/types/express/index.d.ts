import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        role: string;
      };
    }
  }
}
