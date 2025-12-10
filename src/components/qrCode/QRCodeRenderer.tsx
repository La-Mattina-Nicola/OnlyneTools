import { useRef, forwardRef, useImperativeHandle, useState } from "react";
// @ts-ignore
import QRCode from "qrcode.react";

type Props = {
  value: string;
  size?: number;
  reloadKey?: number | string;
  onRequestRev?: () => string | Promise<string>;
  filenameBase?: string;
  logoSrc?: string;
  logoSize?: number;
};

export type QRCodeRendererHandle = {
  downloadSVG: (filename?: string) => void;
  downloadPNG: (filename?: string) => void;
};

const QRCodeRenderer = forwardRef<QRCodeRendererHandle, Props>(
  (
    { value, size = 512, onRequestRev, filenameBase, logoSrc, logoSize },
    ref
  ) => {
    const svgRef = useRef<HTMLDivElement | null>(null);

    const [logoInput, setLogoInput] = useState<string | undefined>(
      logoSrc ?? ""
    );

    const fetchDataUrl = async (src: string) => {
      try {
        const res = await fetch(src, { cache: "no-store" });
        const blob = await res.blob();
        return await new Promise<string>((res2, rej) => {
          const reader = new FileReader();
          reader.onload = () => res2(String(reader.result));
          reader.onerror = rej;
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        return undefined as any;
      }
    };

    const downloadSVGImpl = async (filename = "qrcode.svg") => {
      const svgContainer = svgRef.current;
      if (!svgContainer) return;
      const svgEl = svgContainer.querySelector("svg");
      if (!svgEl) return;
      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgEl);

      // If logo provided via local input, fetch data URL and inject <image> into SVG center
      if (logoInput) {
        const dataUrl = await fetchDataUrl(logoInput).catch(() => undefined);
        if (dataUrl) {
          const logoPx = logoSize ?? Math.round(size / 4);
          const x = Math.round((size - logoPx) / 2);
          const y = x;
          // ensure svg has xmlns attribute
          if (!/xmlns=/.test(svgString)) {
            svgString = svgString.replace(
              /^<svg/,
              '<svg xmlns="http://www.w3.org/2000/svg"'
            );
          }
          // insert image before closing </svg>
          const imageTag = `<image href="${dataUrl}" x="${x}" y="${y}" width="${logoPx}" height="${logoPx}" preserveAspectRatio="xMidYMid meet" />`;
          svgString = svgString.replace(/<\/svg>\s*$/i, imageTag + "</svg>");
        }
      }

      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    };

    const downloadPNGImpl = async (filename = "qrcode.png") => {
      const svgContainer = svgRef.current;
      if (!svgContainer) return;
      const svgEl = svgContainer.querySelector("svg");
      if (!svgEl) return;

      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(svgEl);

      // If logo provided via local input, inject image as dataURL into SVG
      if (logoInput) {
        const dataUrl = await fetchDataUrl(logoInput).catch(() => undefined);
        if (dataUrl) {
          const logoPx = logoSize ?? Math.round(size / 4);
          const x = Math.round((size - logoPx) / 2);
          const y = x;
          if (!/xmlns=/.test(svgString)) {
            svgString = svgString.replace(
              /^<svg/,
              '<svg xmlns="http://www.w3.org/2000/svg"'
            );
          }
          const imageTag = `<image href="${dataUrl}" x="${x}" y="${y}" width="${logoPx}" height="${logoPx}" preserveAspectRatio="xMidYMid meet" />`;
          svgString = svgString.replace(/<\/svg>\s*$/i, imageTag + "</svg>");
        }
      }

      const svgBlob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // draw with transparency preserved
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (!blob) return;
            const u = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = u;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(u);
          });
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      img.onerror = () => URL.revokeObjectURL(url);
      img.src = url;
    };

    useImperativeHandle(ref, () => ({
      downloadSVG: downloadSVGImpl,
      downloadPNG: downloadPNGImpl,
    }));

    const handleDownload = async (type: "png" | "svg") => {
      let newRev: string | undefined;
      try {
        if (onRequestRev) {
          const res = onRequestRev();
          newRev = res instanceof Promise ? await res : res;
        }
      } catch (e) {
        // ignore
      }

      const base = filenameBase || "contact";
      const revPart = newRev ? `_${newRev}` : "";
      const fname = `${base}${revPart}.${type}`;

      // give a short delay so parent can update vCard with REV if needed
      setTimeout(() => {
        if (type === "svg") downloadSVGImpl(fname);
        else downloadPNGImpl(fname);
      }, 80);
    };

    const [fgColor, setFgColor] = useState("#000000");

    return (
      <div className={`w-[${size}px] inline-block`}>
        <label className="block text-xs text-gray-200 mb-1">
          Couleur du QR code&nbsp; :
          <input
            type="color"
            defaultValue={fgColor}
            className="mb-2 inline-block align-middle w-8 h-8 border-2 border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            onChange={(e) => {
              setFgColor(e.target.value);
            }}
          />
        </label>

        <div className="mb-2">
          <label className="block text-xs text-gray-200 mb-1">
            Logo (URL pour le QR)
          </label>
          <input
            type="text"
            placeholder="https://.../logo.png"
            value={logoInput ?? ""}
            onChange={(e) => setLogoInput(e.target.value)}
            className="w-full border border-gray-300 bg-gray-900 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <div
          ref={svgRef}
          className={`relative inline-block`}
          style={{
            width: size,
            height: size,
          }}
        >
          <QRCode
            value={value || ""}
            size={size}
            level="H"
            bgColor="transparent"
            fgColor={fgColor}
            includeMargin={true}
            renderAs="svg"
            imageSettings={{
              excavate: logoInput !== "",
              src: logoSrc || "",
              height: logoSize || Math.round(size / 2.5),
              width: logoSize || Math.round(size / 2.5),
            }}
          />
          {logoInput && (
            <img
              src={logoInput}
              alt="logo"
              className="absolute left-1/2 top-1/2 pointer-events-none"
              style={{
                transform: "translate(-50%, -50%)",
                width: logoSize ?? Math.round(size / 2.5),
                height: logoSize ?? Math.round(size / 2.5),
              }}
            />
          )}
        </div>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => handleDownload("png")}
            className="px-3 py-1.5 bg-orange-500 text-white rounded"
          >
            Télécharger PNG
          </button>
          <button
            type="button"
            onClick={() => handleDownload("svg")}
            className="px-3 py-1.5 bg-orange-500 text-white rounded"
          >
            Télécharger SVG
          </button>
        </div>
      </div>
    );
  }
);

export default QRCodeRenderer;
