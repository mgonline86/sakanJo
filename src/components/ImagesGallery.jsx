import { ChevronLeftRounded, ChevronRightRounded } from '@mui/icons-material';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function ImagesGallery({ images }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className="h-full w-full">
      <Swiper
        className={`w-full ${images.length > 1 ? 'h-4/5' : 'h-full'}`}
        slidesPerView={1}
        spaceBetween={10}
        loop={true}
        navigation={{
          nextEl: '.next-button',
          prevEl: '.prev-button',
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {images.map((img, index) => (
          <SwiperSlide key={img}>
            <img
              src={img}
              alt={`Slide ${index}`}
              className="h-full w-full object-contain"
            />
          </SwiperSlide>
        ))}
        <div className="prev-button absolute left-2 top-1/2 z-10">
          <ChevronLeftRounded className="h-10 w-10 cursor-pointer rounded-full border-2 bg-secondary/50" />
        </div>
        <div className="next-button absolute right-2 top-1/2 z-10">
          <ChevronRightRounded className="h-10 w-10 cursor-pointer rounded-full border-2 bg-secondary/50" />
        </div>
      </Swiper>
      {images.length > 1 && (
        <Swiper
          className="box-border h-1/5 w-full p-2"
          onSwiper={setThumbsSwiper}
          loop={true}
          spaceBetween={20}
          slidesPerView={4}
          breakpoints={{
            320: {
              slidesPerView: 6,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 6,
              spaceBetween: 30,
            },
            768: {
              slidesPerView: 6,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 8,
              spaceBetween: 10,
            },
          }}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
        >
          {images.map((img, index) => (
            <SwiperSlide
              key={img}
              className="aspect-square cursor-pointer rounded-md border border-gray-300 p-1"
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
