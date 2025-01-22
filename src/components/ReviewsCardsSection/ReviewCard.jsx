import { AccountCircle } from '@mui/icons-material';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ReviewStars from '../ReviewStars';
import RatingStarsRow from '../RatingStarsRow';

export default function ReviewCard({
  review: {
    avatar,
    comment,
    created_at,
    id,
    image_name,
    name,
    rating,
    user_id,
  },
}) {
  const image = `https://backend.sakanijo.com/api/images/${image_name}`;
  return (
    <div className="space-y-2 rounded-[0.75rem] border border-[#848EA020] bg-white px-2.5 py-3 md:space-y-5 md:px-5 md:py-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="h-10 w-10 rounded-full md:h-12 md:w-12">
            <Avatar>
              {image ? (
                <AvatarImage src={image} />
              ) : (
                <AccountCircle className="h-12 w-12" />
              )}

              <AvatarFallback className="text-3xl uppercase">
                {name.slice([0], [1])}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <p className="text-sm font-medium md:text-base">{name}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <RatingStarsRow ratingValue={rating} starClasses="h-4 w-4" />({rating.toFixed(1)})
        </div>
      </div>
      <p className="bg-muted-100/20 rounded-[0.75rem] p-2.5 text-sm md:p-5 md:text-base">
        {comment}
      </p>
    </div>
  );
}