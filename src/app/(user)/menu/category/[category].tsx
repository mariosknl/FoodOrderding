import { useItemsList } from "@/api/products";
import RemoteImage from "@/components/RemoteImage";
import Colors from "@/constants/Colors";
import { Tables } from "@/database.types";
import { ItemType } from "@/types";
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

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 300;

/**
 * The `CategoryPage` component is designed to display a list of items belonging to a specific category
 * in a food ordering app. It utilizes the `useItemsList` hook to fetch items based on the category ID
 * obtained from the URL search parameters. This component showcases the items using a `SectionList`,
 * allowing for efficient display and scrolling of potentially large lists of items.
 *
 * The component also features an animated header image that reacts to the user's scroll. This animation
 * is achieved using `react-native-reanimated` to interpolate the scroll offset and adjust the image's
 * translateY property, creating a parallax effect.
 *
 * Key functionalities include:
 * - Fetching category-specific items using the category ID from URL search parameters.
 * - Handling cases where the category or ID is not specified or invalid.
 * - Displaying items in a sectioned list, where each item is clickable and navigates to its detailed view.
 * - Implementing a custom animated effect for the header image based on the user's scroll position.
 *
 * Usage of `expo-router` for navigation and parameter handling, along with `react-native-reanimated` for
 * smooth animations, demonstrates a modern approach to creating interactive and visually appealing mobile
 * applications with React Native.
 *
 * @returns A React component that renders a list of items for a specific category with an animated header.
 */
const CategoryPage = () => {
  const { category, id } = useLocalSearchParams();
  const navigation = useNavigation();

  if (!category || !id || typeof id !== "string") {
    return null;
  }
  const { data: items } = useItemsList(parseFloat(id));

  const filteredItems: ItemType[] = (items || []).filter(
    (item) => item.types && item.types.category_id === parseFloat(id),
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
        pathname: "/(user)/menu/(modal)/[product]",
        params: { id: item.id, category: category as string, product: item },
      }}
      asChild
    >
      <Pressable
        key={index}
        className="bg-white p-4 flex flex-row justify-between mx-4 my-2"
      >
        <View className="flex-1">
          <Text className="text-[16px]">{item.name}</Text>
          <Text className="text-sm py-1 text-gray-500">{item.info}</Text>
          <Text className="text-sm py-1 text-gray-500">€{item.price}</Text>
        </View>
        <RemoteImage
          path={item.img}
          fallback={imageSource}
          className="w-[80px] h-[80px] rounded-md"
        />
      </Pressable>
    </Link>
  );

  if (!items) {
    return null;
  }

  return (
    <View className="flex-1">
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
        }}
      />

      <RemoteImage
        path={items[0]!.types!.categories!.category_image}
        fallback={imageSource}
        style={styles.image}
      />

      <View className="bg-[#FCF8FF]">
        <Text className="text-[30px] m-4 text-center">{category}</Text>
        <SectionList
          contentContainerStyle={{ paddingBottom: 50 }}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          scrollEnabled={false}
          sections={convertedItems}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-[22px] font-bold, m-4, mt-[10px] pl-4">
              {title}
            </Text>
          )}
          ItemSeparatorComponent={() => (
            <View className="h-[1px] bg-[#EEE9F0] mx-4" />
          )}
          SectionSeparatorComponent={() => (
            <View className="h-[1px] bg-[#EEE9F0]" />
          )}
        />
      </View>

      <StatusBar style="light" />
    </View>
  );
};
export default CategoryPage;

const styles = StyleSheet.create({
  image: {
    width,
    height: IMG_HEIGHT,
  },
  arrowBack: {
    backgroundColor: Colors.lightGrey,
    padding: 2,
    borderRadius: 50,
    opacity: 0.8,
  },
});
