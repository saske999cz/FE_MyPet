import { View, Image, Text, Dimensions } from "react-native";
import React from "react";

const windowWidth = Dimensions.get("window").width;

const DynamicImageGrid = ({ images }) => {
  return (
    <View style={{ height: 300, marginBottom: 30 }}>
      {(() => {
        switch (images.length) {
          case 1:
            return (
              <Image
                source={
                  typeof images[0] === "string" ? { uri: images[0] } : images[0]
                }
                style={{ width: windowWidth, height: 300 }}
              />
            );
          case 2:
            return images.map((image, index) => (
              <Image
                key={index}
                source={typeof image === "string" ? { uri: image } : image}
                style={{ width: windowWidth, height: 145, margin: 5 }}
              />
            ));
          case 3:
            return (
              <View>
                <Image
                  source={
                    typeof images[0] === "string"
                      ? { uri: images[0] }
                      : images[0]
                  }
                  style={{ width: windowWidth, height: 145 }}
                />
                <View style={{ flexDirection: "row" }}>
                  {images.slice(1).map((image, index) => (
                    <Image
                      key={index}
                      source={
                        typeof image === "string" ? { uri: image } : image
                      }
                      style={{
                        width: windowWidth / 2 - 10,
                        height: 145,
                        margin: 5,
                      }}
                    />
                  ))}
                </View>
              </View>
            );
          case 4:
            return (
              <View>
                <Image
                  source={
                    typeof images[0] === "string"
                      ? { uri: images[0] }
                      : images[0]
                  }
                  style={{ width: windowWidth, height: 215 }}
                />
                <View style={{ flexDirection: "row" }}>
                  {images.slice(1).map((image, index) => (
                    <Image
                      key={index}
                      source={
                        typeof image === "string" ? { uri: image } : image
                      }
                      style={{
                        width: windowWidth / 3 - 10,
                        height: 75,
                        margin: 5,
                      }}
                    />
                  ))}
                </View>
              </View>
            );
          case 5:
          default:
            return (
              <View>
                <View style={{ flexDirection: "row" }}>
                  {images.slice(0, 2).map((image, index) => (
                    <Image
                      key={index}
                      source={
                        typeof image === "string" ? { uri: image } : image
                      }
                      style={{
                        width: windowWidth / 2 - 10,
                        height: 215,
                        margin: 5,
                      }}
                    />
                  ))}
                </View>
                <View style={{ flexDirection: "row" }}>
                  {images.slice(2, 4).map((image, index) => (
                    <Image
                      key={index}
                      source={
                        typeof image === "string" ? { uri: image } : image
                      }
                      style={{
                        width: windowWidth / 3 - 10,
                        height: 75,
                        margin: 5,
                      }}
                    />
                  ))}
                  {images.length > 5 ? (
                    <View
                      style={{
                        width: windowWidth / 3 - 10,
                        height: 75,
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 5,
                      }}
                    >
                      <Image
                        source={
                          typeof images[4] === "string"
                            ? { uri: images[4] }
                            : images[4]
                        }
                        style={{
                          width: windowWidth / 3 - 10,
                          height: 75,
                          position: "absolute",
                        }}
                      />
                      <View className="w-full h-full absolute top-0 left-0 right-0 bottom-0 bg-black opacity-60 z-22 flex-row items-center justify-center">
                        <Text className="font-semibold text-[14px] opacity-50">
                          hello
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "500",
                          fontSize: 17,
                        }}
                      >
                        +{images.length - 5}
                      </Text>
                    </View>
                  ) : (
                    <Image
                      source={
                        typeof images[4] === "string"
                          ? { uri: images[4] }
                          : images[4]
                      }
                      style={{
                        width: windowWidth / 3 - 10,
                        height: 75,
                        margin: 5,
                      }}
                    />
                  )}
                </View>
              </View>
            );
        }
      })()}
    </View>
  );
};

export default DynamicImageGrid;
