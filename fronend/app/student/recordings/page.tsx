"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query,
  where 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { DashboardShell } from "@/components/dashboard-shell";
import { StudentGuard } from "@/components/student-guard";
import { Card, Badge } from "@/components/ui";
import { EmptyState } from "@/components/empty-state";
import { 
  Loader2, 
  Play, 
  Pause,
  ExternalLink,
  Search,
  Lock,
  CreditCard,
  Volume2,
  VolumeX,
  Maximize
} from "lucide-react";
import Link from "next/link";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface RecordingItem {
  id: string;
  courseId: string;
  courseTitle: string;
  grade: string;
  title: string;
  description?: string;
  videoUrl: string;
  passcode?: string;
  date: string;
  uploadedAt: string;
}

export interface StudentProfile {
  grade?: string;
  enrolledClasses?: string[];
}

export default function StudentRecordingsPage() {
  const [loading, setLoading] = useState(true);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [isPaid, setIsPaid] = useState(false);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<RecordingItem | null>(null);

  // Custom Video Player Controls State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [ytPlayer, setYtPlayer] = useState<any>(null);
  const [ytApiLoaded, setYtApiLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to extract YouTube Video ID
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    try {
      if (url.includes("youtube.com/watch")) {
        return new URL(url).searchParams.get("v");
      }
      if (url.includes("youtu.be/")) {
        return url.split("youtu.be/")[1]?.split("?")[0];
      }
      if (url.includes("youtube.com/embed/")) {
        return url.split("youtube.com/embed/")[1]?.split("?")[0];
      }
    } catch (e) {
      console.warn("YouTube ID parse error:", e);
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const studentDoc = await getDoc(doc(db, "users", user.uid));
          let enrolled: string[] = [];

          if (studentDoc.exists()) {
            const data = studentDoc.data() as StudentProfile;
            enrolled = data.enrolledClasses || [];
          }
          setEnrolledIds(enrolled);

          const paymentsQuery = query(
            collection(db, "payments"),
            where("studentUid", "==", user.uid)
          );
          const paymentsSnap = await getDocs(paymentsQuery);
          const approved = paymentsSnap.docs.some((d) => d.data().status === "Approved");
          setIsPaid(approved);

          const snapshot = await getDocs(collection(db, "recordings"));
          let items = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as RecordingItem[];

          if (enrolled.length > 0) {
            items = items.filter((r) => enrolled.includes(r.courseId));
          }

          items.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
          setRecordings(items);

          if (items.length > 0) {
            setSelectedVideo(items[0]);
          }
        } catch (err) {
          console.error("Error loading recordings:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Disable right-click context menu and screen capture hotkeys
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect PrintScreen, Win+Shift+S, Mac Cmd+Shift+3/4/5, F12, inspect shortcuts
      if (
        e.key === "PrintScreen" ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "S" || e.key === "s")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u" || e.key === "S" || e.key === "s" || e.key === "P" || e.key === "p")) ||
        (e.metaKey && e.shiftKey && (e.key === "S" || e.key === "s" || e.key === "3" || e.key === "4" || e.key === "5"))
      ) {
        e.preventDefault();
        setIsBlurred(true);
        if (ytPlayer && ytPlayer.mute) {
          ytPlayer.mute();
          setIsMuted(true);
        }
        if (ytPlayer && ytPlayer.pauseVideo) {
          ytPlayer.pauseVideo();
          setIsPlaying(false);
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ytPlayer]);

  // Initialize YouTube Player when video changes
  useEffect(() => {
    if (!selectedVideo) return;
    const videoId = getYouTubeId(selectedVideo.videoUrl);
    if (!videoId || !window.YT || !window.YT.Player) return;

    // Destroy existing player if needed
    if (ytPlayer && typeof ytPlayer.destroy === "function") {
      ytPlayer.destroy();
    }

    const player = new window.YT.Player("youtube-player-iframe", {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,            // Hide default YouTube controls (play button, timeline, volume)
        rel: 0,                 // Hide related videos at the end
        modestbranding: 1,      // Remove YouTube logo
        disablekb: 1,           // Disable keyboard shortcuts
        fs: 0,                  // Hide YouTube fullscreen button
        playsinline: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (event: any) => {
          setYtPlayer(event.target);
          setDuration(event.target.getDuration());
          event.target.playVideo();
          setIsPlaying(true);
        },
        onStateChange: (event: any) => {
          // YT.PlayerState.PLAYING === 1, PAUSED === 2, ENDED === 0
          if (event.data === 1) setIsPlaying(true);
          if (event.data === 2 || event.data === 0) setIsPlaying(false);
        },
      },
    });

    return () => {
      if (player && typeof player.destroy === "function") {
        player.destroy();
      }
    };
  }, [selectedVideo, ytApiLoaded]);

  // Sync timeline progress
  useEffect(() => {
    if (!ytPlayer || !isPlaying) return;
    const interval = setInterval(() => {
      if (ytPlayer.getCurrentTime) {
        setCurrentTime(ytPlayer.getCurrentTime());
        if (!duration && ytPlayer.getDuration) {
          setDuration(ytPlayer.getDuration());
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [ytPlayer, isPlaying, duration]);

  // Toggle Play / Pause
  const togglePlayPause = () => {
    if (!ytPlayer) return;
    if (isPlaying) {
      ytPlayer.pauseVideo();
      setIsPlaying(false);
    } else {
      ytPlayer.playVideo();
      setIsPlaying(true);
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!ytPlayer) return;
    if (isMuted) {
      ytPlayer.unMute();
      setIsMuted(false);
    } else {
      ytPlayer.mute();
      setIsMuted(true);
    }
  };

  // Seek Timeline
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (ytPlayer && ytPlayer.seekTo) {
      ytPlayer.seekTo(newTime, true);
    }
  };

  // Fullscreen Container
  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const filteredRecordings = recordings.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedVideoId = selectedVideo ? getYouTubeId(selectedVideo.videoUrl) : null;

  return (
    <StudentGuard>
      {/* YouTube IFrame API Script */}
      <Script
        src="https://www.youtube.com/iframe_api"
        onLoad={() => {
          window.onYouTubeIframeAPIReady = () => {
            setYtApiLoaded(true);
          };
        }}
      />

      <DashboardShell role="student" active="Recordings">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.18em] text-lavender-600">
            Student Portal
          </p>
          <h1 className="mt-2 text-3xl font-black md:text-4xl">Class Recordings</h1>
          <p className="mt-2 text-ink/55">
            Protected video recordings and theory lesson playback for your enrolled courses.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center p-12 text-ink/50">
            <Loader2 className="h-8 w-8 animate-spin text-lavender-600" />
            <p className="mt-3 text-sm font-bold">Loading class recordings...</p>
          </div>
        ) : !isPaid || enrolledIds.length === 0 ? (
          /* UNPAID LOCK STATE */
          <Card className="mt-8 p-8 text-center md:p-12 border-amber-200 bg-amber-50/40">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-100 text-amber-700 text-3xl shadow-sm">
              🔒
            </div>
            <h3 className="mt-4 text-xl font-black text-amber-900">Access Restricted</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-amber-800/80 leading-relaxed">
              You must be enrolled in a course with an approved payment to access video recordings.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/student/courses" className="gradient-button px-6 py-2.5 text-xs shadow-md">
                Go to My Courses
              </Link>
              <Link
                href="/student/payments"
                className="flex items-center gap-1.5 rounded-2xl bg-white px-5 py-2.5 text-xs font-black text-amber-900 shadow-sm border border-amber-300"
              >
                <CreditCard size={15} /> Make Payment
              </Link>
            </div>
          </Card>
        ) : recordings.length === 0 ? (
          /* EMPTY RECORDINGS STATE */
          <div className="mt-8">
            <EmptyState
              emoji="📹"
              title="No Class Recordings Available"
              description="Your teacher hasn't uploaded video recordings for your enrolled courses yet."
              actionLabel="View My Courses"
              actionHref="/student/courses"
            />
          </div>
        ) : (
          /* MAIN RECORDINGS PLAYER & LIST LAYOUT */
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* MAIN SECURE VIDEO PLAYER BOX */}
            <div className="lg:col-span-2 space-y-4">
              {selectedVideo && (
                <div className="rounded-3xl bg-white p-4 md:p-6 shadow-soft border border-white">
                  {/* SECURE PLAYER CONTAINER */}
                  <div
                    ref={containerRef}
                    className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl group"
                  >
                    {selectedVideoId ? (
                      <>
                        {/* SCREEN BLUR OVERLAY FOR SCREEN RECORDING / TAB SWITCH */}
                        {isBlurred && (
                          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/90 p-6 text-center backdrop-blur-xl animate-in fade-in duration-200">
                            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/20 text-rose-400 text-2xl shadow-lg border border-rose-500/30 mb-3">
                              🛡️
                            </div>
                            <h4 className="text-lg font-black text-white">Screen Protected</h4>
                            <p className="mt-1 text-xs text-white/70 max-w-xs">
                              Playback is blurred when switching windows or taking screen captures. Return focus to resume.
                            </p>
                          </div>
                        )}
                        {/* Hidden YouTube IFrame Target */}
                        <div id="youtube-player-iframe" className="h-full w-full pointer-events-none" />

                        {/* TOP OVERLAY BLOCKER (Blocks YouTube Title & Share Button) */}
                        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto z-20" />

                        {/* CUSTOM SECURE CONTROLS BAR (Play/Pause, Timeline, Duration, Volume, Fullscreen) */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 z-30 flex flex-col gap-2">
                          {/* TIMELINE SEEKER */}
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-mono font-bold text-white/80 shrink-0">
                              {formatTime(currentTime)}
                            </span>
                            <input
                              type="range"
                              min={0}
                              max={duration || 100}
                              value={currentTime}
                              onChange={handleSeek}
                              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/30 accent-lavender-400 focus:outline-none"
                            />
                            <span className="text-[11px] font-mono font-bold text-white/60 shrink-0">
                              {formatTime(duration)}
                            </span>
                          </div>

                          {/* CONTROL BUTTONS */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-3">
                              {/* SINGLE PLAY / STOP BUTTON */}
                              <button
                                onClick={togglePlayPause}
                                className="grid h-10 w-10 place-items-center rounded-xl bg-lavender-600 text-white hover:bg-lavender-700 transition shadow-md"
                                title={isPlaying ? "Pause" : "Play"}
                              >
                                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                              </button>

                              {/* MUTE BUTTON */}
                              <button
                                onClick={toggleMute}
                                className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
                                title={isMuted ? "Unmute" : "Mute"}
                              >
                                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                              </button>
                            </div>

                            <button
                              onClick={toggleFullScreen}
                              className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
                              title="Fullscreen"
                            >
                              <Maximize size={16} />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* EXTERNAL NON-YOUTUBE LINK FALLBACK */
                      <div className="flex h-full flex-col items-center justify-center p-6 text-center text-white">
                        <Play size={48} className="text-lavender-400 mb-3" />
                        <p className="font-bold text-sm">External Stream Link</p>
                        <a
                          href={selectedVideo.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 gradient-button px-5 py-2.5 text-xs shadow-md inline-flex items-center gap-2"
                        >
                          Open Stream <ExternalLink size={14} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Video Metadata Box */}
                  <div className="mt-5">
                    <div className="flex items-center gap-2">
                      <Badge tone="purple">{selectedVideo.grade || "Science"}</Badge>
                      <Badge tone="lavender">{selectedVideo.courseTitle}</Badge>
                      <span className="ml-auto text-xs font-bold text-ink/40">{selectedVideo.date}</span>
                    </div>

                    <h2 className="mt-3 text-2xl font-black text-ink">{selectedVideo.title}</h2>
                    {selectedVideo.description && (
                      <p className="mt-2 text-xs leading-relaxed text-ink/70 bg-lavender-50/50 p-4 rounded-2xl border border-lavender-100">
                        {selectedVideo.description}
                      </p>
                    )}

                    {selectedVideo.passcode && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800 border border-amber-200">
                        🔑 Playback Passcode: <span className="font-mono text-sm">{selectedVideo.passcode}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SIDEBAR PLAYLIST */}
            <div className="space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="text"
                  placeholder="Search recordings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pastel-input pl-10 w-full text-xs"
                />
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredRecordings.map((rec) => {
                  const isSelected = selectedVideo?.id === rec.id;

                  return (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedVideo(rec)}
                      className={`p-4 rounded-2xl cursor-pointer transition border ${
                        isSelected
                          ? "bg-lavender-600 text-white shadow-md border-lavender-600"
                          : "bg-white text-ink border-white hover:border-lavender-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-bold ${isSelected ? "text-white/80" : "text-lavender-600"}`}>
                          {rec.courseTitle}
                        </span>
                        <span className={`text-[10px] ${isSelected ? "text-white/70" : "text-ink/40"}`}>
                          {rec.date}
                        </span>
                      </div>

                      <h4 className="mt-2 font-black text-sm leading-snug">{rec.title}</h4>

                      <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-current/10">
                        <span className="flex items-center gap-1 font-bold">
                          <Play size={12} /> {isSelected ? "Now Playing" : "Play Recording"}
                        </span>
                        {rec.passcode && (
                          <span className={`text-[10px] ${isSelected ? "text-amber-200" : "text-amber-700"}`}>
                            🔑 Passcode Required
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </DashboardShell>
    </StudentGuard>
  );
}
