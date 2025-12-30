"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DownloadCloud } from "lucide-react";
import { useTheme } from "next-themes";

interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
  gamename: string;
  previewUrl?: string;
}

export const DownloadModal = ({
  open,
  onClose,
  fileUrl,
  gamename,
  previewUrl,
}: DownloadModalProps) => {
  const [showAd, setShowAd] = useState(true);
  const { theme } = useTheme();

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = gamename;
    link.click();
    onClose();
  };

  const buttonTextColor = theme === "light" ? "text-black" : "text-white";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-lg rounded-3xl bg-gray-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl border border-gray-700"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
          >
            {showAd ? (
              <div className="flex flex-col items-center w-full text-center">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-50 mb-2">
                  Sponsored Ad
                </h2>
                <p className="text-sm sm:text-base text-gray-300 mb-4">
                  Please watch this ad to unlock your download.
                </p>

                <div className="w-full h-52 sm:h-64 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-lg mb-4 shadow-inner">
                  Adsterra Ad
                </div>

                <div className="relative w-full h-3 rounded-full bg-gray-700 overflow-hidden mb-2 shadow-inner">
                  <motion.div
                    className="absolute h-3 bg-linear-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5 }}
                    onAnimationComplete={() => setShowAd(false)}
                  />
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  Loading...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full text-center">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-50 mb-4">
                  Preview Ready
                </h2>

                {previewUrl && (
                  <div className="w-full mb-4 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={previewUrl}
                      alt={gamename}
                      className="w-full h-48 sm:h-64 object-cover object-center transition-transform hover:scale-105"
                    />
                  </div>
                )}

                <p className="text-sm sm:text-base text-gray-300 mb-6">
                  You can now safely download{" "}
                  <span className="font-semibold text-gray-50">{gamename}</span>.
                </p>

                {/* Real download button */}
                <motion.button
                  onClick={handleDownload}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-purple-500 via-pink-500 to-orange-400 px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition ${buttonTextColor} mb-4`}
                >
                  <DownloadCloud size={20} />
                  Download {gamename}
                </motion.button>

                {/* Ad / smartlink buttons */}
                <a
                  href="https://avouchlawsrethink.com/hp09b6k7?key=5091bc8aa59ff3af15e6fee20a2ce1f8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-purple-500 via-pink-500 to-orange-400 px-8 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl transition mb-2"
                >
                  Download Mirror
                </a>

                <a
                  href="https://avouchlawsrethink.com/another-smartlink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-purple-500 via-pink-500 to-orange-400 px-8 py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl transition"
                >
                  Download Mirror
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
