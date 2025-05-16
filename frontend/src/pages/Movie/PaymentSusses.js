import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
const PaymentSusses = () => {
  const location = useLocation();
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/payment/return${location.search}`
        );
        setStatus(response.data.status);
        setMessage(response.data.message);
      } catch (error) {
        setStatus("fail");
        setMessage("Có lỗi xảy ra khi kiểm tra thanh toán.");
      }
    };

    fetchPaymentStatus();
  }, [location]);

  return (
    <div>
      <h2>Kết quả thanh toán</h2>
      {status === "success" ? <p>✅ {message}</p> : <p>❌ {message}</p>}
    </div>
  );
};

export default PaymentSusses;
