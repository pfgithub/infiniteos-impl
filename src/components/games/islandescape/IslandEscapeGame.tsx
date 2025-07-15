import React, { useState, useEffect, useRef } from 'react';

// Define the types for our game state
interface InventoryItem {
  name: string;
  description: string;
}

interface PlayerState {
  inventory: InventoryItem[];
}

interface Choice {
  text: string;
}

interface Scene {
  description: string;
  image_prompt: string;
  choices: Choice[];
  inventory_update?: {
    add?: InventoryItem[];
    remove?: string[]; // item names to remove
  }
}

interface IslandEscapeGameProps {
  onQuit: () => void;
}

// A simple component to show a loading spinner
const Loader = () => (
  <div className="text-center">
    <div className="animate-spin h-10 w-10 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
    <p className="text-cyan-200">The island mists are swirling...</p>
  </div>
);

const IslandEscapeGame: React.FC<IslandEscapeGameProps> = ({ onQuit }) => {
  const [playerState, setPlayerState] = useState<PlayerState>({ inventory: [] });
  const [scene, setScene] = useState<Scene | null>(null);
  const storyHistory = useRef<string[]>([]);
  const [historyForDisplay, setHistoryForDisplay] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const historyContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTo({
        top: historyContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [historyForDisplay]);

  const generatePrompt = (action?: string): string => {
    const history = storyHistory.current.join('\n\n');
    const inventoryList = playerState.inventory.map(i => i.name).join(', ') || 'nothing';

    const prompt = `
You are the storyteller for a text-based puzzle adventure game called "Island Escape".
The player has woken up on a mysterious, deserted island and must solve puzzles to find a way to escape.

Player's Current State:
Inventory: [${inventoryList}]

Game History:
${history ? `${history}` : 'The player has just woken up on a sandy beach.'}

${action ? `Player's Action: "${action}"` : 'Generate the opening scene for the adventure.'}

Your task is to generate the next part of the story. Respond ONLY with a valid JSON object with the following structure. Do not add any text, comments, or markdown fences (like \`\`\`json) before or after the JSON object.

The JSON object must have these keys:
- "description": "A detailed, engaging description of the new scene. Focus on atmosphere, clues, and interactive elements. Maximum 2-3 paragraphs."
- "image_prompt": "A short, descriptive prompt for an AI image generator to create a picture for this scene. E.g., 'A lush jungle opening reveals an ancient, vine-covered stone temple, digital art, mysterious'."
- "choices": An array of 3 objects, where each object has a "text" key with a short description of the choice. The choices should be logical actions the player can take.
- "inventory_update": (Optional) An object to modify the player's inventory. It can have "add" (an array of {name, description} objects) and/or "remove" (an array of item names). Only include this if the action results in finding or using an item.

Example Response Format:
{
  "description": "You follow a faint path into the jungle. The air grows humid and thick with the scent of unknown flowers. You arrive at a small clearing where a weathered stone statue of a monkey holds a coconut. The coconut looks oddly pristine.",
  "image_prompt": "A jungle clearing with an ancient stone monkey statue holding a single coconut, tropical, adventure game concept art.",
  "choices": [
    { "text": "Examine the coconut." },
    { "text": "Look for other paths from the clearing." },
    { "text": "Try to push the statue over." }
  ],
  "inventory_update": {
    "add": [{"name": "Smooth Stone", "description": "A perfectly smooth, grey stone. It feels heavy."}]
  }
}

Generate the JSON response for the player's current situation.
`;
    return prompt;
  };

  const fetchNextScene = async (action?: string) => {
    setIsLoading(true);
    setError(null);

    const prompt = generatePrompt(action);

    if (action) {
      storyHistory.current.push(`> ${action}`);
      setHistoryForDisplay([...storyHistory.current]);
    }

    try {
      const response = await fetch(`/api/llm?prompt=${encodeURIComponent(prompt)}`);

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
      }

      const cleanedContent = accumulatedContent.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      const newSceneData = JSON.parse(cleanedContent) as Scene;

      setScene(newSceneData);
      storyHistory.current.push(newSceneData.description);
      setHistoryForDisplay([...storyHistory.current]);

      if (newSceneData.inventory_update) {
        setPlayerState(prev => {
          let newInventory = [...prev.inventory];
          // Remove items
          if (newSceneData.inventory_update?.remove) {
            newInventory = newInventory.filter(item => !newSceneData.inventory_update!.remove!.includes(item.name));
          }
          // Add items
          if (newSceneData.inventory_update?.add) {
            newInventory.push(...newSceneData.inventory_update.add);
          }
          return { ...prev, inventory: newInventory };
        });
      }

    } catch (err) {
      console.error('Failed to fetch from LLM or parse response:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`The island's secrets are currently obscured. The storyteller is unable to respond. Please try again. (${errorMessage})`);
      if (action) {
        storyHistory.current.pop();
        setHistoryForDisplay([...storyHistory.current]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNextScene();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChoice = (choice: Choice) => {
    if (isLoading) return;
    fetchNextScene(choice.text);
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-lg shadow-2xl w-full max-w-4xl flex flex-col text-gray-200">
      <div className="flex justify-between items-start mb-4 border-b-2 border-cyan-400/30 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-cyan-300">Island Escape</h2>
          <div className="mt-2 text-sm text-gray-400">
            Inventory: {playerState.inventory.length > 0 ? playerState.inventory.map(i => i.name).join(', ') : 'Empty'}
          </div>
        </div>
        <button
          onClick={onQuit}
          className="px-4 py-2 text-lg text-cyan-200 bg-black/50 border-2 border-cyan-400/50 rounded-md shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:bg-cyan-400/20 hover:text-white"
        >
          Quit
        </button>
      </div>

      <div className="flex-grow pr-2 overflow-y-auto" ref={historyContainerRef}>
        <div className="mb-6 space-y-4">
          {historyForDisplay.map((text, index) => (
            <p key={index} className={`leading-relaxed whitespace-pre-wrap ${text.startsWith('>') ? 'text-cyan-300 italic' : 'text-lg'}`}>
              {text}
            </p>
          ))}
        </div>

        {isLoading && <Loader />}
        {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md">{error}</div>}

        {!isLoading && scene && (
          <div>
            <div className="p-3 bg-black/30 border border-teal-400/30 rounded-md mb-6 italic">
              <p className="text-teal-300 text-sm">A vision of the scene: {scene.image_prompt}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scene.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  disabled={isLoading}
                  className="p-4 text-left text-lg text-cyan-200 bg-black/50 border-2 border-cyan-400/50 rounded-md shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:bg-cyan-400/20 hover:text-white disabled:opacity-50 disabled:cursor-wait"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IslandEscapeGame;
