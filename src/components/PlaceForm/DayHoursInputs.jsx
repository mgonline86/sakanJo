import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';

export default function DayHoursInputs({ id }) {
  const { control } = useFormContext();

  return (
    <>
      <div className="flex gap-4 md:col-span-2">
        <FormField
          control={control}
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
            <FormItem className="flex flex-1 flex-col">
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
      </div>
      {!id && (
        <div className="flex gap-4">
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
      )}
    </>
  );
}
