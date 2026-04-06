import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './screens/HomeScreen';
import ReceiveScreen from './screens/ReceiveScreen';
import SendScreen from './screens/SendScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import { WalletContext, defaultWalletState } from './context/WalletContext';

const Tab = createBottomTabNavigator();

export default function App() {
  const [wallet, setWallet] = useState(defaultWalletState);
  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#085041" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#1D9E75',
            tabBarInactiveTintColor: '#888780',
            tabBarStyle: { borderTopWidth: 0.5, borderTopColor: 'rgba(0,0,0,0.1)', backgroundColor: '#fff', height: 60, paddingBottom: 8 },
            tabBarLabelStyle: { fontSize: 10 },
            tabBarIcon: ({ focused, color }) => {
              const icons: Record<string, [string, string]> = {
                Home: ['home', 'home-outline'],
                Receive: ['arrow-down-circle', 'arrow-down-circle-outline'],
                Send: ['arrow-up-circle', 'arrow-up-circle-outline'],
                History: ['list', 'list-outline'],
                Settings: ['settings', 'settings-outline'],
              };
              const [active, inactive] = icons[route.name] ?? ['ellipse', 'ellipse-outline'];
              return <Ionicons name={(focused ? active : inactive) as any} size={22} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Receive" component={ReceiveScreen} />
          <Tab.Screen name="Send" component={SendScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </WalletContext.Provider>
  );
}
