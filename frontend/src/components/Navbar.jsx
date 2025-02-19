import React, { useState, useEffect } from "react";
import { 
  AppBar, Toolbar, IconButton, Button, Typography, Menu, MenuItem, 
  Drawer, List, ListItem, ListItemButton, ListItemText, Box, Dialog 
} from "@mui/material";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

const Navbar = () => {
  const [userRole, setUserRole] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("login");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // Persist login state on refresh
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    console.log(sessionStorage.getItem("role"))
    if (role) {
      setUserRole(role);
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("logintoken");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("userId");
    setUserRole(null);
    handleMenuClose();

    // Clear browser history to prevent back navigation
    navigate("/", { replace: true });

    // Push a new history state to disable back button
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
        window.history.pushState(null, "", window.location.href);
    });

    window.location.reload(); // Force UI update
};

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLoginSuccess = (role) => {
    console.log("saving role",role)
    sessionStorage.setItem("role", role);
    setUserRole(role);
    // handleCloseDialog();
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Contest", path: "/contest" },
    userRole === "admin" && { name: "Create Contest", path: "/createcontest" },userRole === "admin" && { name: "Users", path: "/user" }
  ].filter(Boolean);

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "white", color: "black" }}>
        <Toolbar>
          {/* Mobile Menu Button */}
          <IconButton sx={{ display: { xs: "block", md: "none" } }} onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>

          {/* Logo & Branding */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img className="logo" src="/logo.png" alt="logo" style={{ height: 40 }} />
            <Typography variant="h5" sx={{ ml: 1, color: "black" }}>
              ShutterFlash
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {navItems.map((item) => (
              <Button key={item.name} sx={{ color: "black" }} component={Link} to={item.path}>
                {item.name}
              </Button>
            ))}
          </Box>

          {/* Authentication Buttons */}
          {!userRole ? (
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Button sx={{ color: "black" }} onClick={() => handleOpenDialog("login")}>
                Login
              </Button>
              <Button sx={{ color: "black" }} onClick={() => handleOpenDialog("signup")}>
                Signup
              </Button>
            </Box>
          ) : (
            <>
              <IconButton sx={{ color: "black" }} onClick={handleMenuOpen}>
                <AccountCircle />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        <List sx={{ width: 250 }}>
          {navItems.map((item) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton component={Link} to={item.path} onClick={handleDrawerToggle}>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}

          {!userRole ? (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleOpenDialog("login")}>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleOpenDialog("signup")}>
                  <ListItemText primary="Signup" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/profile" onClick={handleDrawerToggle}>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      {/* Login & Signup Dialogs */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        {dialogType === "login" ? (
          <Login onClose={handleCloseDialog} onLoginSuccess={handleLoginSuccess} />
        ) : (
          <Signup onClose={handleCloseDialog} />
        )}
      </Dialog>
    </>
  );
};

export default Navbar;

