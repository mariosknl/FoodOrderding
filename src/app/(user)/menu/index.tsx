import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { useProductList } from "@/api/products";
import ProductListItem from "@components/ProductListItem";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Categories from "@/components/Categories";
import TopOffers from "@/components/TopOffers";

const { width, height } = Dimensions.get("window");

export default function MenuScreen() {
	const { data: products, error, isLoading } = useProductList();

	if (isLoading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return <Text>Failed to fetch products</Text>;
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={{ top: 0, position: "absolute" }}>
				<Image
					source={require("@assets/images/restaurant.png")}
					style={styles.image}
				/>
			</View>

			<ScrollView style={{ position: "absolute", top: 280 }}>
				<Categories />
				<Text style={{ paddingHorizontal: 15 }}>Top offer today</Text>
				<TopOffers />
			</ScrollView>
			{/* <FlatList
				data={products}
				renderItem={({ item }) => <ProductListItem product={item} />}
				numColumns={2}
				contentContainerStyle={{ gap: 10, padding: 10 }}
				columnWrapperStyle={{ gap: 10 }}
			/> */}
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
		height: height / 3,
	},
});
