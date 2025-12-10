import { useRef, useState } from "react";
import QRCodeRenderer, { type QRCodeRendererHandle } from "./QRCodeRenderer";
import Input from "../ui/Input";
import { formatDate } from "../../utils/utils";

function formatDateForIcs(date: string) {
  // Attend une date au format 'YYYY-MM-DDTHH:mm' et retourne 'YYYYMMDDTHHmmss'
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

export default function QrCodeEvent() {
  const now = new Date();

  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [dtstart, setDtstart] = useState(formatDate(now));
  const [dtend, setDtend] = useState(formatDate(now));

  const qrRef = useRef<QRCodeRendererHandle | null>(null);

  // UID unique
  const uid = "event-" + Math.random().toString(36).slice(2, 12);

  // DTSTAMP UTC
  const formatDTStamp = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      "T" +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) +
      "Z"
    );
  };

  const vevent = [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatDTStamp()}`,
    `SUMMARY:${summary}`,
    dtstart ? `DTSTART;TZID=Europe/Paris:${formatDateForIcs(dtstart)}` : "",
    dtend ? `DTEND;TZID=Europe/Paris:${formatDateForIcs(dtend)}` : "",
    description ? `DESCRIPTION:${description}` : "",
    location ? `LOCATION:${location}` : "",
    "END:VEVENT",
  ]
    .filter(Boolean)
    .join("\n");

  const filenameBase = summary ? summary.replace(/\s+/g, "_") : "event";

  return (
    <div className="flex flex-col md:flex-row md:space-x-8 items-start w-full">
      <div className="flex-1 max-w-4xl bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Créer un événement QR Code</h2>
        <Input
          label="Titre de l'événement"
          value={summary}
          onChange={setSummary}
        />
        <Input
          label="Description"
          value={description}
          onChange={setDescription}
        />
        <Input label="Lieu" value={location} onChange={setLocation} />
        <div className="flex gap-4">
          <Input
            label="Date de début"
            value={dtstart}
            onChange={setDtstart}
            type="datetime-local"
            className="flex-1"
          />
          <Input
            label="Date de fin"
            value={dtend}
            onChange={setDtend}
            type="datetime-local"
            className="flex-1"
          />
        </div>
      </div>
      <div className="flex items-start justify-center min-w-[220px] mt-6 md:mt-0">
        <QRCodeRenderer
          value={vevent}
          ref={qrRef}
          filenameBase={filenameBase}
        />
      </div>
    </div>
  );
}
