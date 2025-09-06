import React, { useState, useContext, useEffect, useRef } from 'react';
import { getAiInsights } from '../../services/geminiService';
import { DataContext } from '../../App';
import { SendIcon, AiIcon } from '../ui/Icons';
import Spinner from '../ui/Spinner';
// A simple markdown-to-react component
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>')       // Italics
      .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 rounded">$1</code>') // Inline code
      .replace(/\n/g, '<br />');                  // Newlines
    
    return <p dangerouslySetInnerHTML={{ __html: html }} />;
};


const AiAssistant: React.FC = () => {
  const { products, sales } = useContext(DataContext);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{ query: string; response: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isLoading]);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    const userQuery = query;
    setConversation(prev => [...prev, { query: userQuery, response: '...' }]); // Optimistic UI
    setQuery('');

    const response = await getAiInsights(userQuery, products, sales);
    
    setConversation(prev => {
        const newConversation = [...prev];
        newConversation[newConversation.length - 1].response = response;
        return newConversation;
    });
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
      <h2 className="text-3xl font-bold text-gray-100 mb-4">AI Assistant</h2>
      <div className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto space-y-6 p-4">
            {conversation.length === 0 && (
                <div className="text-center text-gray-400 flex flex-col items-center justify-center h-full">
                    <AiIcon className="w-20 h-20 mb-4 text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.7)] animate-pulse" />
                    <h3 className="text-2xl font-semibold mb-2 text-white">Ask me anything about your business</h3>
                    <p>Try one of these examples:</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {exampleQueries.map(q => (
                            <button key={q} onClick={() => setQuery(q)} className="text-sm bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1.5 rounded-full transition-colors">{q}</button>
                        ))}
                    </div>
                </div>
            )}
          {conversation.map((entry, index) => (
            <div key={index} className="space-y-4">
              <div className="flex justify-end">
                <p className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-2xl rounded-br-none px-4 py-3 max-w-lg shadow-lg">{entry.query}</p>
              </div>
              <div className="flex justify-start">
                  <div className="bg-slate-700 text-gray-200 rounded-2xl rounded-bl-none px-4 py-3 max-w-lg shadow-lg">
                    {isLoading && entry.response === '...' ? <Spinner/> : <SimpleMarkdown text={entry.response} />}
                  </div>
              </div>
            </div>
          ))}
           <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleQuery} className="mt-4 flex items-center border-t border-white/10 pt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'What was our total revenue this week?'"
            className="flex-1 px-4 py-3 border border-white/20 bg-white/5 rounded-l-full focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white p-3.5 rounded-r-full hover:from-teal-600 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 transition-all shadow-lg shadow-cyan-500/30"
            disabled={isLoading}
          >
            <SendIcon className="w-6 h-6"/>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAssistant;