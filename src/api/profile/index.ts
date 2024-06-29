import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetches a user profile based on the provided ID from the database.
 *
 * This hook uses the `useQuery` hook from React Query to asynchronously fetch a user profile from the "profiles" table in the database using Supabase.
 * It queries the table by the provided `id` and returns the single matching profile.
 *
 * @param {string} id - The unique identifier of the user profile to fetch.
 * @returns An object containing the following properties:
 * - `status`: The status of the query ('loading', 'error', 'success').
 * - `data`: The user profile fetched from the database, or `undefined` if the data is not yet available or an error occurred.
 * - `error`: The error object if an error occurred during the fetch operation.
 * - `isFetching`: A boolean indicating if the query is in the process of fetching data.
 * - `refetch`: A function that can be called to refetch the data.
 */
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
