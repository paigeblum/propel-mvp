export const metadata = {
  title: "Propel – Hybrid Giving MVP",
  description: "Propel: nonprofit college funds + direct-to-student giving",
};

import "./styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
