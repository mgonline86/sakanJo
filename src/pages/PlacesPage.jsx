import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import AccountNav from '@/components/ui/AccountNav';
import InfoCard from '@/components/ui/InfoCard';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '../../hooks/index';
import InstallModal from '@/components/ui/InstallAppModal';
import ProductAddPopover from '@/components/ui/AddPlace';
import { Button } from '@/components/ui/button';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const onClose = () => {
    setOpen(false);
  };

  const {t} = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const response = await axios.get(
            `https://backend.sakanijo.com/api/places/by-owner/${user?.id}`,
          );
          setPlaces(response.data.places.reverse());
          setLoading(false);
        }
      } catch (error) {
        // setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user, reload]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <AccountNav />
      <div className="text-center ">
        {/* <Link
          className="inline-flex gap-1 rounded-full bg-primary px-6 py-2 text-white"
          to={'/account/places/new'}
        > */}
        {/* <InstallModal text={"قم بتحميل تطبيق سكني لكي تستطيع نشر اعلاناتك "} /> */}
        {/* </Link> */}

        <Button
          asChild
          className="gap-2 rounded-full px-2 md:flex md:items-center md:px-3 max-w-sm mx-auto"
        >
          <Link to="/account/places/new">
            <Add />{' '}
            <span className="hidden md:block">{t('Add new place')}</span>
          </Link>
        </Button>
      </div>
      <div className="mx-4 mt-4">
        {places.length > 0 &&
          places.map((place) => <InfoCard place={place} key={place.id} />)}
      </div>
      <ProductAddPopover onClose={onClose} open={open} setReload={setReload} />
    </div>
  );
};

export default PlacesPage;
