import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DeleteForever } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const deletePlace = async (id) => {
  const response = await axios.post(
    `https://backend.sakanijo.com/delete/places/${id}`,
  );
  return response;
};

export default function DeletePlaceAlertDialog({ id }) {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deletePlace(id);
      if (response.status < 400) {
        setOpen(false);
        toast.success('تم حذف الإعلان بنجاح');

        // update user limitPosts
        const updatedUser = {
          ...user,
          limitPosts: user.limitPosts >= 0 ? user.limitPosts + 1 : 1,
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        navigate('/account/places');
      } else {
        toast.error('حدث خطأ أثناء حذف الإعلان');
      }
    } catch (error) {
      console.error('Error deleting place:', error);
      toast.error('حدث خطأ أثناء حذف الإعلان');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2 py-0">
          <span>مسح</span> <DeleteForever />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
          <AlertDialogDescription>
            لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف إعلانك بشكل دائم
            وإزالة بياناته من خوادمنا.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>إلغاء</AlertDialogCancel>
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'جاري المسح...' : 'مسح الإعلان'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
