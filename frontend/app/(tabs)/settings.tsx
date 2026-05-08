import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  Avatar,
  Button,
  Divider,
  List,
  Switch,
  Text,
} from "react-native-paper";

export default function Settings() {
  const [optionOne, setOptionOne] = useState(true);
  const [optionTwo, setOptionTwo] = useState(false);

  return (
    <ScrollView className="flex-1 bg-slate-100">
      <View className="p-4 flex-1">
        <View
          className="items-center mb-6 mt-2 gap-2"
          style={{ marginLeft: "5%", marginTop: "3%" }}
        >
          <Avatar.Text size={72} label="JD" className="bg-blue-600" />
          <Text variant="titleLarge" className="font-bold text-slate-800">
            John Doe
          </Text>
          <Text variant="bodyMedium" className="text-slate-500 font-mono">
            ID: 1234
          </Text>
        </View>

        <List.Section className="bg-white rounded-xl overflow-hidden shadow-sm">
          <List.Subheader className="text-slate-500 font-bold">
            Demo Configuration
          </List.Subheader>

          <List.Item
            title="Option 1"
            description="Option 1 description"
            left={(props) => <List.Icon {...props} icon="wifi-off" />}
            right={() => (
              <Switch value={optionOne} onValueChange={setOptionOne} />
            )}
          />
          <Divider />
          <List.Item
            title="Option 2"
            description="Option 2 description"
            left={(props) => (
              <List.Icon {...props} icon="database-sync-outline" />
            )}
            right={() => (
              <Switch value={optionTwo} onValueChange={setOptionTwo} />
            )}
          />
        </List.Section>

        <List.Section className="bg-white rounded-xl overflow-hidden shadow-sm mt-4">
          <List.Subheader className="text-slate-500 font-bold">
            System (Debug)
          </List.Subheader>

          <List.Item
            title="View Logs"
            left={(props) => <List.Icon {...props} icon="console" />}
            onPress={() => console.log("Opening C++ bridge logs...")}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="Clear Local Cache"
            left={(props) => (
              <List.Icon {...props} icon="delete-outline" color="#dc2626" />
            )}
            onPress={() => console.log("Cache cleared")}
          />
        </List.Section>

        <Button
          mode="outlined"
          textColor="#dc2626"
          className="mt-6 border-red-600 rounded-lg"
          onPress={() => console.log("Resetting Application State")}
        >
          Reset Application State
        </Button>
      </View>
    </ScrollView>
  );
}
