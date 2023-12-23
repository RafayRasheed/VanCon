/**
 * @format
 */

import { Alert, AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { navigateNoti, navigationRef, notificationListeners } from './components/RootNavigation';
import NavigationService from './components/NavigationService';

// Initialize Firebase
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!');
  });


AppRegistry.registerComponent(appName, () => App);
