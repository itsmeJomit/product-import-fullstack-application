import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import api from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.email) newErrors.email = ["Email is required"];
    if (!form.password) newErrors.password = ["Password is required"];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: "Login failed. Check your credentials." });
      }
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={10} p={3} boxShadow={3}>
      <Typography variant="h5" mb={2}>
        Login
      </Typography>
      {errors.general && <Alert severity="error">{errors.general}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          margin="normal"
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email && errors.email[0]}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          name="password"
          margin="normal"
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password && errors.password[0]}
        />
        <Button
          variant="contained"
          color="success"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
}
