import { serve } from "bun";
import index from "./src/index.html";
import { genViewerPrompt } from "prompt";
import prompt from "./prompt/prompt.html";
import { apply } from "apply";
import { llmRoute } from "@/api/llm";
import { infiniteSiteFetch } from "infinite_site";

// A lock to ensure only one LLM request is processed at a time.

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
    "/infinite-site/*": req => {
      const result = new URL(req.url);
      result.pathname = result.pathname.replace("/infinite-site", "");
      result.port = "8388";
      return Response.redirect(result);
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

const iserve = serve({
  routes: {
    "/*": infiniteSiteFetch,
    "/tailwind.js": new Response(Bun.file("node_modules/@tailwindcss/browser/dist/index.global.js")),
  },
  port: 8388,
  idleTimeout: 255,
})

console.log(`🚀 Server running at ${server.url} / ${iserve.url}`);