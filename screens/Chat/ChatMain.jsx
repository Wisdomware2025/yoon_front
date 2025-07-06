import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://ilson-924833727346.asia-northeast3.run.app";

const PostDetail = ({ route, navigation }) => {
  const boardId = route?.params?.boardId;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (!boardId) {
      console.warn("boardId가 없습니다.");
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      try {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const userId = await AsyncStorage.getItem("userId");
        setCurrentUserId(userId);
        
        const res = await axios.get(`${API_URL}/boards/board/${boardId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPost(res.data);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [boardId]);

  // 현재 사용자가 게시글 작성자인지 확인
  const isMine = currentUserId && post?.author && currentUserId === post.author;

  if (loading) {
    return (
      <View style={[styles.background, styles.center]}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.background, styles.center]}>
        <Text>게시글을 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const isFarmer = post.role === "farmer";
  
  // 이미지 디버깅을 위한 로그
  console.log("post.image:", post.image);
  console.log("post.images:", post.images);
  console.log("post.image type:", typeof post.image);
  console.log("post.image isArray:", Array.isArray(post.image));
  console.log("post.images type:", typeof post.images);
  console.log("post.images isArray:", Array.isArray(post.images));

  // image, images 둘 다 확인해서 표시
  const displayImage = (() => {
    if (Array.isArray(post.image) && post.image.length > 0) return post.image[0];
    if (typeof post.image === "string" && post.image) return post.image;
    if (Array.isArray(post.images) && post.images.length > 0) return post.images[0];
    if (typeof post.images === "string" && post.images) return post.images;
    return null;
  })();
  
  console.log("displayImage:", displayImage);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[styles.background, { flex: 1 }]}>
        <View style={styles.Container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../../assets/images/back.png")}
              style={styles.backButton}
            />
          </TouchableOpacity>

          {isMine && (
            <View style={[styles.Con, { marginLeft: "auto" }]}>
              <TouchableOpacity
                style={[styles.Con, { marginRight: 10 }]}
                onPress={() => alert("수정 기능 준비 중")}
              >
                <Image
                  style={styles.smallImg}
                  source={require("../../assets/images/write.png")}
                />
                <Text style={[styles.smallText, { color: "#797979" }]}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Con}
                onPress={() => alert("삭제 기능 준비 중")}
              >
                <Image
                  style={styles.smallImg}
                  source={require("../../assets/images/trash.png")}
                />
                <Text style={[styles.smallText, { color: "#797979" }]}>삭제</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.title}>{post.title}</Text>

        <View style={styles.profileCon}>
          <View style={styles.profileImg} />
          <Text style={styles.userName}>{post.authorName || "작성자 정보 없음"}</Text>
        </View>

        <View style={[styles.stateCon, { marginBottom: 20 }]}>
          <View style={styles.Con}>
            <Image
              style={styles.smallImg}
              source={require("../../assets/images/clock.png")}
            />
            <Text style={styles.smallText}>
              {post.createdAt
                ? Math.floor((new Date() - new Date(post.createdAt)) / (1000 * 60))
                : "?"}
              분 전
            </Text>
            <Text style={styles.smallText}> - 조회 </Text>
            <Text style={styles.smallNumber}>{post.viewCnt ?? 0}</Text>
          </View>
        </View>

        {isFarmer && (
          <View style={styles.infCon}>
            <View style={styles.Con}>
              <Image
                style={styles.img}
                source={require("../../assets/images/money.png")}
              />
              <Text style={styles.text}>시급 </Text>
              <Text style={styles.number}>
                {post.charge ? post.charge.toLocaleString() : "정보 없음"}
              </Text>
              <Text style={styles.text}>원</Text>
            </View>
            <View style={styles.Con}>
              <Image
                style={styles.img}
                source={require("../../assets/images/calender.png")}
              />
              <Text style={styles.number}>
                {post.date
                  ? new Date(post.date).toLocaleDateString("ko-KR")
                  : "정보 없음"}
              </Text>
            </View>
            <View style={styles.Con}>
              <Image
                style={styles.img}
                source={require("../../assets/images/clock.png")}
              />
              <Text style={styles.number}>
                {post.date
                  ? new Date(post.date).toLocaleTimeString("ko-KR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "정보 없음"}
              </Text>
            </View>
            <View style={styles.Con}>
              <Image
                style={styles.img}
                source={require("../../assets/images/location.png")}
              />
              <Text style={styles.text}>{post.location || "정보 없음"}</Text>
            </View>
          </View>
        )}

        <View style={[styles.line, { marginTop: 10, marginBottom: 20 }]} />

        <View style={styles.contentCon}>
          <Text style={styles.conText}>{post.content}</Text>
          {displayImage && <Image style={styles.conImg} source={{ uri: displayImage }} />}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fixedButton}
        onPress={() =>
          navigation.navigate("ChatPage", {
            receiverId: post.author,
            name: post.authorName || "작성자",
          })
        }
      >
        <View style={styles.Con}>
          <Image
            style={[styles.img, { marginRight: 0 }]}
            source={require("../../assets/images/whitechat.png")}
          />
          <Text style={[styles.text, { color: "white", fontWeight: "500" }]}>
            채팅하기
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "transparent",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  Container: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    marginBottom: 10,
  },
  backButton: {
    width: 25,
    height: 25,
    marginTop: 5,
    marginRight: "auto",
  },
  profileCon: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImg: {
    width: 45,
    height: 45,
    backgroundColor: "silver",
    borderRadius: 60,
    marginRight: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 5,
  },
  stateCon: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  Con: {
    flexDirection: "row",
    alignItems: "center",
  },
  smallImg: {
    width: 17,
    height: 17,
    opacity: 0.9,
  },
  smallText: {
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 5,
    opacity: 0.9,
  },
  smallNumber: {
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 5,
    opacity: 0.9,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "black",
    opacity: 0.2,
  },
  infCon: {
    height: 160,
    justifyContent: "center",
    gap: 20,
  },
  img: {
    width: 23,
    height: 23,
    marginRight: 10,
    opacity: 0.9,
  },
  text: {
    fontSize: 15,
    marginBottom: 5,
    marginLeft: 5,
    opacity: 0.9,
  },
  number: {
    fontSize: 15,
    marginBottom: 2,
    marginLeft: 5,
    opacity: 0.9,
  },
  contentCon: {
    width: "100%",
  },
  conText: {
    fontSize: 17,
    opacity: 0.9,
    lineHeight: 30,
    marginBottom: 20,
  },
  conImg: {
    width: "100%",
    height: 500,
    resizeMode: "cover",
    marginBottom: 10,
  },
  fixedButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 110,
    height: 45,
    backgroundColor: "#7DCA79",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    zIndex: 10,
  },
});

export default PostDetail;