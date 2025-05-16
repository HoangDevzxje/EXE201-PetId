import api from "./baseApi";

const paymentApi = {
  createPayment: async (data) => {
    const url = `/payment/create`;
    const response = await api.post(url, data);
    return response;
  },
};

export default paymentApi;
