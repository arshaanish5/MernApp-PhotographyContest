import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInterceptor";
import { Card, Button, Form, Spinner } from "react-bootstrap";
import { FaCloudUploadAlt } from "react-icons/fa";

const UploadImage = () => {
    const { contestId } = useParams(); // Get contest ID from URL
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Handle Image Selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Create image preview
            setError(""); // Reset error message
        }
    };

    // Handle Image Upload
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!image) {
            setError("Please select an image.");
            return;
        }
    
        const userId = sessionStorage.getItem("userId");
console.log("User ID from sessionStorage:", userId);

        if (!userId) {
            setError("User ID not found. Please log in again.");
            console.error("User ID not found in session storage");
            return;
        }
    
        const formData = new FormData();
        formData.append("image", image);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("contestId", contestId);
        formData.append("user", userId); //  Attach user ID to FormData
    
        try {
            const response = await axiosInstance.post("/photo/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            console.log("Upload Success:", response.data);
            navigate("/contest");
        } catch (error) {
            console.error("Upload error:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Image upload failed.");
        }
    };
    

    return (
        <div
            className="d-flex justify-content-center align-items-center min-vh-100"
            style={{
                backgroundImage: "url('/upload-bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Card
                className="p-4 shadow-lg"
                style={{
                    width: "40rem",
                    borderRadius: "15px",
                    background: "rgba(255, 255, 255, 0.9)",
                }}
            >
                <Card.Body>
                    <h2 className="text-center mb-4">
                        <FaCloudUploadAlt size={40} className="text-primary" /> Upload Your Image
                    </h2>

                    {error && <p className="text-danger text-center">{error}</p>}

                    <Form onSubmit={handleSubmit}>

                        {/* Title Field */}
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter image title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {/* Description Field */}
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Write a short description..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>

                        {/* Image Upload */}
                        <Form.Group className="mb-3">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                name="image"
                                required 
                            />
                        </Form.Group>

                        {/* Image Preview */}
                        {preview && (
                            <div className="text-center my-3">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{
                                        width: "100%",
                                        maxHeight: "300px",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                    }}
                                />
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button type="submit" variant="primary" className="w-100 mt-3" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : "Upload"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default UploadImage;
