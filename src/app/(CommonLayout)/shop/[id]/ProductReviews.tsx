"use client";

import { useState } from "react";
import { useMedicineReviews, useCreateReview, useDeleteReview } from "@/hooks/useReviews";
import { useSession } from "@/hooks/useAuth";
import { Star, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import Link from "next/link";

interface ProductReviewsProps {
  medicineId: string;
}

export default function ProductReviews({ medicineId }: ProductReviewsProps) {
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  
  const { data: session, isLoading: sessionLoading } = useSession();
  const { data: reviewsData, isLoading, refetch } = useMedicineReviews(medicineId, page, 10);
  const createReviewMutation = useCreateReview();
  const deleteReviewMutation = useDeleteReview();
  
  const user = session?.user;
  const reviews = reviewsData?.data || [];
  const meta = reviewsData?.meta;
  const hasUserReviewed = reviews.some(r => r.userId === user?.id);
  const isCustomer = user?.role === "CUSTOMER";
  const canReview = !sessionLoading && user && isCustomer && !hasUserReviewed;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Early validation - prevent any submission if conditions not met
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!isCustomer) {
      toast.error("Only customers can submit reviews");
      return;
    }

    if (hasUserReviewed) {
      toast.error("You have already reviewed this product");
      return;
    }

    // If all conditions pass, submit
    try {
      await createReviewMutation.mutateAsync({
        medicineId,
        rating,
        comment: comment.trim() || undefined,
      });
      setRating(5);
      setComment("");
    } catch (error) {
      // Error is already handled in the mutation hook
      console.error("Review submission failed:", error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      await deleteReviewMutation.mutateAsync(reviewId);
    }
  };

  // Loading state for reviews
  if (isLoading && page === 1) {
    return (
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="skeleton h-8 w-48"></div>
          <div className="skeleton h-10 w-32"></div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="skeleton h-10 w-10 rounded-full"></div>
                <div className="flex-1">
                  <div className="skeleton h-5 w-32 mb-2"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-2/3 mt-2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {/* Reviews Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Customer Reviews</h3>
          {meta && (
            <p className="text-sm text-gray-500 mt-1">
              {meta.totalReviews} reviews • {meta.averageRating.toFixed(1)} average rating
            </p>
          )}
        </div>
      </div>

      {/* Write Review Form - Only show if conditions are met */}
      {canReview && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h4 className="font-semibold mb-4">Write a Review</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating Stars */}
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                    disabled={createReviewMutation.isPending}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      } ${createReviewMutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="textarea textarea-bordered w-full"
                placeholder="Share your experience with this product..."
                disabled={createReviewMutation.isPending}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={createReviewMutation.isPending}
              className="btn btn-primary"
            >
              {createReviewMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Not Logged In Message */}
      {!user && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
          <p className="text-gray-600 mb-2">Want to share your experience?</p>
          <Link href="/login" className="btn btn-outline btn-primary">
            Login to Write a Review
          </Link>
        </div>
      )}

      {/* Not Customer Message */}
      {user && !isCustomer && !hasUserReviewed && (
        <div className="bg-amber-50 rounded-lg p-6 mb-8 text-center">
          <p className="text-amber-700">
            Only customers can write reviews. 
            {user?.role === "SELLER" && " You are logged in as a Seller."}
            {user?.role === "ADMIN" && " You are logged in as an Admin."}
          </p>
        </div>
      )}

      {/* Already Reviewed Message */}
      {user && isCustomer && hasUserReviewed && (
        <div className="bg-blue-50 rounded-lg p-4 mb-8 text-blue-700 text-sm">
          Thank you for your review! You have already reviewed this product.
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to review this product!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-10 flex items-center justify-center">
                      {review.user.image ? (
                        <Image
                          src={review.user.image}
                          alt={review.user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-lg">
                          {review.user.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    {/* User Name & Date */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{review.user.name}</span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i + 1 <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    )}
                  </div>
                </div>

                {/* Delete Button (only for own reviews or admin) */}
                {(user?.id === review.userId || user?.role === "ADMIN") && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-500 hover:text-red-700 transition"
                    disabled={deleteReviewMutation.isPending}
                  >
                    {deleteReviewMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="join-item btn btn-sm"
            >
              « Previous
            </button>
            <button className="join-item btn btn-sm btn-active">
              Page {page} of {meta.totalPage}
            </button>
            <button
              onClick={() => setPage(p => Math.min(meta.totalPage, p + 1))}
              disabled={page === meta.totalPage}
              className="join-item btn btn-sm"
            >
              Next »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}