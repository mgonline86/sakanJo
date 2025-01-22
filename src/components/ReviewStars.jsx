import { useTranslation } from 'react-i18next';
import RatingStarsRow from './RatingStarsRow';

export default function ReviewStars({ reviews }) {
  const { t } = useTranslation();

  const reviewsValue = Number(reviews.average_rating);

  if (!reviewsValue) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
      <div className="flex items-center gap-2">
        <RatingStarsRow ratingValue={reviewsValue} />
        <span className="text-muted-foreground">
          {Number(reviews.average_rating).toFixed(1)}
        </span>
      </div>
      <span className="text-muted-foreground">
        ({reviews.total_reviews} {t('review')})
      </span>
    </div>
  );
}
