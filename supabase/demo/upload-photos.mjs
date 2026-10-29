// Upload of the demo recipe photos to Storage: files from `photos/` to the paths from `photos.json`
// (they match `photo_path` in `seed.json`). The owner runs it once when setting up
// the demo project; a repeated run overwrites the same objects.
//
// The project's secret key is needed: there are no write policies in the demo bucket, and an
// ordinary sign-in cannot upload a file. The key is passed only through an environment
// variable and is not stored anywhere.
//
//   SUPABASE_URL         https://<ref>.supabase.co
//   SUPABASE_SECRET_KEY  secret key of the demo project (sb_secret_...)

import { readFile } from "node:fs/promises";

const BUCKET = "recipe-photos";

const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const key = process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SECRET_KEY (see supabase/demo/DEPLOY.md).");
  process.exit(1);
}

const manifest = JSON.parse(await readFile(new URL("./photos.json", import.meta.url), "utf-8"));
let failed = 0;

for (const { file, path } of manifest) {
  const body = await readFile(new URL(`./photos/${file}`, import.meta.url));
  const response = await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "image/webp",
      "x-upsert": "true",
    },
    body,
  });

  if (response.ok) {
    console.log(`ok    ${file} -> ${path}`);
  } else {
    failed += 1;
    console.error(`ERROR ${file} -> ${path}: ${response.status} ${await response.text()}`);
  }
}

console.log(`Uploaded ${manifest.length - failed} of ${manifest.length}.`);
if (failed > 0) process.exit(1);
