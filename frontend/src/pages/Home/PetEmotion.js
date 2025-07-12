import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import api from "../../api/baseApi";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import "moment/locale/vi";
import "./PetEmotion.css";
moment.locale("vi");

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

  // State cho thống kê
  const [showStats, setShowStats] = useState(false);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [statsType, setStatsType] = useState("week"); // "week" hoặc "month"
  const [statMonth, setStatMonth] = useState(moment().format("YYYY-MM"));

  const emotions = [
    { value: "vui vẻ", label: "Vui vẻ", icon: "🐶" },
    { value: "ủ rũ", label: "Ủ rũ", icon: "😿" },
    { value: "hoảng sợ", label: "Hoảng sợ", icon: "🙀" },
    { value: "cáu kỉnh", label: "Cáu kỉnh", icon: "😾" },
    { value: "bồn chồn", label: "Bồn chồn", icon: "🐕" },
    { value: "mệt mỏi", label: "Mệt mỏi", icon: "😿" },
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

  // Fetch thống kê theo tuần
  const fetchWeeklyStats = async (week) => {
    try {
      const res = await api.get(`/emotion-logs/${petId}/stats/week`, {
        params: { week: week || selectedWeek },
      });
      setWeeklyStats(res.data);
    } catch (e) {
      console.error("Lỗi fetch weekly stats:", e);
    }
  };

  // Fetch thống kê theo tháng
  const fetchMonthlyStats = async (month) => {
    try {
      const monthParam = month || statMonth;
      const res = await api.get(`/emotion-logs/${petId}/stats/month`, {
        params: { month: monthParam },
      });
      setMonthlyStats(res.data);
    } catch (e) {
      console.error("Lỗi fetch monthly stats:", e);
    }
  };

  // Fetch thống kê khi toggle
  useEffect(() => {
    if (showStats) {
      if (statsType === "week") {
        fetchWeeklyStats();
      } else {
        fetchMonthlyStats();
      }
    }
  }, [showStats, statsType, selectedWeek, statMonth]);

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

      // Refresh data
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

      // Refresh monthly data
      const monthParam = moment(selectedDate).format("YYYY-MM");
      const monthRes = await api.get(`/emotion-logs/${petId}/month`, {
        params: { month: monthParam },
      });
      setAllLogs(monthRes.data);

      // Refresh stats if showing
      if (showStats) {
        if (statsType === "week") fetchWeeklyStats();
        else fetchMonthlyStats();
      }
    } catch {
      showAlert(
        "success",
        'Bạn đã ghi chú hôm nay rồi. Hãy nhấn vào "Lịch sử" để thay đổi trạng thái.'
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

      // Refresh data
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

      // Refresh monthly data
      const monthParam = moment(selectedDate).format("YYYY-MM");
      const monthRes = await api.get(`/emotion-logs/${petId}/month`, {
        params: { month: monthParam },
      });
      setAllLogs(monthRes.data);

      // Refresh stats if showing
      if (showStats) {
        if (statsType === "week") fetchWeeklyStats();
        else fetchMonthlyStats();
      }
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

      // Refresh data
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

      // Refresh monthly data
      const monthParam = moment(selectedDate).format("YYYY-MM");
      const monthRes = await api.get(`/emotion-logs/${petId}/month`, {
        params: { month: monthParam },
      });
      setAllLogs(monthRes.data);

      // Refresh stats if showing
      if (showStats) {
        if (statsType === "week") fetchWeeklyStats();
        else fetchMonthlyStats();
      }
    } catch {
      showAlert("danger", "Xóa thất bại");
    }
  };

  // Render thống kê tuần
  const renderWeeklyStats = () => {
    if (!weeklyStats) return <div>Đang tải...</div>;

    const { period, overview, dailyBreakdown } = weeklyStats;

    return (
      <div className="statsContainer">
        <h3>
          Thống kê tuần ({period.startDate} - {period.endDate})
        </h3>

        <div className="statsOverview">
          <div className="statCard">
            <h4>Tổng số ghi chú</h4>
            <span className="statNumber">{overview.totalLogs}</span>
          </div>

          <div className="statCard">
            <h4>Trạng thái phổ biến</h4>
            <span className="statEmotion">
              {overview.mostCommonState && (
                <>
                  {
                    emotions.find((e) => e.value === overview.mostCommonState)
                      ?.icon
                  }
                  {overview.mostCommonState}
                </>
              )}
            </span>
          </div>
        </div>

        <div className="statsDistribution">
          <h4>Phân bố cảm xúc</h4>
          <div className="distributionChart">
            {Object.entries(overview.stateDistribution).map(([state, data]) => (
              <div key={state} className="distributionItem">
                <span className="distributionIcon">
                  {emotions.find((e) => e.value === state)?.icon}
                </span>
                <span className="distributionLabel">{state}</span>
                <span className="distributionCount">{data.count}</span>
                <span className="distributionPercent">{data.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dailyBreakdown">
          <h4>Theo ngày trong tuần</h4>
          <div className="dailyGrid">
            {Object.entries(dailyBreakdown).map(([day, states]) => (
              <div key={day} className="dailyItem">
                <div className="dayName">{day}</div>
                <div className="dayStates">
                  {Object.entries(states).map(([state, count]) => (
                    <span key={state} className="dayState">
                      {emotions.find((e) => e.value === state)?.icon} {count}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render thống kê tháng
  const renderMonthlyStats = () => {
    if (!monthlyStats) return <div>Đang tải...</div>;

    const { period, overview, weeklyBreakdown, periodBreakdown } = monthlyStats;

    return (
      <div className="statsContainer">
        <h3>Thống kê tháng {period.monthName}</h3>

        <div className="statsOverview">
          <div className="statCard">
            <h4>Tổng số ghi chú</h4>
            <span className="statNumber">{overview.totalLogs}</span>
          </div>

          <div className="statCard">
            <h4>Trung bình/ngày</h4>
            <span className="statNumber">{overview.logsPerDay}</span>
          </div>

          <div className="statCard">
            <h4>Trạng thái phổ biến</h4>
            <span className="statEmotion">
              {overview.mostCommonState && (
                <>
                  {
                    emotions.find((e) => e.value === overview.mostCommonState)
                      ?.icon
                  }
                  {overview.mostCommonState}
                </>
              )}
            </span>
          </div>
        </div>

        <div className="statsDistribution">
          <h4>Phân bố cảm xúc</h4>
          <div className="distributionChart">
            {Object.entries(overview.stateDistribution).map(([state, data]) => (
              <div key={state} className="distributionItem">
                <span className="distributionIcon">
                  {emotions.find((e) => e.value === state)?.icon}
                </span>
                <span className="distributionLabel">{state}</span>
                <span className="distributionCount">{data.count}</span>
                <span className="distributionPercent">{data.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="weeklyBreakdown">
          <h4>Theo tuần trong tháng</h4>
          <div className="weeklyGrid">
            {Object.entries(weeklyBreakdown).map(([week, states]) => (
              <div key={week} className="weeklyItem">
                <div className="weekName">{week}</div>
                <div className="weekStates">
                  {Object.entries(states).map(([state, count]) => (
                    <span key={state} className="weekState">
                      {emotions.find((e) => e.value === state)?.icon} {count}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="periodBreakdown">
          <h4>Theo giai đoạn</h4>
          <div className="periodGrid">
            {Object.entries(periodBreakdown).map(([period, states]) => (
              <div key={period} className="periodItem">
                <div className="periodName">{period}</div>
                <div className="periodStates">
                  {Object.entries(states).map(([state, count]) => (
                    <span key={state} className="periodState">
                      {emotions.find((e) => e.value === state)?.icon} {count}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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

      <div className="topSection">
        <div className="chart">
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
              const totalWidth = 640;
              const totalHeight = 320;
              const margin = 40;
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

                const x = margin + i * ((totalWidth - 2 * margin) / 6);
                const y = margin + (totalHeight - 2 * margin) - heightBar;

                return { x, y, entry };
              });

              return (
                <g>
                  <polyline
                    points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                    stroke="url(#lineGrad)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {points.map(({ x, y, entry }, i) => (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        fill="#fff"
                        stroke="#1a73e8"
                        strokeWidth="4"
                      />
                      <text
                        x={x}
                        y={totalHeight + margin - 8}
                        textAnchor="middle"
                        fontSize="24"
                        fill="#444"
                      >
                        {labels[i]}
                      </text>
                      {entry && (
                        <text
                          x={x}
                          y={y - 20}
                          textAnchor="middle"
                          fontSize="36"
                        >
                          {emotions.find((e) => e.value === entry.state)
                            ?.icon || ""}
                        </text>
                      )}
                    </g>
                  ))}
                </g>
              );
            })()}
          </svg>
        </div>

        <div className="datePickerContainer">
          <Calendar
            locale="vi-VN"
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
            formatMonthYear={(locale, date) => moment(date).format("MMMM YYYY")}
            formatShortWeekday={(locale, date) => moment(date).format("dd")}
          />
        </div>
      </div>

      {/* Toggle buttons */}
      <div className="toggleButtons">
        <button
          onClick={() => setShowHistory((v) => !v)}
          className={`button toggleBtn ${showHistory ? "active" : ""}`}
        >
          {showHistory ? "Ẩn lịch sử" : "Hiện lịch sử"}
        </button>

        <button
          onClick={() => setShowStats((v) => !v)}
          className={`button toggleBtn ${showStats ? "active" : ""}`}
        >
          {showStats ? "Ẩn thống kê" : "Hiện thống kê"}
        </button>
      </div>

      {/* Thống kê */}
      {showStats && (
        <div className="statsSection">
          <div className="statsTypeSelector">
            <button
              onClick={() => setStatsType("week")}
              className={`button ${statsType === "week" ? "active" : ""}`}
            >
              Theo tuần
            </button>
            <button
              onClick={() => setStatsType("month")}
              className={`button ${statsType === "month" ? "active" : ""}`}
            >
              Theo tháng
            </button>
          </div>

          {/* Selector controls */}
          {statsType === "week" ? (
            <div className="selectorRow">
              <label>Chọn tuần:</label>
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
              <button onClick={() => fetchWeeklyStats()} className="button">
                Xem
              </button>
            </div>
          ) : (
            <div className="selectorRow">
              <label>Chọn tháng:</label>
              <select
                value={statMonth}
                onChange={(e) => setStatMonth(e.target.value)}
                className="datePicker"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const monthValue = moment()
                    .subtract(i, "months")
                    .format("YYYY-MM");
                  const monthName = moment()
                    .subtract(i, "months")
                    .format("MMMM YYYY");
                  return (
                    <option key={monthValue} value={monthValue}>
                      {monthName}
                    </option>
                  );
                })}
              </select>
              <button onClick={() => fetchMonthlyStats()} className="button">
                Xem
              </button>
            </div>
          )}

          {statsType === "week" ? renderWeeklyStats() : renderMonthlyStats()}
        </div>
      )}

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
          {weeklyLogs.length === 0 ? (
            <p>Chưa có ghi nhận.</p>
          ) : (
            weeklyLogs.map((log) => (
              <div key={log._id} className="historyLog">
                <div className="date">
                  {moment(log.date).format("DD/MM/YYYY")}
                </div>
                <div className="state">
                  {emotions.find((e) => e.value === log.state)?.icon}{" "}
                  {log.state}
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
                      Sửa ghi chú
                    </button>
                    <button onClick={() => deleteLog(log._id)}>
                      Xóa ghi chú
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

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
    </div>
  );
}
