import api from "./baseApi";

const eventApi = {
  // Get all events
  getAll: async () => {
    const url = `/event`;
    const response = await api.get(url);
    return response;
  },
  getEventById: async (id) => {
    console.log("day nauy", id);
    const url = `/event/${id}`;
    const response = await api.get(url);
    return response;
  },

  // Admin
  deleteEventById: async (id) => {
    console.log("day nauy", id);
    const url = `/admin/events/${id}`;
    const response = await api.delete(url);
    return response;
  },

  addNewEvent: async (eventData) => {
    const url = `/admin/events`;
    const response = await api.post(url, eventData);
    return response;
  },
  updateEventById: async (id, eventData) => {
    const url = `/admin/events/${id}`;
    const response = await api.put(url, eventData);
    return response;
  },
};

export default eventApi;
