import React, {useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  LogBox,
} from 'react-native';
// import { MMKV } from 'react-native-mmkv';
import {myColors} from './ultils/myColors';
import {myHeight, NotiAlertNew, printWithPlat} from './components/common';
import {AppNavigator} from './components/app_navigator';
import {enableScreens} from 'react-native-screens';
import {Provider} from 'react-redux';
import storeRedux from './redux/store_redux';
import SplashScreen from 'react-native-splash-screen';
import {getCartLocal} from './components/functions/storageMMKV';
import messaging from '@react-native-firebase/messaging';

import {dataFullData, verificationCode} from './components/functions/functions';
import {
  notificationListeners,
  requestUserPermission,
} from './components/RootNavigation';

export default function App() {
  useEffect(() => {
    const api =
      'https://fcm.googleapis.com/v1/projects/foodapp-edd7e/messages:send';
    const myToken =
      'dph9AvipQKa-rwb7sJG_K7:APA91bEo3djpvpDx9GFN_UEjJ2lMQBfzSe1fEsA5GQccV49_FOTYf_bdyWgl9-dFc3FXCtM3PSbAnmx4a9zLcTUwiHmLxZGFV5xqJVywztCOWyc0KlKN3n_0t60JejK8y1rRBGqUFKV9';
    // fetch(api, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json', // Specify the content type as JSON
    //     // Authorization: myToken,
    //   },
    //   message: {
    //     token: myToken,
    //     notification: {
    //       "body": "This is an FCM notification message!",
    //       "title": "FCM Message"
    //     }
    //   }
    //   // body: JSON.stringify(postData) // Convert the data to JSON format
    // })
    //   .then(response => {
    //     console.log(response.json())
    //     return response.json(); // Parse the response as JSON
    //   })
    //   .then(data => {
    //     // Handle the response data
    //     console.log(data);
    //     console.log('data');
    //   })
    //   .catch(error => {
    //     // Handle errors
    //     console.error('Fetch error:', error);
    //   })

    // if (Platform.OS == 'android') {
    //   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS).then((res) => {
    //     console.log("res+++++", res)
    //     if (!!res && res != 'granted') {
    //       requestUserPermission()

    //     }
    //     if (!!res && res == 'granted') {
    //       requestUserPermission()

    //     }
    //   }).catch(error => {
    //     alert('something wrong')
    //   })
    // } else {

    // }
  }, []);

  useEffect(() => {
    printWithPlat('Started Successfully');
    SplashScreen.hide();
    LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    LogBox.ignoreAllLogs();
    // const dispatch = useDispatch()
    // dispatch(setCart(getCartLocal()))
    // console.log(typeof getCartLocal())
    // printWithPlat("Is MMKV store successful? " + storage.contains('mberr'))
  }, []);
  const isAndroid = Platform.OS == 'android';
  // const OsVer = Platform.constants['Release']; Android Version like 9,10, 11
  const OsVer = Platform.Version; //API level like 27, 28, 22

  return (
    <>
      {OsVer >= 23 && (
        <StatusBar
          barStyle="dark-content"
          backgroundColor={'transparent'}
          translucent={true}
        />
      )}
      <Provider store={storeRedux}>
        <AppNavigator />
        <NotiAlertNew />
      </Provider>
    </>
  );
}
