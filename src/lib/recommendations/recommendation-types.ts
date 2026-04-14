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
