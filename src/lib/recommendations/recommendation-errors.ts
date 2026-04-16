export type RecommendationErrorCode =
  | "USER_NOT_FOUND"
  | "EMPTY_WARDROBE"
  | "AI_RECOMMENDATION_FAILED";

export class RecommendationServiceError extends Error {
  constructor(
    message: string,
    public readonly code: RecommendationErrorCode,
    public readonly status: number,
  ) {
    super(message);
    this.name = "RecommendationServiceError";
  }
}
