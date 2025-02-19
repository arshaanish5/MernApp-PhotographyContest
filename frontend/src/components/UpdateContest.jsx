import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../axiosInterceptor";
import { Form, Button, Container, Card } from "react-bootstrap";

const UpdateContest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contest, setContest] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        axiosInstance.get(`/contest/${id}`)
            .then(response => {
                const { name, description, startDate, endDate } = response.data;
                setContest({
                    name,
                    description,
                    startDate: new Date(startDate).toISOString().split("T")[0],
                    endDate: new Date(endDate).toISOString().split("T")[0],
                });
            })
            .catch(error => console.error("Error fetching contest:", error));
    }, [id]);

    const handleChange = (e) => {
        setContest({ ...contest, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance.put(`/contest/update/${id}`, contest)
            .then(() => {
                alert("Contest updated successfully!");
                navigate("/contests");
            })
            .catch(error => console.error("Error updating contest:", error));
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "500px", background: "#f8f9fa" }}>
                <h2 className="text-center text-primary mb-4">Update Contest</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Contest Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={contest.name}
                            onChange={handleChange}
                            required
                            className="border-primary"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={contest.description}
                            onChange={handleChange}
                            required
                            className="border-primary"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="startDate"
                            value={contest.startDate}
                            onChange={handleChange}
                            required
                            className="border-primary"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">End Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="endDate"
                            value={contest.endDate}
                            onChange={handleChange}
                            required
                            className="border-primary"
                        />
                    </Form.Group>

                    <div className="d-grid">
                        <Button
                            variant="primary"
                            type="submit"
                            className="fw-bold"
                            style={{ transition: "0.3s" }}
                        >
                            Update Contest
                        </Button>
                        <Button
                            variant="outline-secondary"
                            className="mt-2 fw-bold"
                            onClick={() => navigate("/contests")}
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default UpdateContest;
