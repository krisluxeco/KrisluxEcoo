
import "./globals.css";


export const metadata = {
  title: "KrisluxEco",
  description: "KrisluxEco",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
