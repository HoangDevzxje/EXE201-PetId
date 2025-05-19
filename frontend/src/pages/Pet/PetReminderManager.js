import { useEffect, useState } from "react";
import reminderApi from "../../api/reminderApi";
import { useParams } from "react-router-dom";
import "./PetReminderManager.css";
import { Link } from "react-router-dom";

export default function PetReminderManager() {
  const { petId } = useParams();
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({
    _id: null,
    title: "",
    note: "",
    remindAt: "",
  });
  const [message, setMessage] = useState(null);

  const fetchReminders = async () => {
    try {
      const res = await reminderApi.getByPet(petId);
      setReminders(res.data);
    } catch {
      setMessage("Không thể tải nhắc nhở");
    }
  };

  useEffect(() => {
    if (petId) fetchReminders();
  }, [petId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (r) => {
    setForm({
      _id: r._id,
      title: r.title,
      note: r.note,
      remindAt: r.remindAt.slice(0, 16),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xoá nhắc nhở này?")) return;
    await reminderApi.delete(id);
    fetchReminders();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form._id) {
        await reminderApi.update(form._id, form);
        setMessage("Đã cập nhật nhắc nhở");
      } else {
        await reminderApi.create({ ...form, petId });
        setMessage("Đã tạo nhắc nhở mới");
      }
      setForm({ _id: null, title: "", note: "", remindAt: "" });
      fetchReminders();
    } catch (err) {
      setMessage("Lỗi khi lưu nhắc nhở");
    }
  };

  return (
    <div className="pet-reminder-container">
      <h3 className="title">📅 Quản lý nhắc lịch tiêm</h3>
      {message && <p className="error-message">{message}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Tiêu đề"
          className="input"
          required
        />
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Ghi chú"
          className="input"
        />
        <input
          type="datetime-local"
          name="remindAt"
          value={form.remindAt}
          onChange={handleChange}
          className="input"
          required
        />
        <button type="submit" className="submit-button">
          {form._id ? "Cập nhật" : "Thêm nhắc nhở"}
        </button>
      </form>

      <ul className="reminder-list">
        {reminders.map((r) => (
          <li key={r._id} className="reminder-item">
            <div>
              <strong>{r.title}</strong>
              <p>{r.note}</p>
              <p className="remind-time">
                🕒 {new Date(r.remindAt).toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="pet-actions">
              <button onClick={() => handleEdit(r)} className="edit-button">
                Sửa
              </button>
              <button
                onClick={() => handleDelete(r._id)}
                className="delete-button"
              >
                Xoá
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
