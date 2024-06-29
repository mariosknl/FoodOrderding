import {
	ActivityIndicator,
	Dimensions,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { useItemsList } from "@/api/products";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Categories from "@/components/Categories";
import TopOffers from "@/components/TopOffers";

const { width, height } = Dimensions.get("window");

/**
 * `MenuScreen` is a React component that displays a list of available food items for ordering.
 * It fetches the menu items from an API and presents them in a list format, categorized by type
 * (e.g., appetizers, mains, desserts). Users can browse through the menu, view details of each item,
 * and add items to their cart.
 *
 * This screen also provides functionality for searching through the menu items by name and filtering
 * by category. The component handles loading, error states, and empty states (when no items match the
 * search or filter criteria).
 *
 * @returns A React component that renders the restaurant's menu, allowing users to browse,
 * search, and filter menu items, view item details, and add items to their cart.
 */
export default function MenuScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<View style={{ top: 0, position: "absolute" }}>
				<Image
					source={require("@assets/images/restaurant.png")}
					style={styles.image}
				/>
			</View>

			<ScrollView style={{ position: "absolute", top: 250 }}>
				<Categories />
				<Text style={{ paddingHorizontal: 15 }}>Top offers today</Text>
				<TopOffers />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		top: 0,
		backgroundColor: Colors.lightGrey,
	},
	image: {
		width,
		height: height / 3.5,
	},
});
