import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Screens
import PerfilScreen from './src/screens/PerfilScreen';
import InicioScreen from "./src/screens/InicioScreen";
import ReportarScreen from "./src/screens/ReportarScreen";
import ReportarMascotaPerdidaScreen from "./src/screens/ReportarMascotaPerdidaScreen";
import ReportarMascotaEncontradaScreen from "./src/screens/ReportarMascotaEncontradaScreen";
import ServiciosScreen from "./src/screens/ServiciosScreen";
import CreateServiceScreen from "./src/screens/CreateServiceScreen";
import MatchScreen from "./src/screens/MatchScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();


function ReportarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ReportarMenu" component={ReportarScreen} />
        <Stack.Screen name="ReportarPerdida" component={ReportarMascotaPerdidaScreen} />
        <Stack.Screen name="ReportarEncontrada" component={ReportarMascotaEncontradaScreen} />
    </Stack.Navigator>
  );
}

function ServiciosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ServiciosHome" component={ServiciosScreen} />
      <Stack.Screen name="CrearServicio" component={CreateServiceScreen} />
    </Stack.Navigator>
  );
}

function MainTabs({ onLogout }) {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Inicio') iconName = 'home';
          else if (route.name === 'Perfil') iconName = 'person';
          else if (route.name === 'Reportar') iconName = 'alert-circle';
          else if (route.name === 'Servicios') iconName = 'storefront';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#03045E',
        tabBarInactiveTintColor: '#f5f1f1ff',
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#00B4D8',
          backgroundColor: '#00B4D8',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} initialParams={{ onLogout }} />
      <Tab.Screen name="Reportar" component={ReportarStack} />
      <Tab.Screen name="Servicios" component={ServiciosStack} />
    </Tab.Navigator>
  );
}


export default function Navegacion({ onLogout }) {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        initialParams={{ onLogout }}
      />
      <RootStack.Screen 
        name="MatchScreen" 
        component={MatchScreen} 
      />
    </RootStack.Navigator>
  );
}
