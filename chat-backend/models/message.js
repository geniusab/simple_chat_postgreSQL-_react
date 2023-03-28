"use strict";
const { Model } = require("sequelize");
const config = require("../config/app");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Chat, { foreignKey: "chatId" });
    }
  }
  Message.init(
    {
      type: DataTypes.STRING,
      message: {
        type: DataTypes.TEXT,
        get() {
          const type = this.getDateValue("type");
          const id = this.getDateValue("chatId");
          const content = this.getDateValue("message");
          return type === "text"
            ? content
            : `${config.appUrl}:${config.appPort}/chat/${id}/${content}`;
        },
      },
      chatId: DataTypes.INTEGER,
      formUserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
