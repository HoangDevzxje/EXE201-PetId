const PetEmotionLog = require("../models/PetEmotionLog");
const moment = require("moment");

const createLog = async (req, res) => {
  try {
    const { petId, state, note, date } = req.body;
    const logDate = date ? moment(date).toDate() : new Date();
    const dayStart = moment(logDate).startOf("day").toDate();
    const dayEnd = moment(logDate).endOf("day").toDate();
    const exists = await PetEmotionLog.findOne({
      pet: petId,
      date: { $gte: dayStart, $lte: dayEnd },
    });

    if (exists) {
      return res
        .status(400)
        .json({ message: "Đã ghi trạng thái cho ngày này rồi" });
    }

    const log = await PetEmotionLog.create({
      pet: petId,
      state,
      note,
      date: logDate,
    });

    res.status(201).json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi tạo log cảm xúc", error });
  }
};

// Lấy log cảm xúc theo tuần
const getWeeklyLogs = async (req, res) => {
  try {
    const { petId } = req.params;
    const weekQuery = req.query.week || moment().format("YYYY-MM-DD");

    const targetDate = moment(weekQuery);
    const startOfWeek = targetDate.clone().startOf("isoWeek").toDate(); // Thứ 2
    const endOfWeek = targetDate.clone().endOf("isoWeek").toDate(); // Chủ nhật

    const logs = await PetEmotionLog.find({
      pet: petId,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    }).sort({ date: 1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy log theo tuần", error });
  }
};

// Lấy danh sách các tuần có log
const getWeeksWithLogs = async (req, res) => {
  try {
    const { petId } = req.params;

    const logs = await PetEmotionLog.find({ pet: petId }).select("date");
    const weeks = logs.map((log) =>
      moment(log.date).startOf("isoWeek").format("YYYY-MM-DD")
    );

    const uniqueWeeks = [...new Set(weeks)];
    res.status(200).json(uniqueWeeks);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách tuần", error });
  }
};
// Xoá log cảm xúc theo ID
const deleteLog = async (req, res) => {
  try {
    const { logId } = req.params;

    const log = await PetEmotionLog.findByIdAndDelete(logId);
    if (!log) {
      return res.status(404).json({ message: "Không tìm thấy log để xoá" });
    }

    res.status(200).json({ message: "Đã xoá log thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xoá log", error });
  }
};

// Cập nhật ghi chú (note) cho log
const updateNote = async (req, res) => {
  try {
    const { logId } = req.params;
    const { note } = req.body;

    const log = await PetEmotionLog.findByIdAndUpdate(
      logId,
      { note },
      { new: true }
    );

    if (!log) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy log để cập nhật" });
    }

    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật ghi chú", error });
  }
};

// Trả về dữ liệu dạng biểu đồ theo tuần (group by trạng thái mỗi ngày)
const getChartData = async (req, res) => {
  try {
    const { petId } = req.params;
    const weekQuery = req.query.week || moment().format("YYYY-MM-DD");

    const targetDate = moment(weekQuery);
    const startOfWeek = targetDate.clone().startOf("isoWeek").toDate();
    const endOfWeek = targetDate.clone().endOf("isoWeek").toDate();

    const logs = await PetEmotionLog.find({
      pet: petId,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    // Trả về dạng { date: 'YYYY-MM-DD', state: 'vui vẻ' }
    const chartData = logs.map((log) => ({
      date: moment(log.date).format("YYYY-MM-DD"),
      state: log.state,
    }));

    res.status(200).json(chartData);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy dữ liệu biểu đồ", error });
  }
};

module.exports = {
  createLog,
  getWeeklyLogs,
  getWeeksWithLogs,
  deleteLog,
  updateNote,
  getChartData,
};
