import api from "./baseApi";

export const getShowtimeByDay = async (movieId, date) => {
  try {
    const response = await api.get(
      `/movie/${movieId}/showtime-by-day?date=${date}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews", error);
    throw error;
  }
};

export const getAllShowtimeMovie = async (showtimeId, date) => {
  try {
    const response = await api.get(`movie/showtime/${showtimeId}?date=${date}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews", error);
    throw error;
  }
};
export const getShowtimeById = async (showtimeId, date) => {
  try {
    const response = await api.get(`movie/showtime/${showtimeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews", error);
    throw error;
  }
};
