import PlaceCard from '@/components/ui/PlaceCard';
import Spinner from '@/components/ui/Spinner';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { usePlaces } from '../../hooks';

const IndexPage = () => {
  const allPlaces = usePlaces();
  const { places, loading } = allPlaces;
  const { t } = useTranslation();

  // const FakePlaces = [
  //   {
  //     _id : 1 ,
  //     placeId : 1 ,
  //     photos : ["/public/assets/fakeImages/1.jpg"] ,
  //     address : "منطقة طبربور حي ابراهيم" ,
  //     title : "فيلا فخمة للبيع" ,
  //     price: "1000",
  //   } ,
  //   {
  //     _id : 2 ,
  //     placeId : 2 ,
  //     photos : ["/public/assets/fakeImages/2.jpg"] ,
  //     address : "عمان حي السعادة" ,
  //     title : "منزل للايجار وقضاء العطلة" ,
  //     price: "6500",
  //   } ,
  //   {
  //     _id : 3 ,
  //     placeId : 3 ,
  //     photos : ["/public/assets/fakeImages/3.jpg"] ,
  //     address : "عمان حي القدس" ,
  //     title : "شقة للييع بتمن مناسب" ,
  //     price: "2500",
  //   } ,
  //   {
  //     _id : 4 ,
  //     placeId : 4 ,
  //     photos : ["/public/assets/fakeImages/4.jpg"] ,
  //     address : "مراكش الشرف" ,
  //     title : "فيلا مع مسبح" ,
  //     price: "10050",
  //   } ,

  // ]

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Helmet>
        <title>{t('app_name')}</title>
      </Helmet>
      <div className="grid grid-cols-1 justify-items-center px-4 py-32 md:grid-cols-2 md:gap-0 lg:grid-cols-3 lg:gap-2 xl:grid-cols-4 xl:gap-10">
        {places.length > 0 ? (
          places.map((place) => <PlaceCard place={place} key={place.id} />)
        ) : (
          <div className="absolute left-1/2 right-1/2 top-40 flex  w-full -translate-x-1/2 transform flex-col p-10  md:w-1/2">
            <h1 className="text-3xl font-semibold">Result not found!</h1>
            <p className="text-lg font-semibold">
              Sorry, we couldn&#39;t find the place you&#39;re looking for.
            </p>
            <button className="mt-4 w-32 rounded-full bg-primary p-2 text-white">
              <a href="/" className="flex items-center justify-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="h-5 w-5"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Go back
              </a>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default IndexPage;
