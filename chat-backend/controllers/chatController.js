const { Op } = require("sequelize");
const config = require("../config/app");
const models = require("../models");
const { sequelize } = require("../models");
const User = models.User;
const Chat = models.Chat;
const ChatUser = models.ChatUser;
const Message = models.Message;

exports.chat = async (req, res) => {
  const user = await User.findOne({
    where: {
      id: req.user.id,
    },

    include: [
      {
        model: Chat,
        include: [
          {
            model: User,
            where: {
              [Op.not]: {
                id: req.user.id,
              },
            },
          },
          {
            model: Message,

            limit: 20,
            include: [
              {
                model: User,
                order: [[(Message, "id", "DESC")]],
              },
            ],
          },
        ],
      },
    ],
  });

  return res.json(user.Chats);
};

exports.create = async (req, res) => {
  const { partnerId } = req.body;

  const t = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      include: [
        {
          model: Chat,
          where: {
            type: "dual",
          },
          include: [
            {
              model: ChatUser,
              where: {
                userId: partnerId,
              },
            },
          ],
        },
      ],
    });

    if (user && user.Chats.length > 0) {
      return res.status(403).json({
        status: "Error",
        message: "Chat with this user has already existed!",
      });
    }

    const chat = await Chat.create({ type: "dual" }, { transaction: t });

    await ChatUser.bulkCreate(
      [
        {
          chatId: chat.id,
          userId: req.user.id,
        },
        {
          chatId: chat.id,
          userId: partnerId,
        },
      ],
      { transaction: t }
    );

    await t.commit();

    // const chatNew = await Chat.findOne({
    //   where: {
    //     id: chat.id,
    //   },
    //   include: [
    //     {
    //       model: Chat,
    //       include: [
    //         {
    //           model: User,
    //           where: {
    //             [Op.not]: {
    //               id: req.user.id,
    //             },
    //           },
    //         },
    //         {
    //           model: Message,
    //           limit: 20,
    //           order: [["id", "DESC"]],
    //         },
    //       ],
    //     },
    //   ],
    // });

    const chatNew = await Chat.findOne({
      where: {
        id: chat.id,
      },
      include: [
        {
          model: User,
          where: {
            [Op.not]: {
              id: req.user.id,
            },
          },
        },
        {
          model: Message,
        },
      ],
    });

    return res.send(chatNew);
  } catch (e) {
    await t.rollback();
    res.end(JSON.stringify({ status: "error", message: e.message }));
  }
};

exports.messages = async (req, res) => {
  const limit = 20;
  const page = req.query.page || 1;

  const offset = page > 1 ? page * limit : 0;

  const size = await Message.count();
  const messages = await Message.findAndCountAll({
    where: {
      chatId: req.query.id,
    },

    include: [
      {
        model: User,
      },
    ],
    limit,
    offset,
    order: [["id", "DESC"]],
  });

  const totalPages = Math.ceil(messages.count / limit);

  if (page > totalPages) {
    return res.json({ data: { messages: [] } });
  }

  const result = {
    messages: messages.rows,
    pagination: {
      page,
      totalPages,
      total: size,
    },
  };

  return res.json({ data: { ...result } });
};

exports.imageUpload = async (req, res) => {
  console.log("uploading image", req.file);
  if (req.file) {
    return res.json({ url: req.file.filename });
  }
  res.status(500).json({ message: "No image uploaded" });
  try {
  } catch (e) {
    res.end(JSON.stringify({ status: "error", message: e.message }));
  }
};

exports.deleteChat = async (req, res) => {
  try {
    await Chat.destroy({
      where: {
        id: req.params.id,
      },
    });

    return res.json({
      status: "success",
      messages: "Chat destroyed successfully",
    });
  } catch (err) {
    res.end(JSON.stringify({ status: "error", message: err.message }));
  }
};

exports.sendMessage = async (req, res) => {
  const { sendMessage, chatId } = req.body;
  const user = req.user;

  try {
    const message = await Message.create({
      type: "text",
      message: sendMessage,
      chatId,
      fromUserId: user.id,
    });

    res.json(message);
  } catch (e) {
    res.end(JSON.stringify({ status: "error", message: e.message }));
  }
};
