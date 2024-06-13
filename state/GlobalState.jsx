import { createGlobalState } from "react-hooks-global-state";

const initialState = {
  toastStatus: false,
  isLogged: false,
  addedCartItem: "",
  cartStatus: false,
  removedCartItem: "",
};
const { setGlobalState, useGlobalState } = createGlobalState(initialState);

export { setGlobalState, useGlobalState };
