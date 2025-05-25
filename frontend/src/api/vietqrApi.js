import axios from "axios";

const VIETQR_ENDPOINT = "https://api.vietqr.io/v2/generate";
const CLIENT_ID = process.env.REACT_APP_VIETQR_CLIENT_ID;
const API_KEY = process.env.REACT_APP_VIETQR_API_KEY;

export const createVietQR = async ({
  accountNo,
  accountName,
  acqId,
  amount,
  addInfo,
  template = "compact",
}) => {
  const headers = {
    "x-client-id": CLIENT_ID,
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  };

  const payload = {
    accountNo,
    accountName,
    acqId,
    amount,
    addInfo,
    template,
  };

  const response = await axios.post(VIETQR_ENDPOINT, payload, { headers });
  return response.data.data.qrDataURL; // base64 image
};
