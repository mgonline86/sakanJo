import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '@/components/ui/Spinner';
import AddressLink from '@/components/ui/AddressLink';
import BookingWidget from '@/components/ui/BookingWidget';
import PlaceGallery from '@/components/ui/PlaceGallery';
import PerksWidget from '@/components/ui/PerksWidget';
import { Helmet } from 'react-helmet';
import ShareButton from "@/components/ShareModal"
import SimilarProducts from "@/components/SimmilarPosts"
import { Box, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button } from '@/components/ui/button';
import { Phone, WhatsApp } from '@mui/icons-material';

const PlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      return '';
    }

    setLoading(true);

    const getPlaceById = async (id) => {
      try {
        const response = await axios.get(
          `https://backend.sakanijo.com/api/places/${id}`,
        );
        setPlace(response.data);
        setLoading(false);
        return response.data;
      } catch (error) {
        console.error('Error fetching place:', error);
        throw error;
      }
    };
    getPlaceById(id);
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (!place) {
    return;
  }
  console.log("place:",place);

  const photos = place.photos?.split(',');

  return (
    <>
      <Helmet>
        {/* Standard Meta Tags */}
        <title>{place?.title}</title>
        <meta name="description" content={place?.description} />
        {/* Open Graph Meta Tags for WhatsApp */}
        <meta property="og:title" content={place?.title} />
        <meta property="og:description" content={place?.description} />
        <meta
          property="og:image"
          content={`https://backend.sakanijo.com/api/images/${place?.folderName}/${photos[0]}`}
        />{' '}
        {/* Replace with the URL of the image you want to display */}
        <meta
          property="og:url"
          content={`https://sakanijo.com/place/${place?.id}`}
        />{' '}
        {/* Replace with the full URL of this specific page */}
        {/* Optional Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sakani Jo" />
      </Helmet>

      <div className="mt-4 overflow-x-hidden px-8 pt-20">
        <h1 className="text-3xl" style={{ fontWeight:"700" }}>{place?.title}</h1>
        <p style={{color:"gray" , fontWeight:"600" }}> رقم الإعلان : {place?.id}</p>
        <AddressLink placeAddress={place?.address} />
        <Box display="flex" alignItems="center" gap={1} padding={3}>
        <VisibilityIcon style={{ color: '#333' }} />
        <Typography variant="body1">{place?.viewers}</Typography>
      </Box>

        
        <PlaceGallery place={place} />

        <div className="mb-8 mt-8 grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
          <div className="">
            <div className="my-4">
              <h2 className="text-2xl font-semibold">Description</h2>
              {place.description}
            </div>
            
            {place.sellingMethod === 'booking' && (
              <p>Max number of guests: {place.maxGuests}</p>
            )}
            <PerksWidget perks={place?.perks} place={place} />

          </div>
          <div>
            {place.sellingMethod === 'booking' ? (
              <BookingWidget place={place} />
            ) : (
              <div className='flex justify-center gap-2 flex-wrap md:justify-start'>
                {
                  place?.ownerPhone &&
                  <Button variant="outline" asChild className="rounded-full h-10 w-10 text-primary hover:bg-primary hover:text-primary-foreground">
                    <a href={`tel:${place?.ownerPhone}`}>
                      <Phone />
                    </a>
                  </Button>
                }

                {
                  (place?.ownerPhone  && place?.gettingCalls === "whatsapp") && 
                  <Button variant="outline" asChild className="rounded-full h-10 w-10 text-[#25D366] hover:bg-[#25D366] hover:text-white">
                    <a href={`https://wa.me/${place.ownerPhone}`}  target='_blank' rel="noopener noreferrer" >
                      <WhatsApp />
                    </a>
                  </Button>
                }

                <ShareButton shareLink={`https://place.sakanijo.com/place?id=${place?.id}`} />
              </div>

            )}
            
          </div>
        </div>
        <div className="-mx-8 border-t bg-white px-8 py-8">
          <div>
            <h2 className="mt-4 text-2xl font-semibold">الاعلانات المشابهة</h2>
          </div>
          <div className="mb-4 mt-2 leading-5 text-gray-700">
            {/* {(place?.type === 'home' || place?.type === 'apartment') && (
              <>
                <p style={{ fontWeight: 'semibold', color: '#121212' }}>
                  Rooms Number: {place?.roomsNumber}
                </p>
                <p style={{ fontWeight: 'semibold', color: '#121212' }}>
                  Stages Number: {place?.stagesNumber}
                </p>
                <p style={{ fontWeight: 'semibold', color: '#121212' }}>
                  Kitchen Number: {place?.numberKitchen}
                </p>
              </>
            )}

            {(place?.type === 'farm' || place?.type === 'land') && (
              <>
                <p style={{ fontWeight: 'semibold', color: '#121212' }}>
                  Property Area: {place?.area}m²
                </p>
                <p style={{ fontWeight: 'semibold', color: '#121212' }}>
                  Streets Number: {place?.streets}
                </p>
              </>
            )} */}


            <SimilarProducts  homeType={place?.home_type} sellType={place?.buy_or_rent} placeId={place?.id}/>
              

          </div>
        </div>
      </div>
    </>
  );
};

export default PlacePage;
