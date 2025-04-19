const User = require('../models/User');
const Member = require('../models/Member');
const MacroLog = require('../models/MacroLog');
const BodyProgress = require('../models/BodyProgress');

const chatWithAI = async (req, res) => {
  const { query } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user || user.role !== 'member') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const member = await Member.findById(user.profile._id);
    const macroLogs = await MacroLog.find({ member: member._id }).sort({ loggedAt: -1 }).limit(5);
    const bodyProgress = await BodyProgress.find({ member: member._id }).sort({ loggedAt: -1 }).limit(1);

    // Simulate AI responses based on query and member data
    let response;
    if (query.toLowerCase().includes('diet')) {
      const recentMacros = macroLogs[0]?.macros || { calories: 0, protein: 0, carbs: 0, fats: 0 };
      response = `Hi ${member.name}! Based on your recent macro logs (Calories: ${recentMacros.calories}, Protein: ${recentMacros.protein}g), I suggest adding more protein-rich foods like eggs or lentils to your diet. Aim for 1.6-2.2g of protein per kg of body weight daily.`;
    } else if (query.toLowerCase().includes('workout')) {
      const latestProgress = bodyProgress[0] || { weight: 0, muscleMass: 0, fatPercentage: 0 };
      response = `Hi ${member.name}! Considering your latest body progress (Weight: ${latestProgress.weight}kg, Fat: ${latestProgress.fatPercentage}%), I recommend a balanced workout plan: 3 days of strength training (focus on compound lifts) and 2 days of cardio (30 mins each).`;
    } else {
      response = `Hi ${member.name}! I'm Vibush, your fitness assistant. I can help with diet or workout plans. What would you like to know?`;
    }

    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { chatWithAI };