import { useInsertOrderItems } from "@/api/order-item";
import { useInsertOrder } from "@/api/orders";
import { Tables } from "@/database.types";
import { useBasketStore } from "@/store/basketStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

async function verifyPayment(
	transactionId: string,
	accessToken: string | null
) {
	if (!transactionId) {
		console.error("Transaction ID is missing");
		return { status: "failed", error: "Transaction ID is missing" };
	}

	try {
		if (!accessToken) {
			console.error("Failed to retrieve access TOKEN");
			return { status: "failed", error: "Authentication error" };
		}

		const response = await fetch(
			`https://demo-api.vivapayments.com/checkout/v2/transactions/${transactionId}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error(`API responded with status code ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error: any) {
		console.error("Error verifying payment:", error);
		return { status: "failed", error: error.message };
	}
}

/**
 * `SuccessScreen` is a React component that displays the payment verification status.
 * It uses the `transactionId` and `accessToken` from the URL search params to verify the payment.
 * Upon mounting, it initiates the payment verification process and displays the status.
 *
 * Uses the `useInsertOrder` hook to potentially insert an order based on the payment status.
 *
 * @returns A React component that displays an activity indicator while verifying the payment,
 * and then shows the payment status as text.
 */
const SuccessScreen = () => {
	const { transactionId, accessToken } = useLocalSearchParams();
	const [paymentStatus, setPaymentStatus] = useState("");
	const { mutate: insertOrder } = useInsertOrder();
	const { mutate: insertOrderItems } = useInsertOrderItems();
	const { products, total, clearCart } = useBasketStore();
	const router = useRouter();

	if (
		transactionId === undefined ||
		Array.isArray(transactionId) ||
		accessToken === undefined ||
		Array.isArray(accessToken)
	)
		return;

	const saveOrderItems = (order: Tables<"orders">) => {
		const orderItems = products.map((cartItem) => ({
			order_id: order.id,
			product_id: cartItem.id as number,
			quantity: cartItem.quantity,
		}));

		insertOrderItems(orderItems, {
			onSuccess: () => {
				clearCart();
				router.push(`/(user)/orders/${order.id}`);
			},
		});
	};

	useEffect(() => {
		verifyPayment(transactionId, accessToken).then((data) => {
			if (data.statusId === "F") {
				setPaymentStatus("success");

				insertOrder(
					{ total },
					{
						onSuccess: saveOrderItems,
					}
				);
			} else {
				setPaymentStatus("failed");
			}
		});
	}, [transactionId]);

	return (
		<View>
			{paymentStatus === "verifying" && <ActivityIndicator />}
			{paymentStatus === "success" && <Text>Payment Successful!</Text>}
			{paymentStatus === "failed" && (
				<Text>Payment Failed. Please try again.</Text>
			)}
		</View>
	);
};

export default SuccessScreen;
