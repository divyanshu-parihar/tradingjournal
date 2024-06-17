console.log("Hello Trading journal");
import CoindcxHandler from "./util/coin";
import * as readline from 'node:readline/promises';  // This uses the promise-based APIs
import { stdin as input, stdout as output } from 'node:process';
import dotenv from "dotenv";
dotenv.config();
const rl = readline.createInterface({ input, output });
const prompt = async (question:any)=>{
    const answer = await rl.question(question);
    return answer;
}


const main = async () => {
  let handler = new CoindcxHandler(
    process.env.API_KEY!,
    process.env.API_SECRET!
  );

  // let data = await handler.get_coins_information();
  // console.log(data.filter((el: any) => el.market == "BTCUSDT"));

  // setInterval(async () => {
  //   let data = await handler.get_order_book("BTC", "USDT");
  //   console.log(data);
  // }, 1000);
  // let data = await handler.placeOrder(
    //"PEOPLEUSDT",
    //"buy",
    //"limit_order",
    //"0.11782",
  //  10
  //);
    console.log("let's make you some money");
    let run = true;
    let input : string | null   = String(0);
    while(run){
        // never have a option 0
        console.log("1. new  position " );
        console.log("2. add position ");
        console.log("3. remove position");
        console.log("4. exit all position");


        input =  await prompt("Put your GODDAAM option. ");

        if(input == '1') {

            let coin =  await prompt("COIN?");
            let price = await prompt("PRICE?");
            let order = await prompt("TYPE?l/m");
            let leverage = await prompt("LEVERAGE");
            let quantity = await prompt("QTY");
            if(!coin || !price || !order || !leverage || !quantity) continue;
            try{

                let data = await  handler.futures_create_order('buy',
                coin,order == 'm' ? 'market_order':  'limit_order',
           price,parseInt(quantity),parseInt(leverage),'good_till_cancel');
                console.log(data);
            }
            catch(e){
                console.log(e)
            }
        }else{
            break;
        }


    }

};

main();
