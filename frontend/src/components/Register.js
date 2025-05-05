import React, { useState } from "react";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    const newErrors = {};
    if (!form.name) newErrors.name = ["Name is required"];
    if (!form.email) newErrors.email = ["Email is required"];
    if (!form.password) newErrors.password = ["Password is required"];
    if (form.password !== form.password_confirmation)
      newErrors.password_confirmation = ["Passwords do not match"];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await api.post("/register", form);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: "Registration failed. Try again." });
      }
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={10} p={3} boxShadow={3}>
      <Typography variant="h5" mb={2}>
        Register
      </Typography>
      {errors.general && <Alert severity="error">{errors.general}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          margin="normal"
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name && errors.name[0]}
        />
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
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          name="password_confirmation"
          margin="normal"
          onChange={handleChange}
          error={!!errors.password_confirmation}
          helperText={
            errors.password_confirmation && errors.password_confirmation[0]
          }
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </form>
    </Box>
  );
}
