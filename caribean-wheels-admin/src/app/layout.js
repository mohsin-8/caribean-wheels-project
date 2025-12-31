import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata = {
  title: "Caribean Wheels Admin",
  description: "Caribean Wheels Admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
