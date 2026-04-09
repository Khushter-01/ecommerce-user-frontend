import { Star } from 'lucide-react';

interface Review {
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="border-b border-border py-4 last:border-0">
    <div className="flex items-center gap-2 mb-1">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
        {review.name?.[0]?.toUpperCase() || 'U'}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{review.name}</p>
        <p className="text-[10px] text-muted-foreground">{new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
      </div>
    </div>
    <div className="flex items-center gap-0.5 mb-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className={i < review.rating ? 'fill-warning text-warning' : 'text-muted'} />
      ))}
    </div>
    <p className="text-sm text-muted-foreground">{review.comment}</p>
  </div>
);

export default ReviewCard;
