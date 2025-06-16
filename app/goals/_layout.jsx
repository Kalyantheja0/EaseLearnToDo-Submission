import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"
import { GoalsProvider } from '../../contexts/GoalsContext'
import { View } from 'react-native';
import React from 'react'
import useGoals from '../../hooks/useGoals';



export default function GoalsLayout() {
  return (
    <GoalsProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'grey',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Your Goals',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                color={color} 
                size={size} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create Goal',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons 
                name={focused ? 'create' : 'create-outline'} 
                color={color} 
                size={size} 
              />
            ),
          }}
        />
      </Tabs>
    </GoalsProvider>
  )
}
