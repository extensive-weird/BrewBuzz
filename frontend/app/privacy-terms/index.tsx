import React from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "../../components/Header";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionText}>{children}</Text>
  </View>
);

const PrivacyTermsScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={styles.container}>
      <Header
        title="Privacy & Terms"
        showBackButton
        onBack={() => router.push("/(tabs)/user-profile")}
      />
      <ScrollView
        style={[isDark && styles.containerDark]}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.pageTitle}>Privacy Policy</Text>

        <Section title="1. Information Collection">
          We collect data you provide directly to us, such as your name, email
          address, and any feedback or usage analytics.
        </Section>
        <Section title="2. Use of Information">
          Your data helps us improve functionality, provide support, and deliver
          relevant updates or offers.
        </Section>
        <Section title="3. Third-Party Services">
          We use secure third-party tools for analytics, crash reporting, and
          user engagement, governed by their own policies.
        </Section>
        <Section title="4. Data Retention">
          We retain personal data only as long as necessary for the purpose it
          was collected.
        </Section>
        <Section title="5. Your Rights">
          You can request access, correction, or deletion of your personal data
          by contacting us at support@example.com.
        </Section>

        <View style={styles.divider} />

        <Text style={styles.pageTitle}>Terms of Service</Text>

        <Section title="1. Acceptance of Terms">
          By using the app, you accept these terms in full.
        </Section>
        <Section title="2. User Responsibilities">
          You agree not to misuse the app or violate any applicable laws or
          third-party rights.
        </Section>
        <Section title="3. Modifications to Terms">
          We may update these terms occasionally. Continued use means you accept
          the changes.
        </Section>
        <Section title="4. Limitation of Liability">
          We are not liable for any indirect damages or losses from use of the
          app.
        </Section>
        <Section title="5. Contact Us">
          If you have any questions or concerns, please contact us at
          support@example.com.
        </Section>
      </ScrollView>
    </View>
  );
};

export default PrivacyTermsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#2c3e50",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#34495e",
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 32,
  },
});
