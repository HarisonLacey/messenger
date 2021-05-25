import User from "../../models/user";
import dbConnect from "../../util/mongodb";
import { getSession } from "next-auth/client";

export default async (req, res) => {
  const { id } = req.body;
  const session = await getSession({ req });
  console.log(id)
  if (session) {
    try {
      await dbConnect();
      await User.findByIdAndUpdate(session.user.id, {
        $pull: { messages: { code: id } },
      });
      res.status(200).json({ message: "Message Deleted!" });
    } catch (err) {
      res.status(400).json({ message: "Try Again!" });
    }
  } else {
    res.status(400).json({ message: "please login" });
  }
};
