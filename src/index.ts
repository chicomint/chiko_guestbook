import { Elysia, t } from 'elysia'; // Added 't' for validation!
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

        return `<!DOCTYPE html><html>...your cute html here...</html>`; 
    })
    .post("/submit", ({ body, redirect }: { body: any, redirect: any }) => {
        const diaryEntries = JSON.parse(readFileSync(SWEET_MEMORY_JAR, 'utf8'));
        diaryEntries.unshift({ 
            name: body.name?.toString().replace(/<[^>]*>/g, "") || "Secret Friend", 
            message: body.message?.toString().replace(/<[^>]*>/g, "") || "Miau~", 
            date: new Date().toLocaleString() 
        });
        writeFileSync(SWEET_MEMORY_JAR, JSON.stringify(diaryEntries));
        return redirect("/");
    })
    .listen(process.env.PORT || 8080);