export type ReviewSentiment = 'positive' | 'neutral' | 'negative';

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  body: string;
  sentiment: ReviewSentiment;
  reply?: {
    text: string;
    author: string;
    createdAt: string;
  };
  isHidden: boolean;
  isFlagged: boolean;
  createdAt: string;
}
