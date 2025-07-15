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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generatePrompt = (action?: string): string => {
    const history = storyHistory.current.slice(-2).join('\n\n'); // Keep last 2 descriptions for context

    const prompt = `
You are the Dungeon Master for a text-based RPG called "Dungeon Delve".
The player's character is:
Name: ${character.name}
Class: ${character.characterClass}
HP: ${character.hp}/${character.maxHp}

${history ? `Recent Events:\n${history}` : 'The adventure is just beginning.'}

${action ? `Player's Action: "${action}"` : 'Generate the opening scene for the adventure.'}

Your task is to generate the next part of the story. Respond ONLY with a valid JSON object with the following structure. Do not add any text, comments, or markdown before or after the JSON object.
{
  "description": "A detailed, engaging description of the new scene. Be creative and concise. Maximum 2-3 paragraphs.",
  "image_prompt": "A short, descriptive prompt for an AI image generator to create a picture for this scene. E.g., 'A fantasy warrior stands at the entrance of a dark, foreboding cave, digital art, epic lighting.'",
  "choices": [
    { "text": "A short description of the first choice." },
    { "text": "A short description of the second choice." },
    { "text": "A short description of the third choice." }
  ],
  "character_update": {
    "hp_change": 0
  }
}

Generate the response for the player.
`;
    return prompt;
  };

  const fetchNextScene = async (action?: string) => {
    setIsLoading(true);
    setError(null);
    if(action) {
        storyHistory.current.push(`I chose to: ${action}`);
    }
    const prompt = generatePrompt(action);

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
      const newSceneData = JSON.parse(cleanedContent);

      setScene(newSceneData);
      storyHistory.current.push(newSceneData.description);
      
      if (newSceneData.character_update && newSceneData.character_update.hp_change) {
        setCharacter(prev => ({
          ...prev,
          hp: Math.min(prev.maxHp, Math.max(0, prev.hp + newSceneData.character_update.hp_change))
        }));
      }

    } catch (err) {
      console.error('Failed to fetch from LLM or parse response:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`The spirits are confused. The Dungeon Master is unable to respond. Please try again. (${errorMessage})`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNextScene();
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
    <div className="bg-black/80 backdrop-blur-md p-6 rounded-lg shadow-2xl w-full max-w-4xl h-full flex flex-col font-['MedievalSharp'] text-yellow-50">
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

      <div className="flex-grow overflow-y-auto pr-2">
        {isLoading && <Loader />}
        {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-md">{error}</div>}
        {!isLoading && scene && (
          <div>
            <div className="mb-6">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{scene.description}</p>
            </div>
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
