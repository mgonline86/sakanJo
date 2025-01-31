import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

export default function DayHoursInputs() {
  const { control, formState, watch, setValue } = useFormContext();

  const [price] = watch(['price']);

  const dirtyFields = useMemo(
    () => Object.keys(formState.dirtyFields),
    [formState],
  );

  useEffect(() => {
    if (!dirtyFields.includes('priceBeforeNoon')) {
      setValue('priceBeforeNoon', price);
    }
    if (!dirtyFields.includes('priceAfterNoon')) {
      setValue('priceAfterNoon', price);
    }
  }, [price, dirtyFields, setValue]);

  return (
    <>
      <FormField
        control={control}
        name="priceBeforeNoon"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>السعر قبل الظهيرة</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                min={1}
                step={0.1}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="priceAfterNoon"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>السعر بعد الظهيرة</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                min={1}
                step={0.1}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='flex gap-4'>
        <FormField
          control={control}
          name="timeOpen.start"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>ميعاد الفتح</FormLabel>
              <Input
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
                type="time"
                className="justify-center"
              />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="timeOpen.end"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>ميعاد الاغلاق</FormLabel>
              <Input
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
                type="time"
                className="justify-center"
              />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
