import { Text, View, Pressable } from "react-native";
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
export default function Index() {
  const [userName, setUserName] = useState<any>("");

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

  const getProfileInfo = async () => {  //Function to access the profile info
    const infoRequest = new GraphRequest("/me", undefined, (error, result) => {  
      if (error) {
        console.error("Error fetching profile info:", error);
      } else if (result) {
        console.log("Profile info:", result);
        setUserName(result.name);
      }
    });
    new GraphRequestManager().addRequest(infoRequest).start(); //
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>FaceBook Login App , Click Below </Text>
      <LoginButton
        onLogoutFinished={() => {console.log("Logged Out")
          setUserName("")
         }}
        onLoginFinished={(error, data) => {
          console.log(error || data);
          AccessToken.getCurrentAccessToken().then((data) => console.log(data));
        }}
      />

      <Pressable
        style={{ padding: 10, marginTop: 10, backgroundColor: "skyblue" }}
        onPress={getProfileInfo}
      >
        <Text>Get Profile Info</Text>
      </Pressable>

      {userName && (
        <Text style={{ fontSize: 30 }}>

          Welcome to your Profile {userName}
        </Text>
      )}
    </View>
  );
}
