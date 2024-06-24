import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: process.env.GOOGLE_MAPS_API_KEY,
        language: "en",
      }}
      styles={{
        textInputContainer: {
          borderRadius: 12,
          alignItems: "center",
          flexDirection: "row",
          height: 48,
          justifyContent: "center",
          borderBlockColor: "#9ca3af",
          borderWidth: 1,
          padding: 2,
          maxHeight: 500,
        },
        textInput: {
          height: 38,
          color: "#5d5d5d",
          fontSize: 16,
          marginTop: 4,
        },
      }}
    />
  );
};

export default GooglePlacesInput;
