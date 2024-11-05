import outputs from "@/../amplify_outputs.json";
import Layout from "@/components/Layout";
import MobileSizeWatcher from "@/components/commons/MobileSizeWatcher";
import ModalProvider from "@/components/commons/Modal";
import ToastProvider from "@/components/commons/Toast/ToastProvider";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Amplify } from "aws-amplify";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";

Amplify.configure(outputs);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  const isSignInPage = router.pathname === "/sign-in";

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider />
      <MobileSizeWatcher />
      <ModalProvider />
      {isSignInPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
