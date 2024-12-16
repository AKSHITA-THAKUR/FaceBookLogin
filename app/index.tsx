import { Text, View } from "react-native";
import { useEffect } from "react";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import {
  AccessToken,
  LoginButton,
  Settings,
  Profile,
  GraphRequest
} from "react-native-fbsdk-next";
export default function Index() {
  useEffect(()=>{
    const requestTracking = async() =>{
     const {status} = await requestTrackingPermissionsAsync();

     Settings.initializeSDK();

     if(status === "granted") {
      await Settings.setAdvertiserTrackingEnabled(true);
     }
    }
    requestTracking();
  },[])

  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>FaceBook Login App , Click Below </Text>
      <LoginButton onLogoutFinished={()=> console.log("Logged Out")}
        onLoginFinished={(error , data)=> {console.log(error || data);
          AccessToken.getCurrentAccessToken().then((data)=> console.log(data))
        }}/>
    </View>
  );
}
