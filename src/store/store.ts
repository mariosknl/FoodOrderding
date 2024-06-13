import { Tables } from "@/database.types";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";

type Store = {
	categories: Tables<"categories">[] | [] | null;
	types: Tables<"types">[] | [] | null;
	setCategories: (categories: Tables<"categories">[]) => void;
	setTypes: (types: Tables<"types">[]) => void;
	items: Tables<"items">[] | null;
	setItems: (items: Tables<"items">[]) => void;
	fetchTypes: () => void;
	fetchCategories: () => void;
	fetchItems: (categoryId: number) => void;
};

export const useStore = create<Store>()((set) => ({
	categories: [],
	types: [],
	setCategories: (categories) => set({ categories }),
	setTypes: (types) => set({ types }),
	items: [],
	setItems: (items) => set({ items }),
	fetchTypes: async () => {
		const { data: types } = await supabase.from("types").select("*");
		set({ types });
	},
	fetchCategories: async () => {
		const { data: categories } = await supabase.from("categories").select("*");
		set({ categories });
	},
	fetchItems: async (categoryId) => {
		const { data, error } = await supabase
			.from("items")
			.select(
				`
          id,
          name,
          price,
          img,
          info,
          type_id,
          types (
            id,
            name,
            category_id,
            categories (
              id,
              name,
              category_image
            )
          )
        `
			)
			.eq("types.category_id", categoryId);

		if (error) {
			throw error;
		}

		set({ items: data });
	},
}));

export const useItemsList = (categoryId: number) => {
	const { fetchItems, items } = useStore();

	return useQuery({
		queryKey: ["items", categoryId],
		queryFn: () => fetchItems(categoryId),
		refetchOnWindowFocus: true,
	});
};
