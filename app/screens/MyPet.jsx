import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { router } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons } from "../../constants";
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
import { SwipeablePetRow } from "../../components/SwipeablePetRow";
import {
  get_all_my_pets,
  delete_pet,
  create_pet,
  get_breeds,
} from "../../api/PetApi";
import { FIREBASE_STORAGE } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import RNPickerSelect from "react-native-picker-select";
import { useGlobalContext } from "../../state/GlobalContextProvider";
import LottieView from "lottie-react-native";

const MyPet = () => {
  const { setToast } = useGlobalContext();
  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["90%"];
  const [newPetImage, setNewPetImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [pets, setPets] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [page, setPage] = useState(1);
  const [newPet, setNewPet] = useState({
    name: "",
    type: "",
    breed_id: "",
    age: null,
    is_purebred: 1,
    gender: "",
    image: null,
  });
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleBack = () => {
    router.back();
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const openBottomSheet = () => {
    bottomSheetModalRef.current.present();
  };
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36);
  };

  const uploadImage = (imageFile) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(FIREBASE_STORAGE, /pets/ + generateId());
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
          // Instead of getting the download URL, we'll resolve with the gs:// URL
          resolve(`${storageRef.toString()}`);
        }
      );
    });
  };

  const handleCreateNewPet = async () => {
    let newErrors = {}; // Temporary object to accumulate errors

    if (!newPet.name) {
      newErrors = { ...newErrors, name: "Please enter your pet name" };
    }
    if (!newPet.type) {
      newErrors = { ...newErrors, type: "Please select a type" };
    } else if (!newPet.breed_id) {
      newErrors = { ...newErrors, breed: "Please select a breed" };
    }
    if (!newPet.age) {
      newErrors = { ...newErrors, age: "Please enter your pet age" };
    }
    if (!newPet.gender) {
      newErrors = { ...newErrors, gender: "Please select your pet gender" }; // Corrected typo from "you" to "your"
    }
    if (!newPetImage) {
      newErrors = { ...newErrors, image: "Please upload an image" };
    }
    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const downloadURL = await uploadImage(imageBlob);
      create_pet({ ...newPet, image: downloadURL }).then((res) => {
        if (res && res.status === 201) {
          setNewPet({
            name: "",
            type: "",
            breed_id: "",
            age: null,
            is_purebred: 1,
            gender: "",
            image: null,
          });
          setNewPetImage(null);
          setImageBlob(null);
          setBreeds([]);
          setIsLoading(false);
          bottomSheetModalRef.current.dismiss();
          setToast({
            type: "success",
            text1: "Success",
            text2: "New pet added successfully!",
          });
        } else {
          console.log(res.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    setError({ ...error, image: null });
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 1,
    });

    if (!result.cancelled) {
      setNewPetImage(result.assets.map((asset) => asset.uri));
      const imageUri = result.assets[0].uri;
      const response = await fetch(imageUri);
      const blob = await response.blob();
      setImageBlob(blob);
    }
  };

  const handleDeleteRow = async (id) => {
    const newData = pets.filter((item) => item.pet_id !== id);
    setPets(newData);
    delete_pet(id);
  };

  useEffect(() => {
    const fetchMyPets = async () => {
      try {
        get_all_my_pets(page, 10).then((res) => {
          if (res && res.status === 200) {
            const newPets = [
              ...pets,
              ...res.data.data.customer_pets,
              ...res.data.data.adopted_pets,
            ];
            const uniquePets = newPets.reduce((unique, pet) => {
              if (!unique.find((item) => item.pet_id === pet.pet_id)) {
                unique.push(pet);
              }
              return unique;
            }, []);
            setPets(uniquePets);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyPets();
  }, [page]);

  useEffect(() => {
    setBreeds([]);
    const fetchBreeds = async () => {
      try {
        if (newPet.type !== "") {
          get_breeds(newPet.type).then((res) => {
            if (res && res.status === 200) {
              setBreeds(res.data.data);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    };
    fetchBreeds();
  }, [newPet.type]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View className="h-full w-full">
          {isLoading ? (
            <View className="w-full h-full bg-black opacity-90 flex-row items-start justify-center">
              <LottieView
                style={{ width: 240, height: 240, marginTop: 250 }}
                source={require("../../assets/lottie/sendingData.json")}
                autoPlay
                loop
                speed={1.5}
              />
            </View>
          ) : (
            <View className="w-full h-full">
              <View className="w-full h-12 flex-row items-center justify-center mb-2 border-b-[0.5px] border-solid border-gray-300 mt-12">
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
                <Text className="font-bold text-[16px]">My Pets</Text>
                <TouchableOpacity
                  className="w-12 h-12 flex-row items-center justify-center absolute top-0 right-0 mr-3"
                  onPress={openBottomSheet}
                >
                  <FontAwesomeIcon
                    icon={icons.faPlus}
                    size={16}
                    style={{ color: "#f59e0b" }}
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                data={pets}
                renderItem={({ item }) => (
                  <SwipeablePetRow
                    key={item.pet_id}
                    onDelete={() => handleDeleteRow(item.pet_id)}
                    item={item}
                  />
                )}
                keyExtractor={(item) => item.pet_id}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
              />
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
                    <Text className="font-semibold text-[15px]">
                      My New Pet
                    </Text>
                    <TouchableOpacity
                      className="w-12 h-12 absolute right-0 top-0 bottom-0 mt-4"
                      onPress={handleCreateNewPet}
                    >
                      <Text className="font-semibold text-amber-500 text-[15px]">
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    className="w-full"
                    showsVerticalScrollIndicator={false}
                  >
                    <View className="w-full h-fit flex-col items-start justify-start px-6 bg-white border-solid border-[0.5px] border-gray-200 rounded-lg">
                      <FormField
                        title="Name"
                        placeholder="Enter your pet name"
                        titleStyles="text-black font-[13px]"
                        otherStyles="mt-5"
                        handleChangeText={(text) => {
                          setNewPet({ ...newPet, name: text });
                          setError({ ...error, name: null });
                        }}
                        value={newPet.name}
                        error={error.name}
                      />
                      <View className="w-full h-20 flex-col mt-4">
                        <View
                          className={`w-full h-fit flex-row items-center px-2 ${
                            error.type ? "justify-between" : "justify-start"
                          }`}
                        >
                          <Text className="font-semibold text-black font-[13px] mt-2 mb-2">
                            Type
                          </Text>
                          {error.type && (
                            <Text className="text-[12px] text-red-500">
                              {error.type}
                            </Text>
                          )}
                        </View>
                        <RNPickerSelect
                          value={newPet.type}
                          onValueChange={(value) => {
                            setNewPet({ ...newPet, type: value });
                            setError({ ...error, type: null });
                          }}
                          placeholder={{
                            label: "Select a type...",
                            value: null,
                          }}
                          style={{
                            placeholder: {
                              color: "#64748b",
                            },
                            inputIOS: {
                              // styles for iOS
                              width: "100%",
                              height: 45,
                              borderColor: `${error.type ? "red" : "#d1d5db"}`,
                              borderRadius: 6,
                              borderWidth: 2,
                              paddingHorizontal: 12,
                              fontSize: 13,
                            },
                            inputAndroid: {
                              // styles for Android
                              width: "100%",
                              height: 45,
                              borderColor: `${error.type ? "red" : "#d1d5db"}`,
                              borderRadius: 6,
                              borderWidth: 2,
                              paddingHorizontal: 12,
                              fontSize: 13,
                            },
                          }}
                          items={[
                            { label: "Dog", value: "dog" },
                            { label: "Cat", value: "cat" },
                          ]}
                        />
                      </View>

                      {breeds.length > 0 && (
                        <View className="w-full h-20 flex-col mt-4">
                          <View
                            className={`w-full h-fit flex-row items-center px-2 ${
                              error.breed ? "justify-between" : " justify-start"
                            }`}
                          >
                            <Text className="font-semibold text-black font-[13px] mt-2 mb-2">
                              Breed
                            </Text>
                            {error.breed && (
                              <Text className="text-[12px] text-red-500">
                                {error.breed}
                              </Text>
                            )}
                          </View>
                          <RNPickerSelect
                            value={newPet.breed_id}
                            onValueChange={(value) => {
                              setNewPet({ ...newPet, breed_id: value });
                              setError({ ...error, breed: null });
                            }}
                            items={breeds.map((breed) => ({
                              label: breed.name,
                              value: breed.id,
                            }))}
                            placeholder={{
                              label: "Select a breed...",
                              value: null,
                            }}
                            style={{
                              placeholder: {
                                color: "#64748b",
                              },
                              inputIOS: {
                                // styles for iOS
                                width: "100%",
                                height: 45,
                                borderColor: `${
                                  error.breed ? "red" : "#d1d5db"
                                }`,
                                borderRadius: 6,
                                borderWidth: 2,

                                paddingHorizontal: 12,
                                fontSize: 13,
                              },
                              inputAndroid: {
                                // styles for Android
                                width: "100%",
                                height: 45,
                                borderColor: `${
                                  error.breed ? "red" : "#d1d5db"
                                }`,
                                borderRadius: 6,
                                borderWidth: 2,

                                paddingHorizontal: 12,
                                fontSize: 13,
                              },
                            }}
                          />
                        </View>
                      )}
                      <FormField
                        title="Age"
                        placeholder="Enter your pet age"
                        titleStyles="text-black font-[13px]"
                        otherStyles="mt-5"
                        handleChangeText={(text) => {
                          setNewPet({ ...newPet, age: text });
                          setError({ ...error, age: null });
                        }}
                        value={newPet.age}
                        error={error.age}
                        numericKeyboard={true}
                      />
                      <View className="w-full h-20 flex-col mt-4">
                        <View
                          className={`w-full h-fit flex-row items-center px-2 ${
                            error.gender ? "justify-between" : "justify-start"
                          }`}
                        >
                          <Text className="font-semibold text-black text-[13px] mt-2 mb-2">
                            Gender
                          </Text>
                          {error.gender && (
                            <Text className="text-[12px] text-red-500">
                              {error.gender}
                            </Text>
                          )}
                        </View>
                        <RNPickerSelect
                          value={newPet.gender}
                          onValueChange={(value) => {
                            setNewPet({ ...newPet, gender: value });
                            setError({ ...error, gender: null });
                          }}
                          placeholder={{
                            label: "Select a gender...",
                            value: null,
                          }}
                          items={[
                            { label: "Male", value: "male" },
                            { label: "Female", value: "female" },
                          ]}
                          style={{
                            placeholder: {
                              color: "#64748b",
                            },
                            inputIOS: {
                              // styles for iOS
                              width: "100%",
                              height: 45,
                              borderColor: `${
                                error.gender ? "red" : "#d1d5db"
                              }`,
                              borderRadius: 6,
                              borderWidth: 2,

                              paddingHorizontal: 12,
                              fontSize: 13,
                            },
                            inputAndroid: {
                              // styles for Android
                              width: "100%",
                              height: 45,
                              borderColor: `${
                                error.gender ? "red" : "#d1d5db"
                              }`,
                              borderRadius: 6,
                              borderWidth: 2,

                              paddingHorizontal: 12,
                              fontSize: 13,
                            },
                          }}
                        />
                      </View>
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
                        {newPetImage && (
                          <DynamicImageGrid images={newPetImage} />
                        )}
                        {error.image && (
                          <View className="w-full h-5 flex-row items-center justify-center mb-4">
                            <Text className="text-[12px] text-red-500">
                              {error.image}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </BottomSheetModal>
            </View>
          )}
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default MyPet;
