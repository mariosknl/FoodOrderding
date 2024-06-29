import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Image,
	Pressable,
} from "react-native";
import { Link } from "expo-router";
import Colors from "@constants/Colors";
import { shopInfo } from "@assets/data/restaurant";
import { StatusBar } from "expo-status-bar";

/**
 * A component that renders a horizontal scroll view of top offers.
 *
 * This component fetches an array of offers from `shopInfo.products[2].types[0].items` and maps over it to display each offer. Each offer is wrapped in a `Link` component for navigation, though the `href` is currently set to an empty string. The offers are displayed as cards with an image, name, price, and additional info.
 *
 * - The `ScrollView` is horizontal and hides the horizontal scroll indicator.
 * - Each offer card contains an image (`Image` component), and a box (`View` component) that includes the offer's name, price, and info.
 * - The `StatusBar` component is set to "light" style, which may indicate the component is intended for use within a dark theme or dark mode.
 */
const TopOffers = () => {
	const offers = shopInfo.products[2].types[0].items;
	return (
		<>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					padding: 15,
				}}
			>
				{offers.map((offer) => (
					<Link key={offer.id} href={""} asChild>
						<Pressable>
							<View style={styles.restaurantCard}>
								<Image source={offer.img} style={styles.image} />

								<View style={styles.categoryBox}>
									<Text style={styles.categoryText}>{offer.name}</Text>
									<Text style={styles.price}>€ {offer.price}</Text>
									<Text style={styles.info}>{offer.info}</Text>
								</View>
							</View>
						</Pressable>
					</Link>
				))}
			</ScrollView>
			<StatusBar style="light" />
		</>
	);
};

const styles = StyleSheet.create({
	restaurantCard: {
		width: 200,
		height: 200,
		backgroundColor: "white",
		marginEnd: 10,
		elevation: 2,
		shadowColor: "black",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.06,
		borderRadius: 4,
	},
	categoryText: {
		paddingVertical: 4,
		fontSize: 14,
		fontWeight: "bold",
	},
	image: {
		flex: 5,
		width: undefined,
	},
	categoryBox: {
		flex: 2,
		padding: 10,
	},
	price: {
		fontSize: 16,
		fontWeight: "bold",
		paddingVertical: 4,
		color: Colors.primary,
	},
	info: {
		fontSize: 14,
		color: Colors.black,
	},
});

export default TopOffers;
