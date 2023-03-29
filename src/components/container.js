import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import FullWidthTabs from './tabs';

export default function SimpleContainer() {
  return (
    <React.Fragment>
      <CssBaseline />
      
      <Container maxWidth="xl" 
      position='relative'  sx={{ bgcolor: 'red', width:"100%" }}>
        {/* <Box sx={{ bgcolor: '#cfe8fc', width:'97%', 
        height: '100vh',
        margin:0,padding:0 }}>
         <FullWidthTabs/>
        </Box> */}
        <FullWidthTabs></FullWidthTabs>
      </Container>
    </React.Fragment>
  );
}