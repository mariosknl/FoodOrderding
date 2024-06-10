import { CartItem, Product } from "@/types";
import { create } from "zustand";

export interface BasketStore {
	products: Array<Product & { quantity: number }>;
	addProduct: (product: Product) => void;
	removeProduct: (item: Product) => void;
	updateProduct: (item: Product, quantity: number) => void;
	clearCart: () => void;
	items: number;
	total: number;
}

export const useBasketStore = create<BasketStore>()((set) => ({
	products: [],
	items: 0,
	total: 0,
	addProduct: (product) => {
		set((state) => {
			state.items += 1;
			state.total += product.price;
			const hasProduct = state.products.find((item) => item.id === product.id);

			if (hasProduct) {
				hasProduct.quantity += 1;
				return { products: state.products };
			} else {
				return { products: [...state.products, { ...product, quantity: 1 }] };
			}
		});
	},
	updateProduct: (product, quantity) => {
		set((state) => {
			state.items += quantity;
			state.total += product.price * quantity;
			return {
				products: state.products.map((p) => {
					if (p.id === product.id) {
						p.quantity += quantity;
					}
					return p;
				}),
			};
		});
	},
	removeProduct: (product) => {
		set((state) => {
			state.items -= 1;
			state.total -= product.price;
			return {
				products: state.products
					.map((p) => {
						if (p.id === product.id) {
							p.quantity -= 1;
						}
						return p;
					})
					.filter((p) => p.quantity > 0),
			};
		});
	},
	clearCart: () => set({ products: [], items: 0, total: 0 }),
}));
