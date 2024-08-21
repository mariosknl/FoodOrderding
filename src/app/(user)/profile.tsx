import { useProfile } from "@/api/profile";
import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
const ProfileScreen = () => {
	const { session, clearSession } = useStore();
	const [customerInfo, setCustomerInfo] = useState({
		address: "",
		phone: "",
		fullName: "",
	});
	const [editing, setEditing] = useState(false);

	const { data: profile } = useProfile(session?.user?.id!);

	const updateUserInfo = async () => {
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

		console.log(data, error);

		if (error) {
			console.log(error);
		} else {
			console.log(data);
		}
	};

	const handleEditInfo = () => {
		setEditing(true);
	};

	const handleLogout = async () => {
		await supabase.auth.signOut();
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
			<View style={styles.container}>
				<Text style={styles.title}>Ονοματεπώνυμο: </Text>
				{!profile?.full_name || editing ? (
					<TextInput
						placeholder="Your full name here"
						value={customerInfo.fullName}
						onChangeText={(text) =>
							setCustomerInfo({ ...customerInfo, fullName: text })
						}
						style={styles.input}
					/>
				) : (
					<Text style={styles.text}>{profile?.full_name}</Text>
				)}
				<Text style={styles.title}>Διεύθυνση: </Text>
				{!profile?.address || editing ? (
					<TextInput
						placeholder="Your address here"
						value={customerInfo.address}
						onChangeText={(text) =>
							setCustomerInfo({ ...customerInfo, address: text })
						}
						style={styles.input}
						autoFocus={editing}
					/>
				) : (
					<Text style={styles.text}>{profile?.address}</Text>
				)}
				<Text style={styles.title}>Τηλέφωνο Επικοινωνίας:</Text>
				{!profile?.phone || editing ? (
					<TextInput
						placeholder="Your phone here"
						value={customerInfo.phone}
						onChangeText={(text) =>
							setCustomerInfo({ ...customerInfo, phone: text })
						}
						style={styles.input}
					/>
				) : (
					<Text style={styles.text}>{profile?.phone}</Text>
				)}

				<Button
					text="Αποθήκευση στοιχείων"
					onPress={updateUserInfo}
					disabled={editing}
				/>
				<Button text="Αποσύνδεση" onPress={handleLogout} />
			</View>
		</>
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
	input: {
		borderWidth: 1,
		borderColor: "gray",
		padding: 10,
		marginTop: 5,
		marginBottom: 20,
		backgroundColor: "white",
		borderRadius: 5,
	},
});

export default ProfileScreen;
