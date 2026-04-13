import api from "@/lib/axios";

export interface Review {
  id: string;
  medicineId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

export interface CreateReviewPayload {
  medicineId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export interface ReviewsResponse {
  data: Review[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    averageRating: number;
    totalReviews: number;
  };
}

// Get reviews for a medicine
export const getMedicineReviews = async (medicineId: string, page: number = 1, limit: number = 10) => {
  const response = await api.get<ReviewsResponse>(`/reviews/medicine/${medicineId}?page=${page}&limit=${limit}`);
  return response.data;
};

// Create a review
export const createReview = async (data: CreateReviewPayload) => {
  const response = await api.post<Review>("/reviews", data);
  return response.data;
};

// Update a review
export const updateReview = async (id: string, data: UpdateReviewPayload) => {
  const response = await api.patch<Review>(`/reviews/${id}`, data);
  return response.data;
};

// Delete a review
export const deleteReview = async (id: string) => {
  await api.delete(`/reviews/${id}`);
};

// Get my reviews
export const getMyReviews = async (page: number = 1, limit: number = 10) => {
  const response = await api.get<ReviewsResponse>(`/reviews/my-reviews?page=${page}&limit=${limit}`);
  return response.data;
};