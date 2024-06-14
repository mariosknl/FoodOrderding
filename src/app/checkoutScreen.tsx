import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function CheckoutScreen() {
	const { orderCode } = useLocalSearchParams();
	return (
		<WebView
			style={styles.container}
			source={{
				uri: `https://demo.vivapayments.com/web/checkout?ref=${orderCode}`,
			}}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: Constants.statusBarHeight,
	},
});
