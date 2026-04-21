import { ref, remove, update } from "firebase/database";
import { rtdb } from "../lib/firebase";
import toast from "react-hot-toast";

interface ModerationData {
  updatedAt: number;
  kickedOut?: boolean;
  kickedAt?: number;
  kickoutReason?: string;
  removed?: boolean;
  removedAt?: number;
  removedUntil?: number;
  removedDuration?: string;
  removedReason?: string;
  blocked?: boolean;
  blockedAt?: number;
  blockedReason?: string;
  isMuted?: boolean;
  mutedAt?: number;
}

export const handleModerationAction = async (
  type: "audio" | "video",
  roomId: string,
  targetUserId: string,
  action: "kickout" | "24h" | "7d" | "block" | "mute"
) => {
  const now = Date.now();
  let modData: ModerationData = { updatedAt: now };
  const isAudio = type === "audio";

  const paths = {
    mod: isAudio ? `room_moderation/${roomId}/${targetUserId}` : `live_moderation/${roomId}/${targetUserId}`,
    participants: isAudio ? `room_participants/${roomId}/${targetUserId}` : `live_participants/${roomId}/${targetUserId}`,
    speakerReq: `room_requests/${roomId}/speaker_requests/${targetUserId}`,
    cohostReq: `room_requests/${roomId}/cohost_requests/${targetUserId}`
  };

  if (action === "kickout") {
    modData = { ...modData, kickedOut: true, kickedAt: now, kickoutReason: "Violating rules" };
  } else if (action === "24h" || action === "7d") {
    const duration = action === "24h" ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    modData = {
      ...modData,
      removed: true,
      removedAt: now,
      removedUntil: now + duration,
      removedDuration: action,
      removedReason: "Temporary ban"
    };
  } else if (action === "block") {
    modData = { ...modData, blocked: true, blockedAt: now, blockedReason: "Permanent ban" };
  } else if (action === "mute") {
    modData = { ...modData, isMuted: true, mutedAt: now };
  }

  try {
    await update(ref(rtdb, paths.mod), modData);

    if (action !== "mute") {
      await remove(ref(rtdb, paths.participants));
      if (isAudio) {
        await remove(ref(rtdb, paths.speakerReq));
        await remove(ref(rtdb, paths.cohostReq));
      }
    }
    toast.success(`Action ${action} successful`);
  } catch (error) {
    console.error(error);
    toast.error("Operation failed");
  }
};