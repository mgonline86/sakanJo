import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { features } from '@/_mock/products';
import AccountNav from '@/components/ui/AccountNav';
import PhotosUploader from '@/components/ui/PhotosUploader';
import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axiosInstance from '@/utils/axios';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import ReactSelect from 'react-select';
import { useAuth } from '../../hooks/index';
import { Autorenew } from '@mui/icons-material';

const createOption = (option) => {
  return {
    value: option,
    label: option,
  };
};

const featuresMap = {
  شقة: features.featureApartment.map((item) => createOption(item)),
  'فيلا / منزل': features.featuresHouse.map((item) => createOption(item)),
  مزرعة: features.featureFarm.map((item) => createOption(item)),
  أرض: features.featureLand.map((item) => createOption(item)),
  شليهات: features.featureChalet.map((item) => createOption(item)),
  استوديو: features.featureStudio.map((item) => createOption(item)),
  'محلات ومخازن': features.featureShops.map((item) => createOption(item)),
  'مكاتب وعيادات': features.featureOffice.map((item) => createOption(item)),
  'مخيمات و اكواخ': features.featureCampsAndCabins.map((item) =>
    createOption(item),
  ),
  مسابح: features.featureSwimming_Pool.map((item) => createOption(item)),
  ملاعب: features.featurePlayground.map((item) => createOption(item)),
  'صالات رياضة': features.featureGym.map((item) => createOption(item)),
  'تنظيم رحلات': features.featureTripOrganization.map((item) =>
    createOption(item),
  ),
  'قاعات اجتماعات': features.featureMeetingRooms.map((item) =>
    createOption(item),
  ),
};

const FormGroup = ({ children, header, description, ...props }) => {
  return (
    <div className="flex flex-col" {...props}>
      <h2 className="text-2xl">{header}</h2>
      {children}
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

const PlacesFormPage = () => {
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const { user } = useAuth();
  const { t } = useTranslation();

  const [perksOptions, setPerksOptions] = useState([]);
  
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    address: '',
    type: '',
    sellingMethod: '',
    ownerPhone: user?.phone,
    description: '',
    perks: [],
    extraInfo: '',
    checkIn: '',
    checkOut: '',
    maxGuests: 1,
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

  useEffect(() => {
    if (!type) return;
    if (!featuresMap[type]) return;
    setFormData((prevFormData) => ({
      ...prevFormData,
      perks: [],
    }));
    setPerksOptions(featuresMap[type]);
  }, [type]);

  const isValidPlaceData = () => {
    if (type.trim() === '') {
      toast.error(t('new_ad.type.error'));
      return false;
    }
    if (title.trim() === '') {
      toast.error(t('new_ad.title.error'));
      return false;
    }
    if (address.trim() === '') {
      toast.error(t('new_ad.address.error'));
      return false;
    }
    if (addedPhotos.length < 5) {
      toast.error(t('new_ad.photos.error'));
      return false;
    }
    if (description.trim() === '') {
      toast.error(t('new_ad.description.error'));
      return false;
    }
    if (maxGuests < 1) {
      toast.error(t('new_ad.max_guests.error.min'));
      return false;
    }
    if (maxGuests > 10) {
      toast.error(t('new_ad.max_guests.error.max'));
      return false;
    }

    return true;
  };

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    axiosInstance.get(`/places/${id}`).then((response) => {
      const { place } = response.data;
      // update the state of formData
      for (const key in formData) {
        if (Object.hasOwn(place, key)) {
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
  }, [id, formData]);

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

    setSubmitting(true);

    const formDataIsValid = isValidPlaceData(); // Assuming you have this validation function
    if (!formDataIsValid) {
      console.error('Form data is invalid');
      setSubmitting(false);
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
        toast.error(t('new_ad.submit_error'));
      }
      finally {
        setSubmitting(false);
      }
    } else {
      // Add new place
      try {
        const data = await addPlace(myForm);
        console.log('Place added successfully:', data);
        setRedirect(true);
      } catch (error) {
        console.error('Failed to add place:', error);
        toast.error(t('new_ad.submit_error'));
      }
      finally {
        setSubmitting(false);
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
      <form
        onSubmit={savePlace}
        className="mb-20 grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2"
      >
        {/* TYPE */}
        <FormGroup
          header={t('new_ad.type.header')}
          description={t('new_ad.type.description')}
        >
          <Select
            name="type"
            onValueChange={(value) => setFormData({ ...formData, type: value })}
            value={formData.type}
          >
            <SelectTrigger className="my-2 rtl:direction-rtl">
              <SelectValue placeholder={t('new_ad.type.placeholder')} />
            </SelectTrigger>
            <SelectContent className="rtl:direction-rtl">
              <SelectItem value="شقة">
                {t('new_ad.type.options.apartment')}
              </SelectItem>
              <SelectItem value="فيلا / منزل">
                {t('new_ad.type.options.villa_house')}
              </SelectItem>
              <SelectItem value="مزرعة">
                {t('new_ad.type.options.farm')}
              </SelectItem>
              <SelectItem value="أرض">
                {t('new_ad.type.options.land')}
              </SelectItem>
              <SelectItem value="شليهات">
                {t('new_ad.type.options.chalets')}
              </SelectItem>
              <SelectItem value="استوديو">
                {t('new_ad.type.options.studio')}
              </SelectItem>
              <SelectItem value="محلات ومخازن">
                {t('new_ad.type.options.shops_warehouses')}
              </SelectItem>
              <SelectItem value="مكاتب وعيادات">
                {t('new_ad.type.options.offices_clinics')}
              </SelectItem>
              <SelectItem value="مخيمات و اكواخ">
                {t('new_ad.type.options.camps_cabins')}
              </SelectItem>
              <SelectItem value="مسابح">
                {t('new_ad.type.options.swimming_pools')}
              </SelectItem>
              <SelectItem value="ملاعب">
                {t('new_ad.type.options.playgrounds')}
              </SelectItem>
              <SelectItem value="صالات رياضة">
                {t('new_ad.type.options.gyms')}
              </SelectItem>
              <SelectItem value="تنظيم رحلات">
                {t('new_ad.type.options.trip_organization')}
              </SelectItem>
              <SelectItem value="قاعات اجتماعات">
                {t('new_ad.type.options.meeting_rooms')}
              </SelectItem>
            </SelectContent>
          </Select>
        </FormGroup>

        {/* TITLE */}
        <FormGroup
          header={t('new_ad.title.header')}
          description={t('new_ad.title.description')}
        >
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleFormData}
            placeholder={t('new_ad.title.placeholder')}
          />
        </FormGroup>

        {/* ADDRESS */}
        <FormGroup
          header={t('new_ad.address.header')}
          description={t('new_ad.address.description')}
          className="md:col-span-2"
        >
          <textarea
            name="address"
            value={address}
            onChange={handleFormData}
            placeholder={t('new_ad.address.placeholder')}
            rows="2"
            style={{ height: 'auto' }}
          />
        </FormGroup>

        {/* PHOTOS */}
        <FormGroup
          header={t('new_ad.photos.header')}
          description={t('new_ad.photos.description')}
          className="md:col-span-2"
        >
          <PhotosUploader
            addedPhotos={addedPhotos}
            setAddedPhotos={setAddedPhotos}
          />
        </FormGroup>

        {/* DESCRIPTION */}
        <FormGroup
          header={t('new_ad.description.header')}
          description={t('new_ad.description.description')}
          className="md:col-span-2"
        >
          <textarea
            value={description}
            name="description"
            onChange={handleFormData}
          />
        </FormGroup>

        {/* PERKS */}
        <FormGroup
          header={t('new_ad.perks.header')}
          description={t('new_ad.perks.description')}
          className="md:col-span-2"
        >
          <ReactSelect
            className="my-2"
            placeholder={t('new_ad.perks.placeholder')}
            isMulti
            options={perksOptions}
            isDisabled={perksOptions.length === 0}
            onChange={(value) => {
              setFormData({ ...formData, perks: value.map((p) => p.value) });
            }}
          />
        </FormGroup>

        {/* EXTRA INFO */}
        <FormGroup
          header={t('new_ad.extra_info.header')}
          description={t('new_ad.extra_info.description')}
          className="md:col-span-2"
        >
          <textarea
            value={extraInfo}
            name="extraInfo"
            onChange={handleFormData}
            style={{ height: 'auto' }}
            rows="4"
          />
        </FormGroup>

        {/* SELLING METHOD */}
        <FormGroup
          header={t('new_ad.selling_method.header')}
          description={t('new_ad.selling_method.description')}
        >
          <Select
            name="sellingMethod"
            onValueChange={(value) => {
              setFormData({ ...formData, sellingMethod: value });
            }}
            value={formData.sellingMethod}
          >
            <SelectTrigger className="my-2 rtl:direction-rtl">
              <SelectValue
                placeholder={t('new_ad.selling_method.placeholder')}
              />
            </SelectTrigger>
            <SelectContent className="rtl:direction-rtl">
              <SelectItem value="للبيع">
                {t('new_ad.selling_method.options.purchase')}
              </SelectItem>
              <SelectItem value="للإيجار">
                {t('new_ad.selling_method.options.rent')}
              </SelectItem>
              <SelectItem value="الحجز">
                {t('new_ad.selling_method.options.booking')}
              </SelectItem>
            </SelectContent>
          </Select>
        </FormGroup>

        {/* PRICE */}
        <FormGroup
          header={`${t('new_ad.price.header')} (JOD)`}
          description={
            formData.sellingMethod === 'الحجز'
              ? t('new_ad.price.description.booking')
              : ''
          }
        >
          <div className="flex flex-wrap gap-2">
            {formData.sellingMethod === 'الحجز' && (
              <div className="flex items-center gap-1 md:flex-1">
                <h3 className="min-w-fit flex-grow">
                  {t('new_ad.max_guests.header')}
                </h3>
                <input
                  type="number"
                  name="maxGuests"
                  value={maxGuests}
                  onChange={handleFormData}
                  placeholder="1"
                  min={1}
                  max={10}
                />
              </div>
            )}
            <div className="flex items-center gap-1 md:flex-1">
              {formData.sellingMethod === 'الحجز' && (
                <h3 className="min-w-fit flex-grow">
                  {t('new_ad.price_per_night.header')}
                </h3>
              )}
              <input
                type="number"
                name="price"
                value={price}
                onChange={handleFormData}
                placeholder="1"
                min={1}
                step={0.1}
              />
            </div>
          </div>
        </FormGroup>
        <div className="flex sm:justify-center md:col-span-2">
          <Button type="submit" className="w-full uppercase flex gap-2 sm:max-w-sm" disabled={submitting}>
            {t('new_ad.save')} {submitting && <Autorenew className='animate-spin' /> }
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PlacesFormPage;
