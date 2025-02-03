import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { placeFormSchema, weekDays } from './PlaceFormSchema';
import { jordanCities } from '@/data/jordanCities';
import { imageUrlToFile, pdfUrlToFile } from '@/utils';


export const getPlacePhotos = async (photos, folderName) => {
  if (!photos || !folderName) return [];
  const photosUrls = photos?.split(',');

  const result = await Promise.all(
    photosUrls.map(async (photo) => {
      return await imageUrlToFile(
        `https://backend.sakanijo.com/api/images/${encodeURIComponent(folderName)}/${encodeURIComponent(photo)}`,
        photo,
      );
    }),
  );
  return result;
};

export const getDocument = async (document, folderName) => {
  if (!document || !folderName) return [];
  // check file extension
  const isPDF = document.split('.').pop() === 'pdf';

  if (isPDF) {
    return await pdfUrlToFile(
      `https://backend.sakanijo.com/api/images/${encodeURIComponent(folderName)}/${encodeURIComponent(document)}`,
      document,
    );
  }

  return await pdfUrlToFile(
    `https://backend.sakanijo.com/api/images/${encodeURIComponent(folderName)}/${encodeURIComponent(document)}`,
    document,
  );
};

const getAddressParent = (address) => {
  if (!address) return '';

  const cities = Object.entries(jordanCities);

  for (const [key, value] of cities) {
    for (const place of value.places) {
      if (place.name === address) {
        return [key, `${place.name}|${place.long}|${place.lat}`];
      }
    }
  }
  return ['', ''];
};

export const usePlaceForm = (t, place = null, photos = [], poolDocument = '', chaletDocument = '') =>
  useForm({
    resolver: zodResolver(placeFormSchema(t)),
    defaultValues: {
      type: null, // --> old api cancelled
      sellingMethod: null, // --> old api cancelled

      homeType: place?.home_type || 'فيلا / منزل', // نوع المنزل (شقة/شليه:/الخ)
      title: place?.title || '', // ??! NOT FOUND ??!
      description: place?.description || '', // ??! NOT FOUND ??!
      existingPhotos: "",
      images: photos, // ??! NOT FOUND ??!
      buyOrRent: place?.buy_or_rent || 'للبيع', // نوع البيع (للبيع/الإيجار/الحجز)
      adsAccept: place?.ads_accept || 'لا', // هون ااعلان يستقبل (قابل لتفاوض/تقسيط/لا)
      gettingCalls: place?.gettingCalls || 'whatsapp', // الاعلان يستقبل رسايل عبر (whatsapp/sms)
      // ownerStatus: '', // حالة المعلن (وسيط/مالك) --> old api cancelled
      publisherState: place?.publisher_state || 'مالك', // هون متا الاولى حالة المعلن وسيط او مالك
      price: place?.price ? Number(place?.price) : 1, // general price

      // depend on homeType
      amenities:
        place?.amenities?.length > 2
          ? JSON.parse(JSON.parse(place?.amenities))
          : [], // هون بتخزن array فيها مزايا العقار

      address: place?.address ? getAddressParent(place?.address) : ['', ''], // بتخزن هنا عنوان المكان
      // location: '',
      street: place?.street || '', // string الحي
      closePlace: place?.closePlace || '', // string ??! مكان قريب
      longitude: place?.longitude ? Number(place?.longitude) : 0, // احداتيات المنطقة في الخريطة of place
      latitude: place?.latitude ? Number(place?.latitude) : 0, // احداتيات المنطقة في الخريطة of place
      spaceGeneral: place?.space_general ? Number(place?.space_general) : 1, // مساحة العقار(رقم)

      // pricing info
      priceHide: place?.priceHide || false, // priceHide, اخفاء السعر (true/false)

      // if rent
      rentType: place?.rentType || 'شهري', // نوع الاليجار (شهري/سنوي)

      // if hajez
      hajezDays:
        place?.hajez_days?.length > 2
          ? JSON.parse(JSON.parse(place?.hajez_days))
          : weekDays, // هون بتخزن array فيها ايام الاسبوع الي مسموح فيها الحجز متال ['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد',]
      hajezType: place?.hajezType || '24ساعة', // نوع الحجز المسموح فيه (24ساعة/12ساعة)
      variablePrices:
        place?.variable_prices?.length > 2
          ? JSON.parse(JSON.parse(place?.variable_prices))
          : {}, // هون السعر متغير حسب الايام القيمة الولية هي {} اوبجيكت فارغ  بس ادا اختار العميل السعر متغير بتدخل سعر حسب الايام متال {الخميس:150، الاحد:200}
      specificDaysInCalander:
        place?.specificDaysInCalendar?.length > 2
          ? JSON.parse(JSON.parse(place?.specificDaysInCalendar)).map(
              (day) => new Date(day),
            )
          : [], // هون بتحط ايام معينة في السنة  داخل array
      // specificDaysCalanderPrice: [100, 200], // هون بتحط السعر لكل يوم من تلك الايام داخل array  القيمة الولية هي null  // I think not used
      calanderDaysPrice:
        place?.calanderDaysPrice?.length > 2
          ? JSON.parse(place?.calanderDaysPrice)
          : {}, // "{"2025-01-05":"12000","2025-01-04":"11000","2025-02-26":"14000","2025-02-13":"13000"}"

      // فقط المسابح والإجتامعات وصالات الرياضة والملاعب
      priceBeforeNoon: place?.priceBeforeNoon
        ? Number(place?.priceBeforeNoon)
        : '', // سعر قبل الضهيرة
      priceAfterNoon: place?.priceAfterNoon
        ? Number(place?.priceAfterNoon)
        : '', // سعر في المساء و بعد الضهيرة
      // هون ادا خلىً القيمة فارغة خلي في هادا السعر نفس قسمة السعر price gneral
      timeOpen:
        place?.timeOpen?.length > 2
          ? JSON.parse(place?.timeOpen)
          : {
              start: '00:00',
              end: '23:59',
            }, // وقت فتح المحل بتخزن زي هيك {end:10:00, start:6:00}

      // if pool or gym
      poolType: place?.poolType || 'رجالي', // نوع المسبح او الصالة الرياضية (رجالي/نسائي)

      // if pool
      deepPool: place?.deepPool || '1متر', // عمق المسبح (5متر/1متر/3متر)
      poolDocument: poolDocument, // ??! NOT FOUND ??! File PDF|Image

      // if store
      containSdah: place?.containSdah || false, // هل يحتوي المحل على سده (true/false)
      evacuation: place?.evacuation || false, // (true/false)

      // if farm
      farmHasHouse: place?.farmHasHouse || 'لا', // هل المزرعة فيها منزل (نعم/لا)
      farmHasWater: place?.farmHasWater || 'لا', // هل المزرعة فيها مياه (نعم/لا)
      farmHasFarmed: place?.farmHasFarmed || 'لا', // هل المزرعة مزروعة (نعم /لا)

      // if land
      landInFaceOfStreet: place?.landInFaceOfStreet || 'لا', // هل الارض امامها شارع (نعم/لا)
      numberOfStreetsInLand: place?.numberOfStreetsInLand || 0, // عدد الشوارع امام الارض (رقم)

      // if apartment or house/villa
      numberOfRooms:
        place?.number_of_rooms?.length > 2
          ? JSON.parse(JSON.parse(place?.number_of_rooms))
          : {
              // عدد الغرف لازم تكون زي هيك
              kitchen: 1,
              rooms: 1,
              bathroom: 1,
              stages: 1, // if villa or house
            },

      // if apartment
      numberOfHomeStage: place?.numberOfHomeStage
        ? Number(place?.numberOfHomeStage)
        : 1, // الشقة في الطابق رقم (رقم)
      totalStages: place?.totalStages ? Number(place?.totalStages) : 1, // عدد الطوابق في البيت (رقم)

      // if trip
      tripLong: place?.tripLong || '', // مدة الرحلة(15days / 1month )
      tripDate: place?.tripDate ? new Date(place?.tripDate) : '', // موعد الرحلة بتخزن هون تاريخ

      // if chalet
      chaletDocument: chaletDocument, // File PDF|Image

      // if meeting room
      meetingRoomType: place?.meetingRoomType || '', // نوع غرفة الاجتماعات اختياري بين الانواع التالية :[  "غرفة على شكل U","مسرح","قاعة درس","مكان للعمل الجماعي","بيانات"]
      countPeople: place?.countPeople ? Number(place?.countPeople) : 3, // عدد الاشخاص المسموح بيهم في غرفة الاجتماعات (رقم)

      // if gym
      subscriptionTypeGym: place?.subscriptionTypeGym || 'شهر', // نوع الاشتراك في الصالة الرياضية: [شهر, تلاتة اشهر,سنة

      // postsLimit: 0, // Add limitation on creation by key "limitPosts" from user object and update loc

      folderName: place?.folderName || undefined,
    },
  });

/**
 * Context
 */

export const PlaceFormProvider = ({ children, place = null, photos = [], poolDocument = '', chaletDocument = '' }) => {
  const { t } = useTranslation();
  const methods = usePlaceForm(t, place, photos, poolDocument, chaletDocument);
  return <FormProvider {...methods}> {children} </FormProvider>;
};
