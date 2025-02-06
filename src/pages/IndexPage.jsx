import PlaceCard from '@/components/ui/PlaceCard';
import Spinner from '@/components/ui/Spinner';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { usePlaces } from '../../hooks';

const IndexPage = () => {
  const allPlaces = usePlaces();
  const { places, loading } = allPlaces;
  const { t } = useTranslation();

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Helmet>
        <title>{t('app_name')}</title>
      </Helmet>
      <div
        className={`grid grid-cols-1 justify-items-center px-4 py-32 sm:grid-cols-2 md:gap-4 ${places.length > 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} lg:gap-8 xl:grid-cols-4`}
      >
        {places.length > 0 ? (
          places.map((place) => <PlaceCard place={place} key={place.id} />)
        ) : (
          <div className="mx-auto p-10">
            <h1 className="text-3xl font-semibold">Result not found!</h1>
            <p className="text-lg font-semibold">
              Sorry, we couldn&#39;t find the place you&#39;re looking for.
            </p>
            <button type="button" className="mt-4 w-32 rounded-full bg-primary p-2 text-white">
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
                  <title>Back</title>
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
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
