import { useTranslation } from 'react-i18next';

const PlaceCard = ({ place }) => {
  const { id, address, title, price, sponsored } = place;
  const photos = place.photos?.split(',');

  const { t } = useTranslation();

  const sellingMethodTranslations = {
    rent: 'إيجار',
    buy: 'شراء',
    booking: 'حجز',
  };

  return (
    <a href={`/place/${id}`} className="m-4 flex flex-col md:m-2 xl:m-0">
      <div className="card  relative">
        {photos?.[0] && (
          <div className="relative h-4/5 w-full rounded-xl">
            <img
              src={`https://backend.sakanijo.com/api/images/${encodeURIComponent(place.folderName)}/${encodeURIComponent(photos[0])}`}
              className="h-full w-full rounded-xl object-cover"
              alt={place.title}
            />
            {!!sponsored && (
              <span className="absolute bottom-2 right-2 z-10 rounded-lg bg-green-500 px-2 py-1 text-xs font-bold text-white">
                {t('sponsored')}
              </span>
            )}
            <div
              className="absolute left-2 top-2"
              style={{
                padding: '5px',
                paddingLeft: '15px',
                paddingRight: '15px',
                backgroundColor: '#467c9d',
                borderRadius: '10px',
              }}
            >
              <p style={{ color: 'white', fontSize: 16 }}>
                {sellingMethodTranslations[place.buy_or_rent] ||
                  place.buy_or_rent}
              </p>
            </div>
          </div>
        )}
        <h2 className="truncate font-bold" style={{ textAlign: 'right' }}>
          {address}
        </h2>
        <h3
          className="truncate text-sm text-gray-500"
          style={{ textAlign: 'right' }}
        >
          {title}
        </h3>
        <div className="mt-1" style={{ textAlign: 'right' }}>
          <span className="font-semibold">{price} JOD </span>
        </div>
      </div>
    </a>
  );
};

export default PlaceCard;
