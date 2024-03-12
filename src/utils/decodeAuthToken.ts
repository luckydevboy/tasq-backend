import { Request } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  iat: number;
}

const decodeAuthToken = (req: Request) => {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = token ? jwt.decode(token) as JwtPayload : null;
    return decoded;
}

export default decodeAuthToken;