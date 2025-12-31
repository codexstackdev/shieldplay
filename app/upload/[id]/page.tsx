"use client";

import UnauthorizedPage from "@/app/components/unauthorizedPage";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Upload, ImagePlus, CheckCircle, VerifiedIcon, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { upload } from "@imagekit/next";
import { deleteImage, uploadGame } from "@/app/hooks/action";
import { Spinner } from "@/components/ui/spinner";

const Page = () => {
  const params = useParams();
  const id = params.id;
  const allowedIds = ["695282db7390e96c6251430b"];
  const [auth, setAuth] = useState(false);
  const [gamename, setGamename] = useState("");
  const [version, setVersion] = useState("");
  const [creator, setCreator] = useState("");
  const [status, setStatus] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [downloadLink, setDownloadLink] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (allowedIds.includes(id as string)) setAuth(true);
  }, [id]);

  useEffect(() => {
    setFeatures(
      featuresInput
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean)
        .map((f) => f[0].toUpperCase() + f.slice(1))
    );
  }, [featuresInput]);

  if (!auth) return <UnauthorizedPage />;

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

  const handleUpload = async () => {
    try {
      const authparams = await authenticator();
      const abortController = new AbortController();
      if (!authparams) return;
      if (!image) return;
      setLoading(true);
      const { token, signature, expire, publicKey } = authparams;
      const uploadResponse = await upload({
        token,
        signature,
        expire,
        publicKey,
        file: image,
        fileName: gamename,
        folder: "/games",
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.signal,
      });
      const gameImage: string | undefined = uploadResponse.url;
      const imageId: string | undefined = uploadResponse.fileId;
      const data = await uploadGame(
        gamename,
        version,
        downloadLink,
        gameImage as string,
        features,
        imageId as string,
        creator,
        id as string,
        status,
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        const imageDelete = deleteImage(uploadResponse.fileId as string);
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight">Upload New Mod</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill out the details below. Mods are reviewed before publishing.
        </p>

        <div className="mt-8 space-y-8 rounded-2xl border bg-card p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Game Name</label>
              <input
                value={gamename}
                onChange={(e) => setGamename(e.target.value)}
                className="mt-1 w-full rounded-xl border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Clash of Clans"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Game Version</label>
              <input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="mt-1 w-full rounded-xl border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="v16.2.1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Mod Creator</label>
            <input
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              className="mt-1 w-full rounded-xl border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Your name or team"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Mod Features</label>
            <textarea
              className="mt-1 w-full rounded-xl border resize-none bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Unlimited gems, God mode, Fast build"
              rows={4}
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
            />

            {features.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    <VerifiedIcon size={14} />
                    {feature}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="w-full sm:w-1/2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Status
            </label>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="w-full rounded-xl border bg-background px-4 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="w-full bg-card rounded-xl shadow-md">
                <SelectItem value="tested">Tested</SelectItem>
                <SelectItem value="untested">Untested</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Game Download Link</label>
            <input
              type="url"
              value={downloadLink}
              onChange={(e) => setDownloadLink(e.target.value)}
              placeholder="https://www.dropbox.com/scl/fi/&dl=1"
              className="mt-1 w-full rounded-xl border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Direct link to the mod file (highly recommended dropbax edit the
              dl=0 to dl=1 for direct download)
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Game Image</label>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              hidden
              disabled={loading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImage(file);
                setPreview(URL.createObjectURL(file));
              }}
            />

            {!preview ? (
              <div
                onClick={() => fileRef.current?.click()}
                className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/40 p-8 transition hover:bg-muted"
              >
                <ImagePlus size={36} className="text-muted-foreground" />
                <p className="mt-2 text-sm font-semibold">Upload game image</p>
                <p className="text-xs text-muted-foreground">
                  PNG or JPG • Max 5MB
                </p>
              </div>
            ) : (
              <div className="relative mt-2 overflow-hidden rounded-xl border">
                <img
                  src={preview}
                  alt="Game preview"
                  className="h-56 w-full object-cover pointer-events-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                  }}
                  className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white"
                >
                  <X/>
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button onClick={() => router.replace("/")} className="rounded-xl border px-5 py-2.5 text-sm font-semibold hover:bg-accent transition">
              Cancel
            </button>

            <button
              onClick={handleUpload}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner />
                  Submitting
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload size={16} />
                  Submit Mod
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-green-600">
            <CheckCircle size={14} />
            Mods are manually reviewed before going live
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
