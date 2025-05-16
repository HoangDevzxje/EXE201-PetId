import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { getShowtimeByDay } from "../../api/showtimeApi";
import "bootstrap/dist/css/bootstrap.min.css";

const Showtime = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const data = await getShowtimeByDay(movieId, selectedDate);
        setShowtimes(data);
      } catch (error) {
        console.error("Lỗi khi lấy suất chiếu:", error);
        setShowtimes([]);
      }
    };
    fetchShowtimes();
  }, [movieId, selectedDate]);

  const getWeekDates = (startDate) => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date.toISOString().split("T")[0];
    });
  };

  const handleSelectSeat = (showtimeId) => {
    navigate(`/showtime-detail/${showtimeId}`);
  };

  return (
    <Container className="my-5">
      <h1 className="fw-bold mb-4 text-center">Lịch Chiếu Phim</h1>
      {showtimes.length > 0 && (
        <h2 className="fw-bold mb-4 text-center">
          {showtimes[0].movie?.title || "Không có thông tin phim"}
        </h2>
      )}
      <Row className="mb-4">
        <Col>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {getWeekDates(new Date()).map((date) => (
              <Button
                key={date}
                variant={selectedDate === date ? "primary" : "outline-primary"}
                onClick={() => setSelectedDate(date)}
                className="flex-grow-1 flex-md-grow-0 text-center py-2 px-3 rounded-pill"
                style={{
                  minWidth: "100px",
                  border:
                    selectedDate === date
                      ? "2px solid transparent"
                      : "2px solid #0d6efd",
                  fontWeight: "500",
                  fontSize: "0.9rem",
                }}
              >
                {new Date(date).toLocaleDateString("vi-VN", {
                  weekday: "short",
                  day: "numeric",
                  month: "numeric",
                })}
              </Button>
            ))}
          </div>
        </Col>
      </Row>
      {showtimes.length > 0 ? (
        showtimes.map((showtime) => (
          <Row key={showtime._id} className="mb-3 border-bottom pb-3">
            <Col md={8}>
              <p className="fs-5 mb-2">
                <strong>Thời Gian:</strong>{" "}
                {new Date(showtime.startTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}{" "}
                -{" "}
                {new Date(showtime.endTime).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </p>

              <p className="fs-5 mb-2">
                <strong>Phòng:</strong>{" "}
                {showtime.room?.name || "Không có thông tin phòng"}
              </p>

              <p className="fs-5 mb-2">
                <strong>Loại:</strong> {showtime.type}
              </p>

              <p className="fs-5 mb-2">
                <strong>Giá Vé:</strong>
                <br />
                {showtime.pricing?.normal ? (
                  <>
                    {showtime.pricing.normal.toLocaleString()} VNĐ (Thường)
                    <br />
                  </>
                ) : (
                  "Không có thông tin giá"
                )}
                {showtime.pricing?.vip && (
                  <>{showtime.pricing.vip.toLocaleString()} VNĐ (VIP)</>
                )}
              </p>

              <p className="fs-5 mb-2">
                <strong>Ghế:</strong> {showtime.seats?.length || 0} / 100 ghế
              </p>
            </Col>

            <Col
              md={4}
              className="text-end d-flex align-items-center justify-content-end"
            >
              <Button
                variant="danger"
                className="fw-bold px-4 py-2"
                onClick={() => handleSelectSeat(showtime._id)}
              >
                Chọn Ghế
              </Button>
            </Col>
          </Row>
        ))
      ) : (
        <p className="text-center">Không có suất chiếu nào trong ngày này.</p>
      )}
    </Container>
  );
};

export default Showtime;
