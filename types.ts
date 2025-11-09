
export interface Prediction {
  homeTeam: string;
  awayTeam: string;
  mostLikelyScore: {
    home: number;
    away: number;
    probability: number;
  };
  hdaProbability: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  overUnder: {
    over1_5: number;
    over2_5: number;
  };
  weather: {
    condition: string;
    impact: string;
  };
  analysis: string;
}

export interface PredictionError {
    error: string;
}

export function isPrediction(data: any): data is Prediction {
    return data && typeof data.homeTeam === 'string' && !data.error;
}

export function isPredictionError(data: any): data is PredictionError {
    return data && typeof data.error === 'string';
}
