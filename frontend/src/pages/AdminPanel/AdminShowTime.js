import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import moviesApi from "../../api/MovieApi";

const AdminShowTime = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [newShowtime, setNewShowtime] = useState({
    movieId: "",
    roomId: "",
    type: "",
    startTime: "",
    endTime: "",
    pricing: { normal: "", vip: "" },
  });
  const [showModal, setShowModal] = useState(false);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await moviesApi.getAdminMovies();
      setMovies(response);
    } catch (error) {
      console.error("Error fetching movies", error);
    }
  };

  const fetchShowtimes = async () => {
    try {
      // Giả sử API lấy danh sách suất chiếu có endpoint `/admin/showtimes`
      const response = await moviesApi.getShowtimes();
      setShowtimes(response);
    } catch (error) {
      console.error("Error fetching showtimes", error);
    }
  };

  const handleAddShowtime = async () => {
    if (!newShowtime.movieId || !newShowtime.roomId || !newShowtime.startTime || !newShowtime.endTime) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await moviesApi.addShowtime(newShowtime.movie, newShowtime);
      fetchShowtimes(); // Cập nhật danh sách sau khi thêm
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi thêm suất chiếu:", error);
      alert("Thêm suất chiếu thất bại!");
    }
  };

  const handleDeleteShowtime = async (movieId, showtimeId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa suất chiếu này?")) {
      try {
        await moviesApi.deleteShowtime(movieId, showtimeId);
        fetchShowtimes(); // Cập nhật danh sách sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa suất chiếu:", error);
        alert("Xóa suất chiếu thất bại!");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🎬 Quản lý suất chiếu</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>➕ Thêm suất chiếu</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Phim</th>
            <th>Phòng</th>
            <th>Thể loại</th>
            <th>Giờ Bắt đầu</th>
            <th>Giờ Kết thúc</th>
            <th>Giá Thường</th>
            <th>Giá VIP</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {showtimes.length > 0 ? (
            showtimes.map((show, index) => (
              <tr key={show._id}>
                <td>{index + 1}</td>
                <td>{show.movieTitle}</td>
                <td>{show.room}</td>
                <td>{show.type}</td>
                <td>{show.startTime}</td>
                <td>{show.endTime}</td>
                <td>{show.pricing.normal} VNĐ</td>
                <td>{show.pricing.vip} VNĐ</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteShowtime(show.movieId, show._id)}>
                    ❌ Xóa
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">Chưa có suất chiếu nào!</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal Thêm Suất Chiếu */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title> Thêm suất chiếu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label> Chọn Phim</Form.Label>
              <Form.Control as="select" value={newShowtime.movieId} 
                onChange={(e) => setNewShowtime({ ...newShowtime, movieId: e.target.value })}>
                <option value="">Chọn phim</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label> Chọn Phòng</Form.Label>
              <Form.Control type="text" placeholder="Nhập số phòng" value={newShowtime.roomId} 
                onChange={(e) => setNewShowtime({ ...newShowtime, roomId: e.target.value })} />
            </Form.Group>

            <Form.Group>
              <Form.Label> Chọn Thể loại</Form.Label>
              <Form.Control as="select" value={newShowtime.type} 
                onChange={(e) => setNewShowtime({ ...newShowtime, type: e.target.value })}>
                <option value="">Chọn thể loại</option> 
                <option value="2D">2D</option>
                <option value="3D">3D</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label> Giờ Bắt đầu</Form.Label>
              <Form.Control type="datetime-local" value={newShowtime.startTime} 
                onChange={(e) => setNewShowtime({ ...newShowtime, startTime: e.target.value })} />
            </Form.Group>

            <Form.Group>
              <Form.Label> Giờ Kết thúc</Form.Label>
              <Form.Control type="datetime-local" value={newShowtime.endTime} 
                onChange={(e) => setNewShowtime({ ...newShowtime, endTime: e.target.value })} />
            </Form.Group>

            <Form.Group>
              <Form.Label> Giá Vé Thường</Form.Label>
              <Form.Control type="number" placeholder="Nhập giá vé thường" value={newShowtime.pricing.normal} 
                onChange={(e) => setNewShowtime({ ...newShowtime, pricing: { ...newShowtime.pricing, normal: e.target.value } })} />
            </Form.Group>

            <Form.Group>
              <Form.Label> Giá Vé VIP</Form.Label>
              <Form.Control type="number" placeholder="Nhập giá vé VIP" value={newShowtime.pricing.vip} 
                onChange={(e) => setNewShowtime({ ...newShowtime, pricing: { ...newShowtime.pricing, vip: e.target.value } })} />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleAddShowtime}>Lưu</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminShowTime;
