"use client";

import { User, Upload, LogOut, PlayCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUser, logout } from "../hooks/action";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import useSetuser from "../store";

interface UserProp {
  userName: string;
  profile: string;
  role: "user" | "admin" | "tester";
  _id: string;
}

const AuthButton = ({ id }: { id?: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const cachedUser = useSetuser((s) => s.setUser);
  const removeUser = useSetuser((s) => s.clearUser);
  const user = useSetuser((e) => e.user);
  useEffect(() => {
    if (!id) return;

    const getData = async () => {
      if(user) return;
      const data = await getUser(id);
      setLoading(true);
      try {
        if (data.success){
          cachedUser(data.user);
        };
      } catch (error) {
        setLoading(false);
      }
      finally{
        setLoading(false);
      }
    };

    getData();
  }, [id]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    const data = await logout();
    if (data.success) {
      toast.success(data.message);
      removeUser();
    }
  };

  if (user === null) {
    return (
      <button
        disabled={loading}
        onClick={() => router.push("/rip/auth")}
        className="rounded-lg border p-2 hover:bg-accent flex items-center gap-2"
      >
        {loading ? <Spinner/> : <>
        <User size={18} />
        <span className="font-semibold">Login</span>
        </>}
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-lg border p-2 hover:bg-accent flex items-center gap-2"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={user?.profile}
            className="object-cover pointer-events-none"
          />
          <AvatarFallback>
            {user?.userName.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="hidden sm:block">{user?.userName}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-background shadow-lg overflow-hidden z-50">
          {user?.role === "admin" && (
            <>
              <button
                onClick={() => router.push(`/admin/${user._id}`)}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-accent"
              >
                <Lock size={16} />
                Admin
              </button>
              <button
                onClick={() => router.push(`/upload/${user._id}`)}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-accent"
              >
                <Upload size={16} />
                Upload Mod
              </button>
            </>
          )}
          {user?.role === "admin" || user?.role === "tester" ? (
            <button
              onClick={() => router.push(`/test/${user._id}`)}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-accent"
            >
              <PlayCircle size={16} />
              Test Mod
            </button>
          ) : null}

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-accent text-red-500"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButton;
