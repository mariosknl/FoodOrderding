import { useItemsList } from "@/api/products";
import RemoteImage from "@/components/RemoteImage";
import Colors from "@/constants/Colors";
import { ItemType, Tables } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
	Dimensions,
	ListRenderItem,
	Pressable,
	SectionList,
	StyleSheet,
	Text,
	View,
} from "react-native";
import Animated, {
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

const CategoryPage = () => {
	const { category, id } = useLocalSearchParams();

	if (!category || !id || typeof id !== "string") {
		return null;
	}
	const { data: items, error, isPending } = useItemsList(parseFloat(id));

	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);
	const navigation = useNavigation();

	const imageAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						scrollOffset.value,
						[-IMG_HEIGHT, 0, IMG_HEIGHT],
						[-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.7]
					),
				},
				{
					scale: interpolate(
						scrollOffset.value,
						[-IMG_HEIGHT, 0, IMG_HEIGHT],
						[2, 1, 1]
					),
				},
			],
		};
	});

	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
		};
	});

	const filteredItems: ItemType[] = (items || []).filter(
		(item) => item.types && item.types.category_id === parseFloat(id)
	);

	const convertItems = (filteredItems: ItemType[]) => {
		if (!filteredItems) {
			return [];
		}
		// Group items by 'types.name'
		const groupedItems: Record<string, Tables<"items">[]> =
			filteredItems?.reduce((acc: Record<string, ItemType[]>, item) => {
				if (item.types) {
					const key = item.types.name;
					if (!acc[key]) {
						acc[key] = [];
					}
					acc[key].push(item);
				}
				return acc;
			}, {});

		// Map grouped items into desired structure
		return Object.entries(groupedItems).map(([title, data], index) => ({
			title,
			data,
			index,
		}));
	};

	const convertedItems = convertItems(filteredItems);

	let imageSource = require("@assets/images/defaultΙmage.png");

	const renderItem: ListRenderItem<any> = ({ item, index }) => (
		<Link
			href={{
				pathname: "(admin)/menu/(modal)/[product]",
				params: { id: item.id, category: category as string },
			}}
			asChild
		>
			<Pressable key={index} style={styles.item}>
				<View style={{ flex: 1 }}>
					<Text style={styles.dish}>{item.name}</Text>
					<Text style={styles.dishText}>{item.info}</Text>
					<Text style={styles.dishText}>€{item.price}</Text>
				</View>
				<RemoteImage
					path={item.img}
					style={styles.dishImage}
					fallback={imageSource}
				/>
			</Pressable>
		</Link>
	);

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					headerTransparent: true,
					headerTitle: "",
					headerLeft: () => (
						<Pressable
							onPress={() => navigation.goBack()}
							style={({ pressed }) => [
								styles.arrowBack,
								pressed && { opacity: 0.5 },
							]}
						>
							<Ionicons name="arrow-back" size={24} />
						</Pressable>
					),
					headerRight: () => (
						<Link
							href={{
								pathname: "(admin)/menu/createCategory",
								params: { categoryId: id },
							}}
							asChild
						>
							<Pressable>
								<Ionicons name="pencil" size={20} />
							</Pressable>
						</Link>
					),
					headerBackground: () => (
						<Animated.View style={[styles.header, headerAnimatedStyle]} />
					),
				}}
			/>
			<Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
				<Animated.Image
					source={
						(items && items[0]?.types?.categories?.category_image) ||
						require("@assets/images/defaultΙmage.png")
					}
					style={[styles.image, imageAnimatedStyle]}
				/>

				<View style={styles.detailsContainer}>
					<Text style={styles.restaurantName}>{category}</Text>
					<SectionList
						contentContainerStyle={{ paddingBottom: 50 }}
						keyExtractor={(item, index) => `${item.id}-${index}`}
						scrollEnabled={false}
						sections={convertedItems}
						renderItem={renderItem}
						renderSectionHeader={({ section: { title } }) => (
							<Text style={styles.sectionHeader}>{title}</Text>
						)}
						ItemSeparatorComponent={() => (
							<View
								style={{
									height: 1,
									backgroundColor: Colors.grey,
								}}
							/>
						)}
						SectionSeparatorComponent={() => (
							<View style={{ height: 1, backgroundColor: Colors.grey }} />
						)}
					/>
				</View>
			</Animated.ScrollView>

			<StatusBar style="light" />
		</View>
	);
};
export default CategoryPage;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	detailsContainer: {
		backgroundColor: Colors.lightGrey,
	},
	image: {
		width,
		height: IMG_HEIGHT,
	},
	text: {
		fontSize: 20,
		fontWeight: "bold",
		textAlign: "center",
	},
	arrowBack: {
		backgroundColor: Colors.lightGrey,
		padding: 2,
		borderRadius: 50,
		opacity: 0.8,
	},
	header: {
		backgroundColor: Colors.white,
		height: 100,
	},
	restaurantName: {
		fontSize: 30,
		margin: 16,
		textAlign: "center",
	},
	restaurantDescription: {
		fontSize: 16,
		margin: 16,
		lineHeight: 22,
		color: Colors.medium,
	},
	sectionHeader: {
		fontSize: 22,
		fontWeight: "bold",
		margin: 16,
		marginTop: 10,
	},
	item: {
		backgroundColor: "white",
		padding: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		marginHorizontal: 16,
		marginVertical: 8,
	},
	dishImage: {
		width: 80,
		height: 80,
		borderRadius: 4,
	},
	dish: {
		fontSize: 16,
		fontWeight: "bold",
	},
	dishText: {
		fontSize: 14,
		color: Colors.mediumDark,
		paddingVertical: 4,
	},
	stickySegments: {
		position: "absolute",
		height: 50,
		left: 0,
		right: 0,
		top: 100,
		backgroundColor: "#fff",
		overflow: "hidden",
		paddingBottom: 10,
	},
	segmentsShadow: {
		backgroundColor: "#fff",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 5,
		width: "100%",
		height: "100%",
	},
	segmentButton: {
		paddingHorizontal: 16,
		paddingVertical: 4,
		borderRadius: 20,
	},
	segmentText: {
		color: Colors.primary,
		fontSize: 16,
	},
	segmentButtonActive: {
		backgroundColor: Colors.primary,
		paddingHorizontal: 16,
		paddingVertical: 4,
		borderRadius: 20,
		marginHorizontal: 8,
	},
	segmentTextActive: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
	},
	segmentScrollview: {
		paddingHorizontal: 16,
		alignItems: "center",
		gap: 20,
		paddingBottom: 4,
	},
	button: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		padding: 8,
		zIndex: 100,
	},
});
