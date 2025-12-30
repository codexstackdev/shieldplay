"use client";

import {
  Sun,
  Moon,
  Download,
  ShieldCheck,
  User,
  CheckCircle,
  Search,
  VerifiedIcon,
  ShieldAlertIcon,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import AuthButton from "./components/authButton";
import { getGames } from "./hooks/action";
import { toast } from "sonner";
import LoadingAnimation from "./components/loadingAnimation";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DownloadModal } from "./components/DownloadModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface gameProps {
  gamename: string;
  version: string;
  status: "tested" | "untested" | "outdated" | "onreview";
  gameimage: string;
  features: string[];
  creator: string;
  link: string;
  uploader: { userName: string; profile: string };
}

export default function Page() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<string | undefined>();
  const [mods, setMods] = useState<gameProps[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMod, setSelectedMod] = useState<{ link: string; gamename: string } | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const res = await fetch("/api/khryzshie");
      const data = await res.json();
      if (data.authenticated) setUser(data.user.user);
    };
    verifyToken();
  }, []);

  useEffect(() => {
    const getMods = async () => {
      const data = await getGames();
      if (data.success) setMods(data.games);
      else toast.error(data.message);
      setLoading(false);
    };
    getMods();
  }, []);

  const filtered = useMemo(() => {
    return mods
      .filter((g) => g.status !== "untested" && g.status !== "onreview")
      .filter((g) => g.gamename.toLowerCase().includes(search.toLowerCase()));
  }, [mods, search]);

  if (loading) return <LoadingAnimation />;

  const openDownloadModal = (mod: gameProps) => {
    if (mod.status === "outdated") return;
    setSelectedMod({ link: mod.link, gamename: mod.gamename });
    setModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <h1 className="text-lg font-semibold tracking-wide">SHIELDPLAY</h1>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-lg border p-2 hover:bg-accent"
            >
              {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <AuthButton id={user as string} />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Safe & Tested Game Mods</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Every mod is reviewed before becoming publicly downloadable.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search games..."
            className="w-full rounded-xl border bg-background py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        {filtered.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl font-bold text-primary mb-2">No Games Found</h1>
            <p className="text-muted-foreground max-w-sm">
              Sorry, we couldn’t find any games matching your search. Try another search or check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((mod) => (
              <div
                key={mod.gamename}
                className="overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-video">
                  <img src={mod.gameimage} alt={mod.gamename} className="absolute pointer-events-none inset-0 h-full w-full object-cover" />

                  {mod.status === "tested" && (
                    <Badge className="absolute right-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs text-white flex gap-1">
                      <VerifiedIcon className="size-4" />
                      TESTED
                    </Badge>
                  )}

                  {mod.status === "outdated" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                      <Badge className="rounded-full bg-red-600 px-4 py-2 text-sm text-white flex gap-2 animate-pulse">
                        <AlertTriangle size={16} />
                        OUTDATED
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      {mod.creator}
                    </div>
                    <span>{mod.version}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Avatar>
                      <AvatarImage src={mod.uploader.profile} alt="profile" className="object-cover pointer-events-none" />
                      <AvatarFallback>{mod.uploader.userName.slice(0, 1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">Uploaded by {mod.uploader.userName}</span>
                  </div>

                  <h3 className="text-lg font-semibold">{mod.gamename}</h3>

                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {mod.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <CheckCircle size={14} className="text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {mod.status === "outdated" && (
                    <Alert variant="destructive" className="mt-4">
                      <ShieldAlertIcon className="h-4 w-4" />
                      <AlertTitle>Game Outdated</AlertTitle>
                      <AlertDescription>
                        This mod is currently unavailable. Please wait for the new update.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="mt-4">
                    <button
                      disabled={mod.status === "outdated"}
                      onClick={() => openDownloadModal(mod)}
                      className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs ${
                        mod.status === "outdated"
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>

                  {mod.status === "tested" ? (
                    <div className="mt-3 flex items-center gap-1 text-xs text-green-600">
                      <ShieldCheck size={14} />
                      Safety Verified
                    </div>
                  ) : mod.status === "outdated" ? (
                    <div className="mt-3 flex items-center gap-1 text-xs text-red-600">
                      <ShieldAlertIcon size={14} />
                      Update Required
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedMod && (
        <DownloadModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          fileUrl={selectedMod.link}
          gamename={selectedMod.gamename}
        />
      )}

      <footer className="border-t px-4 py-6 text-center text-xs text-muted-foreground">
        Mods are created by independent developers. Use at your own risk.
      </footer>
    </main>
  );
}
