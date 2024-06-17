import crypto from "crypto";
import dotenv from "dotenv";
import { BASE_URL } from "../config";
dotenv.config();
export interface OrderBody {
  side: "buy" | "sell"; //Toggle between 'buy' or 'sell'.
  order_type: "limit_order" | "market_order"; //Toggle between a 'market_order' or 'limit_order'.
  market: string; //Replace 'SNTBTC' with your desired market.
  price_per_unit: string; //This parameter is only required for a 'limit_order'
  total_quantity: number; //Replace this with the quantity you want
  timestamp: number;
  client_order_id: `${string}-${string}-${string}-${string}-${string}`; //Replace this with the client order id you want
}

const encrypt = (body: Object): { headers: any; jsonBody: any } => {
  const key = process.env.API_KEY!;
  const secret = process.env.API_SECRET!;
  console.log("key", key, "secret", secret);
  // Generating a timestamp.
  // const timeStamp = Math.round(Date.now());

  // const body = {
  //   side: "buy", // Toggle between 'buy' or 'sell'.
  //   order_type: "limit_order", // Toggle between a 'market_order' or 'limit_order'.
  //   market: "BTCUSDT", // Replace 'SNTBTC' with your desired market pair.
  //   price_per_unit: 71231.5, // This parameter is only required for a 'limit_order'
  //   total_quantity: 1, // Replace this with the quantity you want
  //   timestamp: timeStamp,
  //   client_order_id: "2022.02.14-btcinr_1", // Replace this with the client order id you want
  // };

  const jsonBody = JSON.stringify(body);

  const secretBytes = Buffer.from(secret, "utf-8");

  const signature = crypto
    .createHmac("sha256", secretBytes)
    .update(jsonBody)
    .digest("hex");

  const headers = {
    "Content-Type": "application/json",
    "X-AUTH-APIKEY": key,
    "X-AUTH-SIGNATURE": signature,
  };
  return { headers, jsonBody };
};

export default encrypt;
