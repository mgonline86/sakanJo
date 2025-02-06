import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  adsAcceptOptions,
  genders,
  gettingCallsOptions,
  hajezHours,
  homeTypeOptions,
  meetingRoomTypes,
  poolsDepth,
  publisherStateOptions,
  rentTypeOptions,
  sellingTypeOptions,
  subscriptionTypes,
  tripPeriodOptions,
  weekDays,
  yesNo,
} from '@/context/PlaceFormSchema';
import { amenitiesOptions } from '@/data/amenitiesOptions';
import { jordanCities } from '@/data/jordanCities';
import { cn } from '@/lib/utils';
import {
  Agriculture,
  Apartment,
  Cabin,
  CalendarMonth,
  CloudUpload,
  DeleteForever,
  DepartureBoard,
  Fax,
  FitnessCenter,
  Groups,
  HolidayVillage,
  Home,
  NightShelter,
  PinDrop,
  Pool,
  SportsTennis,
  Warehouse,
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import { serialize } from 'object-to-formdata';
import { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks';
import { Calendar } from '../ui/calendar';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import DayHoursInputs from './DayHoursInputs';
import HajezSpecificDays from './HajezSpecificDays';

const addNewPlace = async (formData) => {
  console.log('calling addNewPlace', formData);
  return await axios.post(
    'https://backend.sakanijo.com/api/places/add',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
};

const updatePlace = async (id, formData) => {
  console.log('calling updatePlace', formData);
  return await axios.post(
    `https://backend.sakanijo.com/ads/update/${id}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
};

const updateAllowedKeys = [
  'title',
  'description',
  'price',
  'priceBeforeNoon',
  'priceAfterNoon',
  'amenities',
  'variablePrices',
  'specificDaysInCalander',
  'folderName',
  'tripDate',
  'poolType',
  'subscriptionTypeGym',
  'existingPhotos',
  'images',
  'calanderDaysPrice',
];

const dayHoursHomeTypes = ['مسابح', 'قاعات اجتماعات', 'صالات رياضة', 'ملاعب'];

const homeTypeIcons = {
  'فيلا / منزل': <Home className="h-5 w-5 sm:h-10 sm:w-10" />,
  مزرعة: <Agriculture className="h-5 w-5 sm:h-10 sm:w-10" />,
  شقة: <Apartment className="h-5 w-5 sm:h-10 sm:w-10" />,
  'مخيمات و اكواخ': <HolidayVillage className="h-5 w-5 sm:h-10 sm:w-10" />,
  'مكاتب وعيادات': <Fax className="h-5 w-5 sm:h-10 sm:w-10" />,
  'محلات ومخازن': <Warehouse className="h-5 w-5 sm:h-10 sm:w-10" />,
  استوديو: <NightShelter className="h-5 w-5 sm:h-10 sm:w-10" />,
  شليهات: <Cabin className="h-5 w-5 sm:h-10 sm:w-10" />,
  مسابح: <Pool className="h-5 w-5 sm:h-10 sm:w-10" />,
  ملاعب: <SportsTennis className="h-5 w-5 sm:h-10 sm:w-10" />,
  'تنظيم رحلات': <DepartureBoard className="h-5 w-5 sm:h-10 sm:w-10" />,
  'قاعات اجتماعات': <Groups className="h-5 w-5 sm:h-10 sm:w-10" />,
  'صالات رياضة': <FitnessCenter className="h-5 w-5 sm:h-10 sm:w-10" />,
  أرض: <PinDrop className="h-5 w-5 sm:h-10 sm:w-10" />,
};

const buyHomeOptionsMap = {
  للبيع: [
    'فيلا / منزل',
    'مزرعة',
    'شقة',
    'مخيمات و اكواخ',
    'استوديو',
    'شليهات',
    'أرض',
    'مكاتب وعيادات',
    'محلات ومخازن',
  ],
  للإيجار: [
    'فيلا / منزل',
    'مزرعة',
    'شقة',
    'مخيمات و اكواخ',
    'مكاتب وعيادات',
    'محلات ومخازن',
  ],
  الحجز: [
    'فيلا / منزل',
    'مزرعة',
    'شقة',
    'مخيمات و اكواخ',
    'استوديو',
    'شليهات',
    'مسابح',
    'ملاعب',
    'تنظيم رحلات',
    'قاعات اجتماعات',
    'صالات رياضة',
  ],
};

const monoBuyingTypes = {
  أرض: 'للبيع',
  مسابح: 'الحجز',
  ملاعب: 'الحجز',
  'تنظيم رحلات': 'الحجز',
  'قاعات اجتماعات': 'الحجز',
  'صالات رياضة': 'الحجز',
};

const hajezVariesNegelectedTypes = [
  'مسابح',
  'صالات رياضة',
  'قاعات اجتماعات',
  'ملاعب',
  'تنظيم رحلات',
];

export default function PlaceForm({ id }) {
  const { t, i18n } = useTranslation();

  const { user, setUser } = useAuth();

  const form = useFormContext();

  const navigate = useNavigate();

  const [
    currentHomeType,
    currentCity,
    currentNeighborhood,
    images,
    buyOrRent,
    price,
  ] = form.watch([
    'homeType',
    'address[0]',
    'address[1]',
    'images',
    'buyOrRent',
    'price',
  ]);

  useEffect(() => {
    if (id && typeof currentNeighborhood === 'string') {
      const [name, lat, long] = currentNeighborhood.split('|');
      form.setValue('address.1', {
        name,
        lat: Number(lat),
        long: Number(long),
      });
    }
  }, [id, currentNeighborhood, form]);

  /* handle home type change */
  const currentAmenities = useMemo(() => {
    return amenitiesOptions[currentHomeType] || [];
  }, [currentHomeType]);

  /* handle city change */
  const currentNeighborhoods = useMemo(() => {
    return jordanCities[currentCity]?.places || [];
  }, [currentCity]);

  const initialHajezPriceVaries =
    JSON.stringify(form.getValues('variablePrices'))?.length > 2;
  // handle hajez price varies
  const [hajezPriceVaries, setHajezPriceVaries] = useState(
    initialHajezPriceVaries,
  );

  const handleHajezPriceVaries = () => {
    setHajezPriceVaries((prev) => {
      if (!prev) {
        form.setValue(
          'variablePrices',
          weekDays.reduce((acc, day) => {
            acc[day] = price;
            return acc;
          }, {}),
        );
      } else {
        form.setValue('variablePrices', {});
      }
      return !prev;
    });
  };

  async function onSubmit(values) {
    const {
      address: {
        0: city,
        1: { name: address, lat: latitude, long: longitude },
      },
    } = values;
    const payload = {
      ...values,
      address,
      latitude,
      longitude,
      ownerId: user.id,
      ownerName: user.name,
      ownerPhone: user.phone,
    };
    if (!payload.poolDocument) {
      payload.poolDocument = null;
    }
    if (!payload.chaletDocument) {
      payload.chaletDocument = null;
    }

    // variablePrices,hajezDays,amenities,numberOfRooms
    // Yassin said it has to be JSON string ??!
    if (payload.variablePrices) {
      payload.variablePrices = JSON.stringify(payload.variablePrices);
    }
    if (payload.hajezDays) {
      payload.hajezDays = JSON.stringify(payload.hajezDays);
    }
    if (payload.amenities) {
      payload.amenities = JSON.stringify(payload.amenities);
    }
    if (payload.numberOfRooms) {
      payload.numberOfRooms = JSON.stringify(payload.numberOfRooms);
    }
    if (payload.specificDaysInCalander) {
      payload.specificDaysInCalander = JSON.stringify(
        payload.specificDaysInCalander,
      );
    }

    if (payload.priceBeforeNoon === '') {
      payload.priceBeforeNoon = payload.price;
    }

    if (payload.priceAfterNoon === '') {
      payload.priceAfterNoon = payload.price;
    }

    if (payload.timeOpen) {
      payload.timeOpen = JSON.stringify(payload.timeOpen);
    }

    if (payload.calanderDaysPrice) {
      payload.calanderDaysPrice = JSON.stringify(payload.calanderDaysPrice);
    }

    // for update somehow I need to change keys for Yassin to recieve it in backend :(
    if (id) {
      for (const key in payload) {
        if (!updateAllowedKeys.includes(key)) {
          payload[key] = undefined;
        }
      }
      if (
        payload.existingPhotos &&
        JSON.stringify(payload.existingPhotos).length > 2
      ) {
        payload.existingPhotos = JSON.stringify(payload.existingPhotos);
      } else {
        payload.existingPhotos = undefined;
      }
      if (payload.images) {
        payload.newPhotos = payload.images;
        payload.images = undefined;
      }
      if (payload.subscriptionTypeGym) {
        payload.subsGym = payload.subscriptionTypeGym;
        payload.subscriptionTypeGym = undefined;
      }
      if (payload.variablePrices) {
        payload.variable_prices = payload.variablePrices;
        payload.variablePrices = undefined;
      }
      if (payload.calanderDaysPrice) {
        payload.selected_day_price = payload.calanderDaysPrice;
        payload.calanderDaysPrice = undefined;
      }
      if (payload.specificDaysInCalander) {
        payload.speceficDayInCalander = payload.specificDaysInCalander;
        payload.specificDaysInCalander = undefined;
      }
    }

    const serializeOptions = {
      noFilesWithArrayNotation: true,
    };

    const formData = serialize(payload, serializeOptions);

    try {
      const res = id
        ? await updatePlace(id, formData)
        : await addNewPlace(formData);

      if (res.status < 400) {
        toast.success(t('new_ad.submit_success'));

        const updateUserObject = {
          ...user,
          limitPosts: user.limitPosts > 1 ? user.limitPosts - 1 : 0,
        };

        localStorage.setItem('user', JSON.stringify(updateUserObject));

        setUser(updateUserObject);

        navigate('/account/places');
      } else {
        toast.error(t('new_ad.submit_error'));
      }
    } catch (error) {
      console.error('Failed to add place:', error);
      toast.error(t('new_ad.submit_error'));
    }
  }

  const handleUpdateHomeType = (newValue) => {
    form.reset();
    form.setValue('homeType', newValue);
    if (Object.keys(monoBuyingTypes).includes(newValue)) {
      setHideMiddleStage(true);
      form.setValue('buyOrRent', monoBuyingTypes[newValue]);
    } else {
      setHideMiddleStage(false);
    }
  };

  const handleUpdateBuyOrRent = (newValue) => {
    const homeType = currentHomeType;
    form.reset();
    form.setValue('homeType', homeType);
    form.setValue('buyOrRent', newValue);
  };

  const handleCityChange = (field, newValue) => {
    field.onChange(newValue);
    form.setValue('address[1]', {});
  };

  const handleAddingImages = (e) => {
    const files = Array.from(e.target.files);
    const uniqueFiles = files.map(
      (f) => new File([f], `${Date.now()}-${f.name}`),
    );
    form.setValue('images', [...form.getValues().images, ...uniqueFiles], {
      shouldValidate: true,
    });
  };

  const handleRemoveImage = (image) => {
    const updatedImages = form.getValues().images.filter((m) => m !== image);
    form.setValue('images', updatedImages, { shouldValidate: true });
  };

  const [currentStage, setCurrentStage] = useState(id ? 'submit' : 'homeType');
  const [hideMiddleStage, setHideMiddleStage] = useState(false);

  const handleSetCurrentStage = (stage) => {
    // scroll to the top of the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStage(stage);
  };

  if (!user) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {!id && (
          <div
            className={`${currentStage === 'homeType' ? 'grid' : 'hidden'} mb-20 grid-cols-1 gap-x-4 gap-y-6 px-4 md:grid-cols-2`}
          >
            {/* REAL ESTATE TYPE */}
            {!id && (
              <FormField
                control={form.control}
                name="homeType"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>{t('new_ad.type.header')}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => handleUpdateHomeType(value)}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-5 xl:gap-10"
                        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {homeTypeOptions.map((option) => (
                          <FormItem
                            key={option}
                            className="flex items-center gap-x-2 space-y-0 rounded-md border px-4 py-2"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={option}
                                checked={field.value === option}
                              />
                            </FormControl>
                            <FormLabel className="flex w-full items-center gap-1 font-normal">
                              {t(`new_ad.type.options.${option}`)}
                              <span className="ms-auto">
                                {homeTypeIcons[option]}
                              </span>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end gap-4 border-t pt-2 md:col-span-2">
              <Button
                variant="link"
                type="button"
                onClick={() =>
                  handleSetCurrentStage(
                    hideMiddleStage ? 'submit' : 'buyOrRent',
                  )
                }
              >
                التالي
              </Button>
            </div>
          </div>
        )}

        {!id && (
          <div
            className={`${currentStage === 'buyOrRent' ? 'grid' : 'hidden'} mb-20 grid-cols-1 gap-x-4 gap-y-6 px-4 md:grid-cols-2`}
          >
            {/* BUY OR RENT */}
            {!id && (
              <FormField
                control={form.control}
                name="buyOrRent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('new_ad.type.header')}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={handleUpdateBuyOrRent}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-4"
                        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {sellingTypeOptions.map((option) => {
                          if (
                            buyHomeOptionsMap[option].includes(currentHomeType)
                          )
                            return (
                              <FormItem
                                key={option}
                                className="flex items-center gap-x-1 space-y-0 rounded-md border px-4 py-2"
                              >
                                <FormControl>
                                  <RadioGroupItem
                                    value={option}
                                    checked={field.value === option}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {t(`new_ad.buyOrRent.options.${option}`)}
                                </FormLabel>
                              </FormItem>
                            );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      {t('new_ad.buyOrRent.description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-between gap-4 border-t pt-2 md:col-span-2">
              <Button
                variant="link"
                type="button"
                onClick={() => handleSetCurrentStage('homeType')}
              >
                السابق
              </Button>
              <Button
                variant="link"
                type="button"
                onClick={() => handleSetCurrentStage('submit')}
              >
                التالي
              </Button>
            </div>
          </div>
        )}

        <div
          className={`${currentStage === 'submit' ? 'grid' : 'hidden'} mb-20 grid-cols-1 gap-x-4 gap-y-6 px-4 md:grid-cols-2`}
        >
          {/* TITLE */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('new_ad.title.header')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('new_ad.title.placeholder')}
                    {...field}
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DESCRIPTION */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('new_ad.description.header')}</FormLabel>
                <FormControl>
                  <Textarea className="h-auto" {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* AMENITIES */}
          {currentAmenities.length > 0 && (
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{t('new_ad.amenities.header')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                  <div className="flex flex-wrap gap-4 rounded-lg border p-4">
                    {currentAmenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-1">
                        <Checkbox
                          className="rounded"
                          value={amenity}
                          checked={field.value.includes(amenity)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, amenity]);
                            } else {
                              field.onChange(
                                field.value.filter(
                                  (value) => value !== amenity,
                                ),
                              );
                            }
                          }}
                        />
                        <FormLabel>{amenity}</FormLabel>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* ADS ACCEPT */}
          {!id && buyOrRent !== 'الحجز' && (
            <FormField
              control={form.control}
              name="adsAccept"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>قابل للتقسيط و التفاوض</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-4"
                      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {adsAcceptOptions.map((option) => (
                        <FormItem
                          key={option}
                          className="flex items-center gap-x-1 space-y-0 rounded-md border px-4 py-2"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={option}
                              checked={field.value === option}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* GETTING CALLS */}
          {!id && (
            <FormField
              control={form.control}
              name="gettingCalls"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>أريد إستقبال الإستفسارات عبر</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-4"
                      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {gettingCallsOptions.map((option) => (
                        <FormItem
                          key={option}
                          className="flex items-center gap-x-1 space-y-0 rounded-md border px-4 py-2"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={option}
                              checked={field.value === option}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* PUBLISHER STATE */}
          {!id && (
            <FormField
              control={form.control}
              name="publisherState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>هل أنت؟</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-4"
                      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {publisherStateOptions.map((option) => (
                        <FormItem
                          key={option}
                          className="flex items-center gap-x-1 space-y-0 rounded-md border px-4 py-2"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={option}
                              checked={field.value === option}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* ADDRESS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-2">
            {/* ADDRESS - CITY */}
            {!id && (
              <FormField
                control={form.control}
                name="address[0]"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المدينة</FormLabel>
                    <Select
                      onValueChange={(value) => handleCityChange(field, value)}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="my-2 capitalize rtl:direction-rtl">
                          <SelectValue placeholder="إختار المدينة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rtl:direction-rtl">
                        {Object.keys(jordanCities).map((city) => (
                          <SelectItem
                            key={city}
                            value={city}
                            className="capitalize"
                          >
                            {t(city)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>إختار المدينة المناسبة</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* ADDRESS - NEIGHBORHOOD */}
            {!id && (
              <FormField
                control={form.control}
                name="address[1]"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المنطقة</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(
                          currentNeighborhoods.find(
                            (neighborhood) =>
                              `${neighborhood.name}|${neighborhood.long}|${neighborhood.lat}` ===
                              value,
                          ),
                        );
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="my-2 capitalize rtl:direction-rtl"
                          disabled={!currentCity}
                        >
                          <SelectValue placeholder="إختار المنطقة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rtl:direction-rtl">
                        {currentNeighborhoods.map((neighborhood) => (
                          <SelectItem
                            key={`${neighborhood.name}|${neighborhood.long}|${neighborhood.lat}`}
                            value={`${neighborhood.name}|${neighborhood.long}|${neighborhood.lat}`}
                            className="capitalize"
                          >
                            {t(neighborhood.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>إختار المنطقة المناسبة</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* STREET */}
          {!id && (
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الشارع</FormLabel>
                  <FormControl>
                    <Input placeholder="ادخل الشارع" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* CLOSE PLACE */}
          {!id && (
            <FormField
              control={form.control}
              name="closePlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>علامة مميزة أو مكان قريب</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ادخل علامة مميزة او مكان قريب"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* SPACE GENERAL */}
          {!id && (
            <FormField
              control={form.control}
              name="spaceGeneral"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>مساحة (متر مربع)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      onChange={(e) => {
                        if (e.target.value === '') {
                          form.resetField('spaceGeneral');
                        } else {
                          return field.onChange(Number(e.target.value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* IMAGES */}
          <div className="mt-2 flex flex-wrap gap-2 md:col-span-2">
            <FormField
              control={form.control}
              name="images"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className="max-w-min">
                  <FormLabel>
                    <div className="mb-2">{t('new_ad.images.header')}</div>

                    <div
                      className="flex h-16 w-16 cursor-pointer items-center justify-center gap-1 rounded-2xl border bg-transparent p-2 text-2xl text-gray-600 md:h-32 md:w-32"
                      tabIndex={0} // Make the wrapper focusable
                      // biome-ignore lint/a11y/useSemanticElements: <explanation>
                      role="button" // Add semantic meaning
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.target.click(); // Simulate input click
                        }
                      }}
                    >
                      <FormControl>
                        <Input
                          {...fieldProps}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          multiple
                          onChange={(e) => handleAddingImages(e)}
                        />
                      </FormControl>
                      <CloudUpload className="h-8 w-8" />
                      <span className="hidden md:block">{t('upload')}</span>
                    </div>
                  </FormLabel>
                  <FormDescription>
                    {t('new_ad.images.description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {images?.length > 0 &&
              images.map((image) => {
                const isURL = typeof image === 'string';
                return (
                  <div
                    className="relative mt-[1.375rem] flex h-16 w-16 md:h-32 md:w-32"
                    key={isURL ? image : image.name}
                  >
                    <img
                      className="w-full rounded-2xl border border-gray-300 object-contain"
                      src={isURL ? image : URL.createObjectURL(image)}
                      alt={image.name}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image)}
                      className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 md:p-1"
                    >
                      <DeleteForever className="h-6 w-6" />
                    </button>
                  </div>
                );
              })}
          </div>

          {/* PRICE */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('new_ad.price.header')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    step={0.1}
                    onChange={(e) => {
                      if (e.target.value === '') {
                        form.resetField('price');
                      } else {
                        return field.onChange(Number(e.target.value));
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PRICE HIDE */}
          {!id && (
            <FormField
              control={form.control}
              name="priceHide"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>إخفاء السعر</FormLabel>
                    <FormDescription>
                      سيتم اخفاء السعر في صفحة الاعلان
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {/* IF RENT */}
          {/* RENT TYPE */}
          {buyOrRent === 'للإيجار' && !id && (
            <FormField
              control={form.control}
              name="rentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع الايجار</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-3"
                      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {rentTypeOptions.map((rentType) => (
                        <FormItem
                          key={rentType}
                          className="flex items-center gap-x-1 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={rentType}
                              checked={field.value === rentType}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {rentType}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* IF HAJEZ */}
          {buyOrRent === 'الحجز' && (
            <>
              <div className="flex gap-4 md:col-span-2">
                <FormField
                  control={form.control}
                  name="priceBeforeNoon"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel>السعر قبل الظهيرة</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          step={0.1}
                          onChange={(e) => {
                            if (e.target.value === '') {
                              form.resetField('priceBeforeNoon');
                            } else {
                              return field.onChange(Number(e.target.value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceAfterNoon"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel>السعر بعد الظهيرة</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          step={0.1}
                          onChange={(e) => {
                            if (e.target.value === '') {
                              form.resetField('priceAfterNoon');
                            } else {
                              return field.onChange(Number(e.target.value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* HAJEZ TYPE */}
              {!id && (
                <FormField
                  control={form.control}
                  name="hajezType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>نوع الحجز</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-3"
                          dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                        >
                          {hajezHours.map((hajezType) => (
                            <FormItem
                              key={hajezType}
                              className="flex items-center gap-x-1 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem
                                  value={hajezType}
                                  checked={field.value === hajezType}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {hajezType}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!hajezVariesNegelectedTypes.includes(currentHomeType) && (
                <>
                  {/* HAJEZ DAYS */}
                  {!id && (
                    <FormField
                      control={form.control}
                      name="hajezDays"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>ايام الحجز</FormLabel>
                          <FormControl>
                            <Input {...field} type="hidden" />
                          </FormControl>
                          <div className="flex flex-wrap gap-4 rounded-lg border p-4">
                            {weekDays.map((day) => (
                              <div
                                key={day}
                                className="flex items-center gap-1"
                              >
                                <Checkbox
                                  className="rounded"
                                  value={day}
                                  checked={field.value.includes(day)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, day]);
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          (value) => value !== day,
                                        ),
                                      );
                                    }
                                  }}
                                />
                                <FormLabel>{day}</FormLabel>
                              </div>
                            ))}
                          </div>
                          <FormDescription>
                            يجب تحديد يوم واحد على الاقل للحجز
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* HAJEZ VARIATION */}
                  <div className="flex flex-col gap-4 rounded-lg border p-3 md:col-span-2">
                    <FormItem className="flex flex-row items-center gap-3">
                      <div className="space-y-0.5">
                        <FormLabel>هل السعر متغير</FormLabel>
                        <FormDescription>
                          سيتم تحديد سعر كل يوم على حدى
                        </FormDescription>
                      </div>
                      <Switch
                        checked={hajezPriceVaries}
                        onCheckedChange={handleHajezPriceVaries}
                      />
                    </FormItem>
                    {hajezPriceVaries && (
                      <div className="flex flex-wrap gap-4">
                        {weekDays.map((day) => (
                          <FormField
                            key={day}
                            control={form.control}
                            name={`variablePrices.${day}`}
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>{day}</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    onChange={(e) => {
                                      if (e.target.value === '') {
                                        form.resetField(
                                          `variablePrices.${day}`,
                                        );
                                      } else {
                                        return field.onChange(
                                          Number(e.target.value),
                                        );
                                      }
                                    }}
                                    type="number"
                                    min={1}
                                    step={0.1}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <HajezSpecificDays />
                </>
              )}
            </>
          )}

          {dayHoursHomeTypes.includes(currentHomeType) && (
            <DayHoursInputs id={id} />
          )}

          {/* POOL & GYM */}
          {['مسابح', 'صالات رياضة'].includes(currentHomeType) && (
            /* MEN OR WOMEN */
            <FormField
              control={form.control}
              name="poolType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>نوع المكان</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-3"
                      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {genders.map((gender) => (
                        <FormItem
                          key={gender}
                          className="flex items-center gap-x-1 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={gender}
                              checked={field.value === gender}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {gender}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* POOL */}
          {currentHomeType === 'مسابح' && !id && (
            <div className="flex flex-wrap gap-4 rounded-lg border p-3 md:col-span-2">
              {/* POOL DEPTH */}
              <FormField
                control={form.control}
                name="deepPool"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>عمق المسبح</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-3"
                        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {poolsDepth.map((pool) => (
                          <FormItem
                            key={pool}
                            className="flex items-center gap-x-1 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={pool}
                                checked={field.value === pool}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {pool}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* POOL DOCUMENT */}
              <FormField
                control={form.control}
                name="poolDocument"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>مستند المسبح</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        placeholder="مستند المسبح"
                        type="file"
                        accept="image/*, application/pdf"
                        onChange={(event) => onChange(event.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* STORES AND WAREHOUSES */}
          {currentHomeType === 'محلات ومخازن' && !id && (
            <div className="flex flex-wrap gap-4 rounded-lg border p-3 md:col-span-2">
              <FormField
                control={form.control}
                name="containSdah"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <FormLabel>يحتوى على سده؟</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="evacuation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <FormLabel>إخلاء</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* FARM */}
          {currentHomeType === 'مزرعة' && !id && (
            <div className="flex flex-wrap gap-4 rounded-lg border p-3 md:col-span-2">
              <FormField
                control={form.control}
                name="farmHasHouse"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>تحتوي على منزل؟</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-3"
                        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {yesNo.map((answer) => (
                          <FormItem
                            key={answer}
                            className="flex items-center gap-x-1 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={answer}
                                checked={field.value === answer}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {answer}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="farmHasWater"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>تحتوي على مياه؟</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-3"
                        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {yesNo.map((answer) => (
                          <FormItem
                            key={answer}
                            className="flex items-center gap-x-1 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={answer}
                                checked={field.value === answer}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {answer}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="farmHasFarmed"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>مزروعة؟</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-3"
                        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {yesNo.map((answer) => (
                          <FormItem
                            key={answer}
                            className="flex items-center gap-x-1 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={answer}
                                checked={field.value === answer}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {answer}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* LAND */}
          {currentHomeType === 'أرض' && !id && (
            <div className="flex flex-wrap gap-4 rounded-lg border p-3 md:col-span-2">
              <FormField
                control={form.control}
                name="landInFaceOfStreet"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>امامها شارع؟</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-3"
                        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {yesNo.map((answer) => (
                          <FormItem
                            key={answer}
                            className="flex items-center gap-x-1 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={answer}
                                checked={field.value === answer}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {answer}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfStreetsInLand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عددالشوارع امام الأرض</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        onChange={(e) => {
                          if (e.target.value === '') {
                            form.resetField('numberOfStreetsInLand');
                          } else {
                            return field.onChange(Number(e.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* HOUSE, VILLA & APARTMENT */}
          {['فيلا / منزل', 'شقة'].includes(currentHomeType) && !id && (
            <div className="flex flex-wrap gap-4 rounded-lg border p-3 md:col-span-2">
              <FormField
                control={form.control}
                name="numberOfRooms.rooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عددالغرف</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        onChange={(e) => {
                          if (e.target.value === '') {
                            form.resetField('numberOfRooms.rooms');
                          } else {
                            return field.onChange(Number(e.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfRooms.kitchen"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عددالمطابخ</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        onChange={(e) => {
                          if (e.target.value === '') {
                            form.resetField('numberOfRooms.kitchen');
                          } else {
                            return field.onChange(Number(e.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfRooms.bathroom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عددالحمامات</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        onChange={(e) => {
                          if (e.target.value === '') {
                            form.resetField('numberOfRooms.bathroom');
                          } else {
                            return field.onChange(Number(e.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {currentHomeType === 'فيلا / منزل' && (
                <FormField
                  control={form.control}
                  name="numberOfRooms.stages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عددالطوابق</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          onChange={(e) => {
                            if (e.target.value === '') {
                              form.resetField('numberOfRooms.stages');
                            } else {
                              return field.onChange(Number(e.target.value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}

          {/* APARTMENT */}
          {currentHomeType === 'شقة' && !id && (
            <div className="flex flex-wrap gap-4 rounded-lg border p-3">
              <FormField
                control={form.control}
                name="numberOfHomeStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الطابق</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        onChange={(e) => {
                          if (e.target.value === '') {
                            form.resetField('numberOfHomeStage');
                          } else {
                            return field.onChange(Number(e.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalStages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الطوابق بالمبنى</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        onChange={(e) => {
                          if (e.target.value === '') {
                            form.resetField('totalStages');
                          } else {
                            return field.onChange(Number(e.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* TRIP */}
          {currentHomeType === 'تنظيم رحلات' && (
            <div className="flex flex-wrap gap-4 rounded-lg border p-3">
              {!id && (
                <FormField
                  control={form.control}
                  name="tripLong"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>مدة الرحلة</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-wrap gap-3"
                          dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                        >
                          {tripPeriodOptions.map((period) => (
                            <FormItem
                              key={period}
                              className="flex items-center gap-x-1 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem
                                  value={period}
                                  checked={field.value === period}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {period}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="tripDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>تاريخ الرحلة</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] ps-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP', {
                                locale: i18n.locale,
                              })
                            ) : (
                              <span>إختار تاريخ</span>
                            )}
                            <CalendarMonth className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      يجب ان يكون تاريخ الرحلة بعد تاريخ اليوم
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* CHALET */}
          {currentHomeType === 'شليهات' && !id && (
            <FormField
              control={form.control}
              name="chaletDocument"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>مستند الشليه</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="مستند الشليه"
                      type="file"
                      accept="image/*, application/pdf"
                      onChange={(event) => onChange(event.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* MEETING ROOMS */}
          {currentHomeType === 'قاعات اجتماعات' && !id && (
            <div className="flex flex-wrap gap-4 rounded-lg border p-3">
              <FormField
                control={form.control}
                name="meetingRoomType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>نوع القاعة</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-3"
                        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {meetingRoomTypes.map((roomType) => (
                          <FormItem
                            key={roomType}
                            className="flex items-center gap-x-1 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={roomType}
                                checked={field.value === roomType}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {roomType}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="countPeople"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد الاشخاص المسموح</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={2}
                        onChange={(e) => {
                          if (e.target.value === '') {
                            form.resetField('countPeople');
                          } else {
                            return field.onChange(Number(e.target.value));
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* GYM */}
          {currentHomeType === 'صالات رياضة' && (
            <div className="flex flex-wrap gap-4 rounded-lg border p-3">
              <FormField
                control={form.control}
                name="subscriptionTypeGym"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>نوع الاشتراك</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-3"
                        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {subscriptionTypes.map((subscriptionType) => (
                          <FormItem
                            key={subscriptionType}
                            className="flex items-center gap-x-1 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={subscriptionType}
                                checked={field.value === subscriptionType}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {subscriptionType}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="flex justify-between gap-4 border-t pt-2 md:col-span-2">
            {!id && (
              <Button
                type="button"
                onClick={() =>
                  handleSetCurrentStage(
                    hideMiddleStage ? 'homeType' : 'buyOrRent',
                  )
                }
                variant="link"
              >
                السابق
              </Button>
            )}
            <Button
              type="submit"
              className={`flex w-full gap-2 uppercase sm:max-w-sm${id ? ' mx-auto' : ''}`}
              disabled={form.formState.isSubmitting}
            >
              {t('new_ad.save')}
              {form.formState.isSubmitting && '...'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
