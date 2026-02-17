// client/src/pages/HomePage.js
import React from 'react';
import { Button, Typography } from '@mui/material'; // Keeping Typography as it's used in <p> tag text below

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] p-4">
      <Typography variant="h1" component="h1" className="text-5xl font-extrabold text-blue-800 text-center mb-6 animate-fadeIn">
        DocSpot: Seamless Appointment Booking for Health
      </Typography>
      <Typography variant="body1" component="p" className="text-xl text-gray-700 text-center max-w-2xl mb-8 leading-relaxed animate-slideUp">
        Booking a doctor's appointment has never been easier. With our convenient online platform, you can quickly and effortlessly schedule your appointments from the comfort of your own home. No more waiting on hold or playing phone tag with busy receptionists.
      </Typography>
      <div className="flex space-x-4 animate-zoomIn">
        <Button
          variant="contained"
          size="large"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform"
          onClick={() => window.location.hash = '#register'}
        >
          Get Started
        </Button>
        <Button
          variant="outlined"
          size="large"
          className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform"
          onClick={() => window.location.hash = '#login'}
        >
          Login
        </Button>
      </div>
      {/* Removed the <style jsx> block */}
    </div>
  );
};

export default HomePage;