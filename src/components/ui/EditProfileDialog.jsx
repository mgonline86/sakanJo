import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Loader2, PenSquare, Upload } from 'lucide-react';
import { useAuth } from '../../../hooks';
import { useTranslation } from 'react-i18next';

const EditProfileDialog = () => {
  const { t, i18n } = useTranslation();
  const { user, setUser, uploadPicture, updateUser } = useAuth();
  const uploadRef = useRef(null);
  const [picture, setPicture] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name,
    new_password: '',
    current_password: '',
  });

  const handleImageClick = () => {
    uploadRef.current.click();
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
  };

  const handleUserData = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const { name, new_password, current_password } = userData;

    // Validation
    if (name.trim() === '') {
      setLoading(false);
      return toast.error("Name Can't be empty");
    } else if (new_password &&  !current_password || !new_password &&  current_password) {
      setLoading(false);
      return toast.error("Passwords pleas fill inputs");
    }

   
      // first check if picture has been updated or not
      let pictureUrl = '';
      if (picture) {
        // upload picture and save the image url
        pictureUrl = await uploadPicture(picture);
      }

      const userDetails = {
        name: userData.name,
        current_password: userData.current_password,
        new_password: userData.new_password,
      };

      const res = await updateUser(userDetails);
      if (res.user) {
        setUser(res.user);
        setLoading(false);
        return toast.success('Updated successfully!');
      }else {
        toast.warn(res.message);
      }
      setLoading(false);
  
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-600 ">
          <PenSquare className="mr-2 h-4 w-4" />
          
          {t("editProfile")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {/* <div className="flex justify-center">
          <div className="relative h-40 w-40 cursor-pointer overflow-hidden rounded-full bg-gray-200">
            <div
              className="absolute flex h-full w-full items-center justify-center bg-gray-200 hover:z-10"
              onClick={handleImageClick}
            >
              <input
                type="file"
                className="hidden"
                ref={uploadRef}
                onChange={handlePictureChange}
              />
              <Upload height={50} width={50} color="#4e4646" />
            </div>

            {picture ? (
              <Avatar className="transition-all ease-in-out hover:z-0 hover:hidden ">
                <AvatarImage src={URL.createObjectURL(picture)} />
              </Avatar>
            ) : (
              <Avatar className="transition-all ease-in-out hover:z-0 hover:hidden ">
                <AvatarImage src={user?.picture} />
              </Avatar>
            )}
          </div>
        </div> */}

        {/* Update form */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={userData.name}
              className="col-span-3"
              onChange={handleUserData}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Old Password
            </Label>
            <Input
              id="password"
              name="current_password"
              value={userData.current_password}
              className="col-span-3"
              type="password"
              onChange={handleUserData}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm_Password" className="text-right">
              New Password
            </Label>
            <Input
              id="confirm_password"
              name="new_password"
              value={userData.new_password}
              className="col-span-3"
              type="password"
              onChange={handleUserData}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={loading}
            type="submit"
            className="w-full"
            onClick={handleSaveChanges}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
