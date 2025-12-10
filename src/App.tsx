import { Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import QrCodePage from "./routes/QrCode";
import Home from "./routes/Home";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-900">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/qrcode" element={<QrCodePage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
