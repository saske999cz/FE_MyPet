import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
  FlatList,
  Modal,
} from "react-native";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
import { images } from "../../constants";
import { router } from "expo-router";
import MyPetCard from "../../components/MyPetCard";
import MyMinimalPost from "../../components/MyMinimalPost";
import { get_all_my_pets } from "../../api/PetApi";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { useGlobalContext } from "../../state/GlobalContextProvider";
import LottieView from "lottie-react-native";
import * as ImagePicker from "expo-image-picker";
import {
  ref,
  uploadBytesResumable,
  listAll,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import { FIREBASE_STORAGE } from "../../firebaseConfig";
import { get_my_blogs, delete_blog } from "../../api/BlogApi";
import { update_profile, get_my_profile } from "../../api/UserApi";

const MyProfile = () => {
  const {
    userAvatar,
    setToast,
    setUserAvatar,
    userId,
    userName,
    userFullName,
    userEmail,
  } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("posts");
  const snapPoints = ["30%", "50%"];
  const [myPets, setMyPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [myBlogs, setMyBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [currentImagesUrls, setCurrentImagesUrls] = useState([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [currentFolderRef, setCurrentFolderRef] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentProccessText, setCurrentProccessText] = useState(". . .");
  const [loadingText, setLoadingText] = useState("Deleting post");
  const [flags, setFlags] = useState([]);
  const bottomSheetModalRef = useRef(null);
  const intervalRef = useRef(null);

  const handleNavigateMyPets = () => {
    router.push("../screens/MyPet");
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

  const handleLoadMore = () => {
    if (page < maxPage) {
      setPage(page + 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // fetch data
    setRefreshing(false);
  };
  const handleBack = () => {
    router.back();
  };

  const openBottomSheet = () => {
    bottomSheetModalRef.current.present();
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current.dismiss();
  };

  const uploadImage = (imageFile) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(FIREBASE_STORAGE, userAvatar);
      deleteObject(storageRef).then(() => {
        const newStorageRef = ref(
          FIREBASE_STORAGE,
          `/avatars/customer/${userId}`
        );
        const uploadTask = uploadBytesResumable(newStorageRef, imageFile);

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
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              setUserAvatar(url);
              resolve(`${newStorageRef.toString()}`);
            });
          }
        );
      });
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 1,
    });

    if (!result.cancelled) {
      setLoadingText("Updating profile image");
      setIsSending(true);
      const imageUri = result.assets[0].uri;
      const response = await fetch(imageUri);
      const blob = await response.blob();
      uploadImage(blob).then((imageRef) => {
        update_profile({
          address: userData.address,
          phone: userData.phone,
          username: userName,
          email: userEmail,
          gender: userData.gender,
          full_name: userFullName,
          birthdate: userData.birthdate,
          avatar: imageRef,
        }).then((res) => {
          if (res && res.status === 200) {
            setLoadingText("Profile image updated successfully!");
            setIsSending(false);
            setToast({
              type: "success",
              text1: "Success",
              text2: "Profile image updated successfully!",
            });
            setLoadingText("Deleting post");
          }
        });
      });
    }
  };

  const handleEditPost = () => {
    closeBottomSheet();
    const encodedUrls = currentImagesUrls.map(encodeURIComponent);
    router.push({
      pathname: "../screens/EditPost",
      params: {
        title: currentTitle,
        text: currentText,
        images: encodedUrls,
        id: currentBlogId,
        folderRef: encodeURIComponent(currentFolderRef),
      },
    });
  };

  const handleDelete = () => {
    closeBottomSheet();
    setShowModal(true);
  };

  const deleteFolder = async (folderPath) => {
    const folderRef = ref(FIREBASE_STORAGE, folderPath);
    try {
      // List all files in the folder
      const fileList = await listAll(folderRef);
      fileList.items.forEach((fileRef) => {
        deleteObject(fileRef)
          .then(() => {
            console.log(`${fileRef.name} deleted successfully`);
          })
          .catch((error) => {
            console.error("Error deleting file:", error);
          });
      });
    } catch (error) {
      console.error("Error listing files:", error);
    }
  };

  const handleDeletePost = async () => {
    const fetchBlogs = async () => {
      const res = await get_my_blogs(page, 10);
      if (res && res.status === 200) {
        const newBlogs = [...myBlogs, ...res.data.data];
        const uniqueBlogs = newBlogs.reduce((unique, blog) => {
          if (!unique.find((item) => item.id === blog.id)) {
            unique.push(blog);
          }
          return unique;
        }, []);
        setMyBlogs(uniqueBlogs);
        setMaxPage(res.data.total_pages);
      } else {
        console.error("Failed to fetch blogs");
        setMaxPage(1);
      }
    };
    setShowModal(false);
    try {
      setIsSending(true);
      startAnimation();
      await deleteFolder(currentFolderRef);
      delete_blog(currentBlogId).then((res) => {
        if (res && res.status === 200) {
          setMyBlogs(myBlogs.filter((blog) => blog.id !== currentBlogId));
          stopAnimation();
          setCurrentProccessText("");
          setLoadingText("Post deleted successfully!");
          setTimeout(() => {
            setIsSending(false);
            setToast({
              type: "success",
              text1: "Success",
              text2: "Post deleted successfully!",
            });
            setLoadingText("Deleting post");
            setCurrentProccessText(". . .");
          }, 500);
        } else {
          console.log(res);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigateMyPet = () => {
    router.push("../screens/MyPet");
  };

  const handleNavigateEditMyProfile = () => {
    router.push("../screens/EditMyProfile");
  };

  useEffect(() => {
    const fetchMyPets = async () => {
      try {
        get_all_my_pets(1, 10).then((res) => {
          if (res && res.status === 200) {
            const newPets = [
              ...myPets,
              ...res.data.data.customer_pets,
              ...res.data.data.adopted_pets,
            ];
            const uniquePets = newPets.reduce((unique, pet) => {
              if (!unique.find((item) => item.pet_id === pet.pet_id)) {
                unique.push(pet);
              }
              return unique;
            }, []);
            setMyPets(uniquePets);
            setFlags((prev) => [...prev, true]);
          } else {
            console.error("Failed to fetch pets");
            setFlags((prev) => [...prev, true]);
          }
        });
      } catch (error) {
        console.error("Error fetching pets:", error);
        setFlags((prev) => [...prev, true]);
      }
    };
    const fetchProfile = async () => {
      const res = await get_my_profile();
      if (res && res.status === 200) {
        setUserData({
          address: res.data.data.address,
          phone: res.data.data.phone,
          gender: res.data.data.gender,
          full_name: res.data.data.full_name,
          birthdate: res.data.data.birthdate,
        });
        setFlags((prev) => [...prev, true]);
      } else {
        console.error("Failed to fetch profile");
        setFlags((prev) => [...prev, true]);
      }
    };
    fetchMyPets();
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await get_my_blogs(page, 10);
      if (res && res.status === 200) {
        const newBlogs = [...myBlogs, ...res.data.data];
        const uniqueBlogs = newBlogs.reduce((unique, blog) => {
          if (!unique.find((item) => item.id === blog.id)) {
            unique.push(blog);
          }
          return unique;
        }, []);
        setMyBlogs(uniqueBlogs);
        setMaxPage(res.data.total_pages);
        setFlags((prev) => [...prev, true]);
      } else {
        console.error("Failed to fetch blogs");
        setMaxPage(1);
        setFlags((prev) => [...prev, true]);
      }
    };
    fetchBlogs();
  }, [page]);

  useEffect(() => {
    if (flags.length === 3 && flags.every((flag) => flag === true)) {
      setIsLoading(false);
    }
  }, [flags]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View className="h-full w-full pb-2">
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
          <View className="w-full h-12 flex-row items-center justify-center mt-[50px]">
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
            <Text className="text-[16px] font-bold">My Profile</Text>
          </View>
          {isLoading ? (
            <View className="w-full h-full flex-row items-start justify-center">
              <LottieView
                style={{ width: 130, height: 130, marginTop: 150 }}
                source={require("../../assets/lottie/loading.json")}
                autoPlay
                loop
                speed={2}
              />
            </View>
          ) : (
            <FlatList
              scrollEventThrottle={16}
              data={myBlogs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MyMinimalPost
                  id={item.id}
                  username={item.username}
                  title={item.title}
                  description={item.text}
                  avatar={item.avatar}
                  uploadedImage={item.image}
                  likes={item.likes_count}
                  dislikes={item.dislikes_count}
                  comments={item.comments_count}
                  interaction={item.interaction_type}
                  createdAt={item.created_at}
                  setIsBottomSheetVisible={openBottomSheet}
                  setCurrentImageUrls={setCurrentImagesUrls}
                  setCurrentTitle={setCurrentTitle}
                  setCurrentText={setCurrentText}
                  setCurrentBlogId={setCurrentBlogId}
                  setCurrentFolderRef={setCurrentFolderRef}
                />
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListHeaderComponent={() => (
                <View className="w-full h-fit">
                  <View className="w-full h-[1px] bg-gray-200"></View>
                  <View className="w-full h-44">
                    <ImageBackground
                      source={images.simple_background}
                      className="w-full h-full object-center"
                      resizeMode="cover"
                    />
                    <View className="w-40 h-40 rounded-full border-4 border-solid border-[#F2F2F2] absolute bottom-0 left-0 ml-3 -mb-9 flex-1 items-center justify-center">
                      <Image
                        source={{ uri: userAvatar }}
                        className="w-full h-full rounded-full"
                      />
                    </View>
                    <TouchableOpacity
                      className="w-8 h-8 rounded-full flex-1 items-center justify-center bg-gray-300 absolute bottom-0 left-0 ml-32 -mb-9 border-[1px] border-solid border-[#F2F2F2]"
                      onPress={pickImage}
                    >
                      <FontAwesomeIcon
                        icon={icons.faCamera}
                        size={16}
                        style={{ color: "#000000" }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View className="w-full h-12 flex-row items-center justify-start px-4 mt-9">
                    <Text className="text-[20px] font-bold">{userName}</Text>
                  </View>
                  <View className="w-full h-9 flex-row items-center justify-start">
                    <TouchableOpacity
                      className="w-32 h-9 flex-row items-center justify-center bg-amber-500 rounded-md ml-4"
                      onPress={handleNavigateEditMyProfile}
                    >
                      <FontAwesomeIcon
                        icon={icons.faPen}
                        size={12}
                        style={{ color: "#ffffff" }}
                      />
                      <Text className="text-[15px] font-semibold ml-2 text-white">
                        Edit info
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="w-full h-[2px] bg-gray-300 mt-4"></View>
                  <View className="flex-col items-center justify-start mt-4 px-4">
                    <View className="w-full flex-row items-center justify-start">
                      <TouchableOpacity
                        className={`w-16 h-8 rounded-full flex-row items-center justify-center ${
                          activeCategory === "posts" ? "bg-[#fed7aa]" : ""
                        }`}
                      >
                        <Text
                          className={`text-[12px] font-semibold ${
                            activeCategory === "posts"
                              ? "text-orange-500"
                              : "text-black"
                          }`}
                        >
                          Posts
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className={`w-16 h-8 rounded-full flex-row items-center justify-center ${
                          activeCategory === "photos" ? "bg-[#fed7aa]" : ""
                        }`}
                        onPress={handleNavigateMyPets}
                      >
                        <Text
                          className={`text-[12px] font-semibold ${
                            activeCategory === "photos"
                              ? "text-orange-500"
                              : "text-black"
                          }`}
                        >
                          Pets
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="w-full h-[1px] bg-gray-300 mt-4"></View>
                  </View>
                  <View className="flex-col items-start justify-start mt-3 px-4">
                    <Text className="font-semibold text-[16px]">Details</Text>
                    <View className="flex-row items-center justify-center mt-3">
                      <FontAwesomeIcon
                        icon={icons.faIdCard}
                        size={15}
                        style={{ color: "#64748b" }}
                      />
                      <View className="flex-row items-center justify-center ml-1">
                        <Text className="text-[14px]">{userFullName}</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center justify-center mt-2">
                      <FontAwesomeIcon
                        icon={icons.faEnvelope}
                        size={15}
                        style={{ color: "#64748b" }}
                      />
                      <View className="flex-row items-center justify-center ml-1">
                        <Text className="text-[14px]">{userEmail}</Text>
                      </View>
                    </View>
                    <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
                  </View>
                  <View className="flex-col items-start justify-start mt-2 px-4">
                    <Text className="font-semibold text-[16px]">My Pets</Text>
                    {myPets && myPets.length > 0 ? (
                      <View className="w-full h-fit mt-3 flex-col items-center justify-start">
                        <View
                          className={`w-full flex-row items-center ${
                            myPets.length >= 3
                              ? "justify-around"
                              : "justify-start"
                          }`}
                        >
                          {myPets.slice(0, 3).map((pet) => (
                            <MyPetCard key={pet.pet_id} pet={pet} />
                          ))}
                        </View>
                        <View
                          className={`w-full flex-row items-center ${
                            myPets.length >= 6
                              ? "justify-around"
                              : "justify-start"
                          }`}
                        >
                          {myPets.slice(3, 6).map((pet) => (
                            <MyPetCard key={pet.pet_id} pet={pet} />
                          ))}
                        </View>
                        {myPets && myPets.length > 6 && (
                          <TouchableOpacity
                            className="w-full h-9 flex-row items-center justify-center bg-gray-200 rounded-md mt-4"
                            onPress={handleNavigateMyPet}
                          >
                            <Text className="font-semibold text-[14px]">
                              See all pets
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ) : (
                      <View className="w-full h-fit flex-row items-center justify-start px-4 mt-2 mb-2">
                        <Text className="text-[13px]">No pets found</Text>
                      </View>
                    )}
                    <View className="w-full h-[1px] bg-gray-300 mt-4 px-4"></View>
                  </View>
                  <View className="w-full h-fit flex-col items-start justify-start mt-2 mb-3">
                    <Text className="font-semibold text-[16px] px-4">
                      My Posts
                    </Text>
                  </View>
                </View>
              )}
            />
          )}
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            enablePanDownToClose={true}
            backgroundStyle={{
              backgroundColor: "#F5F5F7",
            }}
          >
            <View className="w-full h-full bg-[#F5F5F7] flex-col items-center justify-start">
              <View className="w-[92%] h-40 flex-col items-start justify-start px-6 bg-white border-solid border-[0.5px] border-gray-200 rounded-lg">
                <TouchableOpacity
                  className="w-full h-12 flex-row items-center justify-start mt-2"
                  onPress={handleEditPost}
                >
                  <FontAwesomeIcon
                    icon={icons.faPen}
                    size={18}
                    style={{ color: "#000000" }}
                  />
                  <Text className="text-[14px] font-semibold ml-3">
                    Edit Post
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="w-full h-12 flex-row items-center justify-start mt-2"
                  onPress={handleDelete}
                >
                  <FontAwesomeIcon
                    icon={icons.faTrashCan}
                    size={18}
                    style={{ color: "#000000" }}
                  />
                  <Text className="text-[14px] font-semibold ml-3">
                    Delete Post
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BottomSheetModal>
          <Modal visible={showModal} animationType="fade" transparent={true}>
            <View className="flex-1 bg-zinc-900/40 opacity-[50] h-full w-full flex-row items-center justify-center">
              <View className="w-56 flex-col h-24 items-center justify-center bg-white rounded-md">
                <View className="w-full h-[45%] flex-row items-center justify-center px-2">
                  <Text className="text-[13px] text-gray-600 font-medium">
                    Are you sure you want to delete this post?
                  </Text>
                </View>
                <View className="w-full h-[45%] flex-row items-center justify-center mt-2 border-t-[1px] border-solid border-gray-300">
                  <TouchableOpacity
                    className="w-[50%] h-full bg-white flex-row items-center justify-center border-r-[1px] border-solid border-gray-300 rounded-bl-md"
                    onPress={() => setShowModal(false)}
                  >
                    <Text className="text-black text-[13px] font-medium">
                      No
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-[50%] h-full bg-white flex-row items-center justify-center rounded-br-md"
                    onPress={handleDeletePost}
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
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default MyProfile;
