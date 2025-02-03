import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loop } from '@mui/icons-material';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useAuth } from '../../hooks';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

const ProfileImageUpdateSchema = z.object({
  imageFile: z.instanceof(File).refine(
    (file) => {
      return file.type.startsWith('image/');
    },
    {
      message: 'يجب ان يكون الملف صورة',
    },
  ),
});

const updateProfileImage = async (userId, data) => {
  const formData = new FormData();
  formData.append('picture_url', 100);
  formData.append('id', userId);
  formData.append('imageFile', data.imageFile);
  const response = await axios.post(
    'https://backend.sakanijo.com/update-picture/user',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
  return response;
};

export default function ProfileImageUpdateDialog({ userId, triggerBtnProps }) {
  const form = useForm({
    resolver: zodResolver(ProfileImageUpdateSchema),
    defaultValues: {
      imageFile: '',
    },
  });

  const { user, setUser } = useAuth();

  const [open, setOpen] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await updateProfileImage(userId, data);
      if (response.status < 400) {
        toast.success('تم تحديث الصورة بنجاح');
        const updatedUser = {
          ...user,
          picture_url: 100,
          image_name: response.data.imageName,
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        form.reset();
      } else {
        console.log(response.statusText);
        toast.error('حدث خطأ أثناء تحديث الصورة');
      }
    } catch (error) {
      console.log(error);
      toast.error('حدث خطأ أثناء تحديث الصورة');
    } finally {
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...triggerBtnProps}>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] rounded-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تحديث الصورة</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="imageFile"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>حدد الملف</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      placeholder="اختر الملف"
                      type="file"
                      accept="image/*"
                      onChange={(event) => onChange(event.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'جاري التحميل' : 'تحديث الصورة'}{' '}
              {form.formState.isSubmitting && <Loop className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
