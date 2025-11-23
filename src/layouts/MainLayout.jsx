// src/layouts/MainLayout.jsx
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

import { NotificationProvider } from "../context/NotificationContext";
import NotificationBar from "../components/NotificationBar";

function MainLayout() {
  return (
    <NotificationProvider>
      <div className="min-h-screen flex flex-col bg-[#E4EFFD]">
        <NavBar />
        <NotificationBar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </NotificationProvider>
  );
}

export default MainLayout;
