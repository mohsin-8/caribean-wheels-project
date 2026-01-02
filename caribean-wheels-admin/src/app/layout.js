import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/car-admin.css";
import BootstrapScripts from "@/components/BootstrapScripts";

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
          <BootstrapScripts />
        </AuthProvider>
      </body>
    </html>
  );
}
