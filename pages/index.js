import Layout from "../components/Layout";
import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useCallback, useState } from "react";
import User from "../models/user";
import dbConnect from "../util/mongodb";
import Link from "next/link";
import { getSession } from "next-auth/client";

// landing page
export default function Home({ users }) {
  const [load, setLoad] = useState(false);
  // dynamic page height using ref
  const Height = useCallback((el) => {
    console.log(el);
    if (el) {
      el.style.height = `${window.innerHeight}px`;
      window.addEventListener("resize", () => {
        el.style.height = `${window.innerHeight}px`;
      });
      console.log("listener added");
    }
  }, []);
  return (
    <Layout title="Home">
      <Container ref={Height} fluid>
        <>
          {users.map((e, index) => (
            <Link href={`/users/${e.id}`}>
              <a>
                <li value={index} key={e.id}>
                  {e.email}
                </li>
              </a>
            </Link>
          ))}
        </>
      </Container>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  try {
    await dbConnect();
    let res = await User.find({});
    let array = [];
    JSON.parse(JSON.stringify(res)).forEach((e) => {
      array.push({ id: e._id, name: e.name, email: e.email, city: e.city });
    });
    if (session) {
      let filtered = array.filter((e) => e.email !== session.user.email);
      return {
        props: {
          users: filtered,
        },
      };
    } else {
      return {
        props: {
          users: array,
        },
      };
    }
  } catch (err) {
    console.log(err);
  }
}
