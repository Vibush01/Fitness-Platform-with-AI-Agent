const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Member = require('../models/Member');

const sendMessage = async (req, res) => {
  const { recipientId, recipientRole, message } = req.body;
  const senderId = req.user.id;

  try {
    const sender = await User.findById(senderId).populate('profile');
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Validate communication rules
    if (sender.role === 'gym' && recipientRole !== 'trainer') {
      return res.status(403).json({ message: 'Gym can only message trainers' });
    }
    if (sender.role === 'trainer') {
      if (recipientRole === 'gym') {
        const trainer = await Trainer.findById(sender.profile._id);
        if (!trainer.gym || trainer.gym.toString() !== recipient.profile.toString()) {
          return res.status(403).json({ message: 'Trainer can only message their gym' });
        }
      } else if (recipientRole === 'member') {
        const member = await Member.findById(recipient.profile);
        const trainer = await Trainer.findById(sender.profile._id);
        if (!member.gym || !trainer.gym || member.gym.toString() !== trainer.gym.toString()) {
          return res.status(403).json({ message: 'Trainer can only message members of their gym' });
        }
      } else {
        return res.status(403).json({ message: 'Invalid recipient role for trainer' });
      }
    }
    if (sender.role === 'member' && recipientRole !== 'trainer') {
      return res.status(403).json({ message: 'Member can only message trainers' });
    }
    if (sender.role === 'member') {
      const member = await Member.findById(sender.profile._id);
      const trainer = await Trainer.findById(recipient.profile);
      if (!member.gym || !trainer.gym || member.gym.toString() !== trainer.gym.toString()) {
        return res.status(403).json({ message: 'Member can only message trainers of their gym' });
      }
    }

    const chatMessage = await ChatMessage.create({
      sender: senderId,
      senderRole: sender.role,
      recipient: recipientId,
      recipientRole,
      message,
    });

    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.params;

  try {
    const messages = await ChatMessage.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getMessages };