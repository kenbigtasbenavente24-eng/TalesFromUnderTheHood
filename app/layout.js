import "./globals.css";

export const metadata = {
  title: "Tales from Under the Hood",
  description: "Share your stories anonymously with us!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
