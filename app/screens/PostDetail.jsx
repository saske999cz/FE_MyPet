import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import MinimalPost from "../../components/MinimalPost";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import Comment from "../../components/Comment";
import { CommentDummy } from "../../dummy/FakeData";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";

const PostDetail = () => {
  const {
    username,
    avatar,
    title,
    description,
    uploadedImage,
    likes,
    dislikes,
    comments,
  } = useLocalSearchParams();
  const [myComment, setMyComment] = useState("");
  const [numberOfLines, setNumberOfLines] = useState(1);

  const onContentSizeChange = (event) => {
    const { contentSize, layoutMeasurement } = event.nativeEvent;
    const lineHeight = StyleSheet.flatten(styles.textInput).lineHeight;
    const numLines = Math.ceil(contentSize.height / lineHeight);
    setNumberOfLines(numLines); // Update the state
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View className="w-full h-full">
      <SafeAreaView className="flex-1">
        <View className="w-full h-12 flex-row items-center justify-center">
          <TouchableOpacity
            className="w-12 h-12 flex-row items-center justify-center absolute top-0 left-0"
            onPress={handleBack}
          >
            <FontAwesomeIcon
              icon={icons.faArrowLeftLong}
              size={20}
              style={{ color: "#f59e0b" }}
            />
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-1">
          <View className="w-full h-full flex-col items-start justify-center">
            <View className="w-full h-fit">
              <View className="flex-col items-center w-full pb-4 px-3">
                <View className="flex-row justify-start items-center w-full h-10 mt-2">
                  <View className="w-9 h-9 rounded-full border-[0.5px] border-solid border-gray-300">
                    <Image
                      source={avatar}
                      className="w-full h-full rounded-full"
                    />
                  </View>

                  <Text className="ml-4 text-[16px] font-semibold">
                    {username}
                  </Text>
                </View>
                <View className="w-full h-10 flex-row justify-start items-center">
                  <View className="bg-[#fed7aa] rounded-xl w-16 h-5 items-center justify-center">
                    <Text className="text-[15px] font-semibold text-orange-400">
                      #Title:
                    </Text>
                  </View>
                  <Text className="ml-4 text-[15px] font-semibold text-gray-600">
                    {title}
                  </Text>
                </View>
                <View className="w-full h-fit max-h-28">
                  <Text className="text-[15px]">{description}</Text>
                </View>
                <View
                  className="w-full h-fit max-h-40 mt-6 rounded-md"
                  style={{ aspectRatio: 16 / 9 }}
                >
                  <Image
                    source={images.husky}
                    className="w-full h-[100%] rounded-md"
                  />
                </View>
                <View className="w-full h-12 flex-row justify-center items-center mt-8 px-4 border-t-[1px] border-solid border-gray-300 pt-4">
                  <View className="flex-row justify-center items-center w-[30%]">
                    <Text className="text-[14px] font-semibold text-gray-600 border-solid">
                      {likes}
                    </Text>
                    <TouchableOpacity className="min-w-fit h-10 flex-row items-center justify-center ml-2 -mt-[2px]">
                      <FontAwesomeIcon
                        icon={icons.faThumbsUp}
                        size={15}
                        style={{ color: "#9ca3af" }}
                      />
                      <Text className="text-[14px] font-semibold text-gray-600 ml-[2px]">
                        Like
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row justify-center items-center w-[30%] ml-3">
                    <Text className="text-[14px] font-semibold text-gray-600">
                      {dislikes}
                    </Text>
                    <TouchableOpacity className="min-w-fit h-10 flex-row items-center justify-center ml-2">
                      <FontAwesomeIcon
                        icon={icons.faThumbsDown}
                        size={15}
                        style={{ color: "#9ca3af", marginTop: 1 }}
                      />
                      <Text className="text-[14px] font-semibold text-gray-600 ml-[2px]">
                        Dislike
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row justify-center items-center w-[40%] ml-3">
                    <Text className="text-[14px] font-semibold text-gray-600">
                      {comments}
                    </Text>
                    <View className="min-w-fit h-10 flex-row items-center justify-center ml-2">
                      <FontAwesomeIcon
                        icon={icons.faComment}
                        size={15}
                        style={{ color: "#9ca3af" }}
                      />
                      <Text className="text-[14px] font-semibold text-gray-600 ml-[2px]">
                        Comments
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View className="w-full px-3">
                <View className="w-full h-[1px] bg-gray-300"></View>
              </View>
            </View>
            <View className="w-full h-fit flex-col items-start justify-center px-2">
              {
                <View className="w-full h-fit mt-4">
                  <Text className="text-[14px] font-semibold mb-4">
                    Comments
                  </Text>
                  <FlashList
                    data={CommentDummy}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <Comment
                        username={item.userName}
                        avatar={item.userAvatar}
                        comment={item.comment}
                        subcomment={item.subcomment}
                      />
                    )}
                    estimatedItemSize={20}
                  />
                </View>
              }
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <View className="w-full h-fit min-h-[80px] flex-row items-start justify-center bg-white absolute bottom-0 py-4">
        <TextInput
          placeholder="Write a comment..."
          className="w-[80%] px-4 rounded-full border-[1px] border-solid border-gray-300 mr-2"
          numberOfLines={numberOfLines} // Dynamically set
          onContentSizeChange={onContentSizeChange}
          onChangeText={(e) => setMyComment(e)}
          value={myComment}
          style={styles.textInput}
        />
        <TouchableOpacity className="w-10 h-10 flex-row items-center justify-center -mt-[2px]">
          <FontAwesomeIcon
            icon={icons.faLocationArrow}
            size={30}
            style={{ color: "#f59e0b", transform: [{ rotate: "44deg" }] }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 14,
    lineHeight: 16, // Important for accurate line calculation
  },
});
