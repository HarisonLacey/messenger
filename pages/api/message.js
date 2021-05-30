import User from "../../models/user";
import dbConnect from "../../util/mongodb";
import { getSession } from "next-auth/client";
import crypto from "crypto";

// save message api

export default async (req, res) => {
  class Message {
    constructor(type, id, name, email, city, message, date, code) {
      (this.type = type),
        (this.user_id = id),
        (this.user_profile = { name: name, email: email, city: city }),
        (this.message = message),
        (this.date = date),
        (this.code = code),
        (this.join = function () {
          return this.message + this.type;
        });
    }
  }
  const { message, id } = req.body;
  const session = await getSession({ req });
  if (session) {
    try {
      await dbConnect();
      const userRecieve = await User.findById(id),
        userSent = await User.findById(session.user.id);
      await userRecieve.messages.unshift(
        new Message(
          "from",
          userSent.id,
          userSent.name,
          userSent.email,
          userSent.city,
          message,
          new Date(),
          crypto.randomBytes(20).toString("hex")
        )
      );
      await userRecieve.save();
      await userSent.messages.unshift(
        new Message(
          "to",
          userRecieve.id,
          userRecieve.name,
          userRecieve.email,
          userRecieve.city,
          message,
          new Date(),
          crypto.randomBytes(20).toString("hex")
        )
      );
      await userSent.save();
      res.status(200).json({ message: "Message Sent!" });
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ message: "Try Again!" });
    }
  } else {
    res.status(400).json({ message: "Please login" });
  }
};
