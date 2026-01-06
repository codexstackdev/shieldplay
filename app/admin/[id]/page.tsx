"use client";
import { changeRole, changeStatusGame, getResources } from "@/app/hooks/action";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FullPageLoader from "@/app/components/loadingAnimation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";

interface userProps {
  _id: string;
  userName: string;
  profile: string;
  role: string;
}

interface gameProps {
  gamename: string;
  status: "tested" | "untested" | "outdated" | "onreview";
  gameimage: string;
  version: string;
  _id: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<userProps[]>([]);
  const [games, setGames] = useState<gameProps[]>([]);
  const [pageLoad, setPageload] = useState(true);
  const [loading, setLoading] = useState(false);

  const [openUserModal, setOpenUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<userProps | null>(null);
  const [selectedRole, setSelectedRole] = useState<"admin" | "user" | "tester">(
    "user"
  );

  const [openGameModal, setOpenGameModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<gameProps | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    "tested" | "untested" | "outdated" | "onreview"
  >("onreview");

  const gameStatuses = {
    tested: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    untested: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    outdated: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    onreview: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  const roleStyles = {
    user: "bg-zinc-800 text-zinc-300",
    tester: "bg-indigo-500/15 text-indigo-400",
    admin: "bg-purple-500/15 text-purple-400",
  };

  const roles = ["user", "tester", "admin"];
  const statuses = ["tested", "untested", "outdated", "onreview"];

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getResources();
        if (data.success) {
          setUsers(data.users);
          setGames(data.games);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setPageload(false);
      }
    };
    getData();
  }, []);

  if (pageLoad) return <FullPageLoader />;

  const handleGame = async (
    id: string,
    status: "tested" | "untested" | "outdated" | "onreview"
  ) => {
    setLoading(true);
    try {
      const data = await changeStatusGame(id, status);
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpenGameModal(false);
    }
  };

  const handleUser = async(id:string, role: "user" | "admin" | "tester") => {
    setLoading(true);
    try {
      const data = await changeRole(id, role);
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpenUserModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d10] text-zinc-100 px-4 py-6 sm:px-6 lg:px-10">
      <header className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Admin Panel
        </h1>
        <p className="text-zinc-400 mt-1 text-sm sm:text-base">
          User roles & game moderation
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* USERS */}
        <section>
          <h2 className="text-lg sm:text-xl font-medium mb-5">Users</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex flex-col sm:flex-row mb-3 sm:items-center sm:justify-between gap-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 p-4 sm:p-5 hover:border-indigo-500/40 transition"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-11 w-11">
                    <AvatarImage
                      className="pointer-events-none object-cover"
                      src={user.profile}
                      alt={user.userName}
                    />
                    <AvatarFallback>{user.userName[0]}</AvatarFallback>
                  </Avatar>

                  <div className="leading-tight">
                    <p className="font-medium truncate max-w-45">
                      {user.userName}
                    </p>
                    <p className="text-xs text-zinc-500 truncate max-w-45">
                      {user._id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-full text-xs capitalize ${
                      roleStyles[user.role as keyof typeof roleStyles]
                    }`}
                  >
                    {user.role}
                  </span>
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      setSelectedUser(user);
                      setSelectedRole(user.role as "admin" | "user" | "tester");
                      setOpenUserModal(true);
                    }}
                  >
                    Change Role
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GAMES */}
        <section>
          <h2 className="text-lg sm:text-xl font-medium mb-5">Games</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {games.map((game) => (
              <div
                key={game._id}
                className="group rounded-2xl bg-zinc-900/60 border border-zinc-800 overflow-hidden hover:border-indigo-500/40 transition flex flex-col"
              >
                <div className="w-full h-48 sm:h-60 md:h-64 lg:h-72 overflow-hidden relative">
                  <img
                    src={game.gameimage}
                    alt={game.gamename}
                    className="w-full h-full pointer-events-none object-cover object-center group-hover:scale-105 transition"
                  />
                </div>

                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium truncate">{game.gamename}</p>
                    <span className="text-xs text-zinc-400 shrink-0">
                      v{game.version}
                    </span>
                  </div>

                  <span
                    className={`w-fit px-3 py-1 rounded-full text-xs border ${
                      gameStatuses[game.status]
                    }`}
                  >
                    {game.status}
                  </span>

                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setSelectedGame(game);
                      setSelectedStatus(game.status);
                      setOpenGameModal(true);
                    }}
                  >
                    Change Status
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* USER ROLE MODAL */}
      <Dialog open={openUserModal} onOpenChange={setOpenUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role for {selectedUser?.userName}</DialogTitle>
          </DialogHeader>
          <RadioGroup
            value={selectedRole}
            onValueChange={(value) =>
              setSelectedRole(value as "admin" | "user" | "tester")
            }
            className="flex flex-col gap-2"
          >
            {roles.map((role) => (
              <div key={role} className="flex items-center gap-2">
                <RadioGroupItem value={role} id={role} />
                <label htmlFor={role}>{role}</label>
              </div>
            ))}
          </RadioGroup>
          <DialogFooter>
            <Button
              disabled={loading}
              onClick={() => {
                handleUser(selectedUser?._id as string, selectedRole);
              }}
            >
              {loading ? (
                <span>
                  <Spinner />
                </span>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* GAME STATUS MODAL */}
      <Dialog open={openGameModal} onOpenChange={setOpenGameModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Change Status for {selectedGame?.gamename}
            </DialogTitle>
          </DialogHeader>
          <RadioGroup
            value={selectedStatus}
            onValueChange={(value) =>
              setSelectedStatus(
                value as "tested" | "untested" | "outdated" | "onreview"
              )
            }
            className="flex flex-col gap-2"
          >
            {statuses.map((status) => (
              <div key={status} className="flex items-center gap-2">
                <RadioGroupItem value={status} id={status} />
                <label htmlFor={status}>{status}</label>
              </div>
            ))}
          </RadioGroup>
          <DialogFooter>
            <Button
              disabled={loading}
              onClick={() => {
                handleGame(selectedGame?._id as string, selectedStatus);
              }}
            >
              {loading ? (
                <span>
                  <Spinner />
                </span>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
