import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import axiosInstance from "../service/axiosInstance";
import styles from "../styles/ReviewPageStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";

interface Review {
  id: string;
  rating: number;
  review: string;
  createdAt: string;
  User?: { id: string; full_name: string; profilePic?: string };
}
interface User {
  id: string;
  email: string;
  user_category: string;
  full_name: string;
}

interface ApiResponse {
  status: number;
  data: any;
}

const ReviewPage = () => {
  const { shopId, shopName } = useLocalSearchParams<{
    shopId: string;
    shopName: string;
  }>();

  // State management
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<number[]>([
    0, 0, 0, 0, 0,
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  // Helper functions
  const getAuthToken = async () => {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) throw new Error("Authentication token not found");
    return token;
  };

  const makeAuthenticatedRequest = async (
    method: string,
    endpoint: string,
    data?: any
  ): Promise<ApiResponse> => {
    const token = await getAuthToken();

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    let response;
    switch (method.toLowerCase()) {
      case "get":
        response = await axiosInstance.get(endpoint, config);
        break;
      case "post":
        response = await axiosInstance.post(endpoint, data, config);
        break;
      case "delete":
        response = await axiosInstance.delete(endpoint, config);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response;
  };

  const calculateRatingDistribution = (reviews: Review[]) => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      counts[review.rating - 1]++;
    });
    setRatingDistribution(counts);
  };

  const resetForm = () => {
    setModalVisible(false);
    setNewComment("");
    setIsEditing(false);
    setEditingReviewId(null);
  };

  // Check if current user has already posted a review
  const checkUserReview = useCallback(
    (reviews: Review[]) => {
      if (!currentUser) return;

      const existingReview = reviews.find(
        (review) => review.User?.id === currentUser.id
      );

      if (existingReview) {
        setHasUserReviewed(true);
        setUserReview(existingReview);
      } else {
        setHasUserReviewed(false);
        setUserReview(null);
      }
    },
    [currentUser]
  );

  // Data fetching
  const fetchReviews = useCallback(async () => {
    try {
      const response = await makeAuthenticatedRequest(
        "get",
        `/api/businesses/${shopId}/reviews`
      );

      if (response.status === 200 && response.data.reviews) {
        const reviewsData = response.data.reviews as Review[];
        setReviews(reviewsData);
        setAverageRating(response.data.averageRating);
        calculateRatingDistribution(reviewsData);
        checkUserReview(reviewsData);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [shopId, checkUserReview]);

  const loadUserData = useCallback(async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        setCurrentUser(parsedUser);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  // Action handlers
  const deleteReview = async (reviewId: string) => {
    try {
      await makeAuthenticatedRequest("delete", `/api/reviews/${reviewId}`);
      Alert.alert("Deleted", "Your review has been removed.");
      setHasUserReviewed(false);
      setUserReview(null);
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      Alert.alert("Error", "Failed to delete review.");
    }
  };

  const handleSubmitReview = async () => {
    try {
      const response = await makeAuthenticatedRequest(
        "post",
        `/api/businesses/${shopId}/reviews`,
        { rating: newRating, review: newComment }
      );

      if (response.status === 201 || response.status === 200) {
        if (isEditing && editingReviewId) {
          Alert.alert("Updated", "Your review has been updated!");
        } else {
          Alert.alert("Success", "Your review has been posted!");
          setHasUserReviewed(true);
        }
      }

      resetForm();
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Could not submit your review.");
    }
  };

  const handleEditReview = (review: Review) => {
    setIsEditing(true);
    setEditingReviewId(review.id);
    setNewComment(review.review);
    setNewRating(review.rating);
    setModalVisible(true);
  };

  // UI rendering
  const renderStars = (rating: number) => (
    <Text style={styles.stars}>
      {"★".repeat(rating) + "☆".repeat(5 - rating)}
    </Text>
  );

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadUserData();
      fetchReviews();
    }, [loadUserData, fetchReviews])
  );

  return (
    <View style={styles.container}>
      <Header title={shopName || "Reviews"} showBackButton />

      <ScrollView contentContainerStyle={styles.reviewList}>
        <View style={styles.summarySection}>
          <Text style={styles.averageScore}>{averageRating.toFixed(1)}</Text>
          {renderStars(Math.round(averageRating))}
          <Text style={styles.totalReviews}>
            {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
          </Text>
        </View>

        <View style={styles.breakdownSection}>
          {[5, 4, 3, 2, 1].map((star) => (
            <View key={star} style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>{star} ★</Text>
              <View style={styles.breakdownBar}>
                <View
                  style={[
                    styles.breakdownFill,
                    {
                      width: `${
                        reviews.length
                          ? (ratingDistribution[star - 1] / reviews.length) *
                            100
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.breakdownCount}>
                {ratingDistribution[star - 1]}
              </Text>
            </View>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FF944D" />
        ) : reviews.length === 0 ? (
          <Text style={styles.noReviews}>No reviews yet. Be the first!</Text>
        ) : (
          // Replace the existing review card mapping with this enhanced version
          reviews.map((review) => (
            <View
              key={review.id}
              style={[
                styles.reviewCard,
                review.User?.id === currentUser?.id && styles.myReviewCard,
              ]}
            >
              {review.User?.id === currentUser?.id && (
                <View style={styles.myReviewIndicator}>
                  <Text style={styles.myReviewIndicatorText}>Your Review</Text>
                </View>
              )}

              <View style={styles.reviewCardHeader}>
                <Image
                  source={{
                    uri: review.User?.profilePic
                      ? review.User.profilePic
                      : "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(review.User?.full_name || "User") +
                        "&background=FF944D&color=fff",
                  }}
                  style={[
                    styles.userAvatar,
                    review.User?.id === currentUser?.id &&
                      styles.myReviewAvatar,
                  ]}
                />

                <View style={styles.userInfoContainer}>
                  <Text
                    style={[
                      styles.username,
                      review.User?.id === currentUser?.id &&
                        styles.myReviewUsername,
                    ]}
                  >
                    {review.User?.full_name || "Anonymous"}
                  </Text>
                  <Text style={styles.reviewDate}>
                    {formatDate(review.createdAt)}
                  </Text>
                </View>

                <View style={styles.ratingBadge}>
                  {renderStars(review.rating)}
                  <Text style={styles.ratingNumber}>{review.rating}.0</Text>
                </View>
              </View>

              <View style={styles.reviewContentContainer}>
                <Text style={styles.comment}>{review.review}</Text>
              </View>

              {review.User?.id === currentUser?.id && (
                <View style={styles.reviewActionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleEditReview(review)}
                  >
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => deleteReview(review.id)}
                  >
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {currentUser?.user_category !== "Business" && !hasUserReviewed && (
        <TouchableOpacity
          style={styles.newReviewButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.newReviewText}>Write a Review</Text>
        </TouchableOpacity>
      )}

      {currentUser?.user_category !== "Business" &&
        hasUserReviewed &&
        userReview && (
          <View style={styles.reviewActions}>
            <TouchableOpacity
              style={styles.editReviewButton}
              onPress={() => handleEditReview(userReview)}
            >
              <Text style={styles.newReviewText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteReviewButton}
              onPress={() => deleteReview(userReview.id)}
            >
              <Text style={styles.newReviewText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Leave a Review</Text>

            <View style={styles.starPicker}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
                  <Text
                    style={[
                      styles.modalStar,
                      { color: newRating >= star ? "#FF944D" : "#AAA" },
                    ]}
                  >
                    {star <= newRating ? "★" : "☆"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Write your review..."
              placeholderTextColor="#999"
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitReview}
              >
                <Text style={styles.submitButtonText}>
                  {isEditing ? "Update" : "Submit"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReviewPage;
