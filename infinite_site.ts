import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_KEY});

const prefix = `Create an HTML response for the requested url.

- Use tailwind CSS for all styling.
- Include links to other pages on the site when appropriate.
- Include relevant navigation links.
- If any images are needed, make sure they have a detailed path. Use jpg or png images. Include the size of the image in the URL, eg '/images/waterfall-on-a-mountain-range-in-the-distance.jpg?w=1000&h=600'.
- Use tailwind from "/tailwind.js".

Before you start your response:
- Plan a general outline of the page to be fleshed out in the response.
- If there's any information you will need for the page, make it up.
- Describe specific ways you will make the page visually stand out using Tailwind CSS.

Then, write a long and detailed page starting from the template below.

Use the following HTML template:

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="/tailwind.js"></script>
        <title> ... continue here

Requested URL: `;

const template = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="/tailwind.js"></script>
    </head>`;

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
    const encodedPathname = encodePathname(url.pathname + url.search);
    if(url.pathname === "/tailwind.js") return new Response(Bun.file("tailwind.js"), {status: 200});
    if(url.pathname.includes(".jpg") || url.pathname.includes(".png")) {
        let w = url.searchParams.get("w") ?? "1000";
        let h = url.searchParams.get("h") ?? "600"; 
        return Response.redirect("https://picsum.photos/seed/"+encodedPathname+"/"+w+"/"+h);
    }
    if(url.pathname.includes(".") && !url.pathname.includes(".aspx") && !url.pathname.includes(".md") && !url.pathname.includes(".php")) return new Response("ok", {status: 200});
    if(running) return new Response("Server is busy", {status: 503});
    if(await Bun.file("generated/"+encodedPathname).exists()) {
        return new Response(Bun.file("generated/"+encodedPathname), {status: 200, headers: {"Content-Type": "text/html; charset=utf-8"}});
    }
    const prompt = prefix + url.pathname + url.search;
    console.log(prompt);

    const response = await ai.models.generateContentStream({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
            temperature: 1.5,
            maxOutputTokens: 8192,
        }
    });
    console.log("\n\n====RESPONSE====");
    running = true;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            let buffer = "";
            let total = "";
            let documentStarted = false;
            let documentFinished = false;

            for await (const chunk of response) {
                console.log("%[" + chunk.text + "]%");
                if (documentFinished) continue;

                buffer += chunk.text;

                if (!documentStarted) {
                    const doctype = "<!DOCTYPE html>";
                    const startIndex = buffer.indexOf(doctype);
                    if (startIndex !== -1) {
                        // Discard any preamble before the doctype
                        buffer = buffer.substring(startIndex);
                        documentStarted = true;
                        console.log("====READY====");
                    } else {
                        // Not ready, keep buffering
                        continue;
                    }
                }
                
                const endTagIndex = buffer.toLowerCase().indexOf("</html>");
                if (endTagIndex !== -1) {
                    const endPosition = endTagIndex + "</html>".length;
                    const finalChunk = buffer.substring(0, endPosition);
                    
                    controller.enqueue(encoder.encode(finalChunk));
                    total += finalChunk;
                    documentFinished = true;
                    // We're done, we can stop processing.
                    break;
                }
                
                // To avoid splitting the </html> tag, don't process the very end of the buffer.
                // Keep the last N characters, where N is one less than the tag length.
                const safeBoundary = buffer.length - ("</html>".length - 1);
                if (safeBoundary > 0) {
                    const partToEnqueue = buffer.substring(0, safeBoundary);
                    controller.enqueue(encoder.encode(partToEnqueue));
                    total += partToEnqueue;
                    buffer = buffer.substring(safeBoundary);
                }
            }
            
            // This runs after the loop completes (either by breaking or the stream ending).
            // If the document is not yet 'finished', it means the stream ended before </html> was found.
            // We need to process whatever is left in the buffer.
            if (!documentFinished && buffer.length > 0) {
                 const endTagIndex = buffer.toLowerCase().indexOf("</html>");
                 if (endTagIndex !== -1) {
                    const endPosition = endTagIndex + "</html>".length;
                    const finalChunk = buffer.substring(0, endPosition);
                    controller.enqueue(encoder.encode(finalChunk));
                    total += finalChunk;
                 } else {
                    // Model finished without sending </html>, just send what's left.
                    controller.enqueue(encoder.encode(buffer));
                    total += buffer;
                 }
            }

            running = false;
            controller.close();
            await Bun.write("generated/"+encodedPathname, total);
        }
    });
    
    return new Response(stream, {
        headers: {
            "Content-Type": "text/html; charset=utf-8"
        }
    });
}