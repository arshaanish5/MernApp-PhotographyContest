import React from "react";
import { Typography, Card, CardContent, Avatar } from "@mui/material";
import { Container, Row, Col } from "react-bootstrap";

const Leaderboard = ({ leaderboard = [] }) => {
  if (!Array.isArray(leaderboard) || leaderboard.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ my: 2, fontStyle: "italic" }}>
        No leaderboard data available.
      </Typography>
    );
  }

  const medalColors = ["gold", "silver", "#cd7f32"]; // Gold, Silver, Bronze

  return (
    <Container className="mb-4">
      <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: "bold" }}>
        Contest Leaderboard
      </Typography>
      <Row className="justify-content-center">
        {leaderboard.map((photo, index) => (
          <Col xs={12} md={4} key={photo._id} className="mb-3">
            <Card sx={{ border: `3px solid ${medalColors[index] || "#ccc"}` }}>
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  src={photo.user?.avatar || "/default-avatar.png"}
                  alt={photo.user?.username || "Unknown"}
                  sx={{
                    width: 56,
                    height: 56,
                    mx: "auto",
                    mb: 1,
                    bgcolor: medalColors[index] || "grey",
                  }}
                />
                <Typography variant="h6">{photo.user?.username || "Unknown"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {photo.votes} Votes
                </Typography>
              </CardContent>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Leaderboard;
