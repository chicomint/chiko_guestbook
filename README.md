#  Chicomint's Guestbook (MongoDB Edition)

A guestbook system built with **Bun**, **ElysiaJS**, and **MongoDB**.

![Guestbook Preview](1.png)

## Features
- **Smart Database Fallback:**
  -  **Remote:** Connects to MongoDB Atlas.
  -  **Local:** Automatically falls back to local MongoDB if Atlas is offline.
  -  **Mock Mode:** Runs in-memory if no database is found (perfect for quick tests!).
- **Safe Input:** Basic HTML tag stripping to prevent XSS.
- **Cute Aesthetics:** Integrated with custom CSS and "falling star" animations.

---

## Quick Start

### 1. Install Dependencies
Make sure you have [Bun](https://bun.sh) installed.
```bash
bun install
```

### 2. Configure MongoDB
Open `config.json` and enter your connection details:
```json
{
  "mongoUri": "your_mongodb_connection_string",
  "collectionName": "messages"
}
```
*Note: If you use MongoDB Atlas, use the "Standard Connection String" if you encounter DNS issues.*

### 3. Run the App
```bash
bun run src/index.ts
```
The app will be available at **`http://localhost:8080`**.

---

## Troubleshooting

### "Authentication Failed"
- Double-check your username and password in `config.json`.
- Ensure the user has `atlasAdmin` or `readWrite` permissions in the MongoDB Atlas dashboard.

### "DNS Error / ECONNREFUSED"
- This happens if your network blocks SRV records.
- **Fix:** Use the long connection string (e.g., `mongodb://user:pass@shard-00-00...`) instead of the `mongodb+srv://` version.

### "Running in Mock Mode"
- This means the app couldn't reach Atlas OR a local MongoDB.
- Check your internet connection or start your local MongoDB service.
- Messages sent in Mock Mode are **temporary** and will be lost when the server stops.

---

## Project Structure
- `src/index.ts`: The main server logic & database handling.
- `config.json`: Database credentials (do not share this publicly!).

---

