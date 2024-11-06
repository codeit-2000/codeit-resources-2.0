import { adminAtom, authAtom, userAtom } from "@/store/authUserAtom";
import type { Schema } from "@amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import NavigationBar from "./NavigationBar";

const client = generateClient<Schema>();

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useAtom(authAtom);
  const setUser = useSetAtom(userAtom);
  const setIsAdmin = useSetAtom(adminAtom);
  const router = useRouter();

  useEffect(() => {
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
    getUser();
  }, [setUser, setIsAuthenticated]);

  useEffect(() => {
    if (isAuthenticated === false) router.push("/sign-in");
  }, [isAuthenticated, router]);

  if (isAuthenticated === false) return null;

  return (
    <div>
      <NavigationBar />
      <main className="md:ml-200">{children}</main>
    </div>
  );
}
