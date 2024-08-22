import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useItemsList } from "@/api/products";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import Categories from "@/components/Categories";
import TopOffers from "@/components/TopOffers";

const { width, height } = Dimensions.get("window");

export default function MenuScreen() {
  // const { data: products, error, isLoading } = useItemsList();

  // if (isLoading) {
  // 	return <ActivityIndicator />;
  // }

  // if (error) {
  // 	return <Text>Failed to fetch products</Text>;
  // }
  return (
    <SafeAreaView className="top-0">
      <View className="absolute top-0">
        <Image
          source={require("@assets/images/restaurant.png")}
          style={styles.image}
        />
      </View>

      <ScrollView className="absolute top-[250px]">
        <Categories />
        <Text className="px-[15px] text-lg">Top offers today</Text>
        <TopOffers />
      </ScrollView>
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
    height: height / 3.5,
  },
});
