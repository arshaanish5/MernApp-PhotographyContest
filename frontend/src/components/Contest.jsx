import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInterceptor";
import { Row, Col, ToggleButtonGroup, ToggleButton, Card, Button } from "react-bootstrap";

const Contest = () => {
    const [contests, setContests] = useState({
        pastContests: [],
        ongoingContests: [],
        upcomingContests: []
    });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ongoing"); // Default filter
    const [user, setUser] = useState(null); // Store logged-in user data
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const sessionRole = sessionStorage.getItem("role");

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser?.role) {
                    setUser({ ...parsedUser, role: sessionRole || parsedUser.role }); // Ensure consistent role
                } else {
                    console.warn("User object found but missing 'role'");
                }
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        } else {
            console.warn("No user found in localStorage.");
        }

        // Fetch contests
        axiosInstance.get("/contest/all")
            .then(response => {
                if (Array.isArray(response.data)) {
                    const today = new Date();
                    setContests({
                        pastContests: response.data.filter(contest => new Date(contest.endDate) < today),
                        ongoingContests: response.data.filter(contest =>
                            new Date(contest.startDate) <= today && new Date(contest.endDate) >= today
                        ),
                        upcomingContests: response.data.filter(contest => new Date(contest.startDate) > today),
                    });
                } else {
                    console.error("Unexpected API response format:", response.data);
                }
            })
            .catch(error => console.error("Error fetching contests:", error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-center text-lg">Loading contests...</p>;

    return (
        <div className="container my-4"
            style={{
                backgroundImage: "url('/home.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
                padding: "2rem"
            }}
        >
            <h1 className="text-3xl font-bold text-center text-white">Photography Contests</h1>
            <p className="text-center text-white">
                Participate in exciting photography contests, showcase your talent, and win amazing prizes!
            </p>

            {/* Toggle Button Group for Filtering */}
            <Row className="my-4">
                <Col className="text-center">
                    <ToggleButtonGroup 
                        type="radio" 
                        name="contest-filter" 
                        value={filter} 
                        onChange={(val) => setFilter(val)}
                    >
                        <ToggleButton id="ongoing-contests" variant="outline-primary" value="ongoing">
                            Ongoing Contests
                        </ToggleButton>
                        <ToggleButton id="past-contests" variant="outline-danger" value="past">
                            Past Contests
                        </ToggleButton>
                        <ToggleButton id="upcoming-contests" variant="outline-warning" value="upcoming">
                            Upcoming Contests
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Col>
            </Row>

            {/* Render Contests Based on Filter */}
            <Row className="g-4">
                {filter === "ongoing" && renderContests(contests.ongoingContests, navigate, user)}
                {filter === "past" && renderContests(contests.pastContests, navigate, user)}
                {filter === "upcoming" && renderContests(contests.upcomingContests, navigate, user)}
            </Row>
        </div>
    );
};

// Function to Render Contest Cards
const renderContests = (contestList, navigate, user) => {
    const isAdmin = user?.role?.toLowerCase() === "admin"; // Ensure consistency

    console.log("User object:", user);
    console.log("User Role:", user?.role);

    const handleDeleteContest = (contestId, e) => {
        e.stopPropagation();

        if (!window.confirm("Are you sure you want to delete this contest?")) return;

        axiosInstance.delete(`/contest/delete/${contestId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(() => {
            alert("Contest deleted successfully!");
            window.location.reload(); // Refresh the page
        })
        .catch(error => {
            console.error("Error deleting contest:", error.response ? error.response.data : error.message);
            alert("Failed to delete contest.");
        });
    };

    return contestList.length > 0 ? (
        contestList.map(contest => (
            <Col key={contest._id} md={4}>
                <Card className="shadow-sm cursor-pointer">
                    <Card.Body>
                        <Card.Title 
                            className="cursor-pointer text-primary" 
                            onClick={() => navigate(`/contest/${contest._id}`)}
                            style={{ cursor: "pointer", textDecoration: "none"  }}
                        >
                            {contest.name}
                        </Card.Title>

                        <Card.Text>{contest.description}</Card.Text>
                        <Card.Text className="text-muted">
                            {new Date(contest.startDate).toDateString()} - {new Date(contest.endDate).toDateString()}
                        </Card.Text>

                        {/* Show Upload Image button only if contest is ongoing and user is logged in (not an admin) */}
                        {!isAdmin && user && new Date(contest.startDate) <= new Date() && new Date(contest.endDate) >= new Date() ? (
                            <Link to={`/contest/upload/${contest._id}`}>
                                <Button variant="success">
                                    Upload Image
                                </Button>
                            </Link>
                        ) : (
                            !user && (
                                <Button 
                                    variant="success"
                                    onClick={() => navigate("/login")}
                                >
                                    Login to Upload
                                </Button>
                            )
                        )}

                        {/* Show Update & Delete buttons for Admins */}
                        {isAdmin && (
                            <div className="mt-3">
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/contest/update/${contest._id}`); // Navigates correctly
                                    }}
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={(e) => handleDeleteContest(contest._id, e)}
                                >
                                    Delete
                                </Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        ))
    ) : (
        <p className="text-center text-gray-500">No contests available</p>
    );
};

export default Contest;
