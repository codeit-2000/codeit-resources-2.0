import MobileSizeWatcher from "@/components/commons/MobileSizeWatcher";
import ToastProvider from "@/components/commons/Toast/ToastProvider";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
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
      <Component {...pageProps} />
      <ToastProvider />
      <MobileSizeWatcher />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
