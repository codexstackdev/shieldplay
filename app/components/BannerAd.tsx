"use client";

import { useEffect, useRef } from "react";

interface BannerAdProps {
  width?: number;
  height?: number;
  adKey: string;
}

const BannerAd = ({ width = 300, height = 250, adKey }: BannerAdProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;


    const atOptionsScript = document.createElement("script");
    atOptionsScript.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;
    adRef.current.appendChild(atOptionsScript);

    const invokeScript = document.createElement("script");
    invokeScript.src = `https://avouchlawsrethink.com/${adKey}/invoke.js`;
    invokeScript.async = true;
    adRef.current.appendChild(invokeScript);
  }, [adKey, width, height]);

  return <div ref={adRef} style={{ width, height }} />;
};

export default BannerAd;
