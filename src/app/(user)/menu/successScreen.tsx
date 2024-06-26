import { useLocalSearchParams } from "expo-router";
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

const SuccessScreen = () => {
	const { transactionId, accessToken } = useLocalSearchParams();

	const [paymentStatus, setPaymentStatus] = useState("");

	if (
		transactionId === undefined ||
		Array.isArray(transactionId) ||
		accessToken === undefined ||
		Array.isArray(accessToken)
	)
		return;

	useEffect(() => {
		verifyPayment(transactionId, accessToken).then((data) => {
			console.log("data from verifyPayment call", data);
			if (data.statusId === "F") {
				setPaymentStatus("success");
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
