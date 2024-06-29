import { WebView, WebViewNavigation } from "react-native-webview";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";

/**
 * `CheckoutScreen` is a React component that renders a WebView for handling payment checkout.
 * It uses `orderCode` and `accessToken` obtained from the URL search params to initiate the payment process.
 * The payment process is initiated by loading the Viva Payments checkout URL with the `orderCode`.
 *
 * When the payment process redirects to a predefined URL (indicating payment completion),
 * the component captures the transaction ID from the URL and navigates to the `successScreen`,
 * passing along the `transactionId` and `accessToken`.
 *
 * @returns A React component that displays a WebView for the Viva Payments checkout process.
 */
export default function CheckoutScreen() {
	const { orderCode, accessToken } = useLocalSearchParams();
	const navigation = useNavigation();

	const handleNavigationStateChange = (navState: WebViewNavigation) => {
		const targetUrl = "http://demo.vivapayments.com/web/checkout/result";
		if (navState.url.startsWith(targetUrl)) {
			// Redirect to the success screen
			const urlParams = new URLSearchParams(navState.url.split("?")[1]);
			const transactionId = urlParams.get("t");

			(navigation.navigate as any)("successScreen", {
				transactionId,
				accessToken,
			});
		}
	};

	return (
		<>
			<Stack.Screen options={{}} />
			<WebView
				style={styles.container}
				source={{
					uri: `https://demo.vivapayments.com/web/checkout?ref=${orderCode}`,
				}}
				onNavigationStateChange={handleNavigationStateChange}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: Constants.statusBarHeight,
	},
});
