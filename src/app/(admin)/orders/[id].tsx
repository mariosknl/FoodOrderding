import { useOrderDetails, useUpdateOrder } from "@/api/orders";
import OrderItemListItem from "@/components/OrderItemListItem";
import OrderListItem from "@/components/OrderListItem";
import Colors from "@/constants/Colors";
import { notifyUserAboutOrderUpdate } from "@/lib/notifications";
// import { notifyUserAboutOrderUpdate } from "@/lib/notifications";
import { OrderStatusList } from "@/types";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  FlatList,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";

export default function OrderDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const { data: order, isLoading, error } = useOrderDetails(id);
  const { mutate: updateOrder } = useUpdateOrder();

  const updateStatus = async (status: string) => {
    await updateOrder({
      id,
      updatedFields: { status },
    });
    console.log("notify:", order?.user_id);
    if (order) {
      await notifyUserAboutOrderUpdate({ ...order, status });
    }
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }
  if (error || !order) {
    return <Text>Failed to fetch</Text>;
  }

  return (
    <View style={{ padding: 10, gap: 20, flex: 1 }}>
      <Stack.Screen options={{ title: `Order #${id}` }} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListHeaderComponent={() => <OrderListItem order={order} />}
        ListFooterComponent={() => (
          <>
            <Text className="font-JakartaBold">Status</Text>
            <View className="flex flex-row gap-[5px]">
              {OrderStatusList.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => updateStatus(status)}
                  className={`border border-basic p-[10px] rounded-md my-[10px]
                    ${order.status === status ? "bg-basic" : "bg-transparent"}`}
                >
                  <Text
                    className={`${order.status === status ? "text-white" : "text-basic"}`}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      />
    </View>
  );
}
