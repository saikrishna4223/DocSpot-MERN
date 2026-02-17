// client/src/components/layout/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box className="bg-gray-800 text-white py-6 text-center mt-auto rounded-t-lg shadow-inner">
      <Typography variant="body2">&copy; {new Date().getFullYear()} DocSpot. All rights reserved.</Typography>
    </Box>
  );
};

export default Footer;