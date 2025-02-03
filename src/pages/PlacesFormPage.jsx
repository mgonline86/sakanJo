import PlaceForm from '@/components/PlaceForm';
import AccountNav from '@/components/ui/AccountNav';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { PlaceFormProvider, getPlacePhotos } from '@/context/PlaceFormContext';
import { ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks';

export default function PlacesFormPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const [place, setPlace] = useState();
  const [photos, setPhotos] = useState();
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    async function fetchPlace() {
      try {
        const response = await axios.get(
          `https://backend.sakanijo.com/api/places/${id}`,
        );
        setPlace(response.data);
        setPhotos(
          await getPlacePhotos(response.data.photos, response.data.folderName),
        );
      } catch (error) {
        console.error('Error fetching place:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlace();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  /* Check if the user is the owner of the place */
  if (place !== undefined && place?.owner_id !== user?.id) {
    return (
      <>
        <AccountNav />
        <h2 className="mt-12 text-center text-2xl font-semibold text-red-500 md:text-4xl">
          {t('unauthorized_error')}
        </h2>
        <Button
          onClick={() => navigate('/account/places')}
          className="mx-auto mt-6 w-full max-w-xs"
        >
          <ArrowBack className="me-2" /> {t('back')}
        </Button>
      </>
    );
  }

  return (
    <>
      <AccountNav />
      <PlaceFormProvider place={place} photos={photos}>
        <PlaceForm id={id} />
      </PlaceFormProvider>
    </>
  );
}
