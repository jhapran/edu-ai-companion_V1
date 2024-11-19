import React, { useState } from 'react';
import { X, Send, Brain } from 'lucide-react';

export default function AIChat({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState('');

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-xl flex flex-col">
      <div className="p-4 border-b flex items-center justify-between bg-blue-50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Brain className="text-blue-600" />
          <h3 className="font-semibold">AI Education Assistant</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Brain size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none max-w-[80%]">
              <p className="text-sm">
                Hello! I'm your AI education assistant. I can help you with:
              </p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Creating lesson plans</li>
                <li>• Generating quiz questions</li>
                <li>• Analyzing student performance</li>
                <li>• Providing teaching strategies</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}