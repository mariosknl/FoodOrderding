import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/store";
import { PropsWithChildren, useEffect } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
	const { fetchSession, setSession, session, profile } = useStore();

	useEffect(() => {
		fetchSession();
		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		console.log("session from authprovider", profile);
	}, []);

	return children;
}
