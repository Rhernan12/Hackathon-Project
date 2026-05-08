import React from "react";
import { ScrollView, View } from "react-native";
import { Avatar, Card, Text } from "react-native-paper";

const MOCK_DATA_FEED = [
  {
    id: "1",
    title: "Priority 1: Medical",
    subtitle: "Received 2 mins ago via Node Alpha",
    status: "alert",
  },
  {
    id: "2",
    title: "General: Need Water",
    subtitle: "Received 15 mins ago via Node Beta",
    status: "info",
  },
  {
    id: "3",
    title: "Mesh Hub Connection",
    subtitle: "Signal strength: 85% - Connected",
    status: "success",
  },
];

export default function Dashboard() {
  return (
    <ScrollView className="flex-1 bg-slate-100">
      <View className="p-4 flex-1">
        <Text
          variant="headlineSmall"
          className="font-bold text-slate-800 mb-4 px-2"
        >
          Dash Board
        </Text>

        {MOCK_DATA_FEED.map((item) => (
          <Card key={item.id} className="mb-4 rounded-xl shadow-sm bg-white">
            <Card.Title
              title={item.title}
              subtitle={item.subtitle}
              titleVariant="titleMedium"
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon={
                    item.status === "alert"
                      ? "alert-circle"
                      : item.status === "success"
                        ? "check-circle"
                        : "information"
                  }
                  className={
                    item.status === "alert"
                      ? "bg-red-100 text-red-600"
                      : item.status === "success"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                  }
                  color={
                    item.status === "alert"
                      ? "#dc2626"
                      : item.status === "success"
                        ? "#16a34a"
                        : "#2563eb"
                  }
                />
              )}
            />
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
