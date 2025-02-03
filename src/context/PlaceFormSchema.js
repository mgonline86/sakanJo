import { amenitiesOptions } from '@/data/amenitiesOptions';
import { z } from 'zod';

export const homeTypeOptions = Object.keys(amenitiesOptions);

export const sellingTypeOptions = ['للبيع', 'للإيجار', 'الحجز'];

export const adsAcceptOptions = ['قابل لتفاوض', 'قابل لتقسيط', 'لا'];

export const gettingCallsOptions = ['whatsapp', 'sms'];

export const publisherStateOptions = ['مالك', 'معلن'];

export const weekDays = [
  'السبت',
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
];

export const rentTypeOptions = ['شهري', 'سنوي'];

export const yesNo = ['نعم', 'لا'];

export const hajezHours = ['24ساعة', '12ساعة'];

export const genders = ['رجالي', 'نسائي'];

export const poolsDepth = ['1متر', '3متر', '5متر'];

export const tripPeriodOptions = ['15days', '1month'];

export const meetingRoomTypes = [
  'غرفة على شكل U',
  'مسرح',
  'قاعة درس',
  'مكان للعمل الجماعي',
  'بيانات',
];

export const subscriptionTypes = ['شهر', 'تلاتة اشهر', 'سنة'];

const homeTypeSchema = z.discriminatedUnion('homeType', [
  z.object({
    homeType: z.literal('فيلا / منزل'),
    numberOfRooms: z.object({
      kitchen: z.number().int().min(0),
      rooms: z.number().int().min(0),
      bathroom: z.number().int().min(0),
      stages: z.number().int().min(0),
    }),
  }),

  z.object({
    homeType: z.literal('مزرعة'),
    farmHasHouse: z.enum(yesNo),
    farmHasWater: z.enum(yesNo),
    farmHasFarmed: z.enum(yesNo),
  }),
  z.object({
    homeType: z.literal('أرض'),
    landInFaceOfStreet: z.enum(yesNo),
    numberOfStreetsInLand: z.number().int().min(0),
  }),
  z.object({
    homeType: z.literal('شقة'),
    numberOfRooms: z.object({
      kitchen: z.number().int().min(0),
      rooms: z.number().int().min(0),
      bathroom: z.number().int().min(0),
    }),
    numberOfHomeStage: z.number().int().min(0),
    totalStages: z.number().int().min(0),
  }),
  z.object({
    homeType: z.literal('استوديو'),
  }),
  z.object({
    homeType: z.literal('شليهات'),
    chaletDocument: z.instanceof(File).refine(
      (file) => {
        return (
          file.type === 'application/pdf' || file.type.startsWith('image/')
        );
      },
      {
        message: 'يجب ان يكون الملف PDF او صورة',
      },
    ),
  }),
  z.object({
    homeType: z.literal('تنظيم رحلات'),
    tripLong: z.enum(tripPeriodOptions),
    tripDate: z.date(),
  }),
  z.object({
    homeType: z.literal('مخيمات و اكواخ'),
  }),
  z.object({
    homeType: z.literal('مكاتب وعيادات'),
  }),
  z.object({
    homeType: z.literal('محلات ومخازن'),
    containSdah: z.boolean(),
    evacuation: z.boolean(),
  }),
  z.object({
    homeType: z.literal('مسابح'),
    timeOpen: z.object({
      start: z.coerce.string().optional(),
      end: z.coerce.string().optional(),
    }),
    poolType: z.enum(genders),
    deepPool: z.enum(poolsDepth),
    poolDocument: z.instanceof(File).refine(
      (file) => {
        return (
          file.type === 'application/pdf' || file.type.startsWith('image/')
        );
      },
      {
        message: 'يجب ان يكون الملف PDF او صورة',
      },
    ),
  }),
  z.object({
    homeType: z.literal('ملاعب'),
    timeOpen: z.object({
      start: z.coerce.string().optional(),
      end: z.coerce.string().optional(),
    }),
  }),
  z.object({
    homeType: z.literal('قاعات اجتماعات'),
    timeOpen: z.object({
      start: z.coerce.string().optional(),
      end: z.coerce.string().optional(),
    }),
    meetingRoomType: z.enum(meetingRoomTypes),
    countPeople: z.number().int().min(2),
  }),
  z.object({
    homeType: z.literal('صالات رياضة'),
    timeOpen: z.object({
      start: z.coerce.string().optional(),
      end: z.coerce.string().optional(),
    }),
    poolType: z.enum(genders),
    subscriptionTypeGym: z.enum(subscriptionTypes),
  }),
]);

const sellingTypeSchema = z.discriminatedUnion('buyOrRent', [
  z.object({
    buyOrRent: z.literal('للبيع'),
  }),

  // rent only
  z.object({
    buyOrRent: z.literal('للإيجار'),
    rentType: z.enum(rentTypeOptions),
  }),

  z.object({
    // hajz only
    buyOrRent: z.literal('الحجز'),
    hajezDays: z.array(z.enum(weekDays)).min(1),
    hajezType: z.enum(hajezHours),
    variablePrices: z.object({
      ...weekDays.reduce((acc, day) => {
        acc[day] = z.number().min(1).optional();
        return acc;
      }, {}),
    }),
    specificDaysInCalander: z.array(z.date()),
    calanderDaysPrice: z.record(z.string().date(), z.number().min(1)),
  }),
]);

export const placeFormSchema = (t) =>
  z
    .object({
      type: z.any().nullish(),
      sellingMethod: z.any().nullish(),

      homeType: z.enum(homeTypeOptions, {
        required_error: t('new_ad.type.error'),
      }),
      title: z.string().min(1, {
        message: t('new_ad.title.error'),
      }),
      description: z.string().min(1, {
        message: t('new_ad.description.error'),
      }),
      buyOrRent: z.enum(sellingTypeOptions, {
        required_error: t('new_ad.buyOrRent.error'),
      }),
      adsAccept: z.enum(adsAcceptOptions),
      gettingCalls: z.enum(gettingCallsOptions),
      publisherState: z.enum(publisherStateOptions),

      amenities: z.array(z.string()).nullish(),

      address: z.tuple([
        z.string().min(1),
        z.object({
          name: z.string().min(1),
          lat: z.number(),
          long: z.number(),
        }),
      ]),
      street: z.string().min(1),
      closePlace: z.string(),
      spaceGeneral: z.number().min(1),

      price: z.number().min(1),
      priceHide: z.boolean(),

      existingPhotos: z.array(z.string()).nullish(),
      images: z.array(z.instanceof(File)).min(1, {
        message: t('new_ad.images.error'),
      }).max(10),

      priceBeforeNoon: z.number().min(1).or(z.literal("")),
      priceAfterNoon: z.number().min(1).or(z.literal("")),

      folderName: z.string().nullish(),
    })
    .and(sellingTypeSchema)
    .and(homeTypeSchema);
