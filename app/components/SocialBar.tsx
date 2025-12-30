import { useEffect } from "react";

interface SocialBarProps {
  scriptSrc: string;
}

export default function SocialBar({ scriptSrc }: SocialBarProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [scriptSrc]);

  return null;
}
