import { createGlobalState } from "react-hooks-global-state";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  toastStatus: false,
  isLogged: false,
  addedCartItem: "",
  cartStatus: false,
  removedCartItem: "",
};
const { setGlobalState, useGlobalState } = createGlobalState(initialState);

export { setGlobalState, useGlobalState };
