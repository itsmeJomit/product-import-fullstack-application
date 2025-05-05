import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api";

export default function Header() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await api.post("/logout"); // Laravel route
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Product App
        </Typography>
        {!token ? (
          <>
            {location.pathname !== "/" && (
              <Button color="inherit" component={Link} to="/">
                Login
              </Button>
            )}
            {location.pathname !== "/register" && (
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            )}
          </>
        ) : (
          <form onSubmit={handleLogout}>
            <Button type="submit" color="inherit">
              Logout
            </Button>
          </form>
        )}
      </Toolbar>
    </AppBar>
  );
}
