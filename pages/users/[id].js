import dbConnect from "../../util/mongodb";
import User from "../../models/user";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/client";

export default function UserItem({ user }) {
  const [message, setMessage] = useState();
  const [response, setResponse] = useState();
  const [lock, setLock] = useState(false);
  const [session] = useSession();
  const router = useRouter();
  useEffect(() => {
    session ? setLock(false) : setLock(true);
  }, [session]);
  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post("/api/message", {
        message: message,
        id: user._id,
      });
      console.log(res.data.message);
      setResponse(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Layout>
      {router.isFallback && <div>Loading...</div>}
      {!router.isFallback && (
        <div>
          <div>{user.email}</div>
          <form onSubmit={sendMessage}>
            <input
              onChange={(e) => setMessage(e.target.value)}
              placeholder="message"
              type="text area"
              disabled={lock}
            />
            <button type="submit" disabled={lock}>
              Send!
            </button>
            {!session && <p>Sign in to send a message!</p>}
            <p>{response}</p>
          </form>
        </div>
      )}
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  try {
    await dbConnect();
    let res = await User.findById(params.id);
    return {
      props: {
        user: JSON.parse(JSON.stringify(res)),
      },
      revalidate: 1,
    };
  } catch (err) {
    console.log(err);
  }
}

export async function getStaticPaths() {
  try {
    await dbConnect();
    let res = await User.find({});
    const paths = JSON.parse(JSON.stringify(res)).map((e) => ({
      params: { id: e._id },
    }));
    return {
      paths,
      fallback: true,
    };
  } catch (err) {
    console.log(err);
  }
}
