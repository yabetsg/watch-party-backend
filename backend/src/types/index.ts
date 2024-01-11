import Jwt from "jsonwebtoken";
import { Request } from "express";

export interface CustomRequest extends Request {
  token?: string;
  user?: string | Jwt.JwtPayload | undefined;
  partyInfo?: {
    partyID: string;
    participants: number;
    videoID?: string | null | undefined;
  };
}

export interface Message {
  messageID: string;
  user: string;
  content: string;
  timestamp: number;
}
