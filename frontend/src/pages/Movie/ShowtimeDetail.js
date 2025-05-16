import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { getShowtimeById } from "../../api/showtimeApi";

import BokkingApi from "../../api/bookingApi.js";

import PaymentApi from "../../api/paymentApi.js";
import { fetchUser } from "../../services/authen";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ShowtimeDetail.css";

const ShowtimeDetail = () => {
  const { showtimeId } = useParams();
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatPrices, setSeatPrices] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const showtimeData = await getShowtimeById(showtimeId, today);
        setShowtime(showtimeData);
        setSeatPrices(showtimeData.pricing);

        const userData = await fetchUser();
        setUser(userData);
      } catch (error) {
        console.error("Lỗi API:", error);
      }
    };
    fetchData();
  }, [showtimeId]);

  const toggleSeatSelection = (seat) => {
    if (seat.status === "booked") return;

    setSelectedSeats((prev) => {
      let newSeats;
      if (prev.some((s) => s.seatNumber === seat.seatInfo.seatNumber)) {
        newSeats = prev.filter(
          (s) => s.seatNumber !== seat.seatInfo.seatNumber
        );
      } else {
        newSeats = [
          ...prev,
          {
            seatId: seat.seatInfo._id,
            seatNumber: seat.seatInfo.seatNumber,
            price: seatPrices[seat.seatInfo.type.toLowerCase()],
          },
        ];
      }

      const newTotal = newSeats.reduce((sum, seat) => sum + seat.price, 0);
      setTotalPrice(newTotal);
      return newSeats;
    });
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ghế trước khi đặt vé!");
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = () => {
    console.log("day neu", selectedSeats);
    const data = {
      // user: user._id,
      showtime: showtime._id,
      seats: selectedSeats.map((s) => ({ seat: s.seatId })),
    };
    BokkingApi.createBooking(data).then((res) => {
      if (res.status === 201) {
        console.log("CHECK");
        console.log(res);
        PaymentApi.createPayment({
          orderInfo: res.data._id,
          amount: totalPrice,
        }).then((res) => {
          if (res.status === 200) {
            window.location.href = res.data.paymentUrl;
          }
        });
      }
    });
  };

  const groupedSeats = showtime?.seats?.reduce((acc, seat) => {
    const rowLabel = seat.seatInfo.seatNumber[0];
    if (!acc[rowLabel]) acc[rowLabel] = [];
    acc[rowLabel].push(seat);
    return acc;
  }, {});

  Object.keys(groupedSeats || {}).forEach((key) => {
    groupedSeats[key].sort(
      (a, b) =>
        parseInt(a.seatInfo.seatNumber.slice(1)) -
        parseInt(b.seatInfo.seatNumber.slice(1))
    );
  });

  return (
    <Container className="showtime-container">
      <h1 className="text-center mb-4">Chọn Ghế</h1>

      <div className="screen-container">
        <div className="screen">Màn Hình</div>
      </div>

      <div className="seat-map">
        {groupedSeats &&
          Object.entries(groupedSeats).map(([rowLabel, seats]) => (
            <div key={rowLabel} className="seat-row">
              <div className="row-label">{rowLabel}</div>
              <div className="d-flex">
                {seats.map((seat) => (
                  <div
                    key={seat.seatInfo.seatNumber}
                    className={`seat ${seat.status} ${
                      selectedSeats.some(
                        (s) => s.seatNumber === seat.seatInfo.seatNumber
                      )
                        ? "selected"
                        : ""
                    } ${seat.seatInfo.type.toLowerCase()}`}
                    onClick={() => toggleSeatSelection(seat)}
                  >
                    {seat.seatInfo.seatNumber.slice(1)}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      <div className="legend-container">
        <div className="legend-item">
          <div className="seat available"></div> Trống
        </div>
        <div className="legend-item">
          <div className="seat booked"></div> Đã đặt
        </div>
        <div className="legend-item">
          <div className="seat selected"></div> Đang chọn
        </div>
        <div className="legend-item">
          <div className="seat VIP"></div> VIP
        </div>
      </div>

      <div className="text-center mt-4">
        <Button variant="success" className="btn-book" onClick={handleBooking}>
          Đặt vé ({selectedSeats.length} ghế)
        </Button>
      </div>

      {showPayment && (
        <div className="paymentBox">
          <p className="payment-title">Thông tin vé đặt</p>
          <div className="payment">
            <div className="merchant-info">
              <p>
                <strong>Thông tin phim:</strong>
              </p>
              <p>
                <strong>Tên phim:</strong> {showtime.movie.title}
              </p>
              <p>
                <strong>Phòng:</strong> {showtime.room?.name}
              </p>
              <p>
                <strong>Ghế đã chọn:</strong>{" "}
                {selectedSeats.map((s) => s.seatNumber).join(", ")}
              </p>
              <p>
                <strong>Giá: {totalPrice} VND</strong>
              </p>
            </div>

            <div className="customer-info">
              <p>
                <strong>Thông tin người đặt:</strong>
              </p>
              <p>
                <strong>Họ tên:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Điện thoại:</strong> {user?.phone}
              </p>
            </div>

            <div className="payment-actions">
              <button className="pay-btn" onClick={handlePayment}>
                THANH TOÁN
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ShowtimeDetail;
