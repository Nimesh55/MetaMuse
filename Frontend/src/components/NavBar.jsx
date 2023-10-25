import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenuToggle}
        ></IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MetaMuse
        </Typography>
        <Menu
          id="menu-appbar"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={menuOpen}
          onClose={handleMenuToggle}
        >
          <MenuItem component={Link} to="/" onClick={handleMenuToggle}>
            Home
          </MenuItem>
          <MenuItem component={Link} to="/poem" onClick={handleMenuToggle}>
            Poem
          </MenuItem>
          <MenuItem component={Link} to="/poet" onClick={handleMenuToggle}>
            Poet
          </MenuItem>
          <MenuItem component={Link} to="/metaphor" onClick={handleMenuToggle}>
            Metaphor
          </MenuItem>
        </Menu>
        <Tabs>
          <Tab component={Link} to="/" label="Home" />
          <Tab component={Link} to="/poem" label="Poem" />
          <Tab component={Link} to="/poet" label="Poet" />
          <Tab component={Link} to="/metaphor" label="Metaphor" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
