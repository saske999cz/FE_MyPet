import { View, Text } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import { icons } from '../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faStore } from '@fortawesome/free-solid-svg-icons/faStore'

const TabIcon = ({icon, name, color, focused}) => {
    return (
        <View className="items-center justify-center gap-2">
            <Image source={icon} resizeMode="contain" tintColor={color} className="2-6 h-6"/>
            <Text className={`text-xs ${focused ? 'text-primary' : 'text-gray-500'}`} style={{color: color}}>{name}</Text>
        </View>
    )
}

const TabsLayout = () => {
  return (
    <>
        <Tabs
        screenOptions={{
            tabBarShowLabel: false,
            tabBarActiveTintColor:"#16a34a",
            tabBarInactiveTintColor: "#CDCDE0"
        }}>
            <Tabs.Screen name="home" options={{
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon icon={icons.home} name="Home" color={color} focused={focused}/>
                )
            }}/>
            <Tabs.Screen name="video" options={{
                title: 'Video',
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon icon={icons.home} name="Home" color={color} focused={focused}/>
                )
            }}/>
            <Tabs.Screen name="market" options={{
                title: 'Market',
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon icon={<FontAwesomeIcon icon={faStore} />} name="Home" color={color} focused={focused}/>
                )
            }}/>
            <Tabs.Screen name="adopt" options={{
                title: 'Adopt',
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon icon={icons.home} name="Home" color={color} focused={focused}/>
                )
            }}/>
            <Tabs.Screen name="appointment" options={{
                title: 'Appointment',
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon icon={icons.home} name="Home" color={color} focused={focused}/>
                )
            }}/>
            <Tabs.Screen name="menu" options={{
                title: 'Menu',
                headerShown: false,
                tabBarIcon: ({color, focused}) => (
                    <TabIcon icon={icons.home} name="Home" color={color} focused={focused}/>
                )
            }}/>
        </Tabs>
    </>
  )
}

export default TabsLayout