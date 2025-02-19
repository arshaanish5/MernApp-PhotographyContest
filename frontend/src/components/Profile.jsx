import React, { useState, useEffect } from "react";
import { Card, Container, Spinner } from "react-bootstrap";
import axiosInstance from "../axiosInterceptor";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosInstance.get("/user/current");  // Ensure API call is correct
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Card className="shadow-lg p-4">
                <h2 className="text-center">User Profile</h2>
                {user ? (
                    <div>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                ) : (
                    <p className="text-center">User data not found.</p>
                )}
            </Card>
        </Container>
    );
};

export default Profile;
