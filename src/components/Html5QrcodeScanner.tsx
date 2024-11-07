"use client";

import React, { useEffect } from "react";
import { Html5QrcodeScanner, Html5QrcodeCameraScanConfig } from "html5-qrcode";

const qrcodeRegionId = "html5qr-code-full-region";

interface Html5QrcodePluginProps {
  fps?: number;
  qrbox?: number | { width: number; height: number };
  aspectRatio?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  qrCodeSuccessCallback: (decodedText: string, result: any) => void;
  qrCodeErrorCallback?: (error: unknown) => void;
}

const Html5QrcodePlugin: React.FC<Html5QrcodePluginProps> = ({
  fps,
  qrbox,
  aspectRatio,
  disableFlip,
  verbose = false,
  qrCodeSuccessCallback,
  qrCodeErrorCallback,
}) => {
  useEffect(() => {
    // Create the configuration object for Html5QrcodeScanner
    const createConfig = (): Html5QrcodeCameraScanConfig => {
      return {
        fps,
        qrbox,
        aspectRatio,
        disableFlip,
      };
    };

    if (!qrCodeSuccessCallback) {
      console.error("qrCodeSuccessCallback is required");
      return;
    }

    const config = createConfig();
    const scanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);

    scanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);

    // Cleanup function to clear the scanner on component unmount
    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [
    fps,
    qrbox,
    aspectRatio,
    disableFlip,
    verbose,
    qrCodeSuccessCallback,
    qrCodeErrorCallback,
  ]);

  return <div id={qrcodeRegionId} />;
};

export default Html5QrcodePlugin;
