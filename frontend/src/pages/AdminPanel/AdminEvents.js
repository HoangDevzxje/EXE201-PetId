import React, { useEffect, useState } from "react";
import api from "../../api/eventApi.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Modal, Button } from "react-bootstrap";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null); // Lưu event được chọn
  const [dateError, setDateError] = useState(""); // State lưu lỗi ngày

  const [newEvent, setNewEvent] = useState({
    title: "",
    homePageUrl: "",
    startTime: "",
    endTime: "",
    detailUrl: "",
    description: "",
    noticeContent: "",
    isMainEvent: false,
  });

  const [editEvent, setEditEvent] = useState({
    title: "",
    homePageUrl: "",
    startTime: "",
    endTime: "",
    detailUrl: "",
    description: "",
    noticeContent: "",
    isMainEvent: false,
  });

  //fetch data
  const fetchEvents = async () => {
    try {
      const res = await api.getAll();
      setEvents(res.data);
    } catch (error) {
      console.log("Failed to fetch events: ", error);
    }
  };

  //delete event
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sự kiện này không?")) return;
    try {
      await api.deleteEventById(id);
      alert("Event delete successfully!"); // Hiển thị thông báo thành công
      fetchEvents();
    } catch (error) {
      console.log("Failed to delete event: ", error);
    }
  };

  // Cập nhật state khi nhập dữ liệu form Add event
  const handleAddChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Cập nhật state khi nhập dữ liệu form Edit
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDescriptionChange = (value) => {
    setNewEvent((prev) => ({ ...prev, description: value }));
  };

  const handleNoticeContentChange = (value) => {
    setNewEvent((prev) => ({ ...prev, noticeContent: value }));
  };

  const handleEditDescriptionChange = (value) => {
    setEditEvent((prev) => ({ ...prev, description: value }));
  };

  const handleEditNoticeContentChange = (value) => {
    setEditEvent((prev) => ({ ...prev, noticeContent: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDateError(""); // Reset lỗi trước khi kiểm tra

    const start = new Date(newEvent.startTime);
    const end = new Date(newEvent.endTime);

    // Kiểm tra nếu startTime >= endTime
    if (start >= end) {
      setDateError(
        "Start date must be before the end date and cannot be the same."
      );
      return;
    }

    try {
      await api.addNewEvent(newEvent);
      alert("Event created successfully!"); // Hiển thị thông báo thành công
      setShowForm(false);
      setNewEvent({
        title: "",
        homePageUrl: "",
        detailUrl: "",
        startTime: "",
        endTime: "",
        description: "",
        noticeContent: "",
        isMainEvent: false,
      });

      fetchEvents();
    } catch (error) {
      console.error("Failed to create event: ", error);
      alert("Failed to create event. Please try again!"); // Hiển thị thông báo thất bại
    }
  };

  const handleShowModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  // Mở modal edit và load dữ liệu vào form
  const handleShowEditModal = (event) => {
    setEditEvent(event);
    setShowEditModal(true);
  };
  // close modal edit
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // Gửi API để cập nhật sự kiện
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateEventById(editEvent._id, editEvent);
      setShowEditModal(false);
      alert("Event updated successfully!"); // Hiển thị thông báo thành công
      handleCloseEditModal();

      fetchEvents(); // Refresh danh sách sự kiện
    } catch (error) {
      console.log("Failed to update event: ", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // "01/01/2025"
  };
  return (
    <div id="layoutSidenav_content">
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Events</h1>
          <button
            className="btn btn-outline-dark mb-3"
            style={{ borderRadius: "0px" }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close Form" : "Add Event"}
          </button>

          {/* Form nhập event */}
          {showForm && (
            <div className="card mb-4">
              <div className="card-header">Create New Event</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={newEvent.title}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      name="homePageUrl"
                      value={newEvent.homePageUrl}
                      onChange={handleAddChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image Detail URL</label>
                    <input
                      type="text"
                      className="form-control"
                      name="detailUrl"
                      value={newEvent.detailUrl}
                      onChange={handleAddChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="startTime"
                      value={newEvent.startTime}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="endTime"
                      value={newEvent.endTime}
                      onChange={handleAddChange}
                      required
                    />
                  </div>
                  {/* Hiển thị lỗi nếu có */}
                  {dateError && <p className="text-danger">{dateError}</p>}{" "}
                  <div className="mb-3">
                    <label className="form-label">Event Detail</label>
                    <ReactQuill
                      value={newEvent.description}
                      onChange={handleDescriptionChange}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, 4, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          [{ script: "sub" }, { script: "super" }],
                          [{ indent: "-1" }, { indent: "+1" }],
                          [{ direction: "rtl" }],
                          [{ color: [] }, { background: [] }],
                          [{ font: [] }],
                          [{ align: [] }],
                          ["link", "image", "video"],
                          ["clean"], // Xóa định dạng
                        ],
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notice Content</label>
                    <ReactQuill
                      value={newEvent.noticeContent}
                      onChange={handleNoticeContentChange}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, 4, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          [{ script: "sub" }, { script: "super" }],
                          [{ indent: "-1" }, { indent: "+1" }],
                          [{ direction: "rtl" }],
                          [{ color: [] }, { background: [] }],
                          [{ font: [] }],
                          [{ align: [] }],
                          ["link", "image", "video"],
                          ["clean"], // Xóa định dạng
                        ],
                      }}
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="isMainEvent"
                      checked={newEvent.isMainEvent}
                      onChange={handleAddChange}
                    />
                    <label className="form-check-label">Is Main Event?</label>
                  </div>
                  <button type="submit" className="btn btn-success">
                    Create Event
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Danh sách sự kiện */}
          <div className="card mb-4">
            <div className="card-header">
              <i className="fas fa-table me-1"></i> List of events
            </div>
            <div className="card-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Image Main</th>

                    <th>Start Date</th>
                    <th>End Date</th>

                    <th>Main Event</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event._id}>
                      <td>{event.title}</td>
                      <td>
                        <img
                          src={event.homePageUrl}
                          alt={event.title}
                          width="100"
                        />
                      </td>

                      <td>{formatDate(event.startTime)}</td>
                      <td>{formatDate(event.endTime)}</td>

                      <td>{event.isMainEvent ? "True" : "False"}</td>
                      <td className="d-flex flex-column">
                        <button
                          style={{ borderRadius: "0px" }}
                          className="btn btn-success text-white mb-2"
                          onClick={() => handleShowModal(event)}
                        >
                          View Detail
                        </button>
                        <button
                          style={{ borderRadius: "0px" }}
                          className="btn btn-primary text-white mb-2"
                          onClick={() => handleShowEditModal(event)}
                        >
                          Edit
                        </button>
                        <button
                          style={{ borderRadius: "0px" }}
                          onClick={() => handleDelete(event._id)}
                          className="btn btn-danger text-white"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Modal hiển thị chi tiết sự kiện */}
          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{selectedEvent?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedEvent && (
                <div>
                  <p>
                    <strong>Image detail:</strong>{" "}
                    <img
                      src={selectedEvent.detailUrl}
                      alt={selectedEvent.title}
                      width="100"
                    />
                  </p>

                  <p>
                    <strong>Description:</strong>
                  </p>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedEvent.description,
                    }}
                  />
                  <p>
                    <strong>Notice Content:</strong>
                  </p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedEvent.noticeContent,
                    }}
                  />
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal chỉnh sửa sự kiện */}
          <Modal
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {editEvent && (
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={editEvent.title}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      name="homePageUrl"
                      value={editEvent.homePageUrl}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image Detail URL</label>
                    <input
                      type="text"
                      className="form-control"
                      name="detailUrl"
                      value={editEvent.detailUrl}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Event Detail</label>
                    <ReactQuill
                      value={editEvent.description}
                      onChange={handleEditDescriptionChange}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, 4, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          [{ script: "sub" }, { script: "super" }],
                          [{ indent: "-1" }, { indent: "+1" }],
                          [{ direction: "rtl" }],
                          [{ color: [] }, { background: [] }],
                          [{ font: [] }],
                          [{ align: [] }],
                          ["link", "image", "video"],
                          ["clean"], // Xóa định dạng
                        ],
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notice Content</label>
                    <ReactQuill
                      value={editEvent.noticeContent}
                      onChange={handleEditNoticeContentChange}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, 3, 4, false] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          [{ script: "sub" }, { script: "super" }],
                          [{ indent: "-1" }, { indent: "+1" }],
                          [{ direction: "rtl" }],
                          [{ color: [] }, { background: [] }],
                          [{ font: [] }],
                          [{ align: [] }],
                          ["link", "image", "video"],
                          ["clean"], // Xóa định dạng
                        ],
                      }}
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="isMainEvent"
                      checked={editEvent.isMainEvent}
                      onChange={handleEditChange}
                    />
                    <label className="form-check-label">Is Main Event?</label>
                  </div>
                  <button type="submit" className="btn btn-success">
                    Save Changes
                  </button>
                </form>
              )}
            </Modal.Body>
          </Modal>
        </div>
      </main>
    </div>
  );
}
