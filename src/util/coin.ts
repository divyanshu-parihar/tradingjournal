import axios from "axios";
import roe from "../helper/return_or_error";
import encrypt, { OrderBody } from "../helper/encrypt";
import { randomUUID } from "crypto";
type coin = string;
class CoindcxHandler {
  //static variables

  static baseurl = "https://api.coindcx.com";
  api_key: String;
  api_secret: String;
  constructor(api_key: string, api_secret: string) {
    this.api_key = api_key;
    this.api_secret = api_secret;
  }

  async get_coins_information() {
    let response = await axios.get(CoindcxHandler.baseurl + "/exchange/ticker");
    if (response.data) {
      return response.data;
    } else {
      return new Error("Could not get info");
    }
  }

  async get_order_book(primary: string, secondary: string) {
    let response = await axios.get(
      "https://public.coindcx.com" +
        `/market_data/orderbook?pair=I-${primary}_${secondary}`
    );
    return roe(response);
  }
  async placeOrder(
    coin: coin,
    side: "buy" | "sell",
    order_type: "market_order" | "limit_order",
    price: string,
    quantity: number
  ) {
    const body: OrderBody = {
      side, //Toggle between 'buy' or 'sell'.
      order_type, //Toggle between a 'market_order' or 'limit_order'.
      market: coin, //Replace 'SNTBTC' with your desired market.
      price_per_unit: price, //This parameter is only required for a 'limit_order'
      total_quantity: quantity, //Replace this with the quantity you want
      timestamp: Math.floor(Date.now()),
      client_order_id: randomUUID(), //Replace this with the client order id you want
    };

    const url = "https://api.coindcx.com/exchange/v1/orders/create";
    let { headers, jsonBody } = encrypt(body);
    let response = await axios.post(url, jsonBody, { headers });
    return roe(response);
  }

  async getActiveOrder(side: "buy" | "sell", coin: coin) {
    const timeStamp = Math.floor(Date.now());
    const body = {
      side: side, //Toggle between 'buy' or 'sell'.
      market: coin.toUpperCase(), //Replace 'SNTBTC' with your desired market pair.
      timestamp: timeStamp,
    };
    const url = "https://api.coindcx.com/exchange/v1/orders/create";
    let { headers, jsonBody } = encrypt(body);
    let response = await axios.post(url, jsonBody, { headers });
    return roe(response);
  }


  async cancelAllOrder(coin: coin, side : 'Buy' | 'sell'){
    const timestamp = Math.floor(Date.now());
        const body = {
            side : side,
            market : coin.toUpperCase(),
            timestamp : timestamp,
        }
        const url = CoindcxHandler.baseurl + '/exchange/v1/orders/cancel_all';
        let {headers, jsonBody} = encrypt(body)
        let response = await axios.post(url, jsonBody, {headers});
        return roe(response);
    }

    async getActiveInstruments (){
        let response = await axios.get(CoindcxHandler.baseurl + "/exchange/v1/derivatives/futures/data/active_instruments");
        return roe(response);
    }

    async futures_create_order(side : "buy" | "sell", pair : coin, order_type : "market_order" | "limit_order" , price : string,
    total_quantity : number, leverage : number, time_in_force : "good_till_cancel"| "fill_or_kill" | "immediate_or_cancel"
){
    const timestamp = Math.floor(Date.now());
    const body = {
    "timestamp": timestamp , // epoch timestamp in seconds
    "order": {
    "side": side, // buy or sell
    "pair": 'B-' + pair.toUpperCase() + "_USDT", // instrument.string
    "order_type": order_type, // market_order or limit_order
    "price":price,
    "total_quantity": total_quantity,
    "leverage": leverage,
    "notification": 'push_notification', // no_notification or email_notification or push_notification
    "time_in_force": time_in_force, // good_till_cancel or fill_or_kill or immediate_or_cancel
    "hidden": false,
    "post_only": false
    }
    }
    let {headers, jsonBody} = encrypt(body);
    let url = CoindcxHandler.baseurl + "/exchange/v1/derivatives/futures/orders/create"
    let response = await axios.post(url, jsonBody, {headers});
    return roe(response);
}
    async list_positions(){
    const timestamp = Math.floor(Date.now());
    const body = {
        "timestamp": timestamp , // EPOCH timestamp in seconds
        "page": "1", //no . of pages needed
        "size": "10" //no. of records needed
        }
    let {headers, jsonBody} = encrypt(body);
    let url = CoindcxHandler.baseurl + "/exchange/v1/derivatives/futures/positions"
    let response = await axios.post(url, jsonBody, {headers});
    return roe(response);
}
    async make_profit_stop_order(id: string, type: "limit" | "market", stop_price : string, profit_price : string){

    const timestamp = Math.floor(Date.now());
        const body = {
      "timestamp": timestamp, // EPOCH timestamp in seconds
    "id": id, // position.id
    "take_profit": {
      "stop_price": profit_price,
      "limit_price": profit_price, // required for take_profit_limit orders
      "order_type": "take_profit_limit" // take_profit_limit OR take_profit_market
    },
    "stop_loss": {
      "stop_price": stop_price ,
      "limit_price": stop_price, // required for stop_limit orders
      "order_type": "stop_limit" // stop_limit OR stop_market
    }
    }
        const url = CoindcxHandler.baseurl + "/exchange/v1/derivatives/futures/positions/create_tpsl"
        let {headers, jsonBody } = encrypt(body);
        let response = await axios.post(url, jsonBody, {headers});
        return roe(response);
    }
async exit_position(id: string){

    const timestamp = Math.floor(Date.now());
    const body = {
        "timestamp": timestamp , // EPOCH timestamp in seconds
        "id": id // position.id
    }
    const url = CoindcxHandler.baseurl + "/exchange/v1/derivatives/futures/positions/exit"
     const {headers, jsonBody } = encrypt(body);
    let response = await axios.post(url, jsonBody, {headers});
        return roe(response);
    }


}
export default CoindcxHandler;
