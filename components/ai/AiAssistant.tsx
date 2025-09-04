
import React, { useState, useContext } from 'react';
import { getAiInsights } from '../../services/geminiService';
import { DataContext } from '../../App';
import { SendIcon, AiIcon } from '../ui/Icons';
import Spinner from '../ui/Spinner';

const AiAssistant: React.FC = () => {
  const { products, sales } = useContext(DataContext);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{ query: string; response: string }[]>([]);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    const userQuery = query;
    setQuery('');

    const response = await getAiInsights(userQuery, products, sales);

    setConversation(prev => [...prev, { query: userQuery, response }]);
    setIsLoading(false);
  };
  
  const exampleQueries = [
    "How much did we sell today?",
    "What are the top 3 selling products by quantity?",
    "Which product is running low on stock?",
    "Show me all sales from yesterday.",
  ];

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">AI Assistant</h2>
      <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {conversation.length === 0 && (
                <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                    <AiIcon className="w-16 h-16 mb-4 text-indigo-300" />
                    <h3 className="text-xl font-semibold mb-2">Ask me anything about your business</h3>
                    <p>Try one of these examples:</p>
                    <div className="mt-4 space-y-2">
                        {exampleQueries.map(q => (
                            <button key={q} onClick={() => setQuery(q)} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors">{q}</button>
                        ))}
                    </div>
                </div>
            )}
          {conversation.map((entry, index) => (
            <div key={index} className="space-y-2">
              <div className="text-right">
                <p className="inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 max-w-lg">{entry.query}</p>
              </div>
              <div>
                <p className="inline-block bg-gray-200 text-gray-800 rounded-lg px-4 py-2 max-w-lg whitespace-pre-wrap">{entry.response}</p>
              </div>
            </div>
          ))}
           {isLoading && <div className="flex justify-center"><Spinner /></div>}
        </div>
        <form onSubmit={handleQuery} className="mt-4 flex items-center border-t pt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'What was our total revenue this week?'"
            className="flex-1 px-4 py-2 border rounded-l-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-5 py-3 rounded-r-full hover:bg-indigo-700 disabled:bg-gray-400"
            disabled={isLoading}
          >
            <SendIcon className="w-5 h-5"/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAssistant;
