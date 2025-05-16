import React, { useEffect, useState } from "react";
import "./promotion.css";
import api from "../../api/eventApi.js";
import { Link, useParams } from "react-router-dom";
export default function PromotionDetail() {
  const { id } = useParams();
  const [eventDetail, setEventDetail] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.getEventById(id);
        console.log("Events: ", res);
        setEventDetail(res.data);
      } catch (error) {
        console.log("Failed to fetch events: ", error);
      }
    };
    fetchEvents();
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-GB"); // "01/01/2025"
    console.log(formattedDate);
    return formattedDate;
  };
  return (
    <div className="body pt-5">
      <div className="container">
        <div className="container-promotion-detail">
          <div>
            <h3 className="sub_tit">{eventDetail.title}</h3>
            <div>
              <img src={eventDetail.detailUrl} alt="" />
              <div className="event_release">
                <div
                  dangerouslySetInnerHTML={{ __html: eventDetail.description }}
                />
              </div>
            </div>
          </div>
        </div>
        {eventDetail.noticeContent && (
          <div className="view_add">
            <strong>Lưu ý</strong>
            <p
              dangerouslySetInnerHTML={{ __html: eventDetail.noticeContent }}
            />
          </div>
        )}

        <div className="d-flex justify-content-center m-3">
          <Link to="/promotion" className="btn btn-dark no-radius btn-search">
            Danh sách
          </Link>
        </div>
      </div>
    </div>
  );
}
