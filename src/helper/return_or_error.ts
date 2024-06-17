import { AxiosResponse } from "axios";

function roe(response: AxiosResponse) {
  if (response.data) {
    return response.data;
  } else {
    return new Error("Could not get info");
  }
}

export default roe;
