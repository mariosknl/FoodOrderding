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
