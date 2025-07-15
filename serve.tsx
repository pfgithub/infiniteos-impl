import { serve } from "bun";
import index from "./src/index.html";
import { genViewerPrompt } from "prompt";
import prompt from "./prompt/prompt.html";
import { apply } from "apply";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/": index,
    "/filesystem/Users/Admin/Pictures/Wallpapers/galaxy.jpg": Response.redirect("https://images.unsplash.com/photo-1741282198587-65bf77e6075d?q=80&w=1091&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),

    "/prompt.txt": async () => new Response(await genViewerPrompt(), {
      headers: {
        'Content-Type': "text/plain",
      },
    }),
    "/prompt": prompt,
    "/api/apply": {POST: async (req) => {
      const formData = await req.formData();
      const prompt = formData.get("prompt");
      const result = formData.get("result");
      try {
        if(typeof prompt !== "string" || typeof result !== "string") throw new Error("not strings");
        apply(prompt, result);
      }catch(e) {
        console.error(e);
        return new Response("error", {status: 400, headers: {'Content-Type': "text/plain; charset=utf-8"}});
      }
      return new Response("ok", {headers: {'Content-Type': "text/plain; charset=utf-8"}});
    }},
    "/api/llm": async (req) => {
      const url = new URL(req.url);
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          'X-goog-api-key': process.env.GEMINI_KEY ?? "",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: url.searchParams.get("prompt") ?? "No prompt",
                }
              ],
            }
          ],
        }),
      });
      return new Response(response.body, {status: response.status, headers: {'Content-Type': "text/plain; charset=utf-8"}});
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
  port: 8389,
});

console.log(`🚀 Server running at ${server.url}`);