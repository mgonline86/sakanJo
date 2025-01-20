import React from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from './Header';
import Footer from './Footer';
import WhatsappButton from '../WhatsappButton';

const Layout = () => {
  return (
    <>
      <Header />
      <div className="flex flex-col max-w-screen-xl min-h-screen mx-auto">
        <Outlet />
      </div>
      <WhatsappButton />
      <Footer />
    </>
  );
};

export default Layout;
