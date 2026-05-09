import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import Navbar from "./components/common/Navbar.jsx";
import AdminBookingsPage from "./pages/AdminBookingsPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import ExpertDetailPage from "./pages/ExpertDetailPage.jsx";
import ExpertListPage from "./pages/ExpertListPage.jsx";
import MyBookingsPage from "./pages/MyBookingsPage.jsx";
import { useSocketContext } from "./context/useSocketContext.js";

function BookingSync() {
  const socket = useSocketContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const syncBookings = () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["expert"] });
      queryClient.invalidateQueries({ queryKey: ["experts"] });
    };

    socket.on("booking:statusChanged", syncBookings);

    return () => {
      socket.off("booking:statusChanged", syncBookings);
    };
  }, [socket, queryClient]);

  return null;
}

function App() {
  return (
    <div className="app-shell">
      <BookingSync />
      <Navbar />
      <main className="page-shell">
        <Routes>
          <Route path="/experts" element={<ExpertListPage />} />
          <Route path="/experts/:id" element={<ExpertDetailPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/" element={<Navigate to="/experts" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
