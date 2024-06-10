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
				{offers.map((offer, index) => (
					<Link key={index} href={""} asChild>
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
