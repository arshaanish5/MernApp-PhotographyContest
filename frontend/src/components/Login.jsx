import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = ({ onLoginSuccess, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ usernameOrEmail: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.usernameOrEmail) tempErrors.usernameOrEmail = "Username or Email is required";
    if (!formData.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/login`, formData);

            if (response.data.token) {
                const token = response.data.token;
                sessionStorage.setItem("logintoken", token);

                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken); // Debugging
                
                sessionStorage.setItem("role", decodedToken.role || "user");  // Fallback role
                sessionStorage.setItem("userId", decodedToken.userId);  // ✅ Store user ID
                console.log("Stored User ID in sessionStorage:", sessionStorage.getItem("userId"));

                onLoginSuccess(decodedToken.role || "user");  // Ensure Navbar updates

                setTimeout(() => {
                    navigate("/");
                    window.location.reload();
                }, 200);
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrors({ server: error.response?.data?.message || "Invalid login credentials or server issue." });
        }
    }
};


  return (
    <Container maxWidth="xs" sx={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}>
      <Box
        sx={{
          mt: 8,
          mb: 8,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: "black",
          color: "white",
          position: "relative",
        }}
      >
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8, color: "white" }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username / Email"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            error={!!errors.usernameOrEmail}
            helperText={errors.usernameOrEmail}
            margin="normal"
            InputProps={{
              style: { color: "white" },
              sx: {
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              },
            }}
            InputLabelProps={{ style: { color: "white" } }}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            margin="normal"
            InputProps={{
              style: { color: "white" },
              sx: {
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              },
            }}
            InputLabelProps={{ style: { color: "white" } }}
          />

          {errors.server && (
            <Typography color="error" sx={{ mt: 1 }}>
              {errors.server}
            </Typography>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, backgroundColor: "black", color: "white" }}>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
