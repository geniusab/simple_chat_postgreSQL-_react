const { Op } = require("sequelize");
const config = require("../config/app");
const User = require("../models").User;
const Chat = require("../models").Chat;
const ChatUser = require("../models").ChatUser;
const Message = require("../models").Message;
const { sequelize } = require("../models");

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
            include: [
              {
                model: User,
              },
            ],
            limit: 20,
            order: [["id", "DESC"]],
          },
        ],
      },
    ],
  });

  return res.send(user.Chats);
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
  const limit = 10;
  const page = req.query.page || 1;

  const offset = page > 1 ? page * limit : 0;

  const messages = await Message.findAndCountAll({
    where: {
      chatId: req.query.id,
    },
    limit,
    offset,
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
    },
  };

  return res.json({ data: { ...result } });
};

// exports.deleteChat = async (req, res) => {
//   try {
//     await Chat.destroy({
//       where: {
//         id: req.params.id,
//       },
//     });

//     return res.json({
//       status: "success",
//       messages: "Chat destroyed successfully",
//     });
//   } catch (err) {
//     res.end(JSON.stringify({ status: "error", message: e.message }));
//   }
// };

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

    // res.json(message.get({ raw: true }));
    res.json(message);
  } catch (e) {
    res.end(JSON.stringify({ status: "error", message: e.message }));
  }
};
