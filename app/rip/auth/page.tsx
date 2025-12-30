"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { upload } from "@imagekit/next";
import { Progress } from "@/components/ui/progress";
import { deleteImage, login, register } from "@/app/hooks/action";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [isLogin, setLogin] = useState(false);
  const [profile, setProfile] = useState("");
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirm] = useState("");
  const [progress, setProgress] = useState(0);
  const [rawImage, setRaw] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const switchPage = () => setLogin(!isLogin);

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const previewImage = (file: FileList) => {
    try {
      const currentFile = file[0];
      setRaw(currentFile);
      const blob = URL.createObjectURL(currentFile);
      setProfile(blob);
    } catch (error) {
      setProfile("");
    }
  };

  const authenticator = async () => {
    try {
      const response = await fetch("/api/auth/auth_upload");
      if (!response.ok) {
        const errorText = await response.text();
        toast.error(errorText);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      toast.error("Authentication error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!username || !password) return toast.error("Some fields are missing");
      if (password.length <= 8) return toast.error("Password length too short");
      setLoading(true);
      if (rawImage) {
        try {
          const abortController = new AbortController();
          setProgress(0);
          let authparams = await authenticator();
          if (!authparams) return;
          const { token, signature, expire, publicKey } = authparams;
          const uploadResponse = await upload({
            token,
            signature,
            expire,
            publicKey,
            file: rawImage,
            fileName: username,
            folder: "/profiles",
            onProgress: (event) => {
              setProgress((event.loaded / event.total) * 100);
            },
            abortSignal: abortController.signal,
          });
          const data = await register(
            username,
            password,
            uploadResponse.url,
            uploadResponse.fileId
          );
          if (data.success) {
            toast.success(data.message);
            setLogin(true);
            setLogin(true);
            setProfile("");
          } else {
            const data = await deleteImage(uploadResponse.fileId as string);
          }
        } catch (error) {
          toast.error("Authentication failed");
        } finally {
          setLoading(false);
        }
      } else {
        try {
          const data = await register(username, password);
          if (data.success) {
            toast.success(data.message);
            setProfile("");
            setLogin(true);
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error("Something went wrong");
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleLogin = async(e:React.FormEvent) => {
    e.preventDefault();
    if(!username || !password) return toast.error("Some fields are missing");
    const data = await login(username, password);
    if(data.success){
      toast.success(data.message);
      router.push("/");
    }
    else{
      toast.error(data.message);
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={formVariants}
              transition={{ duration: 0.4 }}
              className="rounded-2xl bg-card p-8 shadow-lg sm:p-10"
            >
              <h2 className="text-2xl font-bold text-center sm:text-3xl text-foreground">
                Login
              </h2>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Enter your details to sign in
              </p>

              <form onSubmit={handleLogin} className="mt-6 space-y-5">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Your username"
                    className="mt-1 w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="mt-1 w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <button className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
                  Sign In
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={switchPage}
                  className="text-primary cursor-pointer hover:underline"
                >
                  Sign up
                </button>
                <br />
                <br />
                <Link href={"/"} className="underline">
                  Continue as Guest?
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={formVariants}
              transition={{ duration: 0.4 }}
              className="rounded-2xl bg-card p-8 shadow-lg sm:p-10"
            >
              <h2 className="text-2xl font-bold text-center sm:text-3xl text-foreground">
                Create Account
              </h2>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Enter your details to sign up
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Your username"
                    className="mt-1 w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="mt-1 w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                  {password && password.length <= 8 && (
                    <p className="text-base text-red-500">
                      Password length must be greater than 8
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPass}
                    disabled={!password}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Confirm password"
                    className="mt-1 w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />
                  {confirmPass && confirmPass !== password ? (
                    <p className="text-red-500 text-base ">
                      Password doesn't match
                    </p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground">
                    Upload profile (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    disabled={loading}
                    onChange={(event) =>
                      previewImage(event.target.files as FileList)
                    }
                    className="mt-1 w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  />

                  {profile === "" ? null : (
                    <div className="flex flex-col items-center gap-2 justify-center mt-5">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
                        <img
                          src={profile}
                          alt="user profile"
                          className="w-full h-full pointer-events-none rounded-full object-cover border-2 border-primary"
                        />
                      </div>
                      <Progress value={progress} />
                    </div>
                  )}
                </div>

                <button
                  disabled={loading}
                  className="w-full flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
                >
                  {loading ? <Spinner /> : "Sign Up"}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={switchPage}
                  className="text-primary cursor-pointer hover:underline"
                >
                  Log in
                </button>
                <br />
                <br />
                <Link href={"/"} className="underline">
                  Continue as Guest?
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
