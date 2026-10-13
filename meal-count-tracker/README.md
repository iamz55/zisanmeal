# Meal Count — Daily Tracker

A clean, responsive daily meal-count website that can be hosted with GitHub Pages.

## Important: know what this first version does

GitHub Pages hosts static files; it does not run a private server or securely authenticate admins. This starter project works in **local demo mode**:

- Everyone can open the page and browse the calendar.
- Demo admin login: **ID `admin` · password `meal123`**.
- Saved counts are stored only in the browser's local storage.
- The counts will **not** be shared with other visitors, browsers, or devices. Clearing browser data can erase them.
- The demo login is not secure. Anyone can inspect the public JavaScript and find the demo credentials. Do not use it to protect real data on a public site.

If you want exactly what you described—one shared public meal log, editable only after secure admin login—you need a backend/database with access rules. Supabase is one option. Never place a real admin password, service-role key, or other secret in `config.js` or any file deployed to GitHub Pages.

## Put it on GitHub

1. Download and unzip `meal-count-tracker.zip`.
2. Open your existing GitHub repository, or create a new repository.
3. Upload **the files inside the folder** (`index.html`, `style.css`, `app.js`, `config.js`, `README.md`) to the repository root. Do not upload only the ZIP.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Choose your branch (usually `main`) and folder `/ (root)`, then click **Save**.
7. Wait for the deployment and open the URL GitHub Pages provides.

## Change the demo password (local testing only)

Edit `config.js` and change `demoAdminId` and `demoAdminPassword`. This does **not** make the login secure for a public deployment.

## Design features

- Responsive layout for desktop and mobile
- Monthly calendar with selected-day detail
- Monthly total, average, and number of days recorded
- Admin-only edit controls in the current browser
- No framework or build step required

## Next step for a genuinely shared website

Connect Supabase (or another backend) and configure:
- a public read-only policy for meal counts
- admin authentication
- an admin-only insert/update/delete policy
- environment-safe public configuration

The frontend in this ZIP is deliberately labelled as a local demo instead of pretending browser-only login is secure.
