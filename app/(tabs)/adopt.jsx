import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import {images} from '../../constants'
import {icons} from '../../constants'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {PetDummy} from '../../dummy/DummyData'
import AdoptPetCard from '../../components/AdoptPetCard'
import SearchInput from '../../components/SearchInput'


const adopt = () => {
    const [refreshing, setRefreshing] = useState(false)
    const [activeCategory, setActiveCategory] = useState("none")
    const onRefresh = async () => {
        setRefreshing(true)
        // fetch data
        setRefreshing(false)
    }
    handlePressCategory = (category) => {
        setActiveCategory(category)
    }
  return (
    <SafeAreaView className="h-full flex-col">
        <View className="flex-col items-center justify-between px-4 mb-6">
        <View className="flex-row w-full items-center justify-between mb-4">
        <Image source={images.logoBlack} className="w-32 h-16 -ml-4" resizeMode='contain'/>
        <View className="flex-row items-center w-[45%] justify-end">
        <View className="w-[60%] flex-row items-center justify-center mr-1">
        <Text className="text-[12px] font-semibold mr-1 mt-1">Da Nang, VN</Text>
        <FontAwesomeIcon icon={icons.faLocationDot} size={18} style={{color: "#ef4444"}}/>
        </View>
        <Image source={images.avatar} className="w-9 h-9 rounded-full"/>
        </View>
        </View>
        <View className="flex-row w-full items-center justify-start mb-4">
        <View className="bg-[#e9d5ff] rounded-xl w-24 h-6 items-center justify-center ml-1">
        <Text className="text-[15px] font-semibold text-purple-600">Adopt</Text>
        </View>
        </View>
        <View className="w-full flex-row items-center justify-center">
        <SearchInput title="Search" placeholder="Search for pets" otherStyles={"w-[88%]"}/>
        <TouchableOpacity className="w-10 h-10 bg-[#e5e7eb] rounded-lg flex-row items-center justify-center ml-2">
          <FontAwesomeIcon icon={icons.faFilter} size={20} style={{color: "#000000"}}/>
          </TouchableOpacity>
        </View>
        <View className="w-full flex-col items-start justify-center mt-6">
        <Text className="text-[15px] font-semibold mb-4">Categories</Text>
        <View className='flex-row items-center justify-start w-full'>
          <TouchableOpacity className={`w-24 h-10 rounded-full flex-row items-center justify-center ${activeCategory === "dogs" ? "bg-[#fed7aa]" : "bg-[#e5e7eb]"}`} onPress={() => handlePressCategory("dogs")}>
          <View className={`w-9 h-9 rounded-full flex-row items-center justify-center -ml-2 ${activeCategory === "dogs" ? "bg-[#fb923c]" : "bg-[#d1d5db]"}`}>
            <Image source={images.dog} className="w-5 h-5" resizeMode='contain'/>
            </View>
            <Text className={`text-[13px] ml-2`}>Dogs</Text>
          </TouchableOpacity>
          <TouchableOpacity className={`w-24 h-10 rounded-full flex-row items-center justify-center ml-9 ${activeCategory === "cats" ? "bg-[#fed7aa]" : "bg-[#e5e7eb]"}`} onPress={() => handlePressCategory("cats")}>
          <View className={`w-9 h-9 rounded-full flex-row items-center justify-center -ml-2 ${activeCategory === "cats" ? "bg-[#fb923c]" : "bg-[#d1d5db]"}`}>
            <Image source={images.cat} className="w-5 h-5" resizeMode='contain'/>
            </View>
            <Text className={`text-[13px] ml-2`}>Cats</Text>
          </TouchableOpacity>
          <TouchableOpacity className={`w-24 h-10 rounded-full flex-row items-center justify-center ml-9 ${activeCategory === "birds" ? "bg-[#fed7aa]" : "bg-[#e5e7eb]"}`} onPress={() => handlePressCategory("birds")}>
          <View className={`w-9 h-9 rounded-full flex-row items-center justify-center -ml-2 ${activeCategory === "birds" ? "bg-[#fb923c]" : "bg-[#d1d5db]"}`}>
            <Image source={images.bird} className="w-5 h-5" resizeMode='contain'/>
            </View>
            <Text className={`text-[13px] ml-2`}>Birds</Text>
          </TouchableOpacity>
        </View>
        </View>
        
        </View>
        <FlatList
          data={PetDummy}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => 
                ( <AdoptPetCard image={item.image} name={item.name} gender={item.gender} age={item.age}/>)
                
            }
            numColumns={2}
  columnWrapperStyle={{
    justifyContent: 'space-around',
  }}
  style={{ flex: 1 }}/>
    </SafeAreaView>
  )
}

export default adopt