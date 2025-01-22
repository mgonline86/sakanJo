import { Star, StarOutline } from '@mui/icons-material';

export default function RatingStarsRow({ ratingValue, starClasses="h-4 w-4 md:h-6 md:w-6" }) {
  const reviewPercentage = (ratingValue / 5).toFixed(1);

  return (
    <div className="relative">
      <div
        className="absolute start-0 top-0 z-10 flex w-[var(--review-percentage)] gap-1 overflow-hidden"
        style={{ '--review-percentage': `${reviewPercentage * 100}%` }}
      >
        <Star className={starClasses} />
        <Star className={starClasses} />
        <Star className={starClasses} />
        <Star className={starClasses} />
        <Star className={starClasses} />
      </div>
      <div className="flex gap-1">
        <StarOutline className={starClasses} />
        <StarOutline className={starClasses} />
        <StarOutline className={starClasses} />
        <StarOutline className={starClasses} />
        <StarOutline className={starClasses} />
      </div>
    </div>
  );
}
