import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
// Screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

// de momento este archivo no se usa, pero la idea es que aquí se maneje toda la navegación de la app.
const tab = createBottomTabNavigator();

function TabsInferiores() {
    return (
        <NavigationContainer>
        <tab.Navigator initialRouteName="Login">
            <tab.Screen name="Login" component={LoginScreen} />
            <tab.Screen name="Register" component={RegisterScreen} />
        </tab.Navigator>
        </NavigationContainer>
    );
    }

export default function Navigation() {
    return (
    <NavigationContainer>
        <TabsInferiores />
    </NavigationContainer>
    );
};