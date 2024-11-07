import { client } from "@/lib/api/amplify/helper";
import googleUserUtils from "@/lib/utils/googleUserUtils";
import { adminAtom, authAtom, userAtom } from "@/store/authUserAtom";
import { setCookie } from "@/utils/cookieUtils";
import { getCurrentUser } from "aws-amplify/auth";
import "aws-amplify/auth/enable-oauth-listener";
import { useAtom, useSetAtom } from "jotai";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import NavigationBar from "./NavigationBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useAtom(authAtom);
  const setUser = useSetAtom(userAtom);
  const setIsAdmin = useSetAtom(adminAtom);
  const { data: session } = useSession();
  const router = useRouter();

  // 구글 로그인
  useEffect(() => {
    const getGoogleUser = async () => {
      if (session) {
        console.log("세션있음", session);
        if (session.accessToken) {
          setCookie("access_token", session.accessToken);
        }
        if (session.refreshToken) {
          setCookie("refresh_token", session.refreshToken);
        }
        if (session.user) {
          const userData = await googleUserUtils(session.user);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } else {
        console.log("세션없음");
        getUser();
      }
    };
    getGoogleUser();
  }, [session]);

  // 일반 로그인

  const getUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const userResponse = await client.models.User.get({
          id: currentUser.userId,
        });
        const userData = userResponse?.data;
        if (userData) {
          setUser(userData);
          setIsAdmin(userData.role === "ADMIN");
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
      router.push("/sign-in");
    }
  };

  // useEffect(() => {
  //   if (isAuthenticated === false) router.push("/sign-in");
  // }, [isAuthenticated, router]);
  // if (isAuthenticated === false) return null;

  return (
    <div>
      <NavigationBar />
      <main className="md:ml-200">{children}</main>
    </div>
  );
}
