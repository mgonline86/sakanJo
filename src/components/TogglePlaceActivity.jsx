import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

const togglePlaceActivity = async (id) => {
  const response = await axios.post(
    `https://backend.sakanijo.com/api/places/${id}/toggle-active`,
  );
  return response;
};

export default function TogglePlaceActivity({ id, initialState }) {
  const [active, setActive] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await togglePlaceActivity(id);
      if (response.status < 400) {
        setOpen(false);
        setActive(!active);
        toast.success('تم تغيير حالة الإعلان بنجاح');
      } else {
        toast.error('حدث خطأ أثناء تغيير حالة الإعلان');
      }
    } catch (error) {
      console.error('Error toggling place:', error);
      toast.error('حدث خطأ أثناء تغيير حالة الإعلان');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <Label>{active ? 'نشط' : 'غير نشط'}</Label>
        <Switch checked={active} onCheckedChange={() => setOpen(true)} className="data-[state=checked]:bg-green-600" />
      </div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            هل أنت متأكد من أنك تريد {active ? 'تعطيل' : 'تفعيل'} الإعلان
          </AlertDialogTitle>
          <AlertDialogDescription>
            {active
              ? 'سيتم تعطيل الإعلان ولن يظهر على الصفحة الرئيسية'
              : 'سيتم تفعيل الإعلان وستظهر على الصفحة الرئيسية'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>إلغاء</AlertDialogCancel>
          <Button onClick={handleToggle}>
            {loading ? 'جاري التحميل...' : 'تأكيد'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
