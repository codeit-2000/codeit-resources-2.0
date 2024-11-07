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
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";

Amplify.configure(outputs);

const AUTH_PATHS = ["/sign-in", "/find-password"];

function App({ Component, pageProps }: AppProps) {
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

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider />
      <MobileSizeWatcher />
      <ModalProvider />
      {AUTH_PATHS.includes(router.pathname) ? (
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

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
