import { Elysia, t } from 'elysia'; 
import { html } from '@elysiajs/html';
import { MongoClient } from 'mongodb';
import { readFileSync, existsSync } from 'fs';

let config = { mongoUri: "mongodb://127.0.0.1:27017/guestbook", collectionName: "messages" };
if (existsSync('config.json')) {
    config = JSON.parse(readFileSync('config.json', 'utf8'));
}

const client = new MongoClient(config.mongoUri);
const db = client.db();
const collection = db.collection(config.collectionName);

await client.connect();
console.log("Connected to MongoDB!");

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

        return ` <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>chicomint's guestbook</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta charset="utf-8">
            <link rel="stylesheet" href="https://chiko.cc/style.css?v=1.5">
            <link rel="stylesheet" href="https://chiko.cc/sakura.css" media="screen" />
            <link rel="stylesheet" href="https://chiko.cc/sakura-dark.css" media="screen and (prefers-color-scheme: dark)" />
        </head>
        <body>
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
    .listen(process.env.PORT || 8080);