import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';

export default function DayHoursInputs({ id }) {
  const { control } = useFormContext();

  return (
    <>
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
