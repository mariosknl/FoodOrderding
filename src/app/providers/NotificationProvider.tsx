import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/store";
import { registerForPushNotificationsAsync } from "@lib/notifications";
import * as Notifications from "expo-notifications";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

/**
 * Provides a context for managing push notifications within the app.
 *
 * This component sets up a notification handler to control the behavior of incoming push notifications,
 * registers for push notifications to obtain a token, and listens for both notification receipts and responses.
 * It also updates the user's profile with the new push token for notifications.
 *
 * @component
 * @param {PropsWithChildren} props - The props object, expecting children nodes to render within the NotificationProvider context.
 * @returns {React.ReactElement} The children wrapped within the NotificationProvider context.
 */
const NotificationProvider = ({ children }: PropsWithChildren) => {
	const [expoPushToken, setExpoPushToken] = useState("");
	const [notification, setNotification] = useState<
		Notifications.Notification | undefined
	>(undefined);
	const notificationListener = useRef<Notifications.Subscription>();
	const responseListener = useRef<Notifications.Subscription>();

	const { profile } = useStore();

	const savePushToken = async (newToken: string) => {
		setExpoPushToken(newToken);

		// update the token in the db
		if (!newToken) {
			return;
		}
		await supabase
			.from("profiles")
			.update({ expo_push_token: newToken })
			.eq("id", profile!.id);
	};

	useEffect(() => {
		registerForPushNotificationsAsync()
			.then((token) => savePushToken(token ?? ""))
			.catch((error: any) => setExpoPushToken(`${error}`));

		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				console.log(response);
			});

		return () => {
			if (notificationListener.current) {
				notificationListener.current &&
					Notifications.removeNotificationSubscription(
						notificationListener.current
					);
			}

			if (responseListener.current) {
				responseListener.current &&
					Notifications.removeNotificationSubscription(
						responseListener.current
					);
			}
		};
	}, []);

	console.log("Push token:", expoPushToken);
	console.log("Notification", notification);

	return <>{children}</>;
};

export default NotificationProvider;
