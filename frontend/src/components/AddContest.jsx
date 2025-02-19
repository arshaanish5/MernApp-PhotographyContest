import { useState } from "react";
import { useNavigate } from "react-router-dom"; ``
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";
import axiosInstance from "../axiosInterceptor";

const CreateContest = () => {
  const [contest, setContest] = useState({
    name: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); 
  const handleChange = (e) => {
    setContest({ ...contest, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!contest.name) tempErrors.name = "Contest Name is required";
    if (!contest.description) tempErrors.description = "Description is required";
    if (!contest.category) tempErrors.category = "Category is required";
    if (!contest.startDate) tempErrors.startDate = "Start Date is required";
    if (!contest.endDate) tempErrors.endDate = "End Date is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axiosInstance.post("/contest/createcontest", contest);
      alert("Contest created successfully!");
      setContest({ name: "", description: "", category: "", startDate: "", endDate: "" });
      setErrors({});
      navigate("/contest"); 
    } catch (error) {
      console.error("Error creating contest:", error.response?.data || error.message);
      alert("Failed to create contest");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom align="center">
          Create New Contest
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Contest Name"
            name="name"
            value={contest.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={contest.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            label="Category"
            name="category"
            value={contest.category}
            onChange={handleChange}
            error={!!errors.category}
            helperText={errors.category}
            margin="normal"
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              name="startDate"
              value={contest.startDate}
              onChange={handleChange}
              error={!!errors.startDate}
              helperText={errors.startDate}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              type="date"
              label="End Date"
              name="endDate"
              value={contest.endDate}
              onChange={handleChange}
              error={!!errors.endDate}
              helperText={errors.endDate}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2, backgroundColor: "black", color: "white" }}
          >
            Create Contest
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateContest;
