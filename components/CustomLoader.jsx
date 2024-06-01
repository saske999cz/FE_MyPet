import { View, Text } from "react-native";
import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";

export const CustomLoader = () => (
  <ContentLoader
    speed={1}
    width={300}
    height={280}
    viewBox="0 0 400 500"
    backgroundColor="#dcdcdc"
    foregroundColor="#9ca3af"
  >
    <Rect x="50" y="0" rx="8" ry="8" width="300" height="168" />
    <Rect x="45" y="200" rx="4" ry="4" width="290" height="25" />
    <Rect x="45" y="240" rx="3" ry="3" width="290" height="25" />
    <Rect x="45" y="280" rx="3" ry="3" width="50" height="25" />
    <Rect x="105" y="280" rx="3" ry="3" width="50" height="25" />
    <Rect x="45" y="320" rx="3" ry="3" width="290" height="25" />
  </ContentLoader>
);

export const ProductDetailLoader = () => (
  <ContentLoader
    speed={1}
    width={500}
    height={800}
    viewBox="0 0 500 800"
    backgroundColor="#dcdcdc"
    foregroundColor="#9ca3af"
  >
    <Rect x="20" y="0" rx="8" ry="8" width="350" height="368" />
    <Rect x="20" y="380" rx="4" ry="4" width="290" height="25" />
    <Rect x="20" y="420" rx="3" ry="3" width="290" height="25" />
    <Rect x="20" y="460" rx="3" ry="3" width="50" height="25" />
    <Rect x="90" y="460" rx="3" ry="3" width="50" height="25" />
    <Rect x="20" y="500" rx="3" ry="3" width="290" height="25" />
  </ContentLoader>
);
