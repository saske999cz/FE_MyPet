import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  FlatList,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icons, blurhash } from "../../constants";
import Comment from "../../components/Comment";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import { FIREBASE_STORAGE } from "../../firebaseConfig";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import LottieView from "lottie-react-native";
import DynamicImageGrid from "../../components/DynamicImageGrid";
import {
  get_blog_detail,
  create_comment,
  interact_blog,
  edit_comment,
  delete_comment,
} from "../../api/BlogApi";
import { useGlobalContext } from "../../state/GlobalContextProvider";
import * as timeago from "timeago.js";

const PostDetail = () => {
  const { id, interaction } = useLocalSearchParams();
  const { userId, setBlogChanged, blogChanged } = useGlobalContext();
  const [myComment, setMyComment] = useState("");
  const [comments, setComments] = useState([]);
  const [allComments, setAllComments] = useState([]);
  const [blog, setBlog] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [flags, setFlags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newBlogInteraction, setNewBlogInteraction] = useState(interaction);
  const [newBlogLikeCount, setNewBlogLikeCount] = useState(null);
  const [newBlogDislikeCount, setNewBlogDislikeCount] = useState(null);
  const [parentCommentId, setParentCommentId] = useState(null);
  const [parentUsername, setParentUsername] = useState(null);
  const [totalComments, setTotalComments] = useState(0);
  const [editCommentId, setEditCommentId] = useState(null);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [dataChanged, setDataChanged] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleUserPress = () => {
    router.push({
      pathname: "../screens/ProfileDetail",
      params: {
        id: blog.account_id.toString(),
        username: blog.username,
        avatar: encodeURI(avatarUrl),
      },
    });
  };

  const handleInspectPhotos = () => {
    const encodedUrls = imageUrls.map(encodeURIComponent);
    router.push({
      pathname: "../screens/PostPhotos",
      params: { images: encodedUrls },
    });
  };

  const handleDeleteComment = async () => {
    delete_comment(deleteCommentId).then((res) => {
      if (res && res.status === 200) {
        setDeleteCommentId(null);
        setShowModal(false);
        setDataChanged(!dataChanged);
        setBlogChanged(!blogChanged);
      }
    });
  };

  const handleLoadMore = () => {
    if (comments.length === allComments.length) return;
    setComments((prev) => [
      ...prev,
      ...allComments.slice(prev.length, prev.length + 10),
    ]);
  };

  const handleLikeBlog = () => {
    if (newBlogInteraction === "like") {
      setNewBlogInteraction(null);
      setNewBlogLikeCount(newBlogLikeCount - 1);
    } else {
      if (newBlogInteraction === "dislike") {
        setNewBlogDislikeCount(newBlogDislikeCount - 1);
      }
      setNewBlogInteraction("like");
      setNewBlogLikeCount(newBlogLikeCount + 1);
    }
    interact_blog(id, "like");
  };

  const handleDislikeBlog = () => {
    if (newBlogInteraction === "dislike") {
      setNewBlogInteraction(null);
      setNewBlogDislikeCount(newBlogDislikeCount - 1);
    } else {
      if (newBlogInteraction === "like") {
        setNewBlogLikeCount(newBlogLikeCount - 1);
      }
      setNewBlogInteraction("dislike");
      setNewBlogDislikeCount(newBlogDislikeCount + 1);
    }
    interact_blog(id, "dislike");
  };

  const handleCreateComment = () => {
    if (myComment == "") return;
    if (editCommentId) {
      edit_comment(editCommentId, { text: myComment }).then((res) => {
        if (res && res.status === 200) {
          setMyComment("");
          setEditCommentId(null);
          setDataChanged(!dataChanged);
          setBlogChanged(!blogChanged);
        }
        return;
      });
    } else
      create_comment({
        blog_id: id,
        text: myComment,
        parent_comments_id: parentCommentId,
      }).then((res) => {
        if (res && res.status === 200) {
          setMyComment("");
          setParentCommentId(null);
          setParentUsername(null);
          setDataChanged(!dataChanged);
          setBlogChanged(!blogChanged);
        }
      });
  };

  const getTimeAgo = (createdTimeString) => {
    const createdTime = new Date(createdTimeString);
    const now = new Date();
    const relativeTimeString = timeago.format(createdTime, "en_US"); // Format using English locale
    return relativeTimeString;
  };

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        get_blog_detail(id).then((res) => {
          if (res && res.status === 200) {
            setBlog(res.data.data.blog);
            setAllComments(res.data.data.comments);
            setComments(res.data.data.comments.slice(0, 10));
            setNewBlogLikeCount(res.data.data.blog.likes_count);
            setNewBlogDislikeCount(res.data.data.blog.dislikes_count);
            setTotalComments(res.data.data.total_comments);
          }
        });
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchBlogDetail();
  }, [dataChanged]);

  useEffect(() => {
    if (blog) {
      const fetchAvatar = async () => {
        try {
          const avatarRef = ref(FIREBASE_STORAGE, blog.avatar);
          const url = await getDownloadURL(avatarRef);
          setAvatarUrl(url);
          setFlags((prev) => [...prev, true]);
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      };
      const fetchImages = async () => {
        try {
          const imageRefs = ref(FIREBASE_STORAGE, blog.image);
          const res = await listAll(imageRefs);
          if (res.items.length > 0) {
            Promise.all(res.items.map((item) => getDownloadURL(item)))
              .then((urls) => {
                setImageUrls(urls);
                setFlags((prev) => [...prev, true]);
              })
              .catch((error) => console.error(error));
          }
        } catch (error) {
          console.error("Error fetching images:", error);
          setIsLoading(false);
        }
      };
      fetchAvatar();
      fetchImages();
    }
  }, [blog]);

  useEffect(() => {
    if (flags.length === 2 && flags.every((flag) => flag === true)) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [flags]);

  return isLoading ? (
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
    <KeyboardAvoidingView className="w-full h-full">
      <View className="w-full h-full pb-24" onPress={Keyboard.dismiss}>
        <View className="w-full h-12 flex-row items-center justify-center mt-12">
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
          <Text className="font-bold text-[16px]">Post Detail</Text>
        </View>

        {comments && (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="w-full h-fit px-3">
                <Comment
                  id={item.id}
                  account_id={item.account_id}
                  username={item.username}
                  avatar={item.avatar}
                  comment={item.text}
                  subcomment={item.sub_comments}
                  interaction={item.interaction_type}
                  likes={item.likes_count}
                  dislikes={item.dislikes_count}
                  setParentCommentId={setParentCommentId}
                  setParentUsername={setParentUsername}
                  accountId={item.account_id}
                  currentUserId={userId}
                  setMyComment={setMyComment}
                  setEditCommentId={setEditCommentId}
                  setDeleteCommentId={setDeleteCommentId}
                  createdAt={item.created_at}
                  setShowModal={setShowModal}
                />
              </View>
            )}
            initialNumToRender={10}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={
              <View className="w-full h-fit">
                <View className="flex-col items-center w-full pb-4">
                  <TouchableOpacity
                    className="flex-row justify-start items-center w-full h-10 mt-2 px-3"
                    onPress={handleUserPress}
                  >
                    <View className="w-9 h-9 rounded-full border-[0.5px] border-solid border-gray-300">
                      {avatarUrl && (
                        <Image
                          source={{ uri: avatarUrl }}
                          className="w-full h-full rounded-full"
                          placeholder={{ blurhash }}
                          transition={0}
                        />
                      )}
                    </View>
                    <View className="ml-4 w-fit h-fit flex-col">
                      <Text className="text-[14px] font-semibold">
                        {blog.username}
                      </Text>
                      <View className="w-fit h-fit flex-row items-center justify-start">
                        <Text className="text-[12px] text-gray-500 mr-1">
                          {getTimeAgo(blog.created_at)}
                        </Text>
                        <FontAwesomeIcon
                          icon={icons.faEarthAmericas}
                          size={12}
                          style={{ color: "#9ca3af" }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View className="w-full h-fit flex-row justify-start items-start px-3 mt-2">
                    <View className="h-fit w-full -mt-[2px]">
                      <Text className="text-[15px] font-semibold text-red-900 ">
                        {blog.title}
                      </Text>
                    </View>
                  </View>
                  <View className="w-full h-fit px-3 mt-2">
                    <Text className="text-[14px]">{blog.text}</Text>
                  </View>
                  <View className="w-full h-fit mt-6">
                    {imageUrls && imageUrls.length > 0 && (
                      <DynamicImageGrid
                        images={imageUrls}
                        type="detail"
                        handleInspectPhotos={handleInspectPhotos}
                      />
                    )}
                  </View>
                  <View
                    className={`w-full h-10 flex-row items-center ${
                      newBlogLikeCount > 0 || newBlogDislikeCount > 0
                        ? "justify-between"
                        : "justify-end"
                    }`}
                  >
                    <View className="w-fit px-2 h-fit flex-row items-center">
                      {newBlogLikeCount > 0 && (
                        <View className="w-fit h-7 flex-row items-center justify-center px-1">
                          <View className="w-fit p-1 h-fit rounded-full bg-blue-500">
                            <FontAwesomeIcon
                              icon={icons.faThumbsUp}
                              size={12}
                              style={{ color: "#ffffff" }}
                            />
                          </View>
                          <Text className="text-[13px] ml-[3px]">
                            {newBlogLikeCount}
                          </Text>
                        </View>
                      )}
                      {newBlogLikeCount > 0 && (
                        <View className="w-fit h-5 flex-row items-center justify-center px-1">
                          <View className="w-fit p-1 h-fit rounded-full bg-red-500">
                            <FontAwesomeIcon
                              icon={icons.faThumbsDown}
                              size={12}
                              style={{ color: "#ffffff" }}
                            />
                          </View>
                          <Text className="text-[13px] ml-[3px]">
                            {newBlogDislikeCount}
                          </Text>
                        </View>
                      )}
                    </View>
                    <View className="w-fit h-7 flex-row items-center justify-center px-[14px]">
                      <Text className="text-[13px] mr-[3px]">
                        {totalComments}
                      </Text>
                      <Text className="text-[13px]">
                        {totalComments > 1 ? "comments" : "comment"}
                      </Text>
                    </View>
                  </View>
                  <View className="w-full h-12 flex-row justify-between items-center mt-2 px-4 border-t-[1px] border-solid border-gray-300 pt-4">
                    <View className="flex-row justify-start items-center w-fit">
                      <TouchableOpacity
                        className="min-w-fit h-10 flex-row items-center justify-center"
                        onPress={handleLikeBlog}
                      >
                        <FontAwesomeIcon
                          icon={icons.faThumbsUp}
                          size={15}
                          style={{
                            color:
                              newBlogInteraction === "like"
                                ? "#3b82f6"
                                : "#9ca3af",
                          }}
                        />
                        <Text className="text-[14px] font-semibold text-gray-600 ml-[5px]">
                          {newBlogInteraction === "like" ? "Liked" : "Like"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-center items-center w-fit">
                      <TouchableOpacity
                        className="min-w-fit h-10 flex-row items-center justify-center"
                        onPress={handleDislikeBlog}
                      >
                        <FontAwesomeIcon
                          icon={icons.faThumbsDown}
                          size={16}
                          style={{
                            color:
                              newBlogInteraction === "dislike"
                                ? "#3b82f6"
                                : "#9ca3af",
                          }}
                        />
                        <Text className="text-[14px] font-semibold text-gray-600 ml-[5px]">
                          {newBlogInteraction === "dislike"
                            ? "Disliked"
                            : "Dislike"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-row justify-end items-center w-fit">
                      <TouchableOpacity className="min-w-fit h-10 flex-row items-center justify-center">
                        <FontAwesomeIcon
                          icon={icons.faComment}
                          size={15}
                          style={{ color: "#9ca3af" }}
                        />
                        <Text className="text-[14px] font-semibold text-gray-600 ml-[5px]">
                          Comment
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View className="w-full">
                  <View className="w-full h-[1px] bg-gray-300"></View>
                </View>
                <View className="w-full h-fit mt-4 px-3">
                  <Text className="text-[14px] font-semibold mb-4">
                    Comments ({totalComments})
                  </Text>
                </View>
              </View>
            }
          />
        )}
      </View>
      <View
        className={`w-full h-fit ${
          parentUsername ? "min-h-[120px]" : "min-h-[90px]"
        } flex-col items-start justify-start bg-white absolute bottom-0`}
      >
        {parentUsername && (
          <View className="w-full h-7 flex-row items-center justify-between px-3 bg-slate-300 rounded-t-[5px]">
            <View className="w-fit h-fit flex-row items-center justify-start">
              <FontAwesomeIcon icon={icons.faShare} size={12} color="black" />
              <Text className="text-[13px] text-medium ml-1">
                Reply to {parentUsername}
              </Text>
            </View>
            <TouchableOpacity
              className="w-10 h-7 flex-row items-center justify-center"
              onPress={() => {
                setParentUsername(null);
              }}
            >
              <Text className="text-[13px] text-red-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="w-full h-fit flex-row items-start justify-center mt-[15px]">
          <TextInput
            placeholder="Write a comment..."
            className="w-[80%] px-4 rounded-full border-[1px] border-solid border-gray-300 mr-2"
            onChangeText={(e) => setMyComment(e)}
            value={myComment}
            style={styles.textInput}
          />
          <TouchableOpacity
            className="w-10 h-10 flex-row items-center justify-center -mt-[2px]"
            onPress={handleCreateComment}
          >
            {editCommentId ? (
              <FontAwesomeIcon
                icon={icons.faPen}
                size={26}
                style={{ color: "#f59e0b" }}
              />
            ) : (
              <FontAwesomeIcon
                icon={icons.faLocationArrow}
                size={30}
                style={{ color: "#f59e0b", transform: [{ rotate: "44deg" }] }}
              />
            )}
          </TouchableOpacity>
        </View>
        <Modal visible={showModal} animationType="fade" transparent={true}>
          <View className="flex-1 bg-zinc-900/40 opacity-[50] h-full w-full flex-row items-center justify-center">
            <View className="w-56 flex-col h-24 items-center justify-center bg-white rounded-md">
              <View className="w-full h-[45%] flex-row items-center justify-center px-2">
                <Text className="text-[13px] text-gray-600 font-medium">
                  Are you sure you want to delete this comment?
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
                  onPress={handleDeleteComment}
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
    </KeyboardAvoidingView>
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
