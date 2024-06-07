import { createContext, useContext, useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";
import ApiManager from "../api/ApiManager";
import { refreshTime } from "../constants";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalContextProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [expirationTime, setExpirationTime] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const res = await axiosInstance.post("/auth/refresh", {
        refreshToken: refreshToken,
      });
      if (res.status === 200) {
        AsyncStorage.setItem("token", res.data.access_token);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.access_token}`;
        return res.data.access_token;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleRefreshAccessToken = () => {
    refreshAccessToken()
      .then((accessToken) => {
        if (accessToken) {
          setExpirationTime(Date.now() + refreshTime);
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          return null;
        }
        console.error(error);
      });
  };

  const fetchCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Location permission not granted!");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const locationData = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    return locationData;
  };

  const updateLocation = async () => {
    try {
      const { latitude, longitude } = await fetchCurrentLocation();
      const response = await axiosInstance.post(`/user/location`, {
        latitude,
        longitude,
      });
      const data = await response.data;
      if (data) {
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("toast: ", toast);
    if (toast) {
      console.log(toast);
      Toast.show({
        type: toast.type,
        text1: toast.text1,
        text2: toast.text2,
        position: "top",
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 60,
        bottomOffset: 40,
        leadingIcon: null,
        trailingIcon: null,
        props: {
          swipeable: true,
        },
      });
      setToast(null);
    }
  }, [toast]);

  useEffect(() => {
    if (expirationTime) {
      const timeout = setTimeout(
        handleRefreshAccessToken,
        expirationTime - Date.now()
      );
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [expirationTime]);

  return (
    <GlobalContext.Provider
      value={{
        userAvatar,
        setUserAvatar,
        userName,
        setUserName,
        userId,
        setUserId,
        toast,
        setToast,
        expirationTime,
        setExpirationTime,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
