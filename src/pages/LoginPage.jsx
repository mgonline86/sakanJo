import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useAuth } from '../../hooks';
import ProfilePage from './ProfilePage';
import './main.css';

const LoginPage = () => {
  const { t } = useTranslation(); // Initialize the translation hook

  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [redirect, setRedirect] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const [OTP, setOTP] = useState('');

  const handleChange = (e) => {
    const { value } = e.target;
    if (value.length <= 4) {
      setOTP(value.trim().replace(/[^0-9]/g, ''));
    }
  };

  useEffect(() => {}, []);

  const sendOtp = () => {
    if (!OTP) {
      toast.error(t('please_enter_otp'));
    } else {
      let phone = formData.phone;
      if (!phone.startsWith('+962')) {
        phone = '+962' + phone;
      }
      axios
        .post('https://backend.sakanijo.com/verify-phone', {
          phone: phone,
          code: OTP,
        })
        .then((response) => {
          if (response.data.message) {
            toast.success(response.data.message);
            if (response.data.user && response.data.user.session_token) {
              
              // remove password from user object
              response.data.user.password = undefined;
              
              localStorage.setItem('user', JSON.stringify(response.data.user));
              localStorage.setItem('token', response.data.user.session_token);
              setRedirect(true);
            }
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            console.log('error', error.response);
            toast.error(error.response.data.message);
          } else {
            toast.error(t('error_verifying_otp'));
          }
        });
    }
  };

  const auth = useAuth();

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    // Trim the form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      phone: prevFormData.phone.trim(),
      password: prevFormData.password.trim(),
    }));

    // Check if any field is empty
    if (!formData.phone || !formData.password) {
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
    const response = await auth.login(formData);
    if (response?.message === 'تم إرسال رمز التحقق مرة أخرى.') {
      setIsVerification(true);
    } else {
      if (response.success) {
        toast.success(response.message);
        setRedirect(true);
      } else {
        console.log(response);
        toast.error(response.message);
      }
    }
    setLoading(false);
  };

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  if (auth.user) {
    return <ProfilePage />;
  }

  return (
    <>
      <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
        <div className="mb-40">
          <h1 className="mb-4 text-center text-4xl" style={{ marginTop: 52 }}>
            {t('login_button')}
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
            <input
              name="password"
              type="password"
              placeholder={t('password')}
              value={formData.password}
              onChange={handleFormData}
              required
              autoComplete="current-password"
            />
            <button className="primary my-4">{t('login_button')}</button>
            {loading ? <Spinner /> : null}
          </form>

          <Link
            className="py-2 text-gray-500 hover:underline"
            to={'/forgot-password'}
          >
            {t('forgot_password')}
          </Link>

          <div className="mb-4 flex w-full items-center gap-4">
            <div className="h-0 w-1/2 border-[1px]"></div>
            <p className="small -mt-1">{t('or')}</p>
            <div className="h-0 w-1/2 border-[1px]"></div>
          </div>

          <div className="py-2 text-center text-gray-500">
            {t('no_account')}?{' '}
            <Link className="text-black underline" to={'/register'}>
              {t('create_account')}
            </Link>
          </div>
        </div>
      </div>

      {isVerification ? (
        <div className="form">
          <div className="title">{t('otp')}</div>
          <div className="title">{t('verification_code')}</div>
          <p className="message">{t('otp_message')}</p>
          <div className="inputs">
            <input
              name="otp"
              type="text"
              minLength="4"
              maxLength="4"
              value={OTP}
              onChange={handleChange}
              className="text-xl"
            />
          </div>
          <Button
            type="button"
            className="action mx-auto min-w-24"
            onClick={sendOtp}
            disabled={OTP.length < 4}
          >
            {t('verify')}
          </Button>
        </div>
      ) : null}
    </>
  );
};

export default LoginPage;
