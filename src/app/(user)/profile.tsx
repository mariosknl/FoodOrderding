import { useProfile } from "@/api/profile";
import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/store";
import { StyleSheet, Text, View } from "react-native";
const ProfileScreen = () => {
	const { session, clearSession } = useStore();

	const { data: profile } = useProfile(session?.user?.id!);

	console.log("first profile", session);

	const handleLogout = async () => {
		clearSession();
		await supabase.auth.signOut();
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Address: <Text style={styles.text}>{profile?.address}</Text>
			</Text>
			<Text style={styles.title}>
				Phone: <Text style={styles.text}>{profile?.phone}</Text>
			</Text>

			<Button text="Έξοδος" onPress={handleLogout} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: Colors.white,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
	},
	text: {
		fontSize: 16,
		marginBottom: 10,
		fontWeight: "400",
	},
});

export default ProfileScreen;
