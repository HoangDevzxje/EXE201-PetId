import api from "./baseApi";

const bookingApi = {
  createBooking: async (data) => {
    const url = `/booking/`;
    const response = await api.post(url, data);
    return response;
  },
};

export default bookingApi;
