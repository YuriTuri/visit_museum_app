import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import Home from "./pages/Home";
import ExhibitionDetail from "./pages/ExhibitionDetail";
import SelectDate from "./pages/SelectDate";
import SelectTime from "./pages/SelectTime";
import SelectTickets from "./pages/SelectTickets";
import Confirmation from "./pages/Confirmation";
import Payment from "./pages/Payment";
import Receipt from "./pages/Receipt";
import MyTickets from "./pages/MyTickets";
import TicketDetail from "./pages/TicketDetail";

export default function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exhibition/:id" element={<ExhibitionDetail />} />
          <Route path="/book/date" element={<SelectDate />} />
          <Route path="/book/time" element={<SelectTime />} />
          <Route path="/book/tickets" element={<SelectTickets />} />
          <Route path="/book/confirm" element={<Confirmation />} />
          <Route path="/book/payment" element={<Payment />} />
          <Route path="/receipt/:id" element={<Receipt />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/ticket/:id" element={<TicketDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </BookingProvider>
  );
}
