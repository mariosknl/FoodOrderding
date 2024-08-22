import { useProfile } from "@/api/profile";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const ProfileScreen = () => {
  const router = useRouter();
  const { session, clearSession } = useStore();
  const [customerInfo, setCustomerInfo] = useState({
    address: "",
    phone: "",
    fullName: "",
  });
  const [editing, setEditing] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const { data: profile } = useProfile(session?.user?.id!);

  useEffect(() => {
    if (profile) {
      setCustomerInfo({
        address: profile.address ?? "",
        phone: profile.phone ?? "",
        fullName: profile.full_name ?? "",
      });
    }
  }, [profile]);

  const updateUserInfo = async () => {
    setEditing(true);
    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: session!.user.id,
        address: customerInfo.address,
        phone: customerInfo.phone,
        full_name: customerInfo.fullName,
      })
      .select("*")
      .single();

    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
    setEditing(false);
    setIsButtonDisabled(true);
  };

  const handleEditInfo = () => {
    setEditing(true);
    setIsButtonDisabled(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/welcome");
    clearSession();
  };

  return (
    <>
      <Tabs.Screen
        options={{
          headerRight: () => (
            <Ionicons
              name="pencil"
              size={20}
              style={{ marginRight: 10 }}
              onPress={handleEditInfo}
            />
          ),
        }}
      />
      <View className="flex-1 p-[20px] bg-white">
        {!profile?.full_name || editing ? (
          <InputField
            label="Ονοματεπώνυμο"
            placeholder="Το ονοματεπώνυμό σας εδώ"
            value={customerInfo.fullName}
            onChangeText={(text) =>
              setCustomerInfo({ ...customerInfo, fullName: text })
            }
            editable={editing}
          />
        ) : (
          <View className="my-2 w-full">
            <Text className={`text-lg font-JakartaSemiBold mb-3`}>
              Ονοματεπώνυμο:
            </Text>
            <Text className="text-[16px] mb-[10px] font-Jakarta">
              {profile?.full_name}
            </Text>
          </View>
        )}
        {!profile?.address || editing ? (
          <InputField
            label="Διεύθυνση"
            placeholder="Η διεύθυνση σας εδώ"
            value={customerInfo.address}
            onChangeText={(text) =>
              setCustomerInfo({ ...customerInfo, address: text })
            }
            editable={editing}
          />
        ) : (
          <View className="my-2 w-full">
            <Text className={`text-lg font-JakartaSemiBold mb-3`}>
              Διεύθυνση:
            </Text>
            <Text className="text-[16px] mb-[10px] font-Jakarta">
              {profile?.address}
            </Text>
          </View>
        )}

        {!profile?.phone || editing ? (
          <InputField
            label="Τηλέφωνο"
            placeholder="Your phone here"
            value={customerInfo.phone}
            onChangeText={(text) =>
              setCustomerInfo({ ...customerInfo, phone: text })
            }
            editable={editing}
          />
        ) : (
          <View className="my-2 w-full">
            <Text className={`text-lg font-JakartaSemiBold mb-3`}>
              Τηλέφωνο Επικοινωνίας:
            </Text>
            <Text className="text-[16px] mb-[10px] font-Jakarta">
              {profile?.phone}
            </Text>
          </View>
        )}

        <Button
          text="Αποθήκευση στοιχείων"
          onPress={updateUserInfo}
          disabled={isButtonDisabled}
        />
        <Button text="Αποσύνδεση" onPress={handleLogout} />
      </View>
    </>
  );
};

export default ProfileScreen;
