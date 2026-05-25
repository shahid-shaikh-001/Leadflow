import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "LeadFlow",
  description: "Mini Lead Distribution System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}