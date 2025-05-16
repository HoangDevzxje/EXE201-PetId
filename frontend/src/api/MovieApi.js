import api from "./baseApi";

const movieApi = {
  get5NewMovies: async () => {
    try {
      const response = await api.get(`/movie/main`);
      return response.data
        .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
        .slice(0, 5);
    } catch (error) {
      console.error("Error fetching movies", error);
      return [];
    }
  },

  getMovieDetail: async (movieId) => {
    try {
      const response = await api.get(`/movie/detail/${movieId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching movie detail", error);
      return null;
    }
  },

  getNowPlayingMovies: async () => {
    try {
      const response = await api.get(`/movie/main`);
      const allMovies = response.data;
      const today = new Date();
      return allMovies.filter((movie) => new Date(movie.releaseDate) <= today);
    } catch (error) {
      console.error("Error fetching now showing movies", error);
      return [];
    }
  },

  getUpcomingMovies: async () => {
    try {
      const response = await api.get(`/movie/main`);
      const allMovies = response.data;
      const today = new Date();
      return allMovies.filter((movie) => new Date(movie.releaseDate) > today);
    } catch (error) {
      console.error("Error fetching upcoming movies", error);
      return [];
    }
  },
  getAdminMovies: async () => {
    try {
      const response = await api.get(`/admin/movies`);
      return response.data;
    } catch (error) {
      console.error("Error fetching movies", error);
      return [];
    }
  },
  addNewMovie: async (movieData) => {
    const url = "/admin/movies";
    const response = await api.post(url, movieData);
    return response.data;
  },

  updateMovie: async (movieId, movieData) => {
    const url = `/admin/movies/${movieId}`;
    const response = await api.put(url, movieData);
    return response.data;
  },

  deleteMovie: async (movieId) => {
    const url = `/admin/movies/${movieId}`;
    const response = await api.delete(url);
    return response.data;
  },

  addShowtime: async (movieId, showtimeData) => {
    const url = `/admin/movies/${movieId}/add-showtime`;
    const response = await api.post(url, showtimeData);
    return response.data;
  },

  deleteShowtime: async (movieId, showtimeId) => {
    const url = `/admin/showtimes/${showtimeId}`;
    const response = await api.delete(url);
    return response.data;
  },

  getAllRoom: async () => {
    const url = `admin/rooms`;
    const response = await api.get(url);
    return response.data;
  },

  addReview: async (reviewData) => {
    try {
      const response = await api.post(`/review/add-new`, reviewData);
      return response.data;
    } catch (error) {
      console.error("Error adding review", error);
      throw error;
    }
  },

  getReview: async (movieId) => {
    try {
      const response = await api.get(`/movie/detail/${movieId}/reviews`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews", error);
      return [];
    }
  },
};

export default movieApi;
