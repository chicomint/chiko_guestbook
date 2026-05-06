#  Chicomint's Guestbook 

A guestbook system built with **Bun**, **ElysiaJS**, and **MongoDB**.<br>
<p>for my site! :3</p>
<img src="1.png"  width="300" height="300"></img>
<img src="2.png"  width="300" height="300"></img>
## Quick Start

### 1. Install Dependencies
Make sure you have [Bun](https://bun.sh) installed.
```bash
bun install
```

### 2. Configure Environment
Create a `.env` file (one has been created for you) and enter your details:
```env
MONGO_URI="your_mongodb_connection_string"
COLLECTION_NAME="messages"
PORT=8080
```
*Note: If you use MongoDB Atlas, use the "Standard Connection String" if you encounter DNS issues.*

### 3. Run the App
```bash
bun run src/index.ts
```
The app will be available at **`http://localhost:8080`**.
---
