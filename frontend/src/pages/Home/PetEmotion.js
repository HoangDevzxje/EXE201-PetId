import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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

  // State cho lịch sử tuần
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [weeklyLogs, setWeeklyLogs] = useState([]);

  // State cho Calendar (theo tháng)
  const [allLogs, setAllLogs] = useState([]);
  const [emotionMap, setEmotionMap] = useState({});

  // State cho chỉnh sửa note
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteValue, setEditNoteValue] = useState("");

  // Toggle lịch sử
  const [showHistory, setShowHistory] = useState(false);

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

  // Gắn token vào header
  useEffect(() => {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token]);

  // Fetch pet info và các tuần có log
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/pets/${petId}`);
        setPetInfo(res.data);

        const weeksRes = await api.get(`/emotion-logs/${petId}/weeks`);
        setWeeks(weeksRes.data);

        const currentIsoWeek = moment().startOf("isoWeek").format("YYYY-MM-DD");
        if (weeksRes.data.includes(currentIsoWeek)) {
          setSelectedWeek(currentIsoWeek);
        } else if (weeksRes.data.length) {
          setSelectedWeek(weeksRes.data[0]);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [petId]);

  // --- CHỈNH: Fetch logs cho Calendar theo THÁNG ---
  useEffect(() => {
    (async () => {
      try {
        const monthParam = moment(selectedDate).format("YYYY-MM");
        const res = await api.get(`/emotion-logs/${petId}/month`, {
          params: { month: monthParam },
        });
        setAllLogs(res.data);
      } catch (e) {
        console.error("Lỗi fetch monthly logs:", e);
      }
    })();
  }, [petId, selectedDate]);

  // Map logs tháng → { 'YYYY-MM-DD': icon }
  useEffect(() => {
    const map = {};
    allLogs.forEach((log) => {
      const key = moment(log.date).format("YYYY-MM-DD");
      const emoIcon = emotions.find((e) => e.value === log.state)?.icon;
      if (emoIcon) map[key] = emoIcon;
    });
    setEmotionMap(map);
  }, [allLogs]);

  // Fetch weekly logs & chart khi đổi tuần
  useEffect(() => {
    if (!selectedWeek) return;
    (async () => {
      try {
        const [logsRes, chartRes] = await Promise.all([
          api.get(`/emotion-logs/${petId}`, {
            params: { week: selectedWeek },
          }),
          api.get(`/emotion-logs/${petId}/chart`, {
            params: { week: selectedWeek },
          }),
        ]);
        setWeeklyLogs(logsRes.data);
        setChartData(chartRes.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [selectedWeek, petId]);

  // Submit mới 1 log
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
      // reload lịch sử tuần và chart
      const [logsRes, chartRes] = await Promise.all([
        api.get(`/emotion-logs/${petId}`, {
          params: { week: selectedWeek },
        }),
        api.get(`/emotion-logs/${petId}/chart`, {
          params: { week: selectedWeek },
        }),
      ]);
      setWeeklyLogs(logsRes.data);
      setChartData(chartRes.data);
    } catch {
      showAlert(
        "success",
        "Bạn đã ghi chú hôm nay rồi. Hãy nhấn vào “Lịch sử” để thay đổi trạng thái."
      );
    } finally {
      setLoading(false);
    }
  };

  // Save note
  const saveNote = async (id) => {
    try {
      await api.put(`/emotion-logs/note/${id}`, { note: editNoteValue });
      showAlert("success", "Cập nhật ghi chú");
      setEditNoteId(null);
      // reload lại
      const [logsRes, chartRes] = await Promise.all([
        api.get(`/emotion-logs/${petId}`, {
          params: { week: selectedWeek },
        }),
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

  // Delete log
  const deleteLog = async (id) => {
    if (!window.confirm("Xác nhận xóa?")) return;
    try {
      await api.delete(`/emotion-logs/${id}`);
      showAlert("success", "Đã xóa log");
      const [logsRes, chartRes] = await Promise.all([
        api.get(`/emotion-logs/${petId}`, {
          params: { week: selectedWeek },
        }),
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

  // Tính range hiển thị tuần
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

      {/* Calendar với icon tháng */}
      <div className="datePickerContainer">
        <Calendar
          onClickDay={(date) =>
            setSelectedDate(moment(date).format("YYYY-MM-DD"))
          }
          value={new Date(selectedDate)}
          tileContent={({ date, view }) =>
            view === "month" &&
            emotionMap[moment(date).format("YYYY-MM-DD")] ? (
              <span className="calendar-icon">
                {emotionMap[moment(date).format("YYYY-MM-DD")]}
              </span>
            ) : null
          }
          tileClassName={({ date, view }) =>
            view === "month" && emotionMap[moment(date).format("YYYY-MM-DD")]
              ? "hasEmotion"
              : null
          }
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

      {/* Form nhập cảm xúc */}
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
          placeholder={`Nhật ký thường ngày của ${petInfo?.name || "..."}`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button type="submit" className="button" disabled={loading}>
          {loading ? "..." : "Lưu"}
        </button>
      </form>

      {/* Toggle lịch sử */}
      <div className="historyToggle">
        <button
          onClick={() => setShowHistory((v) => !v)}
          className="button toggleBtn"
        >
          {showHistory ? "Ẩn lịch sử" : "Hiện lịch sử"}
        </button>
      </div>

      {/* Lịch sử tuần */}
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
      <div className="chart" style={{ width: "720px", margin: "0 auto" }}>
        <h3>Biểu đồ cảm xúc</h3>
        <svg
          viewBox="0 -40 720 520"
          width="100%"
          height="auto"
          className="chartSvg"
        >
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#80b4ff" />
              <stop offset="100%" stopColor="#1a73e8" />
            </linearGradient>
          </defs>
          {(() => {
            const totalWidth = 320 * 2;
            const totalHeight = 160 * 2;
            const margin = 20 * 2;
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
              const x =
                margin +
                i * (totalWidth / 7 + (totalWidth - (totalWidth / 7) * 7) / 6);
              const y = margin + (totalHeight - 2 * margin) - heightBar;
              return [x, y];
            });

            return (
              <g>
                <polyline
                  points={points.map((p) => p.join(",")).join(" ")}
                  stroke="url(#lineGrad)"
                  strokeWidth={3 * 2}
                  fill="none"
                  strokeLinecap="round"
                />
                {labels.map((day, i) => {
                  const [cx, cy] = points[i];
                  return (
                    <g key={i}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4 * 2}
                        fill="#fff"
                        stroke="#1a73e8"
                        strokeWidth={2 * 2}
                      />
                      <text
                        x={cx}
                        y={totalHeight + margin - 4 * 2}
                        textAnchor="middle"
                        fontSize={12 * 2}
                        fill="#444"
                      >
                        {day}
                      </text>
                      {chartData.find((c) =>
                        moment(c.date).isSame(
                          moment(selectedWeek).add(i, "days"),
                          "day"
                        )
                      ) && (
                        <text
                          x={cx}
                          y={cy - 10 * 2}
                          textAnchor="middle"
                          fontSize={18 * 2}
                        >
                          {
                            emotions[
                              emotions.findIndex(
                                (e) =>
                                  e.value ===
                                  chartData.find((c) =>
                                    moment(c.date).isSame(
                                      moment(selectedWeek).add(i, "days"),
                                      "day"
                                    )
                                  ).state
                              )
                            ].icon
                          }
                        </text>
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
