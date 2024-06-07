import { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY } from "@env";
import base64 from "react-native-base64";
import axios from "axios";
const baseUrl = "https://api-m.sandbox.paypal.com";

let orderDetail = {
  intent: "CAPTURE",
  purchase_units: [
    {
      items: [
        {
          name: "T-Shirt",
          description: "Green XL",
          quantity: "1",
          unit_amount: {
            currency_code: "USD",
            value: "200.00",
          },
        },
      ],
      amount: {
        currency_code: "USD",
        value: "200.00",
        breakdown: {
          item_total: {
            currency_code: "USD",
            value: "200.00",
          },
        },
      },
    },
  ],
  application_context: {
    return_url: "https://example.com/return",
    cancel_url: "https://example.com/cancel",
  },
};

const generateToken = () => {
  const encodedCredentials = base64.encode(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`
  );
  return new Promise((resolve, reject) => {
    axios
      .post(baseUrl + "/v1/oauth2/token", "grant_type=client_credentials", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${encodedCredentials}`,
        },
      })
      .then((result) => {
        const { access_token } = result.data; // Extract access_token from result.data
        resolve(access_token);
      })
      .catch((error) => {
        console.log("error raised in generateToken", error);
        reject(error);
      });
  });
};

const createOrder = (token = "") => {
  var requestOptions = {
    method: "post",
    url: baseUrl + "/v2/checkout/orders",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: JSON.stringify(orderDetail),
  };

  return new Promise((resolve, reject) => {
    axios(requestOptions)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error raised in createOrder", error);
        reject(error);
      });
  });
};

const capturePayment = (id, token = "") => {
  var requestOptions = {
    method: "post",
    url: baseUrl + `/v2/checkout/orders/${id}/capture`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return new Promise((resolve, reject) => {
    axios(requestOptions)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log("error raised in capture payment", error);
        reject(error);
      });
  });
};

export default {
  generateToken,
  createOrder,
  capturePayment,
};
