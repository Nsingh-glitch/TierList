# Custom Tier List

A single-page tier-list editor with drag-and-drop cards, Supabase image storage, presentation mode, image export, clipboard copy, card shapes, board backgrounds, responsive controls, and local browser persistence.

## Run Locally

Open `custom_tier_list_fixed.html` in a browser, or serve the folder with any static web server:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080/custom_tier_list_fixed.html>.

A local server is recommended because clipboard image copying requires a secure browser context. HTTPS hosting works best.

## Configuration

The HTML file does not contain the Supabase values. They are read from the generated `config.js` file.

1. Copy `.env.example` to `.env`.
2. Put your Supabase project URL and publishable key in `.env`.
3. Generate the browser config:

```bash
node generate-config.mjs
```

The generated `config.js` is ignored by Git. Run the generation command during deployment before publishing the folder. `.env` and `config.js` must not be committed.

Because this is a browser app, a publishable Supabase key will still be visible in the deployed browser network/source files. This is expected. Do not use a secret or service-role key.

## Supabase Setup

The browser app uses the Supabase publishable key. It does not use a service-role key.

1. Create a Storage bucket named `tier-images`.
2. Make the bucket public so stored card and background images can be displayed.
3. Add Storage policies that allow the operations your app needs.

For a personal prototype without authentication, the minimum policies can allow public uploads and deletes, but this is not suitable for a multi-user production app because anyone with the public key could upload or delete files. Add authentication and user-scoped policies before sharing the app broadly.

For a production app:

- Require authenticated uploads.
- Store files under a user-specific path such as `user-id/file-name`.
- Allow users to delete only files they own.
- Keep the bucket public only if public image URLs are desired.
- Never put a Supabase service-role or secret key in this HTML file.

## Deploy

This is a static site. The included GitHub Pages workflow generates the browser config during deployment; other hosts can use the same `node generate-config.mjs` command.

### GitHub Pages

1. Push this repository to GitHub.
2. In repository **Settings > Secrets and variables > Actions**, add `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` as repository secrets.
3. In **Settings > Pages**, set the source to **GitHub Actions**.
4. Push to `main` or run the **Deploy tier list** workflow manually.
5. GitHub Actions generates `config.js`, creates `index.html`, and publishes the site.

### Netlify

1. Drag the project folder into Netlify, or connect the repository.
2. Add `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in the site environment variables.
3. Set the build command to `node generate-config.mjs`.
4. Use the project folder as the publish directory.
5. Rename the HTML file to `index.html` if you want the site to open at the root URL.

### Vercel

1. Import the repository into Vercel.
2. Choose **Other** or a static project configuration.
3. Add `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` as environment variables.
4. Set the build command to `node generate-config.mjs`.
5. Set the output directory to the project root.
6. Rename the HTML file to `index.html` for the root URL.

## Data Behavior

- Tier names, positions, card metadata, and settings are stored in the browser's `localStorage`.
- Uploaded card and background images are stored in Supabase Storage.
- Only image URLs are stored in localStorage; image files are not converted to Base64.
- Use **Save** to download a JSON backup and **Import** to restore one.
- Clearing browser storage removes the local tier-list state, so keep JSON backups for important lists.

## Limits

- Maximum 100 items per list.
- Maximum 5 MB per uploaded image.
- Maximum image dimensions: 4096 x 4096.
- Allowed uploads: JPEG, PNG, WebP, and GIF.
- Image URLs must use HTTPS.

## Main File Structure

The app intentionally remains one HTML file for simple static deployment:

- CSS at the top controls themes, layout, responsive behavior, sidebar, cards, and animations.
- The body contains the header, right-side action panel, settings, tier board, pool, and item form.
- The first script loads Lucide icons and Supabase's browser client.
- The main script manages local state, rendering, drag-and-drop, validation, Storage uploads, export, and persistence.

A future multi-file refactor could move CSS to `styles.css` and JavaScript to `app.js`, but it is not required for deployment and would introduce extra paths to manage.
