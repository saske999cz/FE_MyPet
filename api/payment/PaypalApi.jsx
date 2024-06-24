import { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY } from "@env";
import base64 from "react-native-base64";
import axios from "axios";
const baseUrl = "https://api-m.sandbox.paypal.com";

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

const createOrder = (token = "", orderDetail) => {
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

const capturePayment = (id, token) => {
  const requestOptions = {
    method: "POST",
    url: baseUrl + `/v2/checkout/orders/${id}/capture`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: {},
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

function convertPricesToUSD(cartItems, numberOfSubOrders) {
  const conversionRate = 25400;
  const cartItemsInUSD = cartItems.map((item) => {
    const priceInUSD = (item.price / conversionRate).toFixed(2);
    return {
      ...item,
      price: parseFloat(priceInUSD),
      description:
        item.description.length > 127
          ? item.description.substring(0, 124) + "..."
          : item.description,
    };
  });

  // Calculate the total amount
  const totalAmount = cartItemsInUSD.reduce(
    (acc, item) => acc + item.price * parseFloat(item.quantity || 1),
    0
  );
  const transportFee = parseFloat(
    (parseFloat(30000 / conversionRate) * numberOfSubOrders).toFixed(2)
  );
  const transactionFee = parseFloat((totalAmount * 0.04 + 0.5).toFixed(2));

  const finalItems = [
    ...cartItemsInUSD,
    {
      name: "Transaction Fee",
      description: "Transaction Fee",
      quantity: "1",
      price: transactionFee,
    },
    {
      name: "Transport Fee",
      description: "Transport Fee",
      quantity: "1",
      price: transportFee,
    },
  ];

  return finalItems;
}

const createOrderDetail = (cartItems, numberOfSubOrders) => {
  const itemsInUSD = convertPricesToUSD(cartItems, numberOfSubOrders);
  const baseTotal = itemsInUSD
    .slice(0, -2)
    .reduce((acc, item) => acc + item.price * item.quantity, 0);
  const transactionFee = parseFloat((baseTotal * 0.04).toFixed(2)) + 0.5;
  const transportFee = parseFloat(
    ((30000 / 25400) * numberOfSubOrders).toFixed(2)
  );
  const totalAmount = parseFloat(
    (baseTotal + transactionFee + transportFee).toFixed(2)
  );

  return {
    intent: "CAPTURE",
    purchase_units: [
      {
        items: itemsInUSD.map((item) => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity.toString(),
          unit_amount: {
            currency_code: "USD",
            value: item.price.toFixed(2).toString(),
          },
        })),
        amount: {
          currency_code: "USD",
          value: totalAmount.toString(),
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: totalAmount.toString(),
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
};

export default {
  generateToken,
  createOrder,
  capturePayment,
  createOrderDetail,
};

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

const cartItems = [
  {
    amount: 321000,
    description:
      "Bỉm cái Tom Cat's dùng cho thú cưng vào các giai đoạn nhạy cảm như động dục, bị bệnh đường ruột đi ngoài...",
    id: 242,
    name: "Bỉm cái Tom Cat's",
    price: 107000,
    product_id: 320,
    product_image: "gs://new_petshop_bucket/products/320/",
    quantity: 3,
    rating: "4.29",
    rating_count: 7,
  },
  {
    amount: 189000,
    description:
      "Máy ăn uống tự động cao cấp với thiết kế tinh tế với phần bình giúp cấp nước, thức ăn tự động, cùng kiểu dáng vuông vức, gọn nhẹ thuận tiện khi sử dụng.",
    id: 244,
    name: "Máy ăn uống tự động cao cấp có hai ngăn cho chó mèo",
    price: 189000,
    product_id: 208,
    product_image: "gs://new_petshop_bucket/products/208/",
    quantity: 1,
    rating: "3.50",
    rating_count: 2,
  },
];
