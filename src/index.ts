import { Elysia, t } from 'elysia'; 
import { html } from '@elysiajs/html';
import { MongoClient } from 'mongodb';
import { readFileSync, existsSync } from 'fs';

let config = { 
    mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/guestbook", 
    collectionName: process.env.COLLECTION_NAME || "messages" 
};

let collection: any;
let isLocalFallback = false;
let isMockMode = false;

try {
    const client = new MongoClient(config.mongoUri);
    console.log(`Attempting to connect to Remote MongoDB...`);
    await client.connect();
    collection = client.db().collection(config.collectionName);
    console.log(" Connected successfully to Remote MongoDB!");
} catch (err: any) {
    console.error(" Remote MongoDB connection failed.");
    console.error("Error Message:", err.message);
    console.log(" Attempting to connect to Local MongoDB (127.0.0.1:27017)...");
    
    try {
        const localClient = new MongoClient("mongodb://127.0.0.1:27017/guestbook");
        await localClient.connect();
        collection = localClient.db().collection(config.collectionName);
        isLocalFallback = true;
        console.log(" Connected to Local MongoDB fallback!");
    } catch (localErr) {
        console.error(" Local MongoDB also failed.");
        console.log(" Starting in MOCK MODE (In-memory storage). Data will not be saved permanently.");
        isMockMode = true;
        
        // Mock collection implementation
        const mockData: any[] = [{ name: "System", message: "Database offline. Running in temporary memory mode.", date: new Date().toLocaleString() }];
        collection = {
            find: () => ({ sort: () => ({ toArray: async () => [...mockData].reverse() }) }),
            insertOne: async (doc: any) => { mockData.push(doc); return { acknowledged: true }; }
        };
    }
}

const app = new Elysia()
    .use(html())
    .get("/", async () => {
        const allMyGifts = await collection.find({}).sort({ _id: -1 }).toArray();
        const sparklyContent = allMyGifts.map((gift: any) => `
            <div style="border-bottom: 1px dashed #7fb82a; margin-bottom: 10px; padding-bottom: 5px;">
                <strong>${gift.name}</strong> <small style="opacity:0.6;">(${gift.date})</small><br>
                ${gift.message}
            </div>
        `).join('') || "No messages yet... be the first!";

        let statusBanner = '';
        if (isMockMode) {
            statusBanner = '<div style="background: #f8d7da; color: #721c24; padding: 10px; margin-bottom: 20px; border: 1px solid #f5c6cb; border-radius: 4px;">🛑 <strong>Mock Mode:</strong> Database connection failed. Messages are only saved in temporary memory.</div>';
        } else if (isLocalFallback) {
            statusBanner = '<div style="background: #fff3cd; color: #856404; padding: 10px; margin-bottom: 20px; border: 1px solid #ffeeba; border-radius: 4px;">⚠️ <strong>Local Fallback:</strong> Remote Atlas connection failed. Using local database.</div>';
        }

        return ` <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>chicomint's guestbook</title>
               <link rel="shortcut icon" type="image/x-icon" href="media/chiki.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta charset="utf-8">
            <link rel="stylesheet" href="https://chiko.cc/style.css?v=1.5">
            <link rel="stylesheet" href="https://chiko.cc/sakura.css" media="screen" />
            <link rel="stylesheet" href="https://chiko.cc/sakura-dark.css" media="screen and (prefers-color-scheme: dark)" />
        </head>
        <body>
            ${statusBanner}
            <div class="sky">
                <img src="https://chiko.cc/media/star.png" class="falling-star" style="left: 10%;">
                <img src="https://chiko.cc/media/star.png" class="falling-star" style="left: 30%;">
                <img src="https://chiko.cc/media/star.png" class="falling-star" style="left: 50%;">
                <img src="https://chiko.cc/media/star.png" class="falling-star" style="left: 70%;">
                <img src="https://chiko.cc/media/star.png" class="falling-star" style="left: 90%;">
            </div>

            <h1>Chicomint~!/Guestbook</h1>
            <a href="https://chiko.cc/">| Go to homepage |</a>
            <hr>

            <fieldset>
                <legend>Sign the Book</legend>
                <form action="/submit" method="POST">
                    <label>Name:</label>
                    <input type="text" name="name" placeholder="Who are you?" required><br>
                    <label>Message:</label>
                    <textarea name="message" rows="4" placeholder="Say something." required></textarea><br>
                    <button type="submit">Post Entry</button>
                </form>
            </fieldset>
            <br>

            <div id="entries">
                 <div class="msg-card">
                    <span style="background:#7fb82a; color:white; padding:2px 5px; display:block; margin:-10px -10px 10px -10px;">Messages</span>
                    ${sparklyContent} 
                </div>
            </div>

            <footer>
                <hr>
                <p style="animation: opacityPulse 2s ease-out; animation-iteration-count: infinite; opacity: 1; color: rgb(81, 147, 31);">
                    @Chicomint 2022-untill i die <3 
                </p>
            </footer>
        </body>
        </html>`; 
    })
    .post("/submit", async ({ body, redirect }: { body: any, redirect: any }) => {
        await collection.insertOne({ 
            name: body.name?.toString().replace(/<[^>]*>/g, "") || "Secret Friend", 
            message: body.message?.toString().replace(/<[^>]*>/g, "") || "Miau~", 
            date: new Date().toLocaleString() 
        });
        return redirect("/");
    })
    .listen(process.env.PORT || 8080, ({ hostname, port }) => {
        console.log(` is running at http://${hostname}:${port}`);
    });
