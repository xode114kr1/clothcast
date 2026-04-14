export type RecommendedOutfitItem = {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
};

export type RecommendationResponseData = {
  recommendationId: number | null;
  prompt: string;
  weatherSummary: {
    temperature: number;
    feelsLike: number;
    weather: string;
    location: string;
  };
  recommendedItems: RecommendedOutfitItem[];
  reason: string;
  styleTone: string;
};

export type RecommendationHistoryItem = {
  recommendationId: number;
  prompt: string;
  reason: string;
  styleTone: string;
  recommendedItems: RecommendedOutfitItem[];
  createdAt: string;
};
