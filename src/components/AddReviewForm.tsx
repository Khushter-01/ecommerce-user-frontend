import { useState } from 'react';
import { Star } from 'lucide-react';
import api from '@/api/axios';
import { toast } from 'sonner';

const AddReviewForm = ({ productId, onSubmitted }: { productId: string; onSubmitted: () => void }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      toast.success('Review submitted!');
      onSubmitted();
      setRating(0);
      setComment('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-5 mt-4">
      <h4 className="text-sm font-semibold text-foreground mb-3">Write a Review</h4>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map(i => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star
              size={24}
              className={`transition-colors ${i <= (hoverRating || rating) ? 'fill-warning text-warning' : 'text-muted'}`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Share your experience..."
        rows={3}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-3"
      />
      <button
        type="submit"
        disabled={submitting}
        className="h-9 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default AddReviewForm;
