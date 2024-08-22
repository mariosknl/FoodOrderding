import { useBasketStore } from "@/store/basketStore";
import Colors from "@constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

/**
 * The `MenuStack` component is a navigation stack for the menu section of a food ordering app.
 * It utilizes the `Stack` component from `expo-router` to manage navigation between different screens
 * within the menu section, such as category listings, product details, cart, checkout, and success screens.
 *
 * The navigation stack is configured with a custom header that includes a shopping cart icon. This icon
 * is interactive and displays the current number of items in the cart, fetched from `useBasketStore`.
 * The icon changes opacity when pressed, providing visual feedback to the user. Tapping on the icon
 * navigates the user to the cart screen.
 *
 * The stack includes several screens, each identified by a unique name and configured with specific options:
 * - `category/[category]`: Displays products in a specific category.
 * - `(modal)/[product]`: Presents product details in a modal view.
 * - `cart`: Shows the user's cart, allowing them to review and modify their order.
 * - `checkoutScreen`: Handles the checkout process.
 * - `successScreen`: Displays a success message after a successful checkout.
 *
 * Styles for the cart icon and the item count badge are defined in a `StyleSheet` to ensure consistent
 * appearance and layout.
 *
 * @returns A React component that represents the navigation stack for the menu section of the app.
 */
export default function MenuStack() {
  const { items } = useBasketStore();

  return (
    <Stack
      screenOptions={{
        headerTitle: "",
        headerRight: () => (
          <Link href="menu/cart" asChild>
            <Pressable>
              {({ pressed }) => (
                <View>
                  <FontAwesome
                    name="shopping-cart"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                  {items > 0 ? (
                    <View
                      className="absolute h-[17px] w-[17px]
										rounded-[10px] right-[10px] bottom-[10px] bg-[#20E1B2] items-center justify-center"
                    >
                      <Text className="text-white font-JakartaBold">
                        {items}
                      </Text>
                    </View>
                  ) : null}
                </View>
              )}
            </Pressable>
          </Link>
        ),
      }}
    >
      <Stack.Screen name={`category/[category]`} options={{ title: "" }} />
      <Stack.Screen name={`(modal)/[product]`} />
      <Stack.Screen name="cart" />
      <Stack.Screen name="checkoutScreen" />
      <Stack.Screen name="successScreen" />
    </Stack>
  );
}
