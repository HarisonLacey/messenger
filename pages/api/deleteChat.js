import User from "../../models/user";
import dbConnect from "../../util/mongodb";
import { getSession } from "next-auth/client";

// delete chate api

export default async (req, res) => {
  const { id } = req.body;
  const session = await getSession({ req });
  if (session) {
    try {
      await dbConnect();
      await User.findByIdAndUpdate(session.user.id, {
        $pull: { messages: { user_id: id } },
      });
      res.status(200).json({ message: "Chat deleted" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    res.status(400).json({ message: "please login" });
  }
};
