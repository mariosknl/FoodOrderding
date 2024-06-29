import { btoa } from "react-native-quick-base64";

import { EXPO_VIVA_CLIENT_ID, EXPO_VIVA_CLIENT_SECRET } from "@/secrets";
import { Product } from "@/types";
import { create } from "zustand";
import { useStore } from "./store";

const TOKEN = btoa(`${EXPO_VIVA_CLIENT_ID}:${EXPO_VIVA_CLIENT_SECRET}`);

type State = {
	products: Array<Product & { quantity: number }>;
	items: number;
	total: number;
};

type SetState = (
	partial: Partial<State> | ((state: State) => Partial<State>)
) => void;

type GetState = () => State;

export interface BasketStore {
	products: Array<Product & { quantity: number }>;
	addProduct: (product: Product) => void;
	removeProduct: (item: Product) => void;
	updateProduct: (item: Product, quantity: number) => void;
	clearCart: () => void;
	checkout: () => Promise<CheckoutResponse>;
	items: number;
	total: number;
}

export interface CheckoutResponse {
	orderCode: string;
	accessToken: string;
}

export const useBasketStore = create<BasketStore>()(
	(set: SetState, get: GetState) => ({
		products: [],
		items: 0,
		total: 0,
		addProduct: (product) => {
			set((state) => {
				state.items += 1;
				state.total += product.price;

				const hasProduct = state.products.find(
					(item) => item.id === product.id
				);

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
		checkout: async () => {
			const state = get();
			const storeState = useStore.getState();

			// Step 1: Obtain an access token
			const tokenResponse = await fetch(
				"https://demo-accounts.vivapayments.com/connect/token",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: "Basic " + TOKEN,
					},
					body: new URLSearchParams({
						grant_type: "client_credentials",
					}).toString(),
				}
			);

			if (!tokenResponse.ok) {
				const responseBody = await tokenResponse.text();
				console.error(
					`HTTP error! status: ${tokenResponse.status}, body: ${responseBody}`
				);
				throw new Error(`HTTP error! status: ${tokenResponse.status}`);
			}

			const { access_token } = await tokenResponse.json();

			// Step 2: Create a payment order using the access token from above
			const orderResponse = await fetch(
				"https://demo-api.vivapayments.com/checkout/v2/orders",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${access_token}`,
					},
					body: JSON.stringify({
						amount: state.total * 100,
						customer: {
							email: storeState?.session?.user?.email,
							fullName: storeState?.profile?.full_name,
							phone: storeState?.profile?.phone,
						},
						currencyCode: 978,
						paymentNotification: true,
					}),
				}
			);

			if (!orderResponse.ok) {
				const responseBody = await orderResponse.text();
				console.error(
					`HTTP error! status: ${orderResponse.status}, body: ${responseBody}`
				);
				throw new Error(`HTTP error! status: ${orderResponse.status}`);
			}

			const { orderCode } = await orderResponse.json();

			return { orderCode, accessToken: access_token };
		},
	})
);
