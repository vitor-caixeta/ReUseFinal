import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-dvh bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <Providers>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-12">{children}</main>
        </Providers>

        {/* Watsonx Assistant Web Chat */}
        <Script id="watsonx-webchat" strategy="afterInteractive">
          {`
            window.watsonAssistantChatOptions = {
              integrationID: "ff645a16-bc4c-4e35-875d-e8dec9fba4a5",
              region: "au-syd",
              serviceInstanceID: "8f2b4174-5b07-4d15-96db-1f89538434fa",
              onLoad: async (instance) => { await instance.render(); }
            };
            setTimeout(function(){
              const t = document.createElement('script');
              t.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" + (window.watsonAssistantChatOptions.clientVersion || 'latest') + "/WatsonAssistantChatEntry.js";
              document.head.appendChild(t);
            });
          `}
        </Script>
      </body>
    </html>
  );
}
