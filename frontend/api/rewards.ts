import axiosInstance from "../service/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface RewardTier {
  id?: string;
  pointsRequired: number;
  rewardTitle: string;
  rewardDescription: string;
  isActive: boolean;
}

export interface BusinessRewardsConfig {
  id?: string;
  pointsPerDollar: number;
  rewardTiers: RewardTier[];
}

export interface BusinessRewardsResult {
  success: boolean;
  data?: {
    rewardsConfig: {
      id: string;
      pointsPerDollar: number;
    };
    rewardTiers: RewardTier[];
  };
  message?: string;
}

export interface UserPointsResult {
  success: boolean;
  points?: number;
  message?: string;
}

// Fetch Business Rewards by User ID
export const getBusinessRewards = async (): Promise<BusinessRewardsResult> => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "Authentication token is missing. Please log in again.",
      };
    }

    const response = await axiosInstance.get(`/api/rewards/business`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      return {
        success: true,
        data: response.data.data,
      };
    }

    return {
      success: false,
      message: response.data.message || "Failed to fetch business rewards.",
    };
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Unexpected error occurred while fetching rewards.",
    };
  }
};

// Fetch User Point By User ID
export const getUserPointsByUserId = async (): Promise<UserPointsResult> => {
  try {
    const user = await AsyncStorage.getItem("user");
    if (!user) {
      return {
        success: false,
        message: "User not Found",
      };
    }

    const parsedUser = JSON.parse(user);

    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "Authentication token is missing. Please log in again.",
      };
    }

    const response = await axiosInstance.get(`/api/points/${parsedUser.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      return {
        success: true,
        points: response.data.points || 0,
      };
    }

    return {
      success: false,
      message: "Failed to fetch user points.",
    };
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Unexpected error occurred.",
    };
  }
};

// Save Business Rewards Configuration API Call
export const saveBusinessRewards = async (
  pointsPerDollar: number,
  rewardTiers: RewardTier[]
): Promise<BusinessRewardsResult> => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      return {
        success: false,
        message: "Authentication token is missing. Please log in again.",
      };
    }

    const response = await axiosInstance.post(
      "/api/rewards/business",
      { pointsPerDollar, rewardTiers },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        data: response.data.data,
        message: "Business rewards configuration saved successfully.",
      };
    }

    return {
      success: false,
      message:
        response.data.message ||
        "Failed to save business rewards configuration.",
    };
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Unexpected error occurred while saving rewards.",
    };
  }
};
