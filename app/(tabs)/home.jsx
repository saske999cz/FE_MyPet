import { View, Text, ScrollView, FlatList, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'

const Home = () => {
  return (
    <SafeAreaView>
        <FlatList
            data={[]}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => {
                (
                    <View>
                        <Text>{item.title}</Text>
                        <Text>{item.description}</Text>
                    </View>)
            }}
            ListHeaderComponent={() => {
                <View className="my-6 px-4 space-y-6">
                    <View className="justify-between item-start flex-row mb-6">
                        <CustomButton title="Create a post" containerStyles="w-[48%] bg-[#3D1E14]" textStyles="text-gray-50"/>
                    </View>
                </View>
            }}
        />
    </SafeAreaView>
  )
}

export default Home