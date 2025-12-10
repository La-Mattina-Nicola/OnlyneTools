import { useRef, useState } from "react";
import QRCodeRenderer, { type QRCodeRendererHandle } from "./QRCodeRenderer";
import Input from "../ui/Input";

export default function QrCodeWeb() {
  const [value, setValue] = useState("https://www.exemple.com");

  const qrRef = useRef<QRCodeRendererHandle | null>(null);
  const filenameBase = "qrcode-web";

  return (
    <div className="flex flex-col md:flex-row md:space-x-8 items-start w-full">
      <div className="flex-1 max-w-4xl bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Créer un QR Code</h2>
        <Input label="URL du site web" value={value} onChange={setValue} />
      </div>
      <div className="flex items-start justify-center min-w-[220px] mt-6 md:mt-0">
        <QRCodeRenderer value={value} ref={qrRef} filenameBase={filenameBase} />
      </div>
    </div>
  );
}
