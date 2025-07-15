let isLLMRunning = false;

// server route for /api/llm
export async function llmRoute(req: Request): Promise<Response> {
  // Limit to one LLM request at a time
  if (isLLMRunning) {
    return new Response("An LLM request is already in progress. Please try again later.", {
      status: 429, // Too Many Requests
      headers: { 'Content-Type': "text/plain; charset=utf-8" },
    });
  }

  try {
    isLLMRunning = true; // Set the lock

    const url = new URL(req.url);
    // Use the streaming endpoint for the Gemini API
    const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse", {
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

    // Handle API errors
    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API Error:", errorText);
      return new Response(errorText, { status: geminiResponse.status, headers: { 'Content-Type': "text/plain; charset=utf-8" } });
    }

    if (!geminiResponse.body) {
      return new Response("LLM response has no body", { status: 500, headers: { 'Content-Type': "text/plain; charset=utf-8" } });
    }

    // Create a TransformStream to process the SSE from Gemini,
    // print chunks to the console, and forward the text content.
    const transformStream = new TransformStream({
      start() {
        this.buffer = '';
        this.decoder = new TextDecoder();
      },
      transform(chunk, controller) {
        const decoded = this.decoder.decode(chunk, { stream: true });
        console.log(decoded);
        controller.enqueue(decoded);
        this.buffer += decoded;
      },
      flush() { }
    });

    const stream = geminiResponse.body.pipeThrough(transformStream);

    // Return the streaming response
    return new Response(stream, {
      status: 200,
      headers: { 'Content-Type': "text/plain; charset=utf-8" }
    });

  } catch (error) {
    console.error("Error in /api/llm route:", error);
    return new Response("Internal Server Error", { status: 500 });
  } finally {
    isLLMRunning = false; // Release the lock
  }
}