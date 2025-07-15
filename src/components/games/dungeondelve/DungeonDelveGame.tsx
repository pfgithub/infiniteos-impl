import React, { useState, useEffect, useRef } from 'react';

// Define the types for our game state
interface Character {
  name: string;
  characterClass: string;
  hp: number;
  maxHp: number;
}

interface Choice {
  text: string;
}

interface Scene {
  description: string;
  image_prompt: string;
  choices: Choice[];
}

interface DungeonDelveGameProps {
  character: { name: string; characterClass: string; };
  onQuit: () => void;
}

// A simple component to show a loading spinner
const Loader = () => (
  <div className="text-center">
    <div className="animate-spin h-10 w-10 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
    <p className="text-yellow-200">The Dungeon Master is weaving fate...</p>
  </div>
);

const DungeonDelveGame: React.FC<DungeonDelveGameProps> = ({ character: initialCharacter, onQuit }) => {
  const [character, setCharacter] = useState<Character>({
    ...initialCharacter,
    hp: 100, // Starting HP
    maxHp: 100,
  });
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

    const prompt = `
You are the Dungeon Master for a text-based RPG called "Dungeon Delve".
The player's character is:
Name: ${character.name}
Class: ${character.characterClass}
HP: ${character.hp}/${character.maxHp}

Game History:
${history ? `${history}` : 'The adventure is just beginning.'}

${action ? `Player's Action: "${action}"` : 'Generate the opening scene for the adventure.'}

Your task is to generate the next part of the story. Respond ONLY with a valid JSON object with the following structure. Do not add any text, comments, or markdown fences (like \`\`\`json) before or after the JSON object.

The JSON object must have these keys:
- "description": "A detailed, engaging description of the new scene. Be creative and concise. Maximum 2-3 paragraphs."
- "image_prompt": "A short, descriptive prompt for an AI image generator to create a picture for this scene. E.g., 'A fantasy warrior stands at the entrance of a dark, foreboding cave, digital art, epic lighting.'"
- "choices": An array of 3 objects, where each object has a "text" key with a short description of the choice.
- "character_update": An object with an "hp_change" key (a number, can be positive, negative, or zero).

Example Response Format:
{
  "description": "The old wooden door creaks open, revealing a dusty chamber filled with cobwebs. A single torch flickers on the far wall, casting long, dancing shadows. In the center of the room, a stone pedestal holds an ancient, leather-bound book.",
  "image_prompt": "A dusty, torch-lit dungeon chamber with a book on a pedestal, fantasy, digital art, mysterious atmosphere.",
  "choices": [
    { "text": "Examine the ancient book." },
    { "text": "Search the room for treasure." },
    { "text": "Listen at the far door for any sounds." }
  ],
  "character_update": {
    "hp_change": 0
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

      // The LLM sometimes wraps the JSON in markdown, so we clean it.
      const cleanedContent = accumulatedContent.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
      const newSceneData = JSON.parse(cleanedContent);

      setScene(newSceneData);
      storyHistory.current.push(newSceneData.description);
      setHistoryForDisplay([...storyHistory.current]);

      if (newSceneData.character_update && typeof newSceneData.character_update.hp_change === 'number') {
        setCharacter(prev => ({
          ...prev,
          hp: Math.min(prev.maxHp, Math.max(0, prev.hp + newSceneData.character_update.hp_change))
        }));
      }

    } catch (err) {
      console.error('Failed to fetch from LLM or parse response:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`The spirits are confused. The Dungeon Master is unable to respond. Please try again. (${errorMessage})`);
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

  const HPBar = () => (
    <div className="w-full bg-red-900/50 rounded-full h-4 border border-red-500/50">
      <div
        className="bg-red-500 h-full rounded-full transition-all duration-500"
        style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
      ></div>
    </div>
  );

  return (
    <div className="bg-black/80 backdrop-blur-md p-6 rounded-lg shadow-2xl w-full max-w-4xl flex flex-col font-['MedievalSharp'] text-yellow-50">
      <div className="flex justify-between items-start mb-4 border-b-2 border-yellow-400/30 pb-4">
        <div>
          <h2 className="text-3xl font-extrabold text-yellow-300">{character.name} the {character.characterClass}</h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="font-bold text-lg">HP: {character.hp} / {character.maxHp}</span>
            <div className="w-48">
              <HPBar />
            </div>
          </div>
        </div>
        <button
          onClick={onQuit}
          className="px-4 py-2 text-lg text-yellow-200 bg-black/50 border-2 border-yellow-400/50 rounded-md shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:bg-yellow-400/20 hover:text-white"
        >
          Quit
        </button>
      </div>

      <div className="flex-grow pr-2" ref={historyContainerRef}>
        <div className="mb-6 space-y-4">
          {historyForDisplay.map((text, index) => (
            <p key={index} className={`leading-relaxed whitespace-pre-wrap ${text.startsWith('>') ? 'text-yellow-300 italic' : 'text-lg'}`}>
              {text}
            </p>
          ))}
        </div>

        {isLoading && <Loader />}
        {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md">{error}</div>}

        {!isLoading && scene && (
          <div>
            <div className="p-3 bg-black/30 border border-purple-400/30 rounded-md mb-6 italic">
              <p className="text-purple-300 text-sm">A vision flashes in your mind: {scene.image_prompt}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scene.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  disabled={isLoading}
                  className="p-4 text-left text-lg text-yellow-200 bg-black/50 border-2 border-yellow-400/50 rounded-md shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:bg-yellow-400/20 hover:text-white disabled:opacity-50 disabled:cursor-wait"
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

export default DungeonDelveGame;
