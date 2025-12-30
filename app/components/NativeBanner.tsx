import { useEffect } from "react";

interface NativeBannerProps {
  scriptSrc: string;
  containerId: string;
}

export default function NativeBanner({ scriptSrc, containerId }: NativeBannerProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [scriptSrc]);

  return <div id={containerId}></div>;
}
