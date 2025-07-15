import React, { useState, useRef, useEffect } from 'react';

const BrowserContent: React.FC<{ id: string }> = ({ id }) => {
  const [addressBarValue, setAddressBarValue] = useState('/infinite-site/');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Set initial URL when component mounts
    if (iframeRef.current) {
        iframeRef.current.src = '/infinite-site/';
    }
  }, []);
  
  const slugify = (text: string) =>
    text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!iframeRef.current) return;

    let newUrl = addressBarValue;
    // If it looks like a search query, convert it to an /infinite-site/ URL
    if (!addressBarValue.startsWith('/') && !addressBarValue.startsWith('http')) {
        newUrl = `/infinite-site/${slugify(addressBarValue)}`;
    }
    
    iframeRef.current.src = newUrl;
    setAddressBarValue(newUrl);
  };
  
  const handleReload = () => {
    iframeRef.current?.contentWindow?.location.reload();
  };
  
  const handleBack = () => {
    iframeRef.current?.contentWindow?.history.back();
  };
  
  const handleForward = () => {
    iframeRef.current?.contentWindow?.history.forward();
  };
  
  const handleIframeLoad = () => {
    if (iframeRef.current?.contentWindow) {
      try {
        const iframeLocation = iframeRef.current.contentWindow.location;
        if (iframeLocation.href !== 'about:blank') {
            const path = iframeLocation.pathname + iframeLocation.search + iframeLocation.hash;
            setAddressBarValue(path);
        }
      } catch (e) {
        console.warn("Could not access iframe location due to cross-origin restrictions.");
        // For cross-origin iframes, we can only display the src we set.
        if (iframeRef.current) {
            setAddressBarValue(iframeRef.current.src);
        }
      }
    }
  };

  return (
    <div className="flex-grow flex flex-col bg-gray-700">
      <div className="flex-shrink-0 p-2 bg-gray-800 flex items-center gap-2 border-b border-black/20">
        <button onClick={handleBack} className="p-1 rounded-full hover:bg-white/10" aria-label="Back">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={handleForward} className="p-1 rounded-full hover:bg-white/10" aria-label="Forward">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <button className="p-1 rounded-full hover:bg-white/10" onClick={handleReload} aria-label="Reload">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
        </button>

        <form onSubmit={handleSubmit} className="flex-grow">
          <input
            type="text"
            value={addressBarValue}
            onChange={(e) => setAddressBarValue(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="w-full bg-gray-900 text-white p-1 px-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe a website, e.g., 'a portfolio for a space photographer'"
          />
        </form>
      </div>
      <div className="flex-grow relative bg-white">
        <iframe
          ref={iframeRef}
          onLoad={handleIframeLoad}
          title="Browser Content"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms"
        ></iframe>
      </div>
    </div>
  );
};

export default BrowserContent;
