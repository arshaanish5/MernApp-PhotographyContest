import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosInterceptor";
import {
  Box, Typography, Card, CardMedia, CardContent,
  IconButton, Avatar, Button, Grid, Divider
} from "@mui/material";
import { Favorite, FavoriteBorder, ChatBubbleOutline, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import { Container, Row, Col } from "react-bootstrap";

// Leaderboard Component
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
                <Typography variant="h6">
                  {photo.user?.username || "Unknown"}
                </Typography>
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

const ContestDetail = () => {
  const { contestId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [visiblePhotos, setVisiblePhotos] = useState(6); // Show initial 6 photos
  const [userVotes, setUserVotes] = useState({});

  // Fetch contest photos
  useEffect(() => {
    const fetchContestPhotos = async () => {
      try {
        const response = await axiosInstance.get(`/photo/contests/${contestId}/photos`);
        if (Array.isArray(response.data)) {
          const sortedPhotos = response.data
            .map(photo => ({
              ...photo,
              comments: photo.comments || [],
              voters: photo.voters || [],
              user: photo.user || {},
            }))
            .sort((a, b) => b.votes - a.votes); // Sort by votes for leaderboard

          setPhotos(sortedPhotos);
          setLeaderboard(sortedPhotos.slice(0, 3)); // Top 3 photos for leaderboard
        } else {
          setPhotos([]);
        }
      } catch (error) {
        console.error("Error fetching contest photos:", error);
        toast.error("Failed to load contest photos.");
      }
    };
    fetchContestPhotos();
  }, [contestId,userId]);

  // Fetch user details
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get("/user/current", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data._id);
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user:", error.response ? error.response.data : error.message);
      }
    };
    fetchUserData();
  }, []);

// Handle likes
const handleLike = async (photoId) => {
  const storedUserId = sessionStorage.getItem("userId"); // Retrieve user ID
  console.log("Stored userId:", storedUserId);
  console.log("Photo ID:", photoId);

  if (!storedUserId) {
      toast.error("User ID is missing. Please log in again.");
      return;
  }

  try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(
          `/votes/vote/${photoId}`,
          { userId: storedUserId }, // Ensure userId is in request body
          { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Vote Response:", response.data);
      toast.success("Vote recorded successfully!");
  } catch (error) {
      console.error("Vote request failed:", error.response ? error.response.data : error.message);
      if (error.response?.status === 400) {
          toast.warning(error.response.data.message);
      } else {
          toast.error("Something went wrong. Try again.");
      }
  }
};

  
  

  // Load more photos
  const loadMorePhotos = () => {
    setVisiblePhotos((prev) => prev + 6);
  };

  return (
    <>
      <Box sx={{ maxWidth: "90%", mx: "auto", mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          Contest Entries
        </Typography>

        {/* Leaderboard Section */}
        <Leaderboard leaderboard={leaderboard || []} />

        <Divider sx={{ mb: 3 }} />

        {/* Contest Photos */}
        {photos.length === 0 ? (
          <Typography sx={{ textAlign: "center" }}>No photos found for this contest.</Typography>
        ) : (
          <>
            <Grid container spacing={3}>
              {photos.slice(0, visiblePhotos).map((photo) => {
                const hasLiked = photo.voters.includes(userId);
                const isPhotoOwner = photo.user?._id === userId;
                return (
                  <Grid item xs={12} sm={6} md={4} key={photo._id}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={photo.imageUrl}
                        alt={photo.title}
                        sx={{ maxHeight: 300, objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography variant="h6">{photo.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {photo.description}
                        </Typography>
                        <Typography variant="caption">
                          By: {photo.user?.username || "Unknown"}
                        </Typography>
                      </CardContent>

                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2 }}>
                        <IconButton onClick={() => handleLike(photo._id)} color={hasLiked ? "error" : "default"}>
                          {hasLiked ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                        <Typography>{photo.votes} Likes</Typography>

                        {/* <IconButton>
                          <ChatBubbleOutline />
                        </IconButton>
                        <Typography>{photo.comments.length} Comments</Typography> */}

                        {(userRole === "admin" || isPhotoOwner) && (
                          <IconButton color="error">
                            <Delete />
                          </IconButton>
                        )}
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {/* Load More Button */}
            {visiblePhotos < photos.length && (
              <Button variant="contained" onClick={loadMorePhotos} sx={{ mt: 3, display: "block", mx: "auto" }}>
                Load More
              </Button>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default ContestDetail;
