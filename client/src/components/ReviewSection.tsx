import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Review } from "@shared/schema";
import { useState } from "react";

const reviewSchema = z.object({
  rating: z.number().min(1, "별점을 선택해주세요").max(5),
  title: z.string().min(3, "제목은 최소 3자 이상이어야 합니다"),
  body: z.string().min(10, "리뷰 내용은 최소 10자 이상이어야 합니다"),
  authorName: z.string().min(2, "이름은 최소 2자 이상이어야 합니다"),
  authorEmail: z.string().email("올바른 이메일 주소를 입력해주세요"),
});

type ReviewForm = z.infer<typeof reviewSchema>;

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { toast } = useToast();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews", productId],
    queryFn: async () => {
      const response = await fetch(`/api/reviews/${productId}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
  });

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: ReviewForm) => {
      return await apiRequest("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, productId }),
      });
    },
    onSuccess: () => {
      toast({
        title: "리뷰가 등록되었습니다. 검토 후 게시됩니다.",
        description: "소중한 의견 감사합니다.",
      });
      reset();
      setSelectedRating(0);
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", productId] });
    },
    onError: () => {
      toast({
        title: "리뷰 등록에 실패했습니다",
        description: "다시 시도해 주세요.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewForm) => {
    createReviewMutation.mutate(data);
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating);
  };

  // Calculate average rating
  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="py-12 md:py-16 bg-muted/30" data-testid="review-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Rating Summary */}
          <div className="text-center">
            <h2 className="font-display font-bold text-3xl mb-4" data-testid="text-reviews-title">
              고객 리뷰
            </h2>
            {reviews && reviews.length > 0 ? (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-primary" data-testid="text-average-rating">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">/ 5.0</span>
                </div>
                <div className="flex gap-1" data-testid="stars-average">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 ${
                        star <= Math.round(averageRating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground" data-testid="text-review-count">
                  {reviews.length}개의 리뷰
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground" data-testid="text-no-reviews">
                아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!
              </p>
            )}
          </div>

          <Separator />

          {/* Review Form */}
          <Card className="p-6" data-testid="card-review-form">
            <h3 className="font-semibold text-xl mb-4">리뷰 작성</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">별점</label>
                <div className="flex gap-1" data-testid="stars-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                      data-testid={`button-star-${star}`}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoverRating || selectedRating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <p className="text-xs text-destructive mt-1" data-testid="error-rating">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">제목</label>
                <Input
                  {...register("title")}
                  placeholder="리뷰 제목을 입력하세요"
                  data-testid="input-review-title"
                />
                {errors.title && (
                  <p className="text-xs text-destructive mt-1" data-testid="error-title">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-medium mb-2">내용</label>
                <Textarea
                  {...register("body")}
                  placeholder="제품에 대한 의견을 자유롭게 작성해주세요"
                  rows={4}
                  data-testid="textarea-review-body"
                />
                {errors.body && (
                  <p className="text-xs text-destructive mt-1" data-testid="error-body">
                    {errors.body.message}
                  </p>
                )}
              </div>

              {/* Author Name */}
              <div>
                <label className="block text-sm font-medium mb-2">이름</label>
                <Input
                  {...register("authorName")}
                  placeholder="이름을 입력하세요"
                  data-testid="input-author-name"
                />
                {errors.authorName && (
                  <p className="text-xs text-destructive mt-1" data-testid="error-author-name">
                    {errors.authorName.message}
                  </p>
                )}
              </div>

              {/* Author Email */}
              <div>
                <label className="block text-sm font-medium mb-2">이메일</label>
                <Input
                  {...register("authorEmail")}
                  type="email"
                  placeholder="이메일을 입력하세요"
                  data-testid="input-author-email"
                />
                {errors.authorEmail && (
                  <p className="text-xs text-destructive mt-1" data-testid="error-author-email">
                    {errors.authorEmail.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={createReviewMutation.isPending}
                className="w-full"
                data-testid="button-submit-review"
              >
                {createReviewMutation.isPending ? "등록 중..." : "리뷰 등록"}
              </Button>
            </form>
          </Card>

          <Separator />

          {/* Review List */}
          <div className="space-y-4" data-testid="review-list">
            <h3 className="font-semibold text-xl">리뷰 목록</h3>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8" data-testid="text-loading-reviews">
                리뷰를 불러오는 중...
              </p>
            ) : reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id} className="p-6" data-testid={`review-${review.id}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold" data-testid={`review-title-${review.id}`}>
                        {review.title}
                      </h4>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground" data-testid={`review-date-${review.id}`}>
                      {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <p className="text-foreground/90 mb-3" data-testid={`review-body-${review.id}`}>
                    {review.body}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`review-author-${review.id}`}>
                    {review.authorName}
                  </p>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8" data-testid="text-empty-reviews">
                아직 리뷰가 없습니다
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
