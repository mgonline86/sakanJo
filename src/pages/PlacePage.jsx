import AddReviewForm from '@/components/AddReviewForm';
import ImagesGallery from '@/components/ImagesGallery';
import {
  dayHoursHomeTypes,
  hajezVariesNegelectedTypes,
} from '@/components/PlaceForm';
import ReviewStars from '@/components/ReviewStars';
import ReviewsCardsSection from '@/components/ReviewsCardsSection';
import ShareButton from '@/components/ShareModal';
import SimilarProducts from '@/components/SimmilarPosts';
import AddressLink from '@/components/ui/AddressLink';
import Spinner from '@/components/ui/Spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  AccountCircle,
  ArrowDropDownCircle,
  Campaign,
  Favorite,
  FileOpen,
  Phone,
  ThumbUp,
  Visibility,
  WhatsApp,
} from '@mui/icons-material';
import axios from 'axios';
import { format, formatDistance } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks';
import NotFoundPage from './NotFoundPage';

export default function PlacePageNew() {
  const { id } = useParams();
  const { user } = useAuth();
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

  const userHasReviewed = useMemo(() => {
    if (!user) {
      return false;
    }

    return reviews?.reviews?.some((review) => review.user_id === user.id);
  }, [user, reviews]);

  if (loading) {
    return <Spinner />;
  }

  if (!place || !place.approved) {
    return <NotFoundPage />;
  }

  const photos = place.photos?.split(',');

  const { bathroom, kitchen, rooms, stages } =
    JSON.parse(JSON.parse(place.number_of_rooms)) || {};

  const amenities = JSON.parse(JSON.parse(place.amenities));

  const getDocument = (folderName, document) => {
    if (!document || !folderName) return;
    // check file extension
    const isPDF = document.split('.').pop() === 'pdf';

    if (isPDF) {
      return `https://backend.sakanijo.com/api/images/${encodeURIComponent(folderName)}/${encodeURIComponent(document)}`;
    }

    return `https://backend.sakanijo.com/api/images/${encodeURIComponent(folderName)}/${encodeURIComponent(document)}`;
  };

  const [timeStart, timeEnd] = (() => {
    if (place?.timeOpen?.length > 2) {
      const { start, end } = JSON.parse(place.timeOpen);
      return [start, end];
    }
    return [null, null];
  })();

  const getHajezDays = (daysJSONString) => {
    try {
      const days = JSON.parse(JSON.parse(daysJSONString));
      return days;
    } catch {
      return [];
    }
  };

  const getHajezDaysPrices = (variable_prices) => {
    try {
      const daysPrices = JSON.parse(JSON.parse(variable_prices));
      return Object.entries(daysPrices);
    } catch {
      return [];
    }
  };

  const getCalanderDaysPrice = (calanderDaysPrice) => {
    try {
      const daysPrices = JSON.parse(calanderDaysPrice);
      return Object.entries(daysPrices);
    } catch {
      return [];
    }
  };

  const onReviewAdded = (data) =>
    setReviews((prev) => ({
      ...prev,
      reviews: [...prev.reviews, data.review],
    }));

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
        <div className="relative h-72 w-full rounded-xl border md:sticky md:top-24 md:h-96 md:w-1/2 md:flex-1">
          {!!place?.sponsored && (
            <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-lg bg-green-500 px-2 py-1 text-xs font-bold text-white">
              <Campaign className="h-5 w-5 rtl:-scale-x-100" />
              <span>{t('sponsored')}</span>
            </div>
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

          <div className="my-4 flex flex-col gap-0.5">
            <AddressLink
              placeAddress={place?.address}
              longitude={place?.lng}
              latitude={place?.lat}
              className="block"
            />

            {/* STREET */}
            {place?.street && (
              <span className="text-sm text-muted-foreground">
                الشارع: {place?.street}
              </span>
            )}

            {/* CLOSE PLACE */}
            {place?.closePlace && (
              <span className="text-sm text-muted-foreground">
                علامة مميزة: {place?.closePlace}
              </span>
            )}
          </div>

          {/* ROOMS */}
          {['فيلا / منزل', 'شقة'].includes(place?.home_type) && (
            <div className="flex flex-wrap gap-2 text-[0.6rem] text-muted-foreground md:text-sm">
              {!!bathroom && (
                <span>
                  {bathroom} {t('bathroom')}
                </span>
              )}
              {!!bathroom && !!kitchen && <span>.</span>}
              {!!kitchen && (
                <span>
                  {kitchen} {t('kitchen')}
                </span>
              )}
              {!!kitchen && !!rooms && <span>.</span>}
              {!!rooms && (
                <span>
                  {rooms} {t('rooms')}
                </span>
              )}
              {place?.home_type === 'فيلا / منزل' && !!rooms && !!stages && (
                <span>.</span>
              )}
              {place?.home_type === 'فيلا / منزل' && !!stages && (
                <span>
                  {stages} {t('stages')}
                </span>
              )}
            </div>
          )}

          {/* SPACE GENERAL */}
          {place?.space_general && (
            <div className="my-2">
              {place?.space_general} m<sup>2</sup>
            </div>
          )}

          {/* PRICE & REACTIONS */}
          <div className="my-2 flex flex-wrap items-center gap-3 text-xs">
            {!!place?.heartSave || !!place?.liked ? `${t('reactions')} |` : ''}
            {!!place?.heartSave && (
              <span className="flex items-center gap-0.5">
                <Favorite className="h-3.5 w-3.5" />
                {place?.heartSave}
              </span>
            )}
            {!!place?.liked && (
              <span className="flex items-center gap-0.5">
                <ThumbUp className="h-3.5 w-3.5" />
                {place?.liked}
              </span>
            )}
            {!!place?.viewers && (
              <span className="flex items-center gap-0.5">
                <Visibility className="h-3.5 w-3.5" />
                {place?.viewers}
              </span>
            )}

            {!!place?.price && !place?.priceHide && (
              <span className="flex-grow text-end text-lg font-semibold md:text-3xl">
                {place?.price} JOD
              </span>
            )}
          </div>

          {/* ADS ACCEPT */}
          {place?.ads_accept && (
            <div className="my-2 flex flex-wrap items-center gap-1 text-xs">
              <span className="text-muted-foreground">
                قابل للتقسيط و التفاوض؟
              </span>
              <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                {place.ads_accept}
              </span>
            </div>
          )}

          {/* Owner */}
          <hr />
          <div className="my-4">
            <div className="flex flex-wrap justify-between gap-2">
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

                  <ShareButton
                    shareLink={`https://place.sakanijo.com/place?id=${id}`}
                  />
                </div>
              </div>
            </div>
            {/* PUBLISHER STATE */}
            {place?.publisher_state && (
              <div className="my-2 flex flex-wrap items-center gap-1 text-xs">
                <span className="text-muted-foreground">حالة المعلن</span>
                <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                  {place.publisher_state}
                </span>
              </div>
            )}
          </div>

          {/* AMENITIES */}
          {amenities.length > 0 && (
            <>
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
            </>
          )}

          {/* DESCRIPTION */}
          {place?.description && (
            <>
              <hr />
              <div className="my-2">
                <div className="my-4">
                  <h2 className="text-2xl font-semibold">
                    {t('description_t')}
                  </h2>
                  {place.description}
                </div>
              </div>
            </>
          )}

          {/* IF RENT */}
          {place?.buy_or_rent === 'للإيجار' && place?.rent_type && (
            <>
              <hr />
              <div className="my-4 flex flex-wrap gap-2">
                {place?.rent_type && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      نوع الايجار
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.rent_type}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* IF HAJEZ */}
          {place?.buy_or_rent === 'الحجز' && !place?.priceHide && (
            <>
              <hr />
              <div className="my-4 flex flex-wrap gap-2">
                {!!place?.priceBeforeNoon && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      السعر قبل الظهيرة
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.priceBeforeNoon} JOD
                    </span>
                  </div>
                )}
                {!!place?.priceAfterNoon && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      السعر بعد الظهيرة
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.priceAfterNoon} JOD
                    </span>
                  </div>
                )}
                {!hajezVariesNegelectedTypes.includes(place?.home_type) && (
                  <>
                    {place?.hajez_days?.length > 2 && (
                      <>
                        <hr className="w-full" />
                        <div className="flex flex-col gap-2">
                          <h3>الأيام المتاحة للحجز</h3>
                          <div className="my-4 flex flex-wrap gap-2">
                            {getHajezDays(place.hajez_days).map((day) => (
                              <div
                                key={day}
                                className="rounded-sm border px-2 py-1 text-xs font-bold md:rounded-lg md:px-4 md:py-2 md:text-sm"
                              >
                                {day}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {place?.variable_prices?.length > 2 && (
                      <>
                        <hr className="w-full" />
                        <div className="flex flex-col gap-2">
                          <h3>أسعار أيام الحجز</h3>
                          <div className="flex flex-wrap gap-2">
                            {getHajezDaysPrices(place.variable_prices).map(
                              (dayPrice) => {
                                if (!dayPrice[0] || !dayPrice[1]) return null;
                                return (
                                  <div
                                    key={dayPrice[0]}
                                    className="rounded-sm border px-2 py-1 text-xs md:rounded-lg md:px-4 md:py-2 md:text-sm"
                                  >
                                    {dayPrice[1] && (
                                      <>
                                        <span className="font-bold">
                                          {dayPrice[0]}
                                        </span>
                                        : {dayPrice[1]} JOD
                                      </>
                                    )}
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    {place?.calanderDaysPrice?.length > 2 && (
                      <>
                        <hr className="w-full" />
                        <Collapsible className="rounded-lg border p-2">
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="link"
                              className="flex h-4 items-center gap-1 bg-transparent p-0"
                            >
                              أسعار أيام معينة(
                              {
                                getCalanderDaysPrice(place.calanderDaysPrice)
                                  .length
                              }
                              )
                              <ArrowDropDownCircle className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="my-2 flex flex-wrap gap-2 text-xs md:text-sm">
                              {getCalanderDaysPrice(
                                place.calanderDaysPrice,
                              ).map((dayPrice) => {
                                if (!dayPrice[0] || !dayPrice[1]) return null;
                                return (
                                  <div
                                    key={dayPrice[0]}
                                    className="flex items-center gap-1 rounded-sm border px-2 py-1"
                                  >
                                    <span className="font-bold">
                                      {format(dayPrice[0], 'PPPP', {
                                        locale:
                                          currentLanguage === 'ar'
                                            ? arSA
                                            : enUS,
                                      })}
                                      :
                                    </span>
                                    {dayPrice[1]} JOD
                                  </div>
                                );
                              })}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          {/* DayHours HomeTypes */}
          {dayHoursHomeTypes.includes(place?.home_type) &&
            place?.timeOpen.length > 2 && (
              <>
                {(timeStart || timeEnd) && <hr />}
                <div className="flex flex-wrap gap-2">
                  {timeStart && (
                    <div className="flex min-w-fit flex-1 flex-col gap-1">
                      <span className="text-sm text-muted-foreground">
                        ميعاد الفتح
                      </span>
                      <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                        {timeStart}
                      </span>
                    </div>
                  )}
                  {timeEnd && (
                    <div className="flex min-w-fit flex-1 flex-col gap-1">
                      <span className="text-sm text-muted-foreground">
                        ميعاد الاغلاق
                      </span>
                      <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                        {timeEnd}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

          {/* POOL & GYM */}
          {['مسابح', 'صالات رياضة'].includes(place?.home_type) && (
            <>
              <hr />
              <div className="my-4 flex flex-wrap gap-2">
                {place?.poolType && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      نوع المكان
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.poolType}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* POOL */}
          {place?.home_type === 'مسابح' && (
            <>
              <hr />
              <div className="my-4 flex flex-wrap gap-2">
                {place?.deepPool && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      عمق المسبح
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.deepPool}
                    </span>
                  </div>
                )}
                {place?.poolDocument && place?.folderName && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      مستند المسبح
                    </span>
                    <a
                      className="max-w-fit rounded-sm bg-gray-100 px-2 py-1"
                      href={getDocument(place.folderName, place.poolDocument)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileOpen />
                    </a>
                  </div>
                )}
              </div>
            </>
          )}

          {/* STORES AND WAREHOUSES */}
          {place?.home_type === 'محلات ومخازن' && (
            <>
              <hr />
              <div className="my-4 flex flex-wrap gap-2">
                <div className="flex min-w-fit flex-1 flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    يحتوى على سده؟
                  </span>
                  <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                    {String(place?.containSdah) === 'true' ? 'نعم' : 'لا'}
                  </span>
                </div>
                <div className="flex min-w-fit flex-1 flex-col gap-1">
                  <span className="text-sm text-muted-foreground">إخلاء</span>
                  <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                    {String(place?.evacuation) === 'true' ? 'نعم' : 'لا'}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* FARM */}
          {place?.home_type === 'مزرعة' && (
            <>
              <hr />
              <div className="my-4 flex flex-wrap gap-2">
                {place?.farm_has_house && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      تحتوي على منزل؟
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.farm_has_house}
                    </span>
                  </div>
                )}
                {place?.farm_has_water && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      تحتوي على مياه؟
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.farm_has_water}
                    </span>
                  </div>
                )}
                {place?.farm_has_farmed && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      مزروعة؟
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.farm_has_farmed}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* LAND */}
          {['أرض', 'ارض'].includes(place?.home_type) && (
            <>
              <hr />
              <div className="my-4 flex flex-wrap gap-2">
                {place?.land_in_face_of_street && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      امامها شارع؟
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.land_in_face_of_street}
                    </span>
                  </div>
                )}
                {!!place?.number_of_streets_in_land && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      عدد الشوارع امام الأرض
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.number_of_streets_in_land}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* APARTMENT */}
          {place?.home_type === 'شقة' && (
            <>
              <hr />
              <div className="my-4 flex flex-wrap gap-2">
                {!!place?.number_of_home_stage && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      رقم الطابق
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.number_of_home_stage}
                    </span>
                  </div>
                )}
                {!!place?.total_stages && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      عدد الطوابق بالمبنى
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.total_stages}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TRIP */}
          {place?.home_type === 'تنظيم رحلات' && (
            <>
              <hr />
              <div className="my-4 flex flex-wrap gap-2">
                {place?.tripLong && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      مدة الرحلة
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {t(place.tripLong)}
                    </span>
                  </div>
                )}
                {place?.tripDate && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      تاريخ الرحلة
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {format(new Date(place.tripDate), 'PPPP', {
                        locale: currentLanguage === 'ar' ? arSA : enUS,
                      }) || place.tripDate}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* CHALET */}
          {place?.home_type === 'شليهات' &&
            place?.challetDocument &&
            place?.folderName && (
              <>
                <hr />
                <div className="my-4 flex flex-wrap gap-2">
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      مستند الشليه
                    </span>
                    <a
                      className="max-w-fit rounded-sm bg-gray-100 px-2 py-1"
                      href={getDocument(
                        place.folderName,
                        place.challetDocument,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileOpen />
                    </a>
                  </div>
                </div>
              </>
            )}

          {/* MEETING ROOMS */}
          {place?.home_type === 'قاعات اجتماعات' && (
            <>
              <hr />
              <div className="my-4 flex flex-wrap gap-2">
                {place?.meetingRoomType && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      نوع القاعة
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.meetingRoomType}
                    </span>
                  </div>
                )}
                {!!place?.countPeople && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      عدد الاشخاص المسموح
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.countPeople}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          {/* GYM */}
          {place?.home_type === 'صالات رياضة' && (
            <>
              <hr />
              <div className="my-4 flex flex-wrap gap-2">
                {place?.subscriptionTypeGym && (
                  <div className="flex min-w-fit flex-1 flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      نوع الاشتراك
                    </span>
                    <span className="max-w-fit rounded-sm bg-gray-100 px-2 py-1">
                      {place.subscriptionTypeGym}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
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

      {user ? (
        <>
          {!userHasReviewed && (
            <div className="flex flex-col">
              <h2 className="mb-1 text-2xl font-semibold">{t('add_review')}</h2>
              <AddReviewForm place_id={id} onSuccess={onReviewAdded} />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">{t('login_to_review')}</h2>
          <Button asChild className="w-full max-w-sm">
            <Link to="/login">{t('login')}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
