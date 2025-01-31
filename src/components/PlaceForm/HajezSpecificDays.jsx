import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import { CalendarMonth } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';
import { Calendar } from '../ui/calendar';
import { useMemo } from 'react';
import { Input } from '../ui/input';

export default function HajezSpecificDays() {
  const { watch, control, setValue } = useFormContext();

  const [price, calanderDaysPrice] = watch(['price', 'calanderDaysPrice']);

  const calanderDaysEntries = useMemo(() => {
    return Object.entries(calanderDaysPrice).toSorted();
  }, [calanderDaysPrice]);

  const handleDayClick = (field, newDaysArray, clickedDay) => {
    field.onChange(newDaysArray);

    const formatedDate = format(clickedDay, 'yyyy-MM-dd');

    // if the clicked day is already in the calanderDaysPrice object, remove it
    if (calanderDaysPrice[formatedDate]) {
      const { [formatedDate]: _, ...restOfDays } = calanderDaysPrice;
      setValue('calanderDaysPrice', {
        ...restOfDays,
      });
    } else {
      setValue('calanderDaysPrice', {
        ...calanderDaysPrice,
        [formatedDate]: price,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-3 md:col-span-2">
      <FormField
        control={control}
        name="specificDaysInCalander"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>تسعير أيام معينة</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[240px] pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground',
                    )}
                  >
                    <span>{field.value?.length} أيام معينة</span>
                    <CalendarMonth className="ms-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="multiple"
                  selected={field.value}
                  onSelect={(newDaysArray, clickedDay) => {
                    handleDayClick(field, newDaysArray, clickedDay);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {calanderDaysEntries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {calanderDaysEntries.map(([date, price]) => (
            <FormField
              control={control}
              key={date}
              name={`calanderDaysPrice.${date}`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{date}</FormLabel>
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
          ))}
        </div>
      )}
    </div>
  );
}
