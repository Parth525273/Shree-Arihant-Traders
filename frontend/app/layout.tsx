import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shree Arihant Traders | B2B Wholesale Food Ordering",
  description:
    "Order wholesale food products from 40+ companies. Fast, reliable B2B ordering for retailers.",
  keywords: "wholesale food, B2B ordering, bulk food supply, Shree Arihant Traders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
            {/* Toast notifications appear here */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#1e293b",
                  color: "#f1f5f9",
                  border: "1px solid #334155",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                },
                success: {
                  iconTheme: { primary: "#22c55e", secondary: "#1e293b" },
                },
                error: {
                  iconTheme: { primary: "#ef4444", secondary: "#1e293b" },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
