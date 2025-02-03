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


  if (!user) {
    navigate('/login');
  }

  if (user.limitPosts < 1) {
    return (
      <div className="flex h-full items-center justify-center">
        <h1 className="text-2xl font-semibold text-red-600">
          {t('limit_reached')}
        </h1>
      </div>
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
