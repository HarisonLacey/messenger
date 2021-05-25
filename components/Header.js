import { signIn, signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [session, loading] = useSession();
  const router = useRouter();
  useEffect(() => {
    console.log(router);
  }, [router]);
  return (
    <>
      <div style={{ height: "100px", borderBottom: "solid 1px" }}>
        {loading && <p>Loading...</p>}
        {!session && !loading && <button onClick={signIn}>Sign In</button>}
        {session && !loading && (
          <>
            <button onClick={signOut}>Sign Out</button>
            {router.pathname !== "/dashboard" && (
              <button>
                <Link href="/dashboard">
                  <a>Dashboard</a>
                </Link>
              </button>
            )}
            {router.pathname === "/dashboard" && (
              <button>
                <Link href="/profile">
                  <a>Update Profile</a>
                </Link>
              </button>
            )}
            {router.pathname !== "/" && (
              <button>
                <Link href="/">
                  <a>Home</a>
                </Link>
              </button>
            )}
            <p>{session.user.email}</p>
          </>
        )}
      </div>
    </>
  );
}
