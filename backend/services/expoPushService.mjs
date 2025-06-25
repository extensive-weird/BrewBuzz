import { Expo } from "expo-server-sdk";
const expo = new Expo();

export async function sendPushNotifications(tokens, title, description) {
  const messages = tokens.map((token) => ({
    to: token,
    sound: "default",
    title: title,
    body: description,
  }));

  const chunks = expo.chunkPushNotifications(messages);
  for (let chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch (error) {
      console.error(error);
    }
  }
}
