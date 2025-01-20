import { useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';

import { UserContext } from '@/providers/UserProvider';
import { PlaceContext } from '@/providers/PlaceProvider';

import {
  getItemFromLocalStorage,
  setItemsInLocalStorage,
  removeItemFromLocalStorage,
} from '@/utils';
import axiosInstance from '@/utils/axios';
import axios from 'axios';
// USER
export const useAuth = () => {
  return useContext(UserContext);
};

export const useProvideAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getItemFromLocalStorage('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (formData) => {
    let { name, phone, password } = formData;
    if (!phone.startsWith('+962')) {
      phone = '+962' + phone;
    }

   

    if (!/^\+9620?7[789]\d{7}$/.test(phone)) {
      return { success: false, message: "رقم الهاتف الأردني غير صحيح" };
  }
  

    try {
      const response = await axios.post(
        'https://backend.sakanijo.com/register',
        {
          name,
          phone,
          password,
        },
      );

      const { data } = response;

      if (data.user && data.token) {
        setUser(data.user);
      } else {

      }

      return { success: true, message: 'Registration successful', data: data };
    } catch (error) {
      let message = 'Registration failed';
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      }

      return { success: false, message };
    }
  };

  const login = async (formData) => {
    let { phone, password } = formData;
    if (!phone.startsWith('+962')) {
      phone = '+962' + phone;
    }


    try {
      const response = await axios.post('https://backend.sakanijo.com/login', {
        phone,
        password,
      });

      const { data } = response;

      console.log(data);

      if (data?.user && data.sessionToken) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.sessionToken);
        return { success: true, message: 'Login successful' };
      }
      if (data.message === 'تم إرسال رمز التحقق مرة أخرى.') {
        return { success: true, message: 'تم إرسال رمز التحقق مرة أخرى.' };
      }
    } catch (error) {
      let message = 'Login failed';

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      }
      console.error('Login Error:', error); // Log the full error for debugging
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      // Clear user data and token from localStorage when logging out
      removeItemFromLocalStorage('user');
      removeItemFromLocalStorage('token');

      return { success: true, message: 'Logout successfull' };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Something went wrong!' };
    }
  };

  const uploadPicture = async (picture) => {
    try {
      const formData = new FormData();
      formData.append('picture', picture);
      const { data } = await axiosInstance.post(
        '/user/upload-picture',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (data) => {
    const { name, current_password, new_password } = data;

    let password = new_password;
    let currentpass = current_password;
    const id = JSON.parse(getItemFromLocalStorage('user')).id;

    try {
      const { data } = await axios.post(
        'https://backend.sakanijo.com/user/update-user',
        {
          id,
          name,
          currentpass,
          password,
        },
      );
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error; // Propagate the error for handling in the caller
    }
  };

  return {
    user,
    setUser,
    register,
    login,
    logout,
    loading,
    uploadPicture,
    updateUser,
  };
};

// PLACES
export const usePlaces = () => {
  return useContext(PlaceContext);
};

export const useProvidePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlaces = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://backend.sakanijo.com/api/places`,
      );
      const { places } = response.data;

      // Update places state
      setPlaces(places);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching places:', error);
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchPlaces(); // Fetch the first page of places
  }, []);

  return {
    places,
    loading,
    setLoading,
    setPlaces,
  };
};
