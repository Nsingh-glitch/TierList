import { readFile, writeFile } from "node:fs/promises";

let env = "";
try {
  env = await readFile(".env", "utf8");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const values = {};

for (const line of env.split(/\r?\n/)) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match) values[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
}

values.SUPABASE_URL = process.env.SUPABASE_URL || values.SUPABASE_URL;
values.SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || values.SUPABASE_PUBLISHABLE_KEY;

if (!values.SUPABASE_URL || !values.SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(".env must define SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY");
}

const config = `window.APP_CONFIG=${JSON.stringify({
  supabaseUrl: values.SUPABASE_URL,
  supabaseKey: values.SUPABASE_PUBLISHABLE_KEY
})};\n`;

await writeFile("config.js", config, "utf8");
console.log("Generated config.js");
