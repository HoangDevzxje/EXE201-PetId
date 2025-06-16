import React, { useState, useEffect } from "react";
import api from "../../api/baseApi";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import "./PetEmotion.css";

export default function PetEmotion() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  // State cho form
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // State cho lịch sử
  const [weeks, setWeeks] = useState([]); // danh sách tuần
  const [selectedWeek, setSelectedWeek] = useState(null); // tuần đang chọn
  const [weeklyLogs, setWeeklyLogs] = useState([]); // log trong tuần
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteValue, setEditNoteValue] = useState("");
  const [showHistory, setShowHistory] = useState(false); // ẩn/hiện lịch sử

  // State cho chart
  const [chartData, setChartData] = useState([]);

  // Pet info
  const [petInfo, setPetInfo] = useState(null);

  const emotions = [
    { value: "vui vẻ", label: "Vui vẻ", icon: "😊" },
    { value: "buồn bã", label: "Buồn bã", icon: "😢" },
    { value: "sợ hãi", label: "Sợ hãi", icon: "😰" },
    { value: "tức giận", label: "Tức giận", icon: "😠" },
    { value: "căng thẳng", label: "Căng thẳng", icon: "😤" },
    { value: "stress", label: "Stress", icon: "😵" },
  ];

  // Hiển thị alert
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
  };

  // Gắn token vào axios
  useEffect(() => {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token]);

  // Fetch pet info và list tuần
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/pets/${petId}`);
        setPetInfo(res.data);

        const weeksRes = await api.get(`/emotion-logs/${petId}/weeks`);
        const weekList = weeksRes.data; // mảng "YYYY-MM-DD"
        setWeeks(weekList);

        // Xác định tuần hiện tại (ISO week)
        const currentIsoWeek = moment().startOf("isoWeek").format("YYYY-MM-DD");
        if (weekList.includes(currentIsoWeek)) {
          setSelectedWeek(currentIsoWeek);
        } else if (weekList.length > 0) {
          setSelectedWeek(weekList[0]);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [petId]);

  // Fetch logs & chart khi tuần thay đổi
  useEffect(() => {
    if (!selectedWeek) return;
    (async () => {
      try {
        const logsRes = await api.get(`/emotion-logs/${petId}`, {
          params: { week: selectedWeek },
        });
        setWeeklyLogs(logsRes.data);

        const chartRes = await api.get(`/emotion-logs/${petId}/chart`, {
          params: { week: selectedWeek },
        });
        setChartData(chartRes.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [selectedWeek, petId]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmotion) return showAlert("warning", "Chọn cảm xúc!");
    setLoading(true);
    try {
      await api.post("/emotion-logs", {
        petId,
        date: selectedDate,
        state: selectedEmotion,
        note: note.trim(),
      });
      showAlert("success", "Đã lưu cảm xúc");
      setSelectedEmotion("");
      setNote("");
      // reload data tuần & chart
      const [logsRes, chartRes] = await Promise.all([
        api.get(`/emotion-logs/${petId}`, { params: { week: selectedWeek } }),
        api.get(`/emotion-logs/${petId}/chart`, {
          params: { week: selectedWeek },
        }),
      ]);
      setWeeklyLogs(logsRes.data);
      setChartData(chartRes.data);
    } catch {
      showAlert("danger", "Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật note
  const saveNote = async (id) => {
    try {
      await api.put(`/emotion-logs/note/${id}`, { note: editNoteValue });
      showAlert("success", "Cập nhật ghi chú");
      setEditNoteId(null);
      const [logsRes, chartRes] = await Promise.all([
        api.get(`/emotion-logs/${petId}`, { params: { week: selectedWeek } }),
        api.get(`/emotion-logs/${petId}/chart`, {
          params: { week: selectedWeek },
        }),
      ]);
      setWeeklyLogs(logsRes.data);
      setChartData(chartRes.data);
    } catch {
      showAlert("danger", "Cập nhật thất bại");
    }
  };

  // Xóa log
  const deleteLog = async (id) => {
    if (!window.confirm("Xác nhận xóa?")) return;
    try {
      await api.delete(`/emotion-logs/${id}`);
      showAlert("success", "Đã xóa log");
      const [logsRes, chartRes] = await Promise.all([
        api.get(`/emotion-logs/${petId}`, { params: { week: selectedWeek } }),
        api.get(`/emotion-logs/${petId}/chart`, {
          params: { week: selectedWeek },
        }),
      ]);
      setWeeklyLogs(logsRes.data);
      setChartData(chartRes.data);
    } catch {
      showAlert("danger", "Xóa thất bại");
    }
  };

  // Hiển thị ngày đầu-cuối tuần
  const weekStart = selectedWeek
    ? moment(selectedWeek).format("DD/MM/YYYY")
    : "";
  const weekEnd = selectedWeek
    ? moment(selectedWeek).endOf("isoWeek").format("DD/MM/YYYY")
    : "";

  return (
    <div className="petEmotion">
      <button className="backButton" onClick={() => navigate(`/pets/${petId}`)}>
        ← Quay lại
      </button>

      <div className="datePickerContainer">
        <input
          type="date"
          className="datePicker"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <h2 className="header">
        Ngày hôm nay của {petInfo?.name || "..."} như thế nào?
      </h2>

      {alert.show && (
        <div
          className={
            alert.type === "success"
              ? "alert alertSuccess"
              : alert.type === "warning"
              ? "alert alertWarning"
              : "alert alertDanger"
          }
        >
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <div className="emotionGrid">
          {emotions.map((e) => (
            <div
              key={e.value}
              className={`emotionOption ${
                selectedEmotion === e.value ? "selected" : ""
              }`}
              onClick={() => setSelectedEmotion(e.value)}
            >
              <span className="icon">{e.icon}</span>
              <div className="label">{e.label}</div>
            </div>
          ))}
        </div>

        <textarea
          className="textarea"
          placeholder="Ghi chú (không bắt buộc)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button type="submit" className="button" disabled={loading}>
          {loading ? "..." : "Lưu"}
        </button>
      </form>

      {/* Toggle history */}
      <div className="historyToggle">
        <button
          onClick={() => setShowHistory((v) => !v)}
          className="button toggleBtn"
        >
          {showHistory ? "Ẩn lịch sử" : "Hiện lịch sử"}
        </button>
      </div>

      {/* History Section */}
      {showHistory && (
        <div className="historyList">
          <h3>
            Lịch sử tuần ({weekStart} – {weekEnd})
          </h3>
          <select
            value={selectedWeek || ""}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="datePicker"
          >
            {weeks.map((w) => (
              <option key={w} value={w}>
                {moment(w).format("DD/MM/YYYY")}
              </option>
            ))}
          </select>

          {weeklyLogs.length === 0 && <p>Chưa có ghi nhận.</p>}
          {weeklyLogs.map((log) => (
            <div key={log._id} className="historyLog">
              <div className="date">
                {moment(log.date).format("DD/MM/YYYY")}
              </div>
              <div className="state">
                {emotions.find((e) => e.value === log.state)?.icon} {log.state}
              </div>
              {editNoteId === log._id ? (
                <div className="editNote">
                  <input
                    value={editNoteValue}
                    onChange={(e) => setEditNoteValue(e.target.value)}
                  />
                  <button onClick={() => saveNote(log._id)}>Save</button>
                  <button onClick={() => setEditNoteId(null)}>Cancel</button>
                </div>
              ) : (
                <div className="noteActions">
                  <div className="noteText">{log.note}</div>
                  <button
                    onClick={() => {
                      setEditNoteId(log._id);
                      setEditNoteValue(log.note || "");
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteLog(log._id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Chart Section */}
      <div className="chart">
        <h3>Biểu đồ cột cảm xúc</h3>
        <svg viewBox="0 -20 360 260" className="chartSvg">
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#80b4ff" />
              <stop offset="100%" stopColor="#1a73e8" />
            </linearGradient>
          </defs>
          {(() => {
            const totalWidth = 320;
            const totalHeight = 160;
            const margin = 20;
            const barAreaWidth = totalWidth;
            const barWidth = (barAreaWidth / 7) * 0.6;
            const gap = (barAreaWidth - barWidth * 7) / 6;
            const maxIdx = emotions.length - 1;
            const labels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

            const points = labels.map((_, i) => {
              const date = moment(selectedWeek).add(i, "days");
              const entry = chartData.find((c) =>
                moment(c.date).isSame(date, "day")
              );
              const idx = entry
                ? emotions.findIndex((e) => e.value === entry.state)
                : null;
              const heightBar =
                idx !== null
                  ? ((maxIdx - idx) / maxIdx) * (totalHeight - 2 * margin)
                  : 0;
              const x = margin + i * (barWidth + gap);
              const y = margin + (totalHeight - 2 * margin) - heightBar;
              return [x + barWidth / 2, y];
            });

            return (
              <g>
                <polyline
                  points={points.map((p) => p.join(",")).join(" ")}
                  stroke="#1a73e8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {labels.map((day, i) => {
                  const [cx, cy] = points[i];
                  const date = moment(selectedWeek).add(i, "days");
                  const entry = chartData.find((c) =>
                    moment(c.date).isSame(date, "day")
                  );
                  const idx = entry
                    ? emotions.findIndex((e) => e.value === entry.state)
                    : null;
                  const heightBar =
                    idx !== null
                      ? ((maxIdx - idx) / maxIdx) * (totalHeight - 2 * margin)
                      : 0;
                  const x = margin + i * (barWidth + gap);
                  const y = margin + (totalHeight - 2 * margin) - heightBar;
                  return (
                    <g key={i}>
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={heightBar}
                        rx="6"
                        fill="url(#barGrad)"
                      />
                      <text
                        x={x + barWidth / 2}
                        y={totalHeight + margin - 4}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#444"
                      >
                        {day}
                      </text>
                      {entry && (
                        <>
                          <text
                            x={x + barWidth / 2}
                            y={y - 10}
                            textAnchor="middle"
                            fontSize="18"
                          >
                            {emotions[idx].icon}
                          </text>
                          <circle
                            cx={cx}
                            cy={cy}
                            r="4"
                            fill="#fff"
                            stroke="#1a73e8"
                            strokeWidth="2"
                          />
                        </>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}
