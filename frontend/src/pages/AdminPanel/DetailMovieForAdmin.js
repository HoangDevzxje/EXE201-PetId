import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Row, Col, Table, Form, Modal } from "react-bootstrap";
import moviesApi from "../../api/MovieApi";
import {getAllShowtimeMovie, getShowtimeByDay} from "../../api/showtimeApi";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DetailMovieForAdmin.css";

const DetailMovieForAdmin = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [room, setRoom] = useState(null)
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [newShowtime, setNewShowtime] = useState({
      movieId: movieId,
      roomId: "",
      type: "",
      startTime: "",
      endTime: "",
      pricing: { normal: "", vip: "" },
    });

    const fetchMovieDetail = async () => {
        const data = await moviesApi.getMovieDetail(movieId);
        if (data) {
          setMovie(data);
        }
      };
  
      const fetchRooms = async () =>{
          const rooms = await moviesApi.getAllRoom()
          if(rooms){
              setRoom(rooms);
          }
      };
  
      const fetchShowtimesByDate = async () => {
          try {
            const data = await getShowtimeByDay(movieId, '');
            setShowtimes(data)
          } catch (error) {
            console.error("Lỗi khi lấy lịch chiếu", error);
          }
        };

    const handleAddShowtime = async () => {
        if (!newShowtime.movieId || !newShowtime.roomId || !newShowtime.startTime || !newShowtime.endTime) {
          alert("Vui lòng nhập đầy đủ thông tin!");
          return;
        }
    
        try {
          const noti = await moviesApi.addShowtime(newShowtime.movieId, newShowtime);
          if(noti){
            alert("Thêm suất chiếu thành công!");
          }
          fetchShowtimesByDate(); 
          setShowModal(false);
        } catch (error) {
          console.error("Lỗi khi thêm suất chiếu:", error);
          alert("Thêm suất chiếu thất bại!");
        }
      };
    
      const handleDeleteShowtime = async (movieId, showtimeId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa suất chiếu này?")) {
          try {
            const noti = await moviesApi.deleteShowtime(movieId, showtimeId);
            if(noti){
                alert("Xóa suất chiếu thành công!");
            }
            fetchShowtimesByDate(); // Cập nhật danh sách sau khi xóa
          } catch (error) {
            console.error("Lỗi khi xóa suất chiếu:", error);
            alert("Xóa suất chiếu thất bại!");
          }
        }
      };
    

  useEffect(() => {
   
    fetchMovieDetail();
    fetchRooms();
    fetchShowtimesByDate();
  }, [movieId,selectedDate]);

  if (!movie) return <p>Loading...</p>;

  return (
    <Container className="movie-admin-detail p-4">
      <Row>
        <Col md={4} className="text-center">
          <img src={movie.posterUrl} alt={movie.title} className="img-fluid rounded shadow" />
        </Col>
        <Col md={8}>
          <h2 className="fw-bold mb-3 text-primary">{movie.title}</h2>
          <p><strong>Đạo diễn:</strong> {movie.director?.join(", ")}</p>
          <p><strong>Diễn viên:</strong> {movie.casts?.join(", ")}</p>
          <p><strong>Thể loại:</strong> {movie.genre?.join(", ")}</p>
          <p><strong>Khởi chiếu:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
          <p><strong>Thời lượng:</strong> {movie.duration} phút</p>
          <p><strong>Ngôn ngữ:</strong> {movie.language}</p>
          <p><strong>Nội dung:</strong> {movie.description}</p>
        </Col>
      </Row>
      
      {/* Bảng lịch chiếu */}
      <h3 className="mt-5 text-success">Lịch Chiếu</h3>
      <Button variant="primary" onClick={() => setShowModal(true)}>
            Thêm suất chiếu
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Ngày chiếu</th>
            <th>Giờ chiếu</th>
            <th>Giờ kết thúc</th>
            <th>Thể loại</th>
            <th>Giá vé</th>
            <th>Giá vé VIP</th>
            <th>Phòng</th>
            <th>Chỗ ngồi </th>
            <th>Trạng thái  </th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {showtimes?.length > 0 ? showtimes?.map((show, index) => (
            <tr key={show._id}>
              <td>{index + 1}</td>
              <td>{new Date(show.startTime).toLocaleDateString()}</td>
              <td>{new Date(show.startTime).toLocaleTimeString()}</td>
              <td>{new Date(show.endTime).toLocaleTimeString()}</td>
              <td>{show.type}</td>
              <td>{show.pricing.normal}</td>
              <td>{show.pricing.vip}</td>
              <td>{show.room.name}</td>
              <td>{show.seatSummary.total}</td>
              <td>
                <p>
                    {new Date(show.startTime) <= new Date() ? "Đã chiếu" : "Chưa chiếu"}
                </p>
              </td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteShowtime(movieId,show._id)} size="sm">Xóa</Button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="text-center">Không có lịch chiếu nào</td>
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
            <Form.Label> Chọn Phòng</Form.Label>
            <Form.Control as="select" value={newShowtime.roomId} 
                onChange={(e) => setNewShowtime({ ...newShowtime, roomId: e.target.value })}>
                <option value="">Chọn phòng</option>
                {room?.map((room) => (
                <option key={room._id} value={room._id}>
                    {room.name}
                </option>
                ))}
            </Form.Control>
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
    </Container>
  );
};

export default DetailMovieForAdmin;
