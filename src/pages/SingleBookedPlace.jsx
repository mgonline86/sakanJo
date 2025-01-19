import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import AccountNav from '../components/ui/AccountNav';
import AddressLink from '../components/ui/AddressLink';
import BookingDates from '../components/ui/BookingDates';
import PlaceGallery from '../components/ui/PlaceGallery';
import Spinner from '../components/ui/Spinner';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
const SingleBookedPlace = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [booking, setBooking] = useState({});
  const [loading, setLoading] = useState(false);

  const getBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://backend.sakanijo.com/api/bookings/get/${id}`,
      );

      setBooking(response.data);
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <AccountNav />
      {booking?.place_id ? (
        <div className="p-4">
          <h1 className="text-3xl">{booking?.place?.title}</h1>

          <AddressLink
            className="my-2 block"
            placeAddress={booking.place?.address}
          />
          <div className="my-6 flex flex-col items-center justify-between rounded-2xl bg-gray-200 p-6 sm:flex-row">
            <div className=" ">
              <h2 className="mb-4 text-2xl md:text-2xl">
                {t('Your booking information')}
              </h2>
              <BookingDates booking={booking} />
            </div>
            <div className="mt-5 w-full rounded-2xl bg-primary p-6 text-white sm:mt-0 sm:w-auto">
              <div className="hidden md:block"> {t('totalPrice')} </div>
              <div className="flex justify-center text-3xl">
                <span>JOD{booking?.price}</span>
              </div>
            </div>
          </div>
          <PlaceGallery place={booking?.place} />
        </div>
      ) : (
        <h1> No data</h1>
      )}
    </div>
  );
};

export default SingleBookedPlace;
