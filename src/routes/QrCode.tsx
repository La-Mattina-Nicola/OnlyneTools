import { useState } from "react";
import QrCodeContact from "../components/qrCode/QrCodeContact";
import QrCodeEvent from "../components/qrCode/QrCodeEvent";
import QrCodeWeb from "../components/qrCode/QrCodeSiteWeb";

function QrCodePage() {
  const [isShowingSidebar, setIsShowingSidebar] = useState("contact");

  return (
    <main className="pt-16 flex-1 text-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              isShowingSidebar === "contact"
                ? "bg-orange-700 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setIsShowingSidebar("contact")}
          >
            Contact
          </button>
          <button
            className={`px-4 py-2 rounded ${
              isShowingSidebar === "event"
                ? "bg-orange-700 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setIsShowingSidebar("event")}
          >
            Event
          </button>
          <button
            className={`px-4 py-2 rounded ${
              isShowingSidebar === "web"
                ? "bg-orange-700 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setIsShowingSidebar("web")}
          >
            Site Web
          </button>
        </div>
        {isShowingSidebar === "contact" && <QrCodeContact />}
        {isShowingSidebar === "event" && <QrCodeEvent />}
        {isShowingSidebar === "web" && <QrCodeWeb />}
      </div>
    </main>
  );
}

export default QrCodePage;
