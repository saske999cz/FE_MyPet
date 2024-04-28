import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import {images} from '../../constants'
import {icons} from '../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {ItemDummy} from '../../dummy/DummyData'
import ItemCard from '../../components/ItemCard'
import SearchInput from '../../components/SearchInput'


const market = () => {
    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = async () => {
        setRefreshing(true)
        // fetch data
        setRefreshing(false)
    }
  return (
    <SafeAreaView className="h-full flex-col">
        <View className="flex-col items-center justify-between px-4 mb-6">
        <View className="flex-row w-full items-center justify-between mb-4">
        <Image source={images.logoBlack} className="w-32 h-16 -ml-4" resizeMode='contain'/>
        <View className="flex-row items-center w-[25%] justify-around -mr-1">
        <TouchableOpacity className='w-10 h-10 bg-[#e5e7eb] rounded-full flex-row items-center justify-center'>
          <FontAwesomeIcon icon={icons.faCartShopping} size={20} style={{color: "#000000"}}/>
        </TouchableOpacity>
        <Image source={images.avatar} className="w-9 h-9 rounded-full"/></View>
        </View>
        <View className="flex-row w-full items-center justify-start mb-4">
        <View className="bg-[#e9d5ff] rounded-xl w-24 h-6 items-center justify-center ml-1">
        <Text className="text-[15px] font-semibold text-purple-600">Market</Text>
        </View>
        </View>
        <View className="w-full flex-row items-center justify-center">
        <SearchInput title="Search" placeholder="Search for products" otherStyles={"w-[88%]"}/>
        <TouchableOpacity className="w-10 h-10 bg-[#e5e7eb] rounded-lg flex-row items-center justify-center ml-2">
          <FontAwesomeIcon icon={icons.faFilter} size={20} style={{color: "#000000"}}/>
          </TouchableOpacity>
        </View>
        
        </View>
        <FlatList
          data={ItemDummy}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => 
                ( <ItemCard title={item.title} price={item.price} image={item.image} rating={item.rating} />)
                
            }
            numColumns={2}
  columnWrapperStyle={{
    justifyContent: 'space-around',
  }}
  style={{ flex: 1 }}/>
    </SafeAreaView>
  )
}

export default market