import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks';
import './main.css';

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
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    // Trim the form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      name: prevFormData.name.trim(),
      phone: prevFormData.phone.trim(),
      password: prevFormData.password.trim(),
    }));

    // Check if any field is empty
    if (!formData.name || !formData.phone || !formData.password) {
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
  const [OTP, setOTP] = useState('');

  const handleChange = (e) => {
    const { value } = e.target;
    if (value.length <= 4) {
      setOTP(value.trim().replace(/[^0-9]/g, ''));
    }
  };

  const getCombinedValue = () => {
    return Object.values(inputValues).join('');
  };

  const sendOtp = () => {
    if (!OTP) {
      toast.error(t('please_enter_otp_code'));
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
      <div className="flex items-center justify-around p-4 mt-4 grow md:p-0">
        <div className="mb-40">
          <h1 className="mb-4 text-4xl text-center" style={{ marginTop: 52 }}>
            {t('create_account')}
          </h1>
          <form className="max-w-md mx-auto" onSubmit={handleFormSubmit}>
            <input
              name="name"
              type="text"
              placeholder={t('full_name')}
              value={formData.name}
              onChange={handleFormData}
              required
              autoComplete="name"
            />
            <div className="flex items-center rtl:direction-ltr">
              <span className="p-2 bg-gray-100 border rounded-e-none rounded-s-md">
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
            <div className="flex items-center">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={t('password')}
                value={formData.password}
                onChange={handleFormData}
                className="rounded-e-none"
                autoComplete="new-password"
                required
                minLength={8}
              />
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="py-5 rounded-s-none border-s-0"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </Button>
            </div>
            <button className="my-2 primary">{t('create_account')}</button>
            {loading ? <Spinner /> : null}
          </form>

          <div className="flex items-center w-full gap-4 mb-4">
            <div className="h-0 w-1/2 border-[1px]"></div>
            <p className="-mt-1 small">{t('or')}</p>
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
            className="mx-auto action min-w-24"
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

export default RegisterPage;
