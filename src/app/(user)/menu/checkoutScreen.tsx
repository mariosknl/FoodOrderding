import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

export default function CheckoutScreen() {
	const { orderCode } = useLocalSearchParams();
	return (
		<>
			<Stack.Screen options={{}} />
			<WebView
				style={styles.container}
				source={{
					uri: `https://demo.vivapayments.com/web/checkout?ref=${orderCode}`,
				}}
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