import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import axiosInstance from '@/utils/axios';
import axios from 'axios';
import AccountNav from '@/components/ui/AccountNav';
import Perks from '@/components/ui/Perks';
import PhotosUploader from '@/components/ui/PhotosUploader';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '../../hooks/index';
const PlacesFormPage = () => {
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const { user } = useAuth();
  console.log('user', user);
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    type: 'home',
    sellingMethod: 'buy',
    ownerPhone: user?.phone,
    description: '',
    perks: [],
    extraInfo: '',
    checkIn: '',
    checkOut: '',
    maxGuests: 10,
    price: 500,
    ownerId: user?.id,
  });

  const {
    title,
    address,
    type,
    sellingMethod,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = formData;

  const isValidPlaceData = () => {
    if (type.trim() === '') {
      toast.error("Type can't be empty!");
      return false;
    } else if (title.trim() === '') {
      toast.error("Title can't be empty!");
      return false;
    } else if (address.trim() === '') {
      toast.error("Address can't be empty!");
      return false;
    } else if (addedPhotos.length < 1) {
      toast.error('Upload at least 5 photos!');
      return false;
    } else if (description.trim() === '') {
      toast.error("Description can't be empty!");
      return false;
    } else if (maxGuests < 1) {
      toast.error('At least one guests is required!');
      return false;
    } else if (maxGuests > 10) {
      toast.error("Max. guests can't be greater than 10");
      return false;
    }

    return true;
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ownerId: user?.id,
      ownerPhone: user?.phone,
    }));
  }, [user]);
  const handleFormData = (e) => {
    const { name, value, type } = e.target;
    // If the input is not a checkbox, update 'formData' directly
    if (type !== 'checkbox') {
      setFormData({ ...formData, [name]: value });
      return;
    }

    // If type is checkbox (perks)
    if (type === 'checkbox') {
      const currentPerks = [...perks];
      let updatedPerks = [];

      // Check if the perk is already in perks array
      if (currentPerks.includes(name)) {
        updatedPerks = currentPerks.filter((perk) => perk !== name);
      } else {
        updatedPerks = [...currentPerks, name];
      }
      setFormData({ ...formData, perks: updatedPerks });
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    axiosInstance.get(`/places/${id}`).then((response) => {
      const { place } = response.data;
      // update the state of formData
      for (let key in formData) {
        if (place.hasOwnProperty(key)) {
          setFormData((prev) => ({
            ...prev,
            [key]: place[key],
          }));
        }
      }

      // update photos state separately
      // setAddedPhotos([...place.photos]);

      setLoading(false);
    });
  }, [id]);

  const preInput = (header, description) => {
    return (
      <>
        <h2 className="mt-4 text-2xl">{header}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </>
    );
  };
  // Function to add a place
  const addPlace = async (placeData) => {
    console.log('Adding place with data:');
    for (const [key, value] of placeData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post(
        'https://backend.sakanijo.com/api/places/add',
        placeData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      console.log('Response from server:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding place:', error);
      throw error;
    }
  };

  // Function to save place (triggered on form submit)
  const savePlace = async (e) => {
    e.preventDefault();

    const formDataIsValid = isValidPlaceData(); // Assuming you have this validation function
    if (!formDataIsValid) {
      console.error('Form data is invalid');
      return;
    }

    const myForm = new FormData();

    // Check and append only if the value is defined
    const appendIfDefined = (key, value) => {
      if (value !== undefined && value !== null) {
        myForm.append(key, value);
        console.log(`${key}: ${value}`);
      } else {
        console.warn(`${key} is undefined or null`);
      }
    };

    // Directly log formData before appending
    console.log('Form Data: ', formData);

    appendIfDefined('title', formData.title);
    appendIfDefined('type', formData.type);
    appendIfDefined('sellingMethod', formData.sellingMethod);
    appendIfDefined('address', formData.address);
    appendIfDefined('description', formData.description);
    appendIfDefined('perks', formData.perks);
    appendIfDefined('extraInfo', formData.extraInfo);
    appendIfDefined('maxGuests', formData.maxGuests);
    appendIfDefined('price', formData.price);
    appendIfDefined('ownerId', formData.ownerId);
    appendIfDefined('ownerPhone', formData.ownerPhone);

    // Adding photos to the FormData
    addedPhotos.forEach((file, index) => {
      myForm.append('photos', file);
      console.log(`Photo ${index}:`, file);
    });

    // Log the complete FormData object
    console.log('Complete FormData:');
    for (const [key, value] of myForm.entries()) {
      console.log(`${key}:`, value);
    }

    if (id) {
      // Update existing place
      try {
        const response = await axios.put(
          'https://backend.sakanijo.com/api/places/update',
          myForm,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          },
        );
        console.log('Place updated successfully:', response.data);
        setRedirect(true);
      } catch (error) {
        console.error('Failed to update place:', error);
      }
    } else {
      // Add new place
      try {
        const data = await addPlace(myForm);
        console.log('Place added successfully:', data);
        setRedirect(true);
      } catch (error) {
        console.error('Failed to add place:', error);
      }
    }
  };

  if (redirect) {
    return <Navigate to={'/account/places'} />;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-4">
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput(
          'Type',
          'If you want to set deferent of types about your place , please download our app in app store or play store',
        )}
        <select
          name="type"
          onChange={handleFormData}
          style={{
            width: ' 100%',
            height: '50px',
            border: '1px solid black',
            borderRadius: '10px',
            margin: 10,
            marginTop: 10,
          }}
          value={formData.type}
        >
          <option value={'home'}>Home</option>
          <option value={'apartment'}>Apartment</option>
          <option value={'land'}>Land</option>
          <option value={'farm'}>farm</option>
        </select>

        {preInput(
          'Title',
          'title for your place. Should be short and catchy as in advertisement',
        )}
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleFormData}
          placeholder="title, for example: My lovely apt"
        />

        {preInput('Address', 'address to this place')}
        <input
          type="text"
          name="address"
          value={address}
          onChange={handleFormData}
          placeholder="address"
        />

        {preInput('Photos', 'more = better')}

        <PhotosUploader
          addedPhotos={addedPhotos}
          setAddedPhotos={setAddedPhotos}
        />

        {preInput('Description', 'discription of the place')}
        <textarea
          value={description}
          name="description"
          onChange={handleFormData}
        />

        {preInput('Perks', ' select all the perks of your place')}
        <Perks
          selected={perks}
          handleFormData={handleFormData}
          formData={formData}
        />

        {preInput('Extra info', 'house rules, etc ')}
        <textarea
          value={extraInfo}
          name="extraInfo"
          onChange={handleFormData}
        />

        {preInput('Selling method ', 'select here the method for selling')}
        <select
          name="sellingMethod"
          onChange={handleFormData}
          style={{
            width: ' 100%',
            height: '50px',
            border: '1px solid black',
            borderRadius: '10px',
            margin: 10,
            marginTop: 10,
          }}
          value={formData.sellingMethod}
        >
          <option value={'buy'} selected>
            Buy
          </option>
          <option value={'rent'}>Rent</option>
          <option value={'booking'}>Booking</option>
        </select>

        {preInput(
          'Price',
          // 'add check in and out times, remember to have some time window forcleaning the room between guests. '

          formData.sellingMethod == 'booking'
            ? 'Specify the maximum number of guests so that the client stays within the limit.'
            : '',
        )}
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {formData.sellingMethod === 'booking' && (
            <div>
              <h3 className="-mb-1 mt-2">Max no. of guests</h3>
              <input
                type="text"
                name="maxGuests"
                value={maxGuests}
                onChange={handleFormData}
                placeholder="1"
              />
            </div>
          )}
          <div>
            <h3 className="-mb-1 mt-2">
              Price {formData.sellingMethod === 'booking' && 'per night'}
            </h3>
            <input
              type="number"
              name="price"
              value={price}
              onChange={handleFormData}
              placeholder="1"
            />
          </div>
        </div>
        <button className="mx-auto my-4 flex rounded-full bg-primary px-20 py-3 text-xl font-semibold text-white">
          Save
        </button>
      </form>
    </div>
  );
};

export default PlacesFormPage;
