import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import LocationPage from "./pages/LocationPage";
import LocationDetails from "./pages/LocationDetails";
import Login from "./pages/Login";
import Register from "./pages/Login";
import Reservations from "./pages/Reservations";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/locations/:locationName" element={<LocationPage />} />
        <Route path="/listing/:id" element={<LocationDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute>
              <Reservations />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;