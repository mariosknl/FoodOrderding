import Button from "@/components/Button";
import CartListItem from "@/components/CartListItem";
import { useBasketStore } from "@/store/basketStore";
import { useStore } from "@/store/store";
import { Navigation } from "@/types";
import { Stack, useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, FlatList, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RootStackParamList = {
  checkoutScreen: {
    orderCode: string;
    accessToken: string;
  };
  successScreen: {
    transactionId: string | null;
    accessToken: string;
  };
};

const CartScreen = () => {
  const { total } = useBasketStore();
  const { products, checkout } = useBasketStore();
  const { profile } = useStore();
  const router = useRouter();
  const navigation = useNavigation() as Navigation;

  const handleCheckout = async () => {
    if (profile?.address === "" || profile?.phone === "") {
      Alert.alert(
        "Ελλειπή στοιχεία λογαριασμού",
        "Παρακαλώ συμπληρώστε τα στοιχεία του λογαριασμού σας πριν συνεχίσετε.",
        [
          {
            text: "OK",
            onPress: () => router.push("/profile"),
          },
        ],
        { cancelable: false },
      );
    } else {
      const { orderCode, accessToken } = await checkout();
      navigation.navigate("checkoutScreen", { orderCode, accessToken });
    }
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{ headerShown: true, headerTitle: "Το καλάθι σου" }}
      />
      <View style={{ padding: 10 }}>
        <FlatList
          data={products}
          renderItem={({ item }) => <CartListItem cartItem={item} />}
          contentContainerStyle={{ gap: 10 }}
        />

        <Text className="mt-[10px] text-[20px] font-medium">
          Total: € {total}
        </Text>
        <Button text="Πληρωμή" onPress={handleCheckout} />

        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    </SafeAreaView>
  );
};
export default CartScreen;
