import User from "../../models/user";
import dbConnect from "../../util/mongodb";
import { getSession } from "next-auth/client";

// api to find user via session and make updates
export default async (req, res) => {
  const { name, city } = req.body;
  const session = await getSession({ req });
  if (session) {
    try {
      await dbConnect();
      await User.findByIdAndUpdate(session.user.id, {
        name: name,
        city: city,
        newUser: false,
      });
      res.status(200).json({ message: "Profile Saved!" });
    } catch (err) {
      console.log(err.message);
      res.status(400).json({ message: "Try Again!" });
    }
  } else {
    res.status(400).json({ message: "please login" });
  }
};
