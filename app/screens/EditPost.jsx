import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { router } from "expo-router";
import FormField from "../../components/FormField";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../../constants";
import { useLocalSearchParams } from "expo-router";
import "react-native-get-random-values";
import { useGlobalContext } from "../../state/GlobalContextProvider";
import { Image } from "expo-image";
import { FIREBASE_STORAGE } from "../../firebaseConfig";
import { ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import LottieView from "lottie-react-native";
import * as ImagePicker from "expo-image-picker";
import { update_blog } from "../../api/BlogApi";

const EditPost = () => {
  const { title, text, images, id, folderRef } = useLocalSearchParams();
  const [postData, setPostData] = useState({
    title: title,
    text: text,
  });
  const [imagesUrls, setImagesUrls] = useState(images.split(","));
  const [targetFolderRef, setTargetFolderRef] = useState(folderRef);
  const [imageList, setImageList] = useState([]);
  const [error, setError] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [imageBlobs, setImageBlobs] = useState([]);
  const [currentProccessText, setCurrentProccessText] = useState(". . .");
  const [loadingText, setLoadingText] = useState("Updating post");
  const { userAvatar, userName } = useGlobalContext();
  const [deletedImage, setDeletedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const intervalRef = useRef(null);

  const handleBack = () => {
    router.back();
  };

  const handleDelete = (image) => {
    setDeletedImage(image);
    setShowModal(true);
  };

  const handleDeleteImage = async () => {
    try {
      setImagesUrls(imagesUrls.filter((url) => url !== deletedImage));
      const imageRef = ref(FIREBASE_STORAGE, deletedImage);
      await deleteObject(imageRef);
      console.log("Image deleted successfully!");
      setShowModal(false);
    } catch (error) {
      alert(`Error Failed to delete file: ${error.message}`);
      setShowModal(false);
    }
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36);
  };

  const startAnimation = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setCurrentProccessText((prevText) => {
          if (prevText === ". . .") return ".";
          return prevText + " .";
        });
      }, 200);
    }
  };

  const stopAnimation = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const uploadImage = (imageFile, id) => {
    return new Promise((resolve, reject) => {
      const storageRef =
        targetFolderRef === null ||
        targetFolderRef === "" ||
        targetFolderRef === undefined
          ? ref(FIREBASE_STORAGE, /blogs/ + id + "/" + generateId())
          : ref(FIREBASE_STORAGE, targetFolderRef + generateId());
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error("Upload failed:", error);
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          resolve(`${storageRef.toString()}`);
        }
      );
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImageList(result.assets.map((asset) => asset.uri));
      const imageUris = result.assets.map((asset) => asset.uri);
      const responses = await Promise.all(
        imageUris.map(async (uri) => {
          const response = await fetch(uri);
          return await response.blob();
        })
      );
      setImageBlobs(responses);
      setImagesUrls([...imagesUrls, ...imageUris]);
    }
  };

  const handleEditPost = async () => {
    let newErrors = {}; // Temporary object to accumulate errors

    if (!postData.title) {
      newErrors = { ...newErrors, title: "Please enter title" };
    }
    if (!postData.text) {
      newErrors = { ...newErrors, text: "Please enter description" };
    }

    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const newFolderRef = ref(FIREBASE_STORAGE, "/blogs/" + `${id}`);
      if (
        targetFolderRef === null ||
        targetFolderRef === "" ||
        targetFolderRef === undefined
      ) {
        setPostData({ ...postData, image: newFolderRef.toString() });
      }
      setIsSending(true);
      startAnimation();
      let downloadURLs = null;
      if (imageList.length > 0) {
        downloadURLs = await Promise.all(
          imageBlobs.map(async (blob) => {
            return await uploadImage(blob, id);
          })
        );
      }
      console.log("Download URLs: ", downloadURLs);
      update_blog(id, { ...postData }).then((res) => {
        if (res && res.status === 200) {
          setPostData({
            title: "",
            text: "",
            image: [],
          });
          setImageBlobs([]);
          setImageList(null);
          stopAnimation();
          setCurrentProccessText("");
          setLoadingText("Post updated successfully!");
          setTimeout(() => {
            setIsSending(false);
            setToast({
              type: "success",
              text1: "Success",
              text2: "Post updated successfully!",
            });
            setLoadingText("Updating post");
            setCurrentProccessText(". . .");
            router.replace("../screens/MyProfile");
          }, 500);
        } else {
          console.log(res);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="w-full h-full pb-10">
      {isSending && (
        <View className="w-full h-full flex-row items-start justify-center absolute top-0 bottom-0 z-[12]">
          <View className="w-full h-full bg-zinc-900/40 opacity-100 absolute top-0 bottom-0"></View>
          <LottieView
            style={{ width: 240, height: 240, marginTop: 250 }}
            source={require("../../assets/lottie/sendingData.json")}
            autoPlay
            loop
            speed={1.5}
          />
          <View className="w-full h-fit absolute top-[440px] flex-row items-center justify-center">
            <View className="w-fit h-fit flex-row items-center justify-end">
              <Text className="text-white text-[14px] font-semibold">
                {loadingText}
              </Text>
            </View>
            {currentProccessText !== "" && (
              <View className="w-7 h-fit flex-row items-center justify-start ml-1">
                <Text className="text-white text-[14px] font-semibold ">
                  {currentProccessText}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
      <View className="w-full h-12 flex-row items-center justify-center mb-4 mt-[55px]">
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
        <View className="w-[80%] h-12 flex-row items-center justify-center">
          <View className="w-9 h-9 rounded-full border-solid border-[0.5px] border-gray-200">
            <Image
              source={{ uri: userAvatar }}
              className="w-full h-full rounded-full"
              placeholder={{ blurhash }}
              transition={0}
            />
          </View>
          <Text className="ml-2 text-[15px] font-semibold">{userName}</Text>
        </View>
        <TouchableOpacity
          className="w-12 h-12 flex-row items-center justify-center absolute top-0 right-0 mr-3"
          onPress={handleEditPost}
        >
          <Text className="font-semibold text-[15px] text-amber-500">Done</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="w-full h-full">
        <View className="w-full h-fit flex-col px-4">
          <FormField
            title="Title"
            titleStyles="text-black font-[13px]"
            otherStyles="mt-5"
            value={postData.title}
            onChangeText={(text) => {
              setError({ ...error, title: null });
              setPostData({ ...postData, title: text });
            }}
            error={error.title}
          />
          <FormField
            title="Description"
            titleStyles="text-black font-[13px]"
            otherStyles="mt-5"
            multiline={true}
            numberOfLines={5}
            height={32}
            value={postData.text}
            onChangeText={(text) => {
              setError({ ...error, text: null });
              setPostData({ ...postData, text: text });
            }}
            error={error.text}
          />
          <View className="w-full h-16 flex-row items-center justify-center mt-3">
            <TouchableOpacity
              className="w-32 h-10 rounded-lg flex-row items-center justify-center bg-amber-500"
              onPress={pickImage}
            >
              <FontAwesomeIcon
                icon={icons.faArrowUpFromBracket}
                size={17}
                style={{ color: "#ffffff" }}
              />
              <Text className="text-[13px] text-white ml-2 font-semibold">
                Upload image
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="w-full h-fit mt-4">
          {imagesUrls &&
            imagesUrls.length > 0 &&
            imagesUrls.map((item, index) => (
              <View className="w-full h-36 mt-4" key={index}>
                <TouchableOpacity
                  className="w-6 h-6 rounded-full bg-gray-700 flex-row items-center justify-center absolute left-0 top-0 -mr-1 -mt-1 z-10"
                  onPress={() => handleDelete(item)}
                >
                  <FontAwesomeIcon
                    icon={icons.faXmark}
                    size={12}
                    style={{ color: "#ffffff" }}
                  />
                </TouchableOpacity>
                <Image
                  source={{ uri: item }}
                  className="w-full h-full"
                  placeholder={{ blurhash }}
                  transition={0}
                />
              </View>
            ))}
        </View>
      </ScrollView>
      <Modal visible={showModal} animationType="fade" transparent={true}>
        <View className="flex-1 bg-zinc-900/40 opacity-[50] h-full w-full flex-row items-center justify-center">
          <View className="w-56 flex-col h-24 items-center justify-center bg-white rounded-md">
            <View className="w-full h-[45%] flex-row items-center justify-center px-2">
              <Text className="text-[13px] text-gray-600 font-medium">
                Are you sure you want to delete this picture?
              </Text>
            </View>
            <View className="w-full h-[45%] flex-row items-center justify-center mt-2 border-t-[1px] border-solid border-gray-300">
              <TouchableOpacity
                className="w-[50%] h-full bg-white flex-row items-center justify-center border-r-[1px] border-solid border-gray-300 rounded-bl-md"
                onPress={() => setShowModal(false)}
              >
                <Text className="text-black text-[13px] font-medium">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="w-[50%] h-full bg-white flex-row items-center justify-center rounded-br-md"
                onPress={handleDeleteImage}
              >
                <Text className="text-[#f59e0b] text-[13px] font-medium">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditPost;
