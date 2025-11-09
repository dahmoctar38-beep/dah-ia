
import React, { useState, useCallback } from 'react';
import { FootballIcon } from './components/Icons';
import InputForm from './components/InputForm';
import PredictionDisplay from './components/PredictionDisplay';
import { getPrediction } from './services/geminiService';
import type { Prediction, PredictionError } from './types';

const App: React.FC = () => {
  const [prediction, setPrediction] = useState<Prediction | PredictionError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAnalyze = useCallback(async (url: string, htHome?: number, htAway?: number) => {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await getPrediction(url, htHome, htAway);
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setPrediction({ error: `Failed to get prediction. ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <FootballIcon className="w-10 h-10 text-green-400" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              D7A0HO Football Intelligence
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            AI-powered match analysis. Paste a SofaScore or BeSoccer link to get detailed predictions.
          </p>
        </header>

        <main>
          <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          <div className="mt-8">
            <PredictionDisplay prediction={prediction} isLoading={isLoading} />
          </div>
        </main>
        
        <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Predictions are probabilistic and for informational purposes only. Bet responsibly.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
