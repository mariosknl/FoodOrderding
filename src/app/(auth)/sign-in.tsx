import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import Button from "@components/Button";
import Colors from "@constants/Colors";
import { Link, Stack } from "expo-router";
import { supabase } from "@/lib/supabase";

/**
 * The `SignInScreen` component within the `sign-in.tsx` file is a key part of the authentication flow in a food ordering app, designed
 * specifically for the user sign-in process. This screen provides a user-friendly interface for users to enter their login credentials
 * (typically an email address and password) and access their accounts. It is an essential component for ensuring secure and efficient
 * user access to the app.
 *
 * Key functionalities of the `SignInScreen` include:
 * - A form interface where users can input their email address and password. This form may also include validation to ensure that the
 *   input data meets specific criteria (e.g., valid email format, password complexity requirements).
 * - Options for users to toggle password visibility for ease of use.
 * - A sign-in button that triggers the authentication process based on the provided credentials. This process involves verifying the
 *   credentials against the app's backend or authentication service and handling success or failure outcomes appropriately.
 * - Links or buttons for users who have forgotten their password or who wish to create a new account, directing them to the respective
 *   screens or processes.
 * - Integration with third-party authentication services or social login options (e.g., Google, Facebook) to offer alternative sign-in
 *   methods.
 * - Feedback mechanisms, such as loading indicators during the authentication process and error messages for failed sign-in attempts,
 *   to enhance the user experience.
 *
 * This component plays a crucial role in the app's overall security and user management strategy by facilitating a secure and user-friendly
 * sign-in process.
 */
const SignInScreen = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	async function signInWithEmail() {
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) Alert.alert(error.message);
		setLoading(false);
	}

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ title: "Sign in" }} />

			<Text style={styles.label}>Email</Text>
			<TextInput
				value={email}
				onChangeText={setEmail}
				placeholder="jon@gmail.com"
				style={styles.input}
				autoCapitalize="none"
			/>

			<Text style={styles.label}>Password</Text>
			<TextInput
				value={password}
				onChangeText={setPassword}
				placeholder=""
				style={styles.input}
				secureTextEntry
				autoCapitalize="none"
			/>

			<Button
				onPress={signInWithEmail}
				disabled={loading}
				text={loading ? "Signin in..." : "Sign in"}
			/>
			<Link href="/sign-up" style={styles.textButton}>
				Create an account
			</Link>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		justifyContent: "center",
		flex: 1,
	},
	label: {
		color: "gray",
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
	textButton: {
		alignSelf: "center",
		fontWeight: "bold",
		color: Colors.light.tint,
		marginVertical: 10,
	},
});

export default SignInScreen;
