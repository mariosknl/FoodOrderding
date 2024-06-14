import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type SessionStore = {
	session: Session | null;
	setSession: (session: Session | null) => void;
	clearSession: () => void;
	isAdmin: boolean;
};

export const useSessionStore = create<SessionStore>()((set) => ({
	session: null,
	setSession: (session) => set({ session }),
	clearSession: () => set({ session: null }),
	isAdmin: false,
}));
