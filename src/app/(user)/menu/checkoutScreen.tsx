import { WebView, WebViewNavigation } from "react-native-webview";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";

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
