import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

import './app-bar.scss';

/*
<IconButton
  size="large"
  edge="start"
  color="inherit"
  aria-label="menu"
  sx={{ mr: 2 }}
>
  <MenuIcon />
</IconButton>
 */

export const MiddagAppBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" className="app-bar">
        <Toolbar>
          <Link to="/search">
            <LinkButton title='Search'/>
          </Link>
          <Link to="/add">
            <LinkButton title='Add dinner'/>
          </Link>
          <Link to="/list">
            <LinkButton title='Shopping List'/>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const LinkButton = (props: {title: string}) => {
  return (
    <Button
    sx={{ my: 2, color: 'white', display: 'block', flexGrow: 0 }}>
      {props.title}
  </Button>
  );
}
