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
    const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:streamGenerateContent?alt=sse", {
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

    // This transform stream parses the SSE from Gemini and extracts the text content.
    const transformStream = new TransformStream({
      start(controller) {
        this.buffer = '';
        this.decoder = new TextDecoder();
        this.encoder = new TextEncoder();
      },
      transform(chunk, controller) {
        this.buffer += this.decoder.decode(chunk, { stream: true });
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || ''; // Keep the last, possibly incomplete line

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonString = line.substring(5).trim();
              if (jsonString) {
                const jsonData = JSON.parse(jsonString);
                const textContent = jsonData.candidates?.[0]?.content?.parts?.[0]?.text;
                if (textContent) {
                  controller.enqueue(this.encoder.encode(textContent));
                }
              }
            } catch (e) {
              console.warn('Could not parse JSON from SSE chunk:', line, e);
            }
          }
        }
      },
      flush(controller) {
        // Process any remaining data in the buffer when the stream closes.
        if (this.buffer.startsWith('data: ')) {
          try {
            const jsonString = this.buffer.substring(5).trim();
            if (jsonString) {
              const jsonData = JSON.parse(jsonString);
              const textContent = jsonData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textContent) {
                controller.enqueue(this.encoder.encode(textContent));
              }
            }
          } catch (e) {
            console.warn('Could not parse JSON from final SSE chunk:', this.buffer, e);
          }
        }
      }
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
