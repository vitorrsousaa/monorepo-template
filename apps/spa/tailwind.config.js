import baseConfig from "@repo/ui/tailwind.config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('tailwindcss').Config} */
const config = {
  ...baseConfig,
  content: [
    // Arquivos do SPA
    "./src/**/*.{ts,tsx,js,jsx}",
    // Componentes do pacote UI
    path.resolve(__dirname, "../../packages/ui/src/components/**/*.{ts,tsx}"),
  ],
};

export default config;
