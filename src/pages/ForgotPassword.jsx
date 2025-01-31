import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Spinner from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../hooks';
import ProfilePage from './ProfilePage';
import './main.css';

const ForgotPassword = () => {
  const { t } = useTranslation(); // Initialize the translation hook
  const auth = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({ phone: '' });
  const [loading, setLoading] = useState(false);
  const [checkOTP, setCheckOTP] = useState('');
  const [OTP, setOTP] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleChange = (e) => {
    const { value } = e.target;
    if (value.length <= 4) {
      setOTP(value.trim().replace(/[^0-9]/g, ''));
    }
  };

  const sendOtp = () => {
    if (!OTP) {
      toast.error(t('please_enter_otp_code'));
      return;
    }
    if (OTP !== checkOTP) {
      toast.error(t('please_enter_correct_otp_code'));
      return;
    }
    let phone = formData.phone;
    if (!phone.startsWith('+962')) {
      phone = `+962${phone}`;
    }
    axios
      .post('https://backend.sakanijo.com/reset-password-forget', {
        phoneNumber: phone,
        newPassword: newPassword,
      })
      .then((response) => {
        if (response.data.message) {
          toast.success(t(response.data.message));
          navigate('/login');
        }
      })
      .catch((error) => {
        if (error.response?.data?.message) {
          toast.error(t(error.response.data.message));
        } else {
          toast.error(t('error_verifying_otp_code'));
        }
      });
  };

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

    let phone = formData.phone;
    if (!phone.startsWith('+962')) {
      phone = `+962${phone}`;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'https://backend.sakanijo.com/check-phone',
        {
          phoneNumber: phone,
        },
      );
      toast.success(t('otp_sent_message'));
      setCheckOTP(response.data.code);
    } catch (error) {
      toast.error(t('something_went_wrong'));
    } finally {
      setLoading(false);
    }
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
            <button type="submit" className="primary my-4">
              {t('send')}
            </button>
            {loading ? <Spinner /> : null}
          </form>
        </div>
      </div>
      {checkOTP ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
          <div className="form">
            <div className="title">{t('otp')}</div>
            <div className="title">{t('verification_code')}</div>
            <p className="message">{t('otp_sent_message')}</p>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <label htmlFor="otp">{t('otp')}</label>
                <input
                  name="otp"
                  type="text"
                  placeholder="1234"
                  minLength="4"
                  maxLength="4"
                  value={OTP}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password">{t('new_password')}</label>
                <div className="flex items-center">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('new_password')}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="rounded-e-none"
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="rounded-s-none border-s-0 py-5"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                </div>
              </div>
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
        </div>
      ) : null}
    </>
  );
};

export default ForgotPassword;
