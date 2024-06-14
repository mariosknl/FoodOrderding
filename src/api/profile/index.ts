import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useProfile = (id: string) => {
	return useQuery({
		queryKey: ["profile", id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", id)
				.single();

			if (error) {
				throw new Error(error.message);
			}
			return data;
		},
	});
};
