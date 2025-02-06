import { zodResolver } from '@hookform/resolvers/zod';
import { Star, StarBorder } from '@mui/icons-material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useAuth } from '../../hooks';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const addNewReview = async ({ place_id, user_id, comment, rating }) => {
  const response = await axios.post(
    'https://backend.sakanijo.com/reviews/add',
    {
      place_id,
      user_id,
      comment,
      rating,
    },
  );
  return response;
};

const addReviewFormSchema = z.object({
  comment: z.string().min(2, { message: 'علي الاقل 2 حروف' }).max(255, {
    message: 'الحد الاقصى 255 حرف',
  }),
  rating: z
    .number()
    .min(1, { message: 'التقييم يجب ان يكون على الاقل 1' })
    .max(5, {
      message: 'التقييم يجب ان يكون على الأكثر 5',
    }),
  place_id: z.string(),
  user_id: z.number(),
});

export default function AddReviewForm({ place_id, onSuccess }) {
  const { user } = useAuth();

  const { t } = useTranslation();

  const form = useForm({
    resolver: zodResolver(addReviewFormSchema),
    defaultValues: {
      comment: '',
      rating: 0,
    },
  });

  const [isHoveringStar, setIsHoveringStar] = useState({
    isHoveringStar: false,
    rating: 0,
  });

  useEffect(() => {
    form.reset();
    form.setValue('place_id', place_id);
    form.setValue('user_id', user.id);
  }, [form, place_id, user]);

  const onSubmit = async (data) => {
    try {
      const res = await addNewReview(data);
      if (res.status < 400) {
        toast.success('تم اضافة التقييم بنجاح');
        form.reset();

        if (onSuccess) {
          onSuccess({
            ...res.data,
            review: { user_id: data.user_id, ...res.data.review },
          });
        }
      } else {
        console.log(res.status, res.statusText);
        toast.error('حدث خطأ أثناء اضافة التقييم');
      }
    } catch (error) {
      console.log(error);
      toast.error('حدث خطأ أثناء اضافة التقييم');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="flex max-w-lg flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  className="h-auto w-auto bg-transparent p-0 text-black hover:bg-transparent"
                  onClick={() =>
                    form.setValue('rating', rating, { shouldValidate: true })
                  }
                >
                  <div
                    onMouseEnter={() =>
                      setIsHoveringStar({
                        isHoveringStar: true,
                        rating: rating,
                      })
                    }
                    onMouseLeave={() =>
                      setIsHoveringStar({ isHoveringStar: false, rating: 0 })
                    }
                  >
                    {isHoveringStar.isHoveringStar ? (
                      isHoveringStar.rating >= rating ? (
                        <Star className="h-4 w-4 md:h-6 md:w-6" />
                      ) : (
                        <StarBorder className="h-4 w-4 md:h-6 md:w-6" />
                      )
                    ) : field.value >= rating ? (
                      <Star className="h-4 w-4 md:h-6 md:w-6" />
                    ) : (
                      <StarBorder className="h-4 w-4 md:h-6 md:w-6" />
                    )}
                  </div>
                </Button>
              ))}
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              <span>
                (
                {isHoveringStar.isHoveringStar
                  ? isHoveringStar.rating
                  : field.value}
                )
              </span>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} className="h-auto" rows={4} />
              </FormControl>
              <div
                className={`${field.value.length > 255 ? 'text-red-500' : 'text-muted-foreground'} w-full text-end text-xs`}
              >
                {field.value.length}/255
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {t('submit_review')}
          {form.formState.isSubmitting && '...'}
        </Button>
      </form>
    </Form>
  );
}
