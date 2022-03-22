import { fileURLToPath } from "url";
import path from 'path';

export const __filename = u => fileURLToPath(u);
export const __dirname = u => path.dirname(__filename(u));
export const plur = (num, str, pluralStr) => {
    const pluralized = num === 1 ? str : (pluralStr ?? `${str}s`);
    return `${num} ${pluralized}`;
}