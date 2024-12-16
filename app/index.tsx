import { Text, View, Pressable , Image , StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import {
  AccessToken,
  LoginButton,
  Settings,
  Profile,
  GraphRequest,
  GraphRequestManager,
} from "react-native-fbsdk-next";

interface PictureData {
height:number , 
is_silhouette:boolean,
url:string,
width:number
}

export default function Index() {
  const [userName, setUserName] = useState<any>("");
  const [imageUrl , setImageUrl] = useState<PictureData>({height:0 , 
    is_silhouette:false,
    url:"",
    width:0});

  useEffect(() => {
    const requestTracking = async () => {
      const { status } = await requestTrackingPermissionsAsync();

      Settings.initializeSDK();

      if (status === "granted") {
        await Settings.setAdvertiserTrackingEnabled(true);
      }
    };
    requestTracking();
  }, []);

  const getProfileInfo = async () => {
    //Function to access the profile info
    const infoRequest = new GraphRequest("/me", undefined, (error, result) => {
      if (error) {
        console.error("Error fetching profile info:", error);
      } else if (result) {
        console.log("Profile info:", result);
        setUserName(result.name);
        // Added request for profile picture
        const pictureRequest = new GraphRequest(
          "/me/picture?redirect=false", 
          undefined,
          (error, pictureResult) => {
            if (error) {
              console.error("Error fetching profile picture:", error);
            } else if (pictureResult && pictureResult.data) {
              console.log("Profile picture info:", pictureResult.data);
              setImageUrl(pictureResult.data as PictureData)
            }
          }
        );
        new GraphRequestManager().addRequest(pictureRequest).start();
      }
    });
    new GraphRequestManager().addRequest(infoRequest).start(); //
  };

  return (
    <View
    style={styles.container}
    >
      <Text style={styles.title}>FaceBook Login App , Click Below </Text>
      <LoginButton
        onLogoutFinished={() => {
          console.log("Logged Out");
          setUserName("");
          setImageUrl({height:0 , 
            is_silhouette:false,
            url:"",
            width:0})
        }}
        onLoginFinished={(error, data) => {
          console.log(error || data);
          AccessToken.getCurrentAccessToken().then((data) => console.log(data));
        }}
      />

      <Pressable
        style={styles.button}
        onPress={getProfileInfo}
      >
        <Text style={styles.buttonText}>Get Profile Info</Text>
      </Pressable>

      {userName && (
        <Text style={styles.userName}>Welcome to your Profile {userName}</Text>
      )}
      
      {imageUrl && (
        <View style={{marginTop: 20, width: 200, height: 200 }}>
          <Image source={{ uri: imageUrl.url }} style={styles.profileImage} />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  
  },
  button: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 28,
    marginTop: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 45,
    marginTop: 20,
  },
});