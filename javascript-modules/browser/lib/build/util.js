import { fileURLToPath } from "url";
import path from 'path';

export const __filename = u => fileURLToPath(u);
export const __dirname = u => path.dirname(__filename(u));
