import { useEffect, useState } from "react";
import axiosInstance from "../axiosInterceptor";
import { Table, Button, Container, Alert } from "react-bootstrap";
import { Paper, Typography } from "@mui/material";

const User = () => {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState(null);  // Store success/error messages

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get("/user/allusers");
            console.log("Fetched Users:", response.data);
            setUsers(response.data);
        } catch (error) {
            console.error(
                "Error fetching users:",
                error.response ? error.response.data : error.message
            );
        }
    };

    const toggleBlockUser = async (userId, isBlocked) => {
        const action = isBlocked ? "unblock" : "block";
        const confirmAction = window.confirm(`Are you sure you want to ${action} this user?`);

        if (!confirmAction) return; // Cancel if user selects "No"

        try {
            if (isBlocked) {
                await axiosInstance.put(`/user/unblock/${userId}`);
            } else {
                await axiosInstance.put(`/user/block/${userId}`);
            }
            setMessage({ type: "success", text: `User ${action}ed successfully!` });
            fetchUsers(); // Refresh user list after update
        } catch (error) {
            setMessage({ type: "danger", text: `Failed to ${action} user.` });
            console.error("Error toggling user status:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <Container className="mt-4">
            <Paper elevation={3} className="p-4">
                <Typography variant="h4" className="mb-3" align="center">
                    User Management
                </Typography>

                {/* Show success/error messages */}
                {message && <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>{message.text}</Alert>}

                <Table striped bordered hover responsive>
                    <thead>
                        <tr className="text-center">
                            <th>Username</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user._id} className="text-center">
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td style={{ color: user.isBlocked ? "red" : "green", fontWeight: "bold" }}>
    {user.isBlocked ? "Blocked" : "Active"}
</td>
<td>
<Button
    variant={user.isBlocked ? "success" : "danger"}
    size="sm"
    onClick={() => toggleBlockUser(user._id, user.isBlocked)}
>
    {user.isBlocked ? "Unblock" : "Block"}
</Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Paper>
        </Container>
    );
};

export default User;
