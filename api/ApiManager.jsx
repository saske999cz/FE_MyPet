import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const token = AsyncStorage.getItem("access_token");

const ApiManager = axios.create({
  baseURL: "https://gostoblogger.site/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default ApiManager;
