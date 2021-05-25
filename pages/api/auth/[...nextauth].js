import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import User from "../../../models/user";

const options = {
  site: process.env.NEXTAUTH_URL,
  providers: [
    // email provider setup
    Providers.Email({
      server: {
        port: 465,
        host: "smtp.gmail.com",
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      from: process.env.EMAIL_USERNAME,
    }),
    // google provider setup
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT,
    }),
    // facebook provider setup
    Providers.Facebook({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_CLIENT,
    }),
  ],
  // database
  database: process.env.MONGODB_URI,
  // session jwt
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
  },
  // jwt secret
  jwt: {
    secret: process.env.SECRET,
  },
  callbacks: {
    // callback to save user id to session
    session: async (session, token) => {
      session.user.id = token.sub;
      session.user.newUser = token.newUser;
      try {
        let findUser = await User.findById(token.sub);
        if (findUser.newUser === undefined) {
          findUser.newUser = token.newUser;
          await findUser.save();
        }
      } catch (err) {
        console.log(err.message);
      }
      console.log(session);
      return Promise.resolve(session);
    },
    // jwt callback
    jwt: async (token, user, account, profile, isNewUser) => {
      console.log(token);
      if (isNewUser !== undefined) token.newUser = isNewUser;
      return Promise.resolve(token);
    },
    // redirect to dashboard callback
    redirect: async (url, baseUrl) => {
      return Promise.resolve("/dashboard");
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
