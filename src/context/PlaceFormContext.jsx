import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { placeFormSchema, weekDays } from './PlaceFormSchema';

const getPlacePhotos = (photos, folderName) => {
  if (!photos) return [];
  return photos
    ?.split(',')
    .map(
      (photo) =>
        `https://backend.sakanijo.com/api/images/${encodeURIComponent(folderName)}/${encodeURIComponent(photo)}`,
    );
};

export const usePlaceForm = (t, place = null) =>
  useForm({
    resolver: zodResolver(placeFormSchema(t)),
    defaultValues: {
      type: null, // --> old api cancelled
      sellingMethod: null, // --> old api cancelled

      homeType: 'فيلا / منزل', // نوع المنزل (شقة/شليه:/الخ)
      title: place?.title || '', // ??! NOT FOUND ??!
      description: place?.description || '', // ??! NOT FOUND ??!
      existingPhotos: getPlacePhotos(place?.photos, place?.folderName) || [],
      images: [], // ??! NOT FOUND ??!
      buyOrRent: 'للبيع', // نوع البيع (للبيع/الإيجار/الحجز)
      adsAccept: 'لا', // هون ااعلان يستقبل (قابل لتفاوض/تقسيط/لا)
      gettingCalls: 'whatsapp', // الاعلان يستقبل رسايل عبر (whatsapp/sms)
      // ownerStatus: '', // حالة المعلن (وسيط/مالك) --> old api cancelled
      publisherState: 'مالك', // هون متا الاولى حالة المعلن وسيط او مالك
      price: 1, // general price

      // get it from user
      owner_id: null,
      ownerPhone: '', //  رقم هاتف المعلن
      ownerName: '', // اسم المعلن

      // depend on homeType
      amenities: [], // هون بتخزن array فيها مزايا العقار

      address: undefined, // بتخزن هنا عنوان المكان
      // location: '',
      street: '', // string الحي
      closePlace: '', // string ??! مكان قريب
      longitude: 0, // احداتيات المنطقة في الخريطة of place
      latitude: 0, // احداتيات المنطقة في الخريطة of place
      spaceGeneral: 1, // مساحة العقار(رقم)

      // pricing info
      priceHide: false, // priceHide, اخفاء السعر (true/false)

      // if rent
      rentType: undefined, // نوع الاليجار (شهري/سنوي)

      // if hajez
      hajezDays: weekDays, // هون بتخزن array فيها ايام الاسبوع الي مسموح فيها الحجز متال ['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد',]
      hajezType: '24ساعة', // نوع الحجز المسموح فيه (24ساعة/12ساعة)
      variablePrices: {}, // هون السعر متغير حسب الايام القيمة الولية هي {} اوبجيكت فارغ  بس ادا اختار العميل السعر متغير بتدخل سعر حسب الايام متال {الخميس:150، الاحد:200}
      specificDaysInCalander: [], // هون بتحط ايام معينة في السنة  داخل array
      // specificDaysCalanderPrice: [100, 200], // هون بتحط السعر لكل يوم من تلك الايام داخل array  القيمة الولية هي null  // I think not used
      calanderDaysPrice: {}, // "{"2025-01-05":"12000","2025-01-04":"11000","2025-02-26":"14000","2025-02-13":"13000"}"

      // فقط المسابح والإجتامعات وصالات الرياضة والملاعب
      priceBeforeNoon: 1, // سعر قبل الضهيرة
      priceAfterNoon: 1, // سعر في المساء و بعد الضهيرة
      // هون ادا خلىً القيمة فارغة خلي في هادا السعر نفس قسمة السعر price gneral
      timeOpen: {
        start: "00:00",
        end: "23:59",
      }, // وقت فتح المحل بتخزن زي هيك {end:10:00, start:6:00}

      // if pool or gym
      poolType: 'رجالي', // نوع المسبح او الصالة الرياضية (رجالي/نسائي)

      // if pool
      deepPool: '1متر', // عمق المسبح (5متر/1متر/3متر)
      poolDocument: "", // ??! NOT FOUND ??! File PDF|Image

      // if store
      containSdah: false, // هل يحتوي المحل على سده (true/false)
      evacuation: false, // (true/false)

      // if farm
      farmHasHouse: '', // هل المزرعة فيها منزل (نعم/لا)
      farmHasWater: '', // هل المزرعة فيها مياه (نعم/لا)
      farmHasFarmed: '', // هل المزرعة مزروعة (نعم /لا)

      // if land
      landInFaceOfStreet: '', // هل الارض امامها شارع (نعم/لا)
      numberOfStreetsInLand: 0, // عدد الشوارع امام الارض (رقم)

      // if apartment or house/villa
      numberOfRooms: {
        // عدد الغرف لازم تكون زي هيك
        kitchen: 1,
        rooms: 1,
        bathroom: 1,
        stages: 1, // if villa or house
      },

      // if apartment
      numberOfHomeStage: 1, // الشقة في الطابق رقم (رقم)
      totalStages: 1, // عدد الطوابق في البيت (رقم)

      // if trip
      tripLong: '', // مدة الرحلة(15days / 1month )
      tripDate: '', // موعد الرحلة بتخزن هون تاريخ

      // if chalet
      chaletDocument: null, // File PDF|Image

      // if meeting room
      meetingRoomType: '', // نوع غرفة الاجتماعات اختياري بين الانواع التالية :[  "غرفة على شكل U","مسرح","قاعة درس","مكان للعمل الجماعي","بيانات"]
      countPeople: 3, // عدد الاشخاص المسموح بيهم في غرفة الاجتماعات (رقم)

      // if gym
      subscriptionTypeGym: 'شهر', // نوع الاشتراك في الصالة الرياضية: [شهر, تلاتة اشهر,سنة

      // postsLimit: 0, // Add limitation on creation by key "limitPosts" from user object and update loc
    },
  });

/**
 * Context
 */

export const PlaceFormProvider = ({ children, place = null }) => {
  const { t } = useTranslation();
  const methods = usePlaceForm(t, place);
  return <FormProvider {...methods}> {children} </FormProvider>;
};
