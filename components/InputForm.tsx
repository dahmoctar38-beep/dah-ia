
import React, { useState } from 'react';

interface InputFormProps {
  onAnalyze: (url: string, htHome?: number, htAway?: number) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');
  const [useHt, setUseHt] = useState(false);
  const [htHome, setHtHome] = useState('');
  const [htAway, setHtAway] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid match URL.');
      return;
    }
    if (!url.toLowerCase().includes('sofascore.com') && !url.toLowerCase().includes('besoccer.com')) {
      setError('Please provide a valid SofaScore or BeSoccer URL.');
      return;
    }
    setError('');

    const homeScore = useHt && htHome ? parseInt(htHome, 10) : undefined;
    const awayScore = useHt && htAway ? parseInt(htAway, 10) : undefined;
    onAnalyze(url, homeScore, awayScore);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-gray-700">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
            Match URL (SofaScore or BeSoccer)
          </label>
          <textarea
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g., https://www.sofascore.com/real-madrid-barcelona/..."
            rows={3}
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            disabled={isLoading}
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
        
        <div className="mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={useHt}
                    onChange={(e) => setUseHt(e.target.checked)}
                    className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500"
                    disabled={isLoading}
                />
                <span className="text-sm font-medium text-gray-300">Adjust with Half-Time Score</span>
            </label>
        </div>

        {useHt && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="htHome" className="block text-sm font-medium text-gray-300 mb-2">
                HT Home Score
              </label>
              <input
                type="number"
                id="htHome"
                value={htHome}
                onChange={(e) => setHtHome(e.target.value)}
                min="0"
                className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="htAway" className="block text-sm font-medium text-gray-300 mb-2">
                HT Away Score
              </label>
              <input
                type="number"
                id="htAway"
                value={htAway}
                onChange={(e) => setHtAway(e.target.value)}
                min="0"
                className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            '🚀 Analyze Match'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
