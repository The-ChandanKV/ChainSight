import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { LinksFunction, MetaFunction } from "react-router";
import "./app.css";
import { ThemeProvider } from './components/ThemeToggle';
import { NotificationProvider } from './components/NotificationSystem';
import QuickActionsButton from './components/QuickActionsButton';

export const meta: MetaFunction = () => {
  return [
    { title: "ChainSight - AI-Powered Supply Chain Management" },
    { name: "description", content: "Blockchain-powered, AI-driven supply chain tracker with real-time analytics, delay predictions, and immutable tracking." },
    { name: "keywords", content: "supply chain, blockchain, AI, logistics, shipment tracking, analytics" },
    { property: "og:title", content: "ChainSight - Supply Chain Management" },
    { property: "og:description", content: "Next-gen supply chain tracking with blockchain and AI" },
    { property: "og:type", content: "website" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "icon",
    type: "image/x-icon",
    href: "/favicon.ico",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f2027" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <NotificationProvider>
            {children}
            <QuickActionsButton />
          </NotificationProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: { error: unknown }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-dark p-8 rounded-2xl border border-red-500/30 max-w-lg text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">{message}</h1>
        <p className="text-gray-400 mb-6">{details}</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go Home
        </a>
        {stack && (
          <pre className="mt-6 p-4 bg-gray-900 rounded-lg text-left text-xs text-gray-400 overflow-x-auto">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}