import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks';
import './main.css';
import axios from 'axios';
import Spinner from '@/components/ui/Spinner';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const RegisterPage = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const auth = useAuth();

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await auth.register(formData);

    if (response.message === 'Registration successful') {
      toast.success(t('registration_successful'));
      setIsVerification(true);
      setUserData(response.data);
    } else {
      if (response.success) {
        toast.success(t(response.message));
      } else {
        toast.error(t(response.message));
      }
    }
    setLoading(false);
  };

  const [isVerification, setIsVerification] = useState(false);
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

  const sendOtp = () => {
    const otpValue = getCombinedValue();
    if (!otpValue) {
      toast.error(t('please_enter_otp_code'));
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
            toast.success(t(response.data.message));
            if (userData.user && userData.user.session_token) {
              localStorage.setItem('user', JSON.stringify(userData.user));
              localStorage.setItem('token', userData.user.session_token);
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
            toast.error(t(error.response.data.message));
          } else {
            toast.error(t('error_verifying_otp_code'));
          }
        });
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="mt-4 flex grow items-center justify-around p-4 md:p-0">
        <div className="mb-40">
          <h1 className="mb-4 text-center text-4xl" style={{ marginTop: 52 }}>
            {t('create_account')}
          </h1>
          <form className="mx-auto max-w-md" onSubmit={handleFormSubmit}>
            <input
              name="name"
              type="text"
              placeholder={t('full_name')}
              value={formData.name}
              onChange={handleFormData}
            />
            <input
              name="phone"
              type="tel"
              placeholder="+962"
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
            <button className="primary my-2">{t('create_account')}</button>
            {loading ? <Spinner /> : null}
          </form>

          <div className="mb-4 flex w-full items-center gap-4">
            <div className="h-0 w-1/2 border-[1px]"></div>
            <p className="small -mt-1">{t('or')}</p>
            <div className="h-0 w-1/2 border-[1px]"></div>
          </div>

          <div className="py-2 text-center text-gray-500">
            {t('have_account')}?{' '}
            <Link className="text-black underline" to={'/login'}>
              {t('login')}
            </Link>
          </div>
        </div>
      </div>

      {isVerification ? (
        <div className="form">
          <div className="title">{t('otp')}</div>
          <div className="title">{t('verification_code')}</div>
          <p className="message">{t('otp_sent_message')}</p>
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
            {t('verify')}
          </button>
        </div>
      ) : null}
    </>
  );
};

export default RegisterPage;
