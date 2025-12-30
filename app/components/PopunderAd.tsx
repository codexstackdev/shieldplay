import { useEffect } from "react";

export default function PopunderAd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://avouchlawsrethink.com/7e/3e/05/7e3e05323f4b89738cf40e91d04bf72c.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
