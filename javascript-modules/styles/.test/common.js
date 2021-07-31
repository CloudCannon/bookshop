import { fileURLToPath } from "url";
import path from 'path';

global.__filename = u => fileURLToPath(u);
global.__dirname = u => path.dirname(__filename(u));
