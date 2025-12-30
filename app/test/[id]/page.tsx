"use client";

import { JSX,useEffect, useState } from "react";
import {
  CheckCircle,
  ShieldAlert,
  ClipboardCheck,
  Gamepad2,
  DownloadCloud,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getGames, updateGame } from "@/app/hooks/action";
import { toast } from "sonner";
import { useParams } from "next/navigation";

type GameStatus = "tested" | "untested" | "outdated" | "onreview";

interface gameProps {
  _id:string;
  gamename: string;
  version: string;
  status: GameStatus;
  gameimage: string;
  features: string[];
  creator: string;
  link: string;
}

const STATUS_UI: Record<
  GameStatus,
  {
    badge: string;
    ring: string;
    bg: string;
    icon: JSX.Element;
    label: string;
  }
> = {
  untested: {
    badge: "bg-yellow-500 text-black",
    ring: "ring-yellow-500/40",
    bg: "bg-yellow-500/5",
    icon: <Clock size={14} />,
    label: "UNTESTED",
  },
  onreview: {
    badge: "bg-blue-600",
    ring: "ring-blue-500/40",
    bg: "bg-blue-500/5",
    icon: <ClipboardCheck size={14} />,
    label: "ON REVIEW",
  },
  tested: {
    badge: "bg-green-600",
    ring: "ring-green-500/40",
    bg: "bg-green-500/5",
    icon: <CheckCircle size={14} />,
    label: "TESTED",
  },
  outdated: {
    badge: "bg-red-600",
    ring: "ring-red-500/40",
    bg: "bg-red-500/5",
    icon: <AlertTriangle size={14} />,
    label: "OUTDATED",
  },
};

const TesterPage = () => {
  const [games, setGames] = useState<gameProps[]>([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const id = params.id;

  const updateStatus = async(id: string, status: GameStatus) => {
    try {
      setLoading(true);
      setGames((prev) =>
      prev.map((g) => (g._id === id ? { ...g, status } : g))
    );
    const data = await updateGame(id, status);
    if(data.success){
      toast.success(data.message);
    }
    else{
      toast.error(data.message);
    }
    } catch (error) {
      toast.error("Something went wrong");
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      const data = await getGames();
      if (data.success) {
        setGames(data.games);
      } else {
        toast.error(data.games);
      }
    };
    getData();
  }, [id]);

  const download = (url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  };

  const visibleGames = games.filter((g) => g.status !== "tested");

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-10">
      <div className="mx-auto max-w-7xl mb-10">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <ClipboardCheck className="text-primary" />
          Tester Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl mb-3">
          Each status has a distinct visual state for faster reviewing.
        </p>
      </div>

      <div className="mx-auto max-w-7xl grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {visibleGames.map((game) => {
          const ui = STATUS_UI[game.status];

          return (
            <div
              key={game.gamename}
              className={`rounded-2xl border bg-card shadow-sm hover:shadow-xl transition overflow-hidden flex flex-col ring-1 ${ui.ring}`}
            >
              <div className={`relative aspect-video ${ui.bg}`}>
                <img
                  src={game.gameimage}
                  alt={game.gamename}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <Badge
                  className={`absolute top-3 right-3 flex items-center gap-1 ${ui.badge}`}
                >
                  {ui.icon}
                  {ui.label}
                </Badge>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Gamepad2 size={18} />
                  {game.gamename}
                </h2>

                <p className="text-xs text-muted-foreground mt-1">
                  Version {game.version} • {game.creator}
                </p>

                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {game.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <CheckCircle size={14} className="text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="secondary"
                  className="mt-4 gap-2"
                  onClick={() => download(game.link, game.gamename)}
                >
                  <DownloadCloud size={16} />
                  Download & Test
                </Button>

                <div className="mt-4 flex gap-2">
                  {game.status === "untested" && (
                    <Button
                      className="flex-1 bg-yellow-500 text-black hover:bg-yellow-400"
                      onClick={() =>
                        updateStatus(game._id, "onreview")
                      }
                    >
                      Start Review
                    </Button>
                  )}

                  {game.status === "onreview" && (
                    <>
                      <Button
                        className="flex-1 gap-2 bg-green-600 hover:bg-green-500"
                        onClick={() =>
                          updateStatus(game._id, "tested")
                        }
                      >
                        <CheckCircle size={16} />
                        Mark Tested
                      </Button>

                      <Button
                        variant="destructive"
                        className="flex-1 gap-2"
                        onClick={() =>
                          updateStatus(game._id, "outdated")
                        }
                      >
                        <ShieldAlert size={16} />
                        Mark Outdated
                      </Button>
                    </>
                  )}

                  {game.status === "outdated" && (
                    <Button
                      className="flex-1"
                      onClick={() =>
                        updateStatus(game._id, "onreview")
                      }
                    >
                      Retest
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default TesterPage;
