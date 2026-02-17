// client/src/components/layout/Header.js
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { AuthContext } from '../../context/AuthContext'; // Adjust path as needed for your file structure

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg rounded-b-lg">
      <Toolbar className="flex justify-between items-center py-3">
        <Typography variant="h5" component="div" className="font-bold text-white tracking-wide">
          DocSpot
        </Typography>
        <Box>
          {isAuthenticated ? (
            <>
              <Typography variant="body1" component="span" className="text-white mr-4">
                Welcome, {user?.name} ({user?.role})
              </Typography>
              <Button color="inherit" onClick={logout} className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-md">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => window.location.hash = '#login'} className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-md mr-2">
                Login
              </Button>
              <Button color="inherit" onClick={() => window.location.hash = '#register'} className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-md">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;