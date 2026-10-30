import "./globals.css";

export const metadata = {
  title: "Tales from Under the Hood",
  description: "Read the spooky school stories shared around the campfire and join the conversation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
