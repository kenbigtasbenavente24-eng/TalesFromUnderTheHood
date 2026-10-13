import "./globals.css";

export const metadata = {
  title: "Send me an anonymous message",
  description: "Say what you actually want to say. No name, no limit that gets in the way.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
