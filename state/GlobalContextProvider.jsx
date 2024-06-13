import { createContext, useContext, useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";
import ApiManager from "../api/ApiManager";
import { refreshTime } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import geolib from "geolib";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalContextProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [expirationTime, setExpirationTime] = useState(null);
  const [userAvatar, setUserAvatar] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userFullName, setUserFullName] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userLocationData, setUserLocationData] = useState(null);
  const [cartLength, setCartLength] = useState(0);
  const [cartId, setCartId] = useState(null);
  const [cartChanged, setCartChanged] = useState(false);
  const [quantityChanged, setQuantityChanged] = useState(false);
  const [currentCartItems, setCurrentCartItems] = useState([]);
  const [checkOutItems, setCheckOutItems] = useState([]);

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

  const reverseGeocode = async (location) => {
    const address = await Location.reverseGeocodeAsync(location);
    return address;
  };

  const calculateDistance = async (address) => {
    const userCoords = await fetchCurrentLocation();
    const geocodedAddress = await Location.geocodeAsync(address);
    if (geocodedAddress.length === 0) {
      return "Address not found";
    }
    const addressCoords = {
      latitude: geocodedAddress[0].latitude,
      longitude: geocodedAddress[0].longitude,
    };

    const distanceInMeters = geolib.getDistance(userCoords, addressCoords);
    const distanceInKilometers = geolib.convertDistance(distanceInMeters, "km");

    return distanceInKilometers;
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

  useEffect(() => {
    const fetchUserLocation = async () => {
      const location = await fetchCurrentLocation();
      const address = await reverseGeocode(location);
      setUserLocation(address[0].city + ", " + address[0].isoCountryCode);
      setUserLocationData(
        address[0].streetNumber +
          " " +
          address[0].street +
          ", " +
          address[0].district +
          ", " +
          address[0].city +
          ", " +
          address[0].country
      );
    };
    fetchUserLocation();
  }, [userLocation]);

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
        userFullName,
        setUserFullName,
        userEmail,
        setUserEmail,
        userLocation,
        userLocationData,
        calculateDistance,
        cartLength,
        setCartLength,
        cartId,
        setCartId,
        cartChanged,
        setCartChanged,
        quantityChanged,
        setQuantityChanged,
        currentCartItems,
        setCurrentCartItems,
        checkOutItems,
        setCheckOutItems,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
