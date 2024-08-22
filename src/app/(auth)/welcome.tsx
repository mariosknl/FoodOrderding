import { onboarding } from "@/constants";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet, View, Image } from "react-native";
import Swiper from "react-native-swiper";
import { TouchableOpacity } from "react-native";
import Button from "@components/Button";
import { useRouter } from "expo-router";

const Welcome = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;
  const router = useRouter();

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      <TouchableOpacity
        onPress={() => {
          router.replace("/(auth)/sign-up");
        }}
        className="w-full flex justify-end items-end p-5"
      >
        <Text className="text-black text-md font-JakartaMedium">Παράλειψη</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#E2E8F0] rounded-full" />
        }
        activeDot={
          <View className="w-[32px] h-[4px] mx-1 bg-[#0286FF] rounded-full" />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} className="flex items-center justify-center p-5">
            <Image
              source={item.image}
              className="w-full h-[300px]"
              resizeMode="contain"
            />
            <View className="flex flex-row items-center justify-center w-full mt-10">
              <Text className="text-black text-3xl font-bold mx-10 text-center">
                {item.title}
              </Text>
            </View>
            <Text className="text-md font-JakartaSemiBold text-center text-[#858585] mx-10 mt-3">
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>
      <Button
        onPress={() =>
          isLastSlide
            ? router.replace("/(auth)/sign-up")
            : swiperRef.current?.scrollBy(1)
        }
        text={isLastSlide ? "Get Started" : "Next"}
        className="w-11/12 mt-10 mb-5"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dotContainer: {
    width: 32,
    height: 4,
    marginHorizontal: 4,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  activeDot: {
    width: 32,
    height: 4,
    marginHorizontal: 4,
    backgroundColor: "#0286FF",
    borderRadius: 16,
  },
});

export default Welcome;
