import React, { useEffect, useState } from "react";
import "./promotion.css";
import api from "../../api/eventApi.js";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
export default function Promotion() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State lưu từ khóa tìm kiếm
  const [filteredEvents, setFilteredEvents] = useState([]); // State lưu danh sách sự kiện đã lọc

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.getAll();
        console.log("Events: ", res);
        setEvents(res.data);
        setFilteredEvents(res.data); // Ban đầu danh sách hiển thị tất cả
      } catch (error) {
        console.log("Failed to fetch events: ", error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    // Lọc sự kiện dựa trên từ khóa tìm kiếm
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // "01/01/2025"
  };

  return (
    <>
      <div className="container">
        <div className="container-promotion">
          <div className="d-flex justify-content-between w-100">
            <h3 className="fw-bold title-main">Promotion</h3>
            <div className="d-flex">
              <input
                type="text"
                className="form-control ipt_txt no-radius"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm khi nhập liệu
              />
              <button className="btn btn-dark no-radius btn-search">
                Tìm kiếm
              </button>
            </div>
          </div>
          <div className="mt-3 row">
            {filteredEvents.map((event) => (
              <Link
                key={event._id}
                className="pt-3 col-lg-3 col-sm-12 col-md-6"
                to={`/promotion/${event._id}`}
              >
                <div>
                  <div className="e-list">
                    <img
                      src={event.homePageUrl}
                      alt={event.title}
                      className="w-100"
                    />
                    <div className="p-1 text-center">
                      {formatDate(event.startTime)} -{" "}
                      {formatDate(event.endTime)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
