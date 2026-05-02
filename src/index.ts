import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { writeFileSync, readFileSync, existsSync } from 'fs';

const SWEET_MEMORY_JAR = 'messages.json';

if (!existsSync(SWEET_MEMORY_JAR)) {
    writeFileSync(SWEET_MEMORY_JAR, JSON.stringify([]));
}

const app = new Elysia()
    .use(html())
    .get("/", () => {
        const allMyGifts: any[] = JSON.parse(readFileSync(SWEET_MEMORY_JAR, 'utf8'));
        
        const sparklyContent = allMyGifts.map((gift: any) => `
            <div style="border-bottom: 1px dashed #7fb82a; margin-bottom: 10px; padding-bottom: 5px;">
                <strong>${gift.name}</strong> <small style="opacity:0.6;">(${gift.date})</small><br>
                ${gift.message}
            </div>
        `).join('') || "No messages yet... be the first!";

        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>chicomint's guestbook</title>
            <meta charset="utf-8">
            <link rel="stylesheet" href="https://chiko.cc/style.css?v=1.5">
        </head>
        <body>
            <h1>Chicomint~!/Guestbook</h1>
            <fieldset>
                <legend>Sign the Book</legend>
                <form action="/submit" method="POST">
                    <input type="text" name="name" placeholder="Who are you?" required><br>
                    <textarea name="message" placeholder="Say something." required></textarea><br>
                    <button type="submit">Post Entry</button>
                </form>
            </fieldset>
            <div id="entries">
                 <div class="msg-card">
                    <span style="background:#7fb82a; color:white;">Messages</span>
                    ${sparklyContent} 
                </div>
            </div>
        </body>
        </html>`;
    })
    .post("/submit", ({ body, redirect }: { body: any, redirect: any }) => { 
        const bffName = body.name?.toString().replace(/<[^>]*>/g, "") || "Secret Friend";
        const sweetSecret = body.message?.toString().replace(/<[^>]*>/g, "") || "Miau~";

        const diaryEntries = JSON.parse(readFileSync(SWEET_MEMORY_JAR, 'utf8'));
        diaryEntries.unshift({ 
            name: bffName, 
            message: sweetSecret, 
            date: new Date().toLocaleString() 
        });
        
        writeFileSync(SWEET_MEMORY_JAR, JSON.stringify(diaryEntries));

        return redirect("/"); 
    })
    .listen(process.env.PORT || 8080);

console.log(`at port ${app.server?.port}`);