import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // For translations
import { Link } from 'react-router-dom'; // For React Router in React JS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './SimilarProducts.css'; // Ensure you have the corresponding CSS file for styling
import { Card, CardContent, CardHeader } from './ui/card';
import { ChevronLeftRounded, ChevronRightRounded } from '@mui/icons-material';

const SimilarProducts = ({ homeType, sellType, placeId }) => {
  const [similarAds, setSimilarAds] = useState([]);
  const { t } = useTranslation(); // Translation hook

  useEffect(() => {
    // Axios fetch data with homeType and sellType
    axios
      .get('https://backend.sakanijo.com/similar-products', {
        params: {
          homeType,
          sellType,
          placeId,
        },
      })
      .then((response) => {
        setSimilarAds(response.data); // Assuming response.data contains the list of ads
      })
      .catch((error) => {
        console.error('Error fetching data:', error.response);
      });
  }, [homeType, sellType, placeId]); // Re-fetch when homeType or sellType changes

  if (similarAds.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-4 text-center text-2xl font-semibold">
        {t('related_ads')}
      </h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 50,
          },
        }}
        loop={true}
        navigation={{
          nextEl: '.next-button',
          prevEl: '.prev-button',
        }}
        modules={[FreeMode, Navigation, Thumbs]}
      >
        {similarAds.map((item) => {
          const photos = item.photos ? item.photos.split(',') : [];
          return (
            <SwiperSlide key={item.id}>
              <Link to={`/place/${item?.id}`}>
                <Card className="overflow-clip">
                  <CardHeader className="px-0 pt-0">
                    <div className="relative">
                      <div className="relative h-52 w-full">
                        <img
                          src={`https://backend.sakanijo.com/api/images/${item.folderName}/${photos[0]}`}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="float-end text-base font-bold text-primary">
                      {item.price}
                    </p>
                    <p className="text-sm text-gray-500">{item.address}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </SwiperSlide>
          );
        })}
        <div className="prev-button absolute left-2 top-1/2 z-10">
          <ChevronLeftRounded className="h-10 w-10 cursor-pointer rounded-full border-2 bg-secondary/50" />
        </div>
        <div className="next-button absolute right-2 top-1/2 z-10">
          <ChevronRightRounded className="h-10 w-10 cursor-pointer rounded-full border-2 bg-secondary/50" />
        </div>
      </Swiper>
    </div>
  );
};

export default SimilarProducts;
