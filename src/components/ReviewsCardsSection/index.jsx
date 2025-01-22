import { useTranslation } from 'react-i18next';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ReviewCard from './ReviewCard';

export default function ReviewsCardsSection({ reviews }) {
  const { t } = useTranslation();

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="relative mx-auto my-12 flex w-full flex-col items-center justify-center gap-6 overflow-hidden">
      <h2
        id="reviews"
        className="xs:whitespace-break-spaces xs:text-base w-4/5 max-w-4xl text-balance text-center text-sm font-semibold sm:text-xl md:text-4xl md:leading-tight lg:text-[2.75rem]"
      >
        {t('reviews')}
      </h2>
      <div className="w-full max-w-[135rem]">
        <Swiper
          slidesPerView={1}
          spaceBetween={16}
          autoplay={{
            pauseOnMouseEnter: true,
            delay: 10000,
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
          }}
          loop
          pagination={{
            el: '.custom-pagination',
            clickable: true,
          }}
          modules={[Autoplay, Pagination]}
          wrapperClass="items-center"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div>
        <div className="custom-pagination mx-auto" />
      </div>
    </div>
  );
}
