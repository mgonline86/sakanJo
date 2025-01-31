import ImagesGallery from '@/components/ImagesGallery';
import ReviewStars from '@/components/ReviewStars';
import ReviewsCardsSection from '@/components/ReviewsCardsSection';
import ShareButton from '@/components/ShareModal';
import SimilarProducts from '@/components/SimmilarPosts';
import AddressLink from '@/components/ui/AddressLink';
import BookingWidget from '@/components/ui/BookingWidget';
import PerksWidget from '@/components/ui/PerksWidget';
import Spinner from '@/components/ui/Spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  AccountCircle,
  Favorite,
  Phone,
  ThumbUp,
  Visibility,
  WhatsApp,
} from '@mui/icons-material';
import axios from 'axios';
import { formatDistance } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

export default function PlacePageNew() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchPlace() {
      try {
        const response = await axios.get(
          `https://backend.sakanijo.com/api/places/${id}`,
        );
        setPlace(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching place:', error);
        setLoading(false);
      }
    }

    fetchPlace();
  }, [id]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await axios.get(
          `https://backend.sakanijo.com/reviews/${id}?page=1`,
        );
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }

    fetchReviews();
  }, [id]);

  const ownerPictureLink = useMemo(() => {
    if (!place) {
      return null;
    }

    const { owner_picture, owner_image_name } = place;

    if (owner_picture === 100) {
      return `https://backend.sakanijo.com/user/profile-picture/${owner_image_name}`;
    }

    return `/assets/publisherUsers/${owner_picture}.png`;
  }, [place]);

  if (loading) {
    return <Spinner />;
  }

  if (!place) {
    return <NotFoundPage />;
  }

  const photos = place.photos?.split(',');

  const { bathroom, kitchen, rooms, stages } = JSON.parse(
    JSON.parse(place.number_of_rooms),
  );

  const amenities = JSON.parse(JSON.parse(place.amenities));

  return (
    <div className="container mt-20 px-5 md:mt-28">
      <Helmet>
        <title>{`${place?.title} | ${t('app_name')}`}</title>
        <meta name="description" content={place?.description} />
        {/* Open Graph Meta Tags for WhatsApp */}
        <meta property="og:title" content={place?.title} />
        <meta property="og:description" content={place?.description} />
        <meta
          property="og:image"
          content={`https://backend.sakanijo.com/api/images/${place?.folderName}/${photos[0]}`}
        />
        {/* Replace with the URL of the image you want to display */}
        <meta
          property="og:url"
          content={`https://sakanijo.com/place/${place?.id}`}
        />
        {/* Replace with the full URL of this specific page */}
        {/* Optional Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sakani Jo" />
      </Helmet>
      <div className="relative mb-14 flex flex-col justify-center gap-10 md:flex-row">
        <div className="relative top-0 h-72 w-full rounded-xl border md:sticky md:h-96 md:w-1/2 md:flex-1">
          {!!place.sponsored && (
            <span className="absolute bottom-2 right-2 z-10 rounded-lg bg-green-500 px-2 py-1 text-xs font-bold text-white">
              {t('sponsored')}
            </span>
          )}
          <div
            className="absolute left-2 top-2 z-10"
            style={{
              padding: '5px',
              paddingLeft: '15px',
              paddingRight: '15px',
              backgroundColor: '#467c9d',
              borderRadius: '10px',
            }}
          >
            <p style={{ color: 'white', fontSize: 16 }}>
              {t(place.buy_or_rent) || place.buy_or_rent}
            </p>
          </div>
          <ImagesGallery
            images={photos.map(
              (photo) =>
                `https://backend.sakanijo.com/api/images/${place.folderName}/${photo}`,
            )}
          />
        </div>
        <div className="md:flex-1">
          <h1 className="text-3xl" style={{ fontWeight: '700' }}>
            {place?.title}
          </h1>

          <h4 className="mt-1">
            {t('ad_number')}: {place?.id}
          </h4>

          <div className="my-2">
            <ReviewStars reviews={reviews} />
          </div>

          <AddressLink
            placeAddress={place?.address}
            longitude={place?.lng}
            latitude={place?.lat}
          />

          <div className="flex flex-wrap gap-2 text-[0.6rem] text-muted-foreground md:text-sm">
            {bathroom > 0 && (
              <span>
                {bathroom} {t('bathroom')}
              </span>
            )}
            {bathroom > 0 && kitchen > 0 && <span>.</span>}
            {kitchen > 0 && (
              <span>
                {kitchen} {t('kitchen')}
              </span>
            )}
            {kitchen > 0 && rooms > 0 && <span>.</span>}
            {rooms > 0 && (
              <span>
                {rooms} {t('rooms')}
              </span>
            )}
            {rooms > 0 && stages > 0 && <span>.</span>}
            {stages > 0 && (
              <span>
                {stages} {t('stages')}
              </span>
            )}
          </div>

          {place?.space_general && (
            <div className="my-2">
              {place?.space_general} m<sup>2</sup>
            </div>
          )}

          <div className="my-2 flex flex-wrap items-center gap-3 text-xs">
            {place?.heartSave > 0 || place?.liked > 0
              ? `${t('reactions')} |`
              : ''}
            {place?.heartSave > 0 && (
              <span className="flex items-center gap-0.5">
                <Favorite className="h-3.5 w-3.5" />
                {place?.heartSave}
              </span>
            )}
            {place?.liked > 0 && (
              <span className="flex items-center gap-0.5">
                <ThumbUp className="h-3.5 w-3.5" />
                {place?.liked}
              </span>
            )}
            {place?.viewers > 0 && (
              <span className="flex items-center gap-0.5">
                <Visibility className="h-3.5 w-3.5" />
                {place?.viewers}
              </span>
            )}

            {place?.price > 0 && !place?.priceHide && (
              <span className="flex-grow text-end text-lg font-semibold md:text-3xl">
                {place?.price} JOD
              </span>
            )}
          </div>

          <hr />

          <div className="my-4 flex flex-wrap justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-12 w-12">
                <Avatar>
                  {ownerPictureLink ? (
                    <AvatarImage src={ownerPictureLink} />
                  ) : (
                    <AccountCircle className="h-12 w-12" />
                  )}

                  <AvatarFallback className="text-3xl uppercase">
                    {place?.ownerName.slice([0], [1])}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="text-sm md:text-base">
                {t('posted_by')} <span>{place?.ownerName}</span>
                <div className="text-xs">
                  {formatDistance(new Date(place?.date), new Date(), {
                    addSuffix: true,
                    locale: currentLanguage === 'ar' ? arSA : enUS,
                  })}
                </div>
              </div>
            </div>
            <div className="flex-grow md:flex-grow-0">
              {place.sellingMethod === 'booking' ? (
                <BookingWidget place={place} />
              ) : (
                <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                  {place?.ownerPhone && (
                    <Button
                      variant="outline"
                      asChild
                      className="h-10 w-10 rounded-full text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <a href={`tel:${place?.ownerPhone}`}>
                        <Phone />
                      </a>
                    </Button>
                  )}

                  {place?.ownerPhone && place?.gettingCalls === 'whatsapp' && (
                    <Button
                      variant="outline"
                      asChild
                      className="h-10 w-10 rounded-full text-[#25D366] hover:bg-[#25D366] hover:text-white"
                    >
                      <a
                        href={`https://wa.me/${place.ownerPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WhatsApp />
                      </a>
                    </Button>
                  )}

                  <ShareButton shareLink={window.location.href} />
                </div>
              )}
            </div>
          </div>

          <hr />

          <div className="my-4 flex flex-wrap gap-2">
            {amenities?.map((amenity) => (
              <div
                key={amenity}
                className="rounded-sm bg-gray-100 px-2 py-1 text-xs md:rounded-lg md:px-4 md:py-2 md:text-sm"
              >
                {amenity}
              </div>
            ))}
          </div>

          <hr />

          <div className="my-2">
            <div className="my-4">
              <h2 className="text-2xl font-semibold">{t('description_t')}</h2>
              {place.description}
            </div>

            {place.sellingMethod === 'booking' && (
              <p>Max number of guests: {place.maxGuests}</p>
            )}

            {place.perks && <PerksWidget perks={place?.perks} place={place} />}
          </div>
        </div>
      </div>
      <div className="my-14">
        <SimilarProducts
          homeType={place?.home_type}
          sellType={place?.buy_or_rent}
          placeId={place?.id}
        />
      </div>
      {reviews?.reviews && <ReviewsCardsSection reviews={reviews.reviews} />}
    </div>
  );
}
