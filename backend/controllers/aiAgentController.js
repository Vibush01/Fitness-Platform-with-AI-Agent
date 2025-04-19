const User = require('../models/User');
const Member = require('../models/Member');
const MacroLog = require('../models/MacroLog');
const BodyProgress = require('../models/BodyProgress');
const ChatMessage = require('../models/ChatMessage');
const { aiIntents, matchIntent } = require('../utils/aiIntents');

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

    // Match the query to an intent
    const intent = matchIntent(query);
    const intentData = aiIntents[intent];
    const response = intentData.response(member, intent === 'diet' ? macroLogs : bodyProgress);

    // Store the user's message
    await ChatMessage.create({
      sender: userId,
      senderRole: user.role,
      recipientRole: 'ai',
      isAI: true,
      message: query,
    });

    // Store Vibush's response (AI message)
    const aiMessage = await ChatMessage.create({
      sender: userId, // Since AI isn't a user, we can use the same userId for simplicity
      senderRole: 'ai',
      recipient: userId,
      recipientRole: user.role,
      isAI: true,
      message: response,
    });

    res.status(200).json({ response, messageId: aiMessage._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAIChatHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user || user.role !== 'member') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const chatHistory = await ChatMessage.find({
      $or: [
        { sender: userId, recipientRole: 'ai', isAI: true },
        { recipient: userId, senderRole: 'ai', isAI: true },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(chatHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { chatWithAI, getAIChatHistory };