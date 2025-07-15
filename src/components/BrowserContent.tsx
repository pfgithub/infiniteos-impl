import React, { useState, useRef, useEffect } from 'react';

const BrowserContent: React.FC<{ id: string }> = ({ id }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const generateWebsite = async (promptToGenerate: string) => {
    if (!promptToGenerate || isLoading) return;

    setIsLoading(true);
    setCurrentPrompt(promptToGenerate);
    setContent('');

    try {
      const response = await fetch(`/api/llm?prompt=${encodeURIComponent("Generate a complete, visually appealing, single-file HTML website based on the following prompt. The HTML should be self-contained, using inline CSS or a single <style> block. Do not use any external resources like images or scripts. The design should be modern and responsive. Prompt: " + promptToGenerate)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulatedContent += decoder.decode(value, { stream: true });
        setContent(accumulatedContent);
      }
    } catch (error) {
      console.error('Failed to fetch from LLM:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setContent(`<div style="font-family: sans-serif; color: red; padding: 20px;"><h2>Error Generating Website</h2><p>${errorMessage}</p></div>`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateWebsite(prompt);
  };

  const handleReload = () => {
    if (currentPrompt) {
      generateWebsite(currentPrompt);
    }
  }
  
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
        const iframe = iframeRef.current;
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(content);
        doc.close();
    }
  }, [content]);

  return (
    <div className="flex-grow flex flex-col bg-gray-700">
      <div className="flex-shrink-0 p-2 bg-gray-800 flex items-center gap-2 border-b border-black/20">
        <button className="p-1 rounded-full text-gray-400 cursor-not-allowed" aria-label="Back">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button className="p-1 rounded-full text-gray-400 cursor-not-allowed" aria-label="Forward">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <button className="p-1 rounded-full hover:bg-white/10" onClick={handleReload} aria-label="Reload">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
        </button>

        <form onSubmit={handleSubmit} className="flex-grow">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="w-full bg-gray-900 text-white p-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe a website, e.g., 'a weather app for space travelers'"
          />
        </form>
      </div>
      <div className="flex-grow relative bg-white">
        <iframe
          ref={iframeRef}
          title="Browser Content"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
        {isLoading && !content && (
          <div className="absolute inset-0 flex items-center justify-center bg-white text-gray-600">
            <div className="text-center">
              <p className="text-lg">Generating website for "{currentPrompt}"...</p>
              <div className="mt-4 animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          </div>
        )}
        {!content && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white text-gray-500">
            <div className="text-center p-4">
                <div className="text-5xl mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400 mx-auto" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" /><path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 1 0 18" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">CuOS AI Browser</h2>
                <p>Enter a prompt above to generate a website with AI.</p>
                <p className="text-sm mt-1">Example: <span className="italic text-gray-600">"a landing page for a futuristic space hotel"</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserContent;
