import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Import useTranslation

import ProfilePage from './ProfilePage';
import { useAuth } from '../../hooks';
import './main.css';
import axios from 'axios';
import Spinner from '@/components/ui/Spinner';

const LoginPage = () => {
  const { t } = useTranslation(); // Initialize the translation hook

  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [redirect, setRedirect] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const [inputValues, setInputValues] = useState({
    input1: '',
    input2: '',
    input3: '',
    input4: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (value.length <= 1) {
      setInputValues({
        ...inputValues,
        [id]: value,
      });
    }
  };

  const getCombinedValue = () => {
    return Object.values(inputValues).join('');
  };

  useEffect(() => {}, []);

  const sendOtp = () => {
    const otpValue = getCombinedValue();
    if (!otpValue) {
      toast.error(t('please_enter_otp'));
    } else {
      let phone = formData.phone;
      if (!phone.startsWith('+962')) {
        phone = '+962' + phone;
      }
      axios
        .post('https://backend.sakanijo.com/verify-phone', {
          phone: phone,
          code: otpValue,
        })
        .then((response) => {
          if (response.data.message) {
            toast.success(response.data.message);
            if (response.data.user && response.data.user.session_token) {
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
            console.log("error",error.response)
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await auth.login(formData);
    if (response?.message === 'تم إرسال رمز التحقق مرة أخرى.') {
      setIsVerification(true);
    } else {
      if (response.success) {
        toast.success(response.message);
        setRedirect(true);
      } else {
        console.log(response)
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
            <input
              name="phone"
              type="tel"
              placeholder={t('phone_placeholder')}
              value={formData.phone}
              onChange={handleFormData}
            />
            <input
              name="password"
              type="password"
              placeholder={t('password')}
              value={formData.password}
              onChange={handleFormData}
            />
            <button className="primary my-4">{t('login_button')}</button>
            {loading ? <Spinner /> : null}
          </form>

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
              id="input1"
              type="text"
              maxLength="1"
              value={inputValues.input1}
              onChange={handleChange}
            />
            <input
              id="input2"
              type="text"
              maxLength="1"
              value={inputValues.input2}
              onChange={handleChange}
            />
            <input
              id="input3"
              type="text"
              maxLength="1"
              value={inputValues.input3}
              onChange={handleChange}
            />
            <input
              id="input4"
              type="text"
              maxLength="1"
              value={inputValues.input4}
              onChange={handleChange}
            />
          </div>
          <button className="action" onClick={sendOtp}>
            {t('verify_me')}
          </button>
        </div>
      ) : null}
    </>
  );
};

export default LoginPage;
