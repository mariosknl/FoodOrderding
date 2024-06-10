import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { shopInfo } from "@assets/data/restaurant";
const Categories = () => {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{
				padding: 15,
			}}
		>
			{shopInfo.products.map(({ category, types }, index) => (
				<Link key={index} href={`/(user)/menu/category/${category}`}>
					<View style={styles.categoryCard}>
						<Image
							source={types[0].items[0].img}
							style={styles.image}
							resizeMode="contain"
						/>
						<Text style={styles.categoryText}>{category}</Text>
					</View>
				</Link>
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	categoryCard: {
		width: 100,
		height: 100,
		backgroundColor: Colors.white,
		margin: 10,
		elevation: 2,
		shadowColor: Colors.black,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.06,
		borderRadius: 4,
	},
	categoryText: {
		padding: 5,
		fontSize: 14,
		fontWeight: "bold",
		textAlign: "center",
	},
	image: {
		width: 100,
		height: 70,
		borderTopLeftRadius: 4,
		borderTopRightRadius: 4,
	},
});

export default Categories;
