

const request = require('request')
const crypto = require('crypto')
const dotenv = require('dotenv')
dotenv.config();
const baseurl = "https://api.coindcx.com"

const timeStamp = Math.floor(Date.now());
// To check if the timestamp is correct
console.log(timeStamp);

// Place your API key and secret below. You can generate it from the website.
const key = process.env.API_KEY;
const secret = process.env.API_SECRET;
console.log("key",key,"secret", secret);
const body = {
"timestamp": timeStamp , // EPOCH timestamp in seconds
"order": {
"side": "buy", // buy OR sell
"pair": "B-PEOPLE_USDT", // instrument.string
"order_type": "market_order", // market_order OR limit_order
"price": '0.11003',
"total_quantity": 60,
"leverage": 1,
"notification": 'push_notification', // no_notification OR email_notification OR push_notification
"time_in_force": 'good_till_cancel', // good_till_cancel OR fill_or_kill OR immediate_or_cancel
"hidden": false,
"post_only": false
}
}

  const secretBytes = Buffer.from(secret, "utf-8");

  const signature = crypto
    .createHmac("sha256", secretBytes)
    .update(JSON.stringify(body))
    .digest("hex");


const options = {
    url: baseurl + "/exchange/v1/derivatives/futures/orders/create",
    headers: {
        'X-AUTH-APIKEY': key,
        'X-AUTH-SIGNATURE': signature
    },
    json: true,
    body: body
}

request.post(options, function(error, response, body) {
    console.log(body);
})

