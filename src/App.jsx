import { Route, Routes } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/ui/Layout';
import AboutPage from './pages/AboutPage';
import BookingsPage from './pages/BookingsPage';
import ContactPage from './pages/ContactPage';
import ForgotPassword from './pages/ForgotPassword';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import PlacePage from './pages/PlacePage';
import PlacesFormPage from './pages/PlacesFormPage';
import PlacesPage from './pages/PlacesPage';
import PrivacyPolicy from './pages/Policy';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import SingleBookedPlace from './pages/SingleBookedPlace';
import { PlaceProvider } from './providers/PlaceProvider';
import { UserProvider } from './providers/UserProvider';
import PlacesUpdateFormPage from './pages/PlacesUpdateFormPage';

function App() {
  return (
    <UserProvider>
      <PlaceProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/policy" element={<PrivacyPolicy />} />

            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/account" element={<ProfilePage />} />
            <Route path="/account/places" element={<PlacesPage />} />
            <Route path="/account/places/new" element={<PlacesFormPage />} />
            <Route path="/account/places/:id" element={<PlacesUpdateFormPage />} />
            <Route path="/place/:id" element={<PlacePage />} />
            <Route path="/account/bookings" element={<BookingsPage />} />
            <Route
              path="/account/bookings/:id"
              element={<SingleBookedPlace />}
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer autoClose={2000} transition={Slide} />
      </PlaceProvider>
    </UserProvider>
  );
}

export default App;
