const MacroLog = require('../models/MacroLog');
const User = require('../models/User');

const logMacro = async (req, res) => {
  const { food, macros } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user || user.role !== 'member') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const macroLog = await MacroLog.create({
      member: user.profile._id,
      food,
      macros,
    });

    res.status(201).json(macroLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editMacro = async (req, res) => {
  const { logId, food, macros } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user || user.role !== 'member') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const macroLog = await MacroLog.findOneAndUpdate(
      { _id: logId, member: user.profile._id },
      { food, macros },
      { new: true }
    );

    if (!macroLog) {
      return res.status(404).json({ message: 'Macro log not found' });
    }

    res.status(200).json(macroLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMacro = async (req, res) => {
  const { logId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user || user.role !== 'member') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const macroLog = await MacroLog.findOneAndDelete({ _id: logId, member: user.profile._id });
    if (!macroLog) {
      return res.status(404).json({ message: 'Macro log not found' });
    }

    res.status(200).json({ message: 'Macro log deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMacroLogs = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user || user.role !== 'member') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const macroLogs = await MacroLog.find({ member: user.profile._id }).sort({ loggedAt: -1 });
    res.status(200).json(macroLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { logMacro, editMacro, deleteMacro, getMacroLogs };