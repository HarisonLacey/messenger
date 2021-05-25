import { getSession } from "next-auth/client";
import User from "../models/user";
import dbConnect from "../util/mongodb";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Profile({ profile }) {
  const [name, setName] = useState();
  const [city, setCity] = useState();
  const [response, setResponse] = useState();
  const router = useRouter();
  const profileUpdate = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post("api/profile", {
        name: name,
        city: city,
      });
      setResponse(res.data.message);
      router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <form onSubmit={profileUpdate}>
        <input
          onChange={(e) => setName(e.target.value)}
          placeholder="update name"
          type="text"
        />
        <input
          onChange={(e) => setCity(e.target.value)}
          placeholder="update city"
          type="text"
        />
        <button type="submit">Submit</button>
        <p>{response}</p>
      </form>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return {
      props: {
        user: {},
      },
    };
  }
  try {
    await dbConnect();
    const userFind = await User.findById(session.user.id);
    return {
      props: {
        profile: JSON.parse(JSON.stringify(userFind)),
      },
    };
  } catch (err) {
    console.log(err);
  }
}
