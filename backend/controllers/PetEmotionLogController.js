// Updated PetEmotionLogController to support selecting previous/next weeks or months via query parameters
const PetEmotionLog = require("../models/PetEmotionLog");
const moment = require("moment");

// Helper to parse targetDate for weeks
function parseWeekTarget(weekQuery, weekNumber, offsetWeek) {
  if (weekQuery) {
    return moment(weekQuery, "YYYY-MM-DD");
  }
  if (weekNumber) {
    return moment().isoWeek(parseInt(weekNumber, 10));
  }
  if (offsetWeek) {
    return moment().add(parseInt(offsetWeek, 10), "weeks");
  }
  return moment();
}

// Helper to parse targetMonth for months
function parseMonthTarget(monthQuery, monthNumber, offsetMonth, year) {
  if (monthQuery) {
    return moment(monthQuery, "YYYY-MM");
  }
  if (monthNumber) {
    const yr = year ? parseInt(year, 10) : moment().year();
    return moment()
      .year(yr)
      .month(parseInt(monthNumber, 10) - 1);
  }
  if (offsetMonth) {
    return moment().add(parseInt(offsetMonth, 10), "months");
  }
  return moment();
}

// Create emotion log (one per day)
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

// Get logs by week
const getWeeklyLogs = async (req, res) => {
  try {
    const { petId } = req.params;
    const { week, weekNumber, offsetWeek } = req.query;
    const targetDate = parseWeekTarget(week, weekNumber, offsetWeek);
    const startOfWeek = targetDate.clone().startOf("isoWeek").toDate();
    const endOfWeek = targetDate.clone().endOf("isoWeek").toDate();

    const logs = await PetEmotionLog.find({
      pet: petId,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    }).sort({ date: 1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy log theo tuần", error });
  }
};

// Get emotion chart data by week (date + state)
const getChartData = async (req, res) => {
  try {
    const { petId } = req.params;
    const { week, weekNumber, offsetWeek } = req.query;
    const targetDate = parseWeekTarget(week, weekNumber, offsetWeek);
    const startOfWeek = targetDate.clone().startOf("isoWeek").toDate();
    const endOfWeek = targetDate.clone().endOf("isoWeek").toDate();

    const logs = await PetEmotionLog.find({
      pet: petId,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const chartData = logs.map((log) => ({
      date: moment(log.date).format("YYYY-MM-DD"),
      state: log.state,
    }));

    res.status(200).json(chartData);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy dữ liệu biểu đồ", error });
  }
};

// Get logs by month
const getMonthlyLogs = async (req, res) => {
  try {
    const { petId } = req.params;
    const { month, monthNumber, offsetMonth, year } = req.query;
    const targetMonth = parseMonthTarget(month, monthNumber, offsetMonth, year);
    const startOfMonth = targetMonth.clone().startOf("month").toDate();
    const endOfMonth = targetMonth.clone().endOf("month").toDate();

    const logs = await PetEmotionLog.find({
      pet: petId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ date: 1 });

    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy log theo tháng", error });
  }
};

// Get weeks list with logs (no change needed)
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

// Delete
const deleteLog = async (req, res) => {
  try {
    const { logId } = req.params;
    const log = await PetEmotionLog.findByIdAndDelete(logId);
    if (!log)
      return res.status(404).json({ message: "Không tìm thấy log để xoá" });
    res.status(200).json({ message: "Đã xoá log thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xoá log", error });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    const { logId } = req.params;
    const { note } = req.body;
    const log = await PetEmotionLog.findByIdAndUpdate(
      logId,
      { note },
      { new: true }
    );
    if (!log)
      return res
        .status(404)
        .json({ message: "Không tìm thấy log để cập nhật" });
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật ghi chú", error });
  }
};

// Weekly stats
const getWeeklyStats = async (req, res) => {
  try {
    const { petId } = req.params;
    const { week, weekNumber, offsetWeek } = req.query;
    const targetDate = parseWeekTarget(week, weekNumber, offsetWeek);
    const startOfWeek = targetDate.clone().startOf("isoWeek").toDate();
    const endOfWeek = targetDate.clone().endOf("isoWeek").toDate();

    const logs = await PetEmotionLog.find({
      pet: petId,
      date: { $gte: startOfWeek, $lte: endOfWeek },
    });
    const stateStats = {};
    logs.forEach((log) => {
      stateStats[log.state] = (stateStats[log.state] || 0) + 1;
    });
    const totalLogs = logs.length;
    const percentageStats = {};
    Object.keys(stateStats).forEach((state) => {
      percentageStats[state] = {
        count: stateStats[state],
        percentage:
          totalLogs > 0
            ? ((stateStats[state] / totalLogs) * 100).toFixed(1)
            : 0,
      };
    });
    const mostCommonState =
      totalLogs > 0
        ? Object.keys(stateStats).reduce((a, b) =>
            stateStats[a] > stateStats[b] ? a : b
          )
        : null;
    const daysOfWeek = [
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
      "Chủ nhật",
    ];
    const dailyStats = {};
    logs.forEach((log) => {
      const dayName = daysOfWeek[moment(log.date).isoWeekday() - 1];
      dailyStats[dayName] = dailyStats[dayName] || {};
      dailyStats[dayName][log.state] =
        (dailyStats[dayName][log.state] || 0) + 1;
    });

    res.status(200).json({
      period: {
        startDate: moment(startOfWeek).format("YYYY-MM-DD"),
        endDate: moment(endOfWeek).format("YYYY-MM-DD"),
        weekNumber: targetDate.isoWeek(),
      },
      overview: {
        totalLogs,
        mostCommonState,
        stateDistribution: percentageStats,
      },
      dailyBreakdown: dailyStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy thống kê theo tuần", error });
  }
};

// Monthly stats
const getMonthlyStats = async (req, res) => {
  try {
    const { petId } = req.params;
    const { month, monthNumber, offsetMonth, year } = req.query;
    const targetMonth = parseMonthTarget(month, monthNumber, offsetMonth, year);
    const startOfMonth = targetMonth.clone().startOf("month").toDate();
    const endOfMonth = targetMonth.clone().endOf("month").toDate();

    const logs = await PetEmotionLog.find({
      pet: petId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });
    const stateStats = {};
    logs.forEach((log) => {
      stateStats[log.state] = (stateStats[log.state] || 0) + 1;
    });
    const totalLogs = logs.length;
    const percentageStats = {};
    Object.keys(stateStats).forEach((state) => {
      percentageStats[state] = {
        count: stateStats[state],
        percentage:
          totalLogs > 0
            ? ((stateStats[state] / totalLogs) * 100).toFixed(1)
            : 0,
      };
    });
    const mostCommonState =
      totalLogs > 0
        ? Object.keys(stateStats).reduce((a, b) =>
            stateStats[a] > stateStats[b] ? a : b
          )
        : null;

    // Weekly breakdown within month
    const weeklyStats = {};
    logs.forEach((log) => {
      const weekOfMonth = Math.ceil(moment(log.date).date() / 7);
      const key = `Tuần ${weekOfMonth}`;
      weeklyStats[key] = weeklyStats[key] || {};
      weeklyStats[key][log.state] = (weeklyStats[key][log.state] || 0) + 1;
    });

    // Day-range breakdown
    const dayRangeStats = {};
    logs.forEach((log) => {
      const day = moment(log.date).date();
      let range;
      if (day <= 10) range = "Đầu tháng (1-10)";
      else if (day <= 20) range = "Giữa tháng (11-20)";
      else range = "Cuối tháng (21-31)";
      dayRangeStats[range] = dayRangeStats[range] || {};
      dayRangeStats[range][log.state] =
        (dayRangeStats[range][log.state] || 0) + 1;
    });

    // Daily trend
    const dailyTrend = {};
    logs.forEach((log) => {
      dailyTrend[moment(log.date).format("YYYY-MM-DD")] = log.state;
    });

    res.status(200).json({
      period: {
        month: targetMonth.format("YYYY-MM"),
        monthName: targetMonth.format("MM/YYYY"),
        daysInMonth: targetMonth.daysInMonth(),
      },
      overview: {
        totalLogs,
        logsPerDay:
          totalLogs > 0
            ? (totalLogs / targetMonth.daysInMonth()).toFixed(1)
            : 0,
        mostCommonState,
        stateDistribution: percentageStats,
      },
      weeklyBreakdown: weeklyStats,
      periodBreakdown: dayRangeStats,
      dailyTrend,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi lấy thống kê theo tháng", error });
  }
};

module.exports = {
  createLog,
  getWeeklyLogs,
  getWeeksWithLogs,
  getChartData,
  getMonthlyLogs,
  deleteLog,
  updateNote,
  getWeeklyStats,
  getMonthlyStats,
};
