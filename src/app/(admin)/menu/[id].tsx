import { useItem } from "@/api/products";
import { defaultPizzaImage } from "@/components/ProductListItem";
import RemoteImage from "@/components/RemoteImage";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

/**
 * The `ProductDetailsScreen` component within the `admin` folder is tailored for the administrative interface of a food ordering app,
 * providing functionalities for viewing and editing the details of a specific product. This screen is typically accessed by selecting
 * a product from a list within the admin panel, allowing for detailed management of product information such as name, description,
 * price, and availability.
 *
 * Key features of the `admin` `ProductDetailsScreen` include:
 * - Fetching detailed information about a product using its unique identifier (ID), which is passed as a route parameter.
 * - Providing a form or interface for editing the product's details, including text inputs for name and description, a numeric input
 *   for price, and toggles or dropdowns for availability status.
 * - Implementing validation and error handling to ensure that product information is correctly entered and saved.
 * - Offering options to save changes, delete the product, or cancel edits, with appropriate confirmations to prevent accidental data loss.
 * - Integrating with the backend or database to update product information in real-time, reflecting changes immediately in the user-facing app.
 *
 * This component is essential for administrators to manage the product offerings of the food ordering app, ensuring that the menu remains
 * accurate and up-to-date.
 */
const ProductDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams();

  if (!idString) return;

  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const { data: product, error, isLoading } = useItem(id);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <View className="bg-white flex- p-[10px]">
      <Stack.Screen
        options={{
          title: "Menu",
          headerRight: () => (
            <Link href={`/(admin)/menu/create?id=${id}}`} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen options={{ title: product?.name }} />
      <RemoteImage
        path={product?.img}
        fallback={defaultPizzaImage}
        className="w-full aspect-square"
      />

      <Text className="text-lg font-bold mt-auto">€ {product?.name}</Text>
      <Text className="text-lg font-bold mt-auto">€ {product?.price}</Text>
    </View>
  );
};

export default ProductDetailsScreen;
