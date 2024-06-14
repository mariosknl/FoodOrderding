import { supabase } from "@/lib/supabase";
import { Tables } from "@/types";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type State = {
	session: Session | null;
	loading: boolean;
	profile: Tables<"profiles"> | null;
	isAdmin: boolean;
	setSession: (session: Session | null) => void;
	setProfile: (profile: Tables<"profiles"> | null) => void;
	setLoading: (loading: boolean) => void;
	fetchSession: () => void;
	clearSession: () => void;
};

export const useStore = create<State>((set) => ({
	session: null,
	loading: true,
	profile: null,
	isAdmin: false,
	setSession: (session) => set(() => ({ session })),
	setProfile: (profile) =>
		set(() => ({ profile, isAdmin: profile?.group === "ADMIN" })),
	setLoading: (loading) => set(() => ({ loading })),
	fetchSession: async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		set(() => ({ session }));

		if (session) {
			// fetch profile
			const { data } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", session.user.id)
				.single();
			set(() => ({ profile: data || null }));
			console.log("data", data);
		}

		set(() => ({ loading: false }));
	},
	clearSession: () =>
		set(() => ({ session: null, profile: null, isAdmin: false })),
}));
