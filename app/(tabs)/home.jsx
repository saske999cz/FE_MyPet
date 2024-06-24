import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { icons, blurhash, images } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MinimalPost from "../../components/MinimalPost";
import { router } from "expo-router";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import FormField from "../../components/FormField";
import * as ImagePicker from "expo-image-picker";
import DynamicImageGrid from "../../components/DynamicImageGrid";
import { FIREBASE_STORAGE } from "../../firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Image } from "expo-image";
import { useGlobalContext } from "../../state/GlobalContextProvider";
import { get_current_cart, create_cart } from "../../api/CartApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get_blogs, create_blog } from "../../api/BlogApi";
import LottieView from "lottie-react-native";

const Home = () => {
  const {
    userAvatar,
    setUserAvatar,
    setCartLength,
    setCartId,
    setCurrentCartItems,
    setNotifications,
    blogChanged,
    userId,
    setUserId,
    userEmail,
    setUserEmail,
    userFullName,
    setUserFullName,
    userName,
    setUserName,
    setToast,
  } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["90%"];
  const [postData, setPostData] = useState({
    title: "",
    text: "",
    image: [],
  });
  const [imageList, setImageList] = useState(null);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [imageBlobs, setImageBlobs] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState({});
  const [currentProccessText, setCurrentProccessText] = useState(". . .");
  const [loadingText, setLoadingText] = useState("Creating new post");
  const intervalRef = useRef(null);

  const handleNavigateMyProfile = () => {
    router.push("../screens/MyProfile");
  };

  const handleLoadMore = () => {
    if (page >= maxPage) return;
    setPage((prevPage) => prevPage + 1);
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36);
  };

  const startAnimation = () => {
    if (!intervalRef.current) {
      // Check if already running
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
      const storageRef = ref(
        FIREBASE_STORAGE,
        /blogs/ + id + "/" + generateId()
      );
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
    }
  };

  const handleCreateNewPost = async () => {
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
      const newBlogId = generateId();
      const folderRef = ref(FIREBASE_STORAGE, "/blogs/" + `${newBlogId}`);
      setIsSending(true);
      startAnimation();
      bottomSheetModalRef.current.dismiss();
      let downloadURLs = null;
      if (imageList.length > 0) {
        downloadURLs = await Promise.all(
          imageBlobs.map(async (blob) => {
            return await uploadImage(blob, newBlogId);
          })
        );
      }
      console.log("Download URLs: ", downloadURLs);
      create_blog({ ...postData, image: folderRef.toString() + "/" }).then(
        (res) => {
          if (res && res.status === 201) {
            setPostData({
              title: "",
              text: "",
              image: [],
            });
            setImageBlobs([]);
            setImageList(null);
            stopAnimation();
            setCurrentProccessText("");
            setLoadingText("New post created successfully!");
            setTimeout(() => {
              setIsSending(false);
              setToast({
                type: "success",
                text1: "Success",
                text2: "New post created successfully!",
              });
              setLoadingText("Creating new post");
              setCurrentProccessText(". . .");
            }, 500);
          } else {
            console.log(res);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setIsLoading(true);
    if (page > 1) setPage(1);
    else {
      const fetchBlogs = async () => {
        const res = await get_blogs(page, 10);
        if (res && res.status === 200) {
          const newBlogs = [...blogs, ...res.data.data];
          const uniqueBlogs = newBlogs.reduce((unique, blog) => {
            if (!unique.find((item) => item.id === blog.id)) {
              unique.push(blog);
            }
            return unique;
          }, []);
          setBlogs(uniqueBlogs);
          setMaxPage(res.data.total_pages);
          setIsLoading(false);
        } else {
          console.error("Failed to fetch blogs");
          setMaxPage(1);
          setIsLoading(false);
        }
      };
      fetchBlogs();
    }
    setRefreshing(false);
  };

  const handleNavigateSearch = () => {
    router.push("../screens/Search");
  };

  const handleNavigateNotifications = () => {
    router.push("../screens/Notifications");
  };

  const toggleSheet = () => {
    bottomSheetModalRef.current.present();
  };

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

  useEffect(() => {
    const fetchUserCart = async () => {
      const res = await get_current_cart();
      if (res && res.status === 200) {
        setCartLength(
          res.data.shops.reduce(
            (total, shop) => total + shop.cart_items.length,
            0
          )
        );
        setCartId(res.data.cart.id);
        const combinedItemIds = res.data.shops.reduce((ids, shop) => {
          const shopItemIds = shop.cart_items.map((item) => item.product_id);
          return ids.concat(shopItemIds);
        }, []);
        setCurrentCartItems(combinedItemIds);
      } else {
        const res = await create_cart();
        if (res && res.status === 200) {
          setCartLength(
            res.data.shops.reduce(
              (total, shop) => total + shop.cart_items.length,
              0
            )
          );
          setCartId(res.data.cart.id);
          const combinedItemIds = res.data.shops.reduce((ids, shop) => {
            const shopItemIds = shop.cart_items.map((item) => item.product_id);
            return ids.concat(shopItemIds);
          }, []);
          setCurrentCartItems(combinedItemIds);
        } else {
          setCartLength(0);
          setCartId(res.data.cart.id);
        }
      }
    };
    const getUserAvatar = async () => {
      const localAvatar = await AsyncStorage.getItem("userAvatar");
      const notifications = await AsyncStorage.getItem("notifications");
      if (notifications) {
        setNotifications(notifications);
      }
      if (localAvatar) {
        setUserAvatar(localAvatar);
        return;
      } else {
        const avatarRef = ref(FIREBASE_STORAGE, userAvatar);
        const url = await getDownloadURL(avatarRef);
        setUserAvatar(url);
        await AsyncStorage.setItem("userAvatar", url);
      }
    };
    const fetchUserDataFromStorage = async () => {
      if (userId) return;
      const id = await AsyncStorage.getItem("userId");
      const name = await AsyncStorage.getItem("userName");
      const email = await AsyncStorage.getItem("userEmail");
      const fullName = await AsyncStorage.getItem("userFullName");
      if (id) setUserId(id);
      if (name) setUserName(name);
      if (email) setUserEmail(email);
      if (fullName) setUserFullName(fullName);
    };
    getUserAvatar();
    fetchUserCart();
    fetchUserDataFromStorage();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await get_blogs(page, 10);
      if (res && res.status === 200) {
        const newBlogs = [...blogs, ...res.data.data];
        const uniqueBlogs = newBlogs.reduce((unique, blog) => {
          if (!unique.find((item) => item.id === blog.id)) {
            unique.push(blog);
          }
          return unique;
        }, []);
        setBlogs(uniqueBlogs);
        setMaxPage(res.data.total_pages);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch blogs");
        setMaxPage(1);
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, [page, blogChanged]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View className="h-full w-full">
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
          <View className="w-full justify-between items-center flex-row px-4 mt-[59px]">
            <Image
              source={images.logoBlack}
              className="w-32 h-16 -ml-4 mt-1"
              contentFit="contain"
            />
            <View className="flex-row items-center w-[40%] justify-around -mr-1">
              <TouchableOpacity
                className="w-10 h-10 bg-[#e5e7eb] rounded-full flex-row items-center justify-center"
                onPress={handleNavigateSearch}
              >
                <FontAwesomeIcon
                  icon={icons.faMagnifyingGlass}
                  size={20}
                  style={{ color: "#000000" }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="w-10 h-10 bg-[#e5e7eb] rounded-full flex-row items-center justify-center"
                onPress={handleNavigateNotifications}
              >
                <FontAwesomeIcon
                  icon={icons.faBell}
                  size={20}
                  style={{ color: "#000000" }}
                />
              </TouchableOpacity>

              {userAvatar && (
                <TouchableOpacity
                  className="w-9 h-9 rounded-full"
                  onPress={handleNavigateMyProfile}
                >
                  <Image
                    source={{ uri: userAvatar }}
                    className="w-full h-full rounded-full"
                    transition={0}
                    placeholder={{ blurhash }}
                  />
                </TouchableOpacity>
              )}
            </View>
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
          ) : blogs && blogs.length > 0 ? (
            <FlatList
              data={blogs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MinimalPost
                  id={item.id}
                  userId={item.account_id}
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
                />
              )}
              ListHeaderComponent={() => (
                <View className="px-3 space-y-5 pb-4 mt-2">
                  <TouchableOpacity
                    className="w-full h-10 bg-[#e5e7eb] rounded-lg flex-row items-center justify-between px-3"
                    onPress={toggleSheet}
                  >
                    <Text className="text-[15px] text-[#64676B]">
                      Want to share something?
                    </Text>
                    <FontAwesomeIcon
                      icon={icons.faPen}
                      size={16}
                      style={{ color: "#64676B" }}
                    />
                  </TouchableOpacity>
                </View>
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              initialNumToRender={10}
              scrollEventThrottle={8}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
            />
          ) : (
            <View className="w-full h-full flex-row items-start justify-center bg-[#f9f9f9]">
              <Image
                source={images.nodata}
                className="w-full h-[400px]"
                contentFit="contain"
              />
            </View>
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
              <View className="w-full h-12 flex-row items-center justify-center ">
                <Text className="font-semibold text-[15px]">Create post</Text>
                <TouchableOpacity
                  className="w-12 h-12 absolute right-0 top-0 bottom-0 mt-4"
                  onPress={handleCreateNewPost}
                >
                  <Text className="font-semibold text-amber-500 text-[15px]">
                    Post
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                className="w-full"
                showsVerticalScrollIndicator={false}
              >
                <View className="w-full h-fit flex-col items-start justify-start px-6 bg-white border-solid border-[0.5px] border-gray-200 rounded-lg">
                  <View className="w-full h-12 flex-row items-center justify-start mt-2">
                    <View className="w-9 h-9 rounded-full border-[0.5px] border-solid border-gray-200">
                      {userAvatar && (
                        <Image
                          source={{ uri: userAvatar }}
                          className="w-full h-full rounded-full"
                          transition={0}
                          placeholder={{ blurhash }}
                        />
                      )}
                    </View>
                    <Text className="text-[14px] font-semibold ml-4">
                      {userName}
                    </Text>
                  </View>
                  <FormField
                    title="Title"
                    placeholder="Title"
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
                    placeholder="Enter description here..."
                    titleStyles="text-black font-[13px]"
                    otherStyles="mt-5"
                    value={postData.text}
                    multiline={true}
                    numberOfLines={5}
                    height={32}
                    onChangeText={(e) => {
                      setPostData({ ...postData, text: e });
                      setError({ ...error, text: null });
                    }}
                    error={error.text}
                  />
                  <View className="w-full h-fit px-4 flex-col items-center justify-center mt-6">
                    <TouchableOpacity
                      className="w-32 h-10 rounded-lg flex-row items-center justify-center bg-amber-500 mb-4"
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
                    {imageList && <DynamicImageGrid images={imageList} />}
                  </View>
                </View>
              </ScrollView>
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Home;
