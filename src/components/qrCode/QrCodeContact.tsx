import { useState, useRef, Activity } from "react";
import QRCodeRenderer from "./QRCodeRenderer";
import type { QRCodeRendererHandle } from "./QRCodeRenderer";
import type { Phone, Address } from "../../types/QrCode";
import Input from "../ui/Input";

const sections = [
  { key: "identite", label: "Identité" },
  { key: "pro", label: "Professionnel" },
  { key: "phones", label: "Téléphones" },
  { key: "addresses", label: "Adresses" },
  { key: "divers", label: "Divers" },
];

export default function QrCodeContactV4() {
  const [activeTab, setActiveTab] = useState(sections[0].key);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [org, setOrg] = useState("");
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoType, setPhotoType] = useState("image/jpeg");

  const [phones, setPhones] = useState<Phone[]>([
    { type: "work,voice", value: "" },
  ]);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      type: "WORK",
      label: "",
      street: "",
      city: "",
      region: "",
      postalCode: "",
      country: "",
    },
  ]);
  const [email, setEmail] = useState("");
  const [rev, setRev] = useState("");
  const qrRef = useRef<QRCodeRendererHandle | null>(null);

  const formatVCardRev = (d = new Date()) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(
      d.getUTCDate()
    )}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(
      d.getUTCSeconds()
    )}Z`;
  };

  const vCardLines = [
    "BEGIN:VCARD",
    "VERSION:4.0",
    `N:${lastName};${firstName};;${prefix};${suffix}`,
    `FN:${firstName} ${lastName}`,
    org && `ORG:${org}`,
    title && `TITLE:${title}`,
    photo && `PHOTO;MEDIATYPE=${photoType}:${photo}`,
    ...phones
      .filter((p) => p.value)
      .map((p) => `TEL;TYPE=${p.type};VALUE=uri:tel:${p.value}`),
    ...addresses
      .filter(
        (a) => a.street || a.city || a.region || a.postalCode || a.country
      )
      .map(
        (a) =>
          `ADR;TYPE=${a.type};LABEL="${a.label}":;;${a.street};${a.city};${a.region};${a.postalCode};${a.country}`
      ),
    email && `EMAIL:${email}`,
  ].filter(Boolean) as string[];

  const vCard = [...vCardLines, rev && `REV:${rev}`, "END:VCARD"]
    .filter(Boolean)
    .join("\n");

  const filenameBase =
    firstName || lastName ? `${firstName}_${lastName}` : "contact";

  const requestRev = () => {
    const newRev = formatVCardRev();
    setRev(newRev);
    return newRev;
  };

  const addPhone = () =>
    setPhones([...phones, { type: "home,voice", value: "" }]);
  const removePhone = (idx: number) =>
    setPhones(phones.filter((_, i) => i !== idx));
  const updatePhone = (idx: number, field: keyof Phone, value: string) =>
    setPhones(phones.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));

  const addAddress = () =>
    setAddresses([
      ...addresses,
      {
        type: "HOME",
        label: "",
        street: "",
        city: "",
        region: "",
        postalCode: "",
        country: "",
      },
    ]);
  const removeAddress = (idx: number) =>
    setAddresses(addresses.filter((_, i) => i !== idx));
  const updateAddress = (idx: number, field: keyof Address, value: string) =>
    setAddresses(
      addresses.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
    );

  return (
    <div className="flex flex-col md:flex-row md:space-x-8 items-start w-full">
      <div className="flex-1 max-w-4xl bg-white rounded-lg p-6 shadow-lg">
        {/* Tabs Bar */}
        <div className="flex border-b mb-4">
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              className={`px-4 py-2 -mb-px border-b-2 font-bold transition-colors ${
                activeTab === section.key
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-orange-500"
              }`}
              onClick={() => setActiveTab(section.key)}
            >
              {section.label}
            </button>
          ))}
        </div>
        <form
          className="grid grid-cols-1 gap-4 text-[0.95rem]"
          autoComplete="off"
          onSubmit={(e) => e.preventDefault()}
        >
          <Activity mode={activeTab === "identite" ? "visible" : "hidden"}>
            <div className="space-y-2">
              <Input label="Prénom" value={firstName} onChange={setFirstName} />
              <Input label="Nom" value={lastName} onChange={setLastName} />
              <Input
                label="Préfixe (ex: Mr.)"
                value={prefix}
                onChange={setPrefix}
              />
              <Input label="Suffixe" value={suffix} onChange={setSuffix} />
              <Input label="Email" value={email} onChange={setEmail} />
            </div>
          </Activity>
          <Activity mode={activeTab === "pro" ? "visible" : "hidden"}>
            <div className="space-y-2">
              <Input label="Organisation" value={org} onChange={setOrg} />
              <Input label="Titre" value={title} onChange={setTitle} />
            </div>
          </Activity>
          <Activity mode={activeTab === "phones" ? "visible" : "hidden"}>
            <div className="space-y-2">
              {phones.map((phone, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-1">
                  <Input
                    label="Téléphone"
                    value={phone.value}
                    onChange={(v) => updatePhone(idx, "value", v)}
                    className="flex-1"
                  />
                  <Input
                    label="Type (ex: work,voice)"
                    value={phone.type}
                    onChange={(v) => updatePhone(idx, "type", v)}
                    className="w-32"
                  />
                  {phones.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removePhone(idx)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="text-orange-600 text-xs mt-1 hover:underline"
                onClick={addPhone}
              >
                + Ajouter un téléphone
              </button>
            </div>
          </Activity>
          <Activity mode={activeTab === "addresses" ? "visible" : "hidden"}>
            <div className="space-y-2">
              {addresses.map((address, idx) => (
                <div key={idx} className="border rounded p-2 mb-2 bg-white">
                  <div className="flex gap-2 mb-2">
                    <Input
                      label="Type"
                      value={address.type}
                      onChange={(v) => updateAddress(idx, "type", v)}
                      className="w-24"
                    />
                    <Input
                      label="Label"
                      value={address.label}
                      onChange={(v) => updateAddress(idx, "label", v)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Input
                      label="Rue"
                      value={address.street}
                      onChange={(v) => updateAddress(idx, "street", v)}
                      className="flex-5"
                    />
                    <Input
                      label="Ville"
                      value={address.city}
                      onChange={(v) => updateAddress(idx, "city", v)}
                      className="flex-2"
                    />
                    <Input
                      label="Code postal"
                      value={address.postalCode}
                      onChange={(v) => updateAddress(idx, "postalCode", v)}
                      className="w-24"
                    />
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Input
                      label="Région"
                      value={address.region}
                      onChange={(v) => updateAddress(idx, "region", v)}
                      className="flex-1"
                    />
                    <Input
                      label="Pays"
                      value={address.country}
                      onChange={(v) => updateAddress(idx, "country", v)}
                      className="flex-1"
                    />
                  </div>
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500 text-xs mt-1 hover:underline"
                      onClick={() => removeAddress(idx)}
                    >
                      ✕ Supprimer
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="text-orange-600 text-xs mt-1 hover:underline"
                onClick={addAddress}
              >
                + Ajouter une adresse
              </button>
            </div>
          </Activity>
          <Activity mode={activeTab === "divers" ? "visible" : "hidden"}>
            <div className="space-y-2">
              <Input label="Photo (URL)" value={photo} onChange={setPhoto} />
              <Input
                label="Type MIME (ex: image/gif)"
                value={photoType}
                onChange={setPhotoType}
              />
              <Input label="Révision date" value={rev} readOnly={true} />
            </div>
          </Activity>
        </form>
      </div>
      <div className="flex items-start justify-center min-w-[220px] mt-6 md:mt-0">
        <div className="mb-4 w-full" />
        <QRCodeRenderer
          value={vCard}
          ref={qrRef}
          onRequestRev={requestRev}
          filenameBase={filenameBase}
        />
      </div>
    </div>
  );
}
