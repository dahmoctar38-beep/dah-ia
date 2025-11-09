
import React from 'react';
import type { Prediction, PredictionError } from '../types';
import { isPrediction, isPredictionError } from '../types';
import { SunIcon, BarChartIcon } from './Icons';

interface PredictionDisplayProps {
  prediction: Prediction | PredictionError | null;
  isLoading: boolean;
}

const StatCard: React.FC<{ title: string; value: string; subValue?: string; className?: string }> = ({ title, value, subValue, className }) => (
    <div className={`bg-gray-800 p-4 rounded-lg text-center border border-gray-700 ${className}`}>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
    </div>
);

const SkeletonLoader: React.FC = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-16 bg-gray-700 rounded-lg"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-20 bg-gray-700 rounded-lg"></div>
            <div className="h-20 bg-gray-700 rounded-lg"></div>
            <div className="h-20 bg-gray-700 rounded-lg"></div>
            <div className="h-20 bg-gray-700 rounded-lg"></div>
        </div>
        <div className="h-24 bg-gray-700 rounded-lg"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
    </div>
);

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ prediction, isLoading }) => {
  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!prediction) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Enter a match URL to see the AI-powered prediction.</p>
      </div>
    );
  }

  if (isPredictionError(prediction)) {
    return (
      <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg text-center">
        <h3 className="font-bold">Analysis Failed</h3>
        <p>{prediction.error}</p>
      </div>
    );
  }

  if (isPrediction(prediction)) {
    const { homeTeam, awayTeam, mostLikelyScore, hdaProbability, overUnder, weather, analysis } = prediction;
    return (
      <div className="space-y-6">
        {/* Main Score Prediction */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-gray-700 text-center">
            <p className="text-sm text-gray-400 mb-2">Most Likely Score</p>
            <div className="flex items-center justify-center space-x-4">
                <span className="text-2xl sm:text-3xl font-semibold w-2/5 text-right truncate">{homeTeam}</span>
                <span className="text-5xl sm:text-6xl font-black text-green-400">{mostLikelyScore.home} - {mostLikelyScore.away}</span>
                <span className="text-2xl sm:text-3xl font-semibold w-2/5 text-left truncate">{awayTeam}</span>
            </div>
            <p className="text-green-300 mt-2 font-semibold">{(mostLikelyScore.probability * 100).toFixed(1)}% Chance</p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Home Win" value={`${(hdaProbability.homeWin * 100).toFixed(1)}%`} />
            <StatCard title="Draw" value={`${(hdaProbability.draw * 100).toFixed(1)}%`} />
            <StatCard title="Away Win" value={`${(hdaProbability.awayWin * 100).toFixed(1)}%`} />
            <StatCard title="Over 2.5 Goals" value={`${(overUnder.over2_5 * 100).toFixed(1)}%`} subValue={`O/1.5: ${(overUnder.over1_5 * 100).toFixed(1)}%`} />
        </div>
        
        {/* Weather and Analysis */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col items-center justify-center text-center">
                <SunIcon className="w-8 h-8 text-yellow-400 mb-2"/>
                <p className="text-lg font-bold text-white">{weather.condition}</p>
                <p className="text-sm text-gray-400">{weather.impact}</p>
            </div>
            <div className="md:col-span-2 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="font-bold text-lg mb-2 flex items-center"><BarChartIcon className="w-5 h-5 mr-2 text-green-400"/>Analyst's Summary</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{analysis}</p>
            </div>
        </div>

      </div>
    );
  }

  return null;
};

export default PredictionDisplay;
