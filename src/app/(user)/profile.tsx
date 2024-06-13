import { supabase } from "@/lib/supabase";
import { View, Text, Button } from "react-native";
import { useAuth } from "../providers/AuthProvider";
const ProfileScreen = () => {
	const { session, profile } = useAuth();
	console.log("profile", profile);
	return (
		<View>
			<Text>ProfileScreen</Text>

			<Button
				title="Sign out"
				onPress={async () => await supabase.auth.signOut()}
			/>
		</View>
	);
};
export default ProfileScreen;
