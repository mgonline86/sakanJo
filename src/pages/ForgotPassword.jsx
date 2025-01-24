import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useAuth } from '../../hooks';
import ProfilePage from './ProfilePage';
import './main.css';

const ForgotPassword = () => {
  const { t } = useTranslation(); // Initialize the translation hook
  const auth = useAuth();

  const [formData, setFormData] = useState({ phone: '' });
  const [loading, setLoading] = useState(false);

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    // Trim the form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      phone: prevFormData.phone.trim(),
    }));

    // Check if any field is empty
    if (!formData.phone) {
      toast.error(t('please_fill_all_inputs'));
      return false;
    }

    // Check if phone number is valid
    const phone = `+962${formData.phone}`;
    if (!/^\+9620?7[789]\d{7}$/.test(phone)) {
      toast.error(t('invalid_phone_number'));
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setLoading(true);
    
    // TODO: by Yassin ad logic for backend forgot password
    console.log(formData);
    

    setLoading(false);
  };

  if (auth.user) {
    return <ProfilePage />;
  }

  return (
    <>
      <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
        <div className="mb-40">
          <h1 className="mb-4 text-center text-4xl" style={{ marginTop: 52 }}>
            {t('forgot_password')}
          </h1>
          <form className="mx-auto max-w-md" onSubmit={handleFormSubmit}>
            <div className="flex items-center rtl:direction-ltr">
              <span className="rounded-e-none rounded-s-md border bg-gray-100 p-2">
                +962
              </span>
              <input
                name="phone"
                type="tel"
                placeholder="07xxxxxxxx"
                className="rounded-s-none border-s-0"
                value={formData.phone}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^\d]/g, '');
                  handleFormData(e);
                }}
                required
                maxLength={10}
                autoComplete="tel"
              />
            </div>
            <button className="primary my-4">{t('send')}</button>
            {loading ? <Spinner /> : null}
          </form>
        </div>
      </div>

    </>
  );
};

export default ForgotPassword;
