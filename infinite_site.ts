import { GoogleGenAI } from "@google/genai";

// It's a good practice to use a more stable temperature for generating code/HTML.
// 1.5 is very high and can lead to malformed output. Let's use 1.0.
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_KEY});

// Let's create a more robust prompt that tells the AI to continue the document.
const headTemplate = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="/tailwind.js"></script>
        <title>Infinite Pages</title>
    </head>
    <body class="bg-gray-100 text-gray-800 font-sans">`;

const promptPrefix = `You are an expert web developer creating a page for an "infinitely" generated website.
Your task is to continue the HTML document provided below.

**Instructions:**
- The response MUST start directly with the content for the <body>. Do NOT include <!DOCTYPE>, <html>, <head>, or <body> tags.
- Use Tailwind CSS for all styling, loaded from "/tailwind.js".
- Make the page visually engaging and well-structured. Use semantic HTML5 tags like <main>, <header>, <nav>, <section>, <article>, <footer>.
- Include navigation links to other potential pages on the site (e.g., '/about', '/products', '/contact').
- If images are needed, use placeholder URLs like '/images/a-descriptive-image-name.jpg?w=1200&h=800'. Use jpg or png.
- Your response will be streamed directly into the page, so only output the raw HTML content for the body.
- End your response naturally. The server will add the closing </body> and </html> tags.

**Plan for the requested URL:**
Before you start the HTML, provide a brief plan for the page layout, content, and unique visual elements you'll use. Enclose this plan in XML comments like this: <!-- ... plan here ... -->

**Continue the HTML for the requested URL below:**
Requested URL: `;


function encodePathname(pathname: string) {
    let res = "_F_";
    for(const char of [...pathname]) {
        if(char.codePointAt(0)! >= 'a'.codePointAt(0)! && char.codePointAt(0)! <= 'z'.codePointAt(0)!) {
            res += char;
        }else{
            res += "_" + char.codePointAt(0)!.toString(16)+"_";
        }
    }
    return res;
}

let running = false;
export async function infiniteSiteFetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    if(url.pathname.endsWith("/")) url.pathname = url.pathname.slice(0, -1);
    const fullPath = url.pathname + url.search;
    const encodedPathname = encodePathname(fullPath);

    // Asset handling remains the same
    if(url.pathname === "/tailwind.js") return new Response(Bun.file("tailwind.js"), {status: 200});
    if(url.pathname.includes(".jpg") || url.pathname.includes(".png")) {
        let w = url.searchParams.get("w") ?? "1000";
        let h = url.searchParams.get("h") ?? "600";
        return Response.redirect("https://picsum.photos/seed/"+encodedPathname+"/"+w+"/"+h);
    }
    if(url.pathname.includes(".") && !url.pathname.includes(".aspx") && !url.pathname.includes(".md") && !url.pathname.includes(".php")) return new Response("ok", {status: 200});

    if(await Bun.file("generated/"+encodedPathname).exists()) {
        console.log(`Serving cached file: ${encodedPathname}`);
        return new Response(Bun.file("generated/"+encodedPathname), {status: 200, headers: {"Content-Type": "text/html; charset=utf-8"}});
    }
    
    // The "running" check now needs to be inside the stream, but we can keep a simple one here.
    if(running) return new Response("Server is busy generating another page, please try again shortly.", {status: 503});

    const prompt = promptPrefix + fullPath;
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
        async start(controller) {
            if (running) {
                controller.enqueue(encoder.encode("Server is busy, stream cancelled."));
                controller.close();
                return;
            }
            running = true;
            console.log("Stream started. Generating content for:", fullPath);

            try {
                // --- KEY CHANGE 1: Send the initial HTML head immediately ---
                // This sends the first bytes to the browser, preventing a timeout.
                controller.enqueue(encoder.encode(headTemplate));

                // --- KEY CHANGE 2: Call the AI API from *inside* the stream ---
                const generationStream = await ai.models.generateContentStream({
                    model: "gemini-2.5-pro",
                    contents: prompt,
                });

                console.log("\n\n====AI RESPONSE STREAM STARTED====\n");
                let fullResponseText = "";

                // --- KEY CHANGE 3: Simplified stream processing ---
                // No need to look for <!DOCTYPE>. Just send the text as it comes.
                for await (const chunk of generationStream) {
                    const chunkText = chunk.text;
                    if (chunkText) {
                        process.stdout.write(chunkText); // Log progress to console
                        controller.enqueue(encoder.encode(chunkText));
                        fullResponseText += chunkText;
                    }
                }
                
                // --- KEY CHANGE 4: Manually add closing tags ---
                // This ensures the HTML is always valid, even if the AI forgets.
                const closingTags = "\n</body>\n</html>";
                controller.enqueue(encoder.encode(closingTags));
                
                // Save the complete file for caching
                const finalHtml = headTemplate + fullResponseText + closingTags;
                await Bun.write("generated/"+encodedPathname, finalHtml);
                console.log(`\n\n====SAVED TO CACHE: ${encodedPathname}====`);

            } catch (error) {
                console.error("Error during stream generation:", error);
                controller.enqueue(encoder.encode("<h1>Error Generating Page</h1><p>Sorry, an error occurred while trying to create this page.</p>"));
            } finally {
                // --- KEY CHANGE 5: Clean up at the end ---
                running = false;
                controller.close();
                console.log("Stream finished.");
            }
        }
    });

    // The Response is returned immediately, with the stream piped to the browser.
    return new Response(stream, {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "X-Content-Type-Options": "nosniff" // Good security practice
        }
    });
}