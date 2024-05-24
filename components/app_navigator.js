import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StartupNavigator} from './startup/startup_navigator';
import {HomeBottomNavigator} from './home/home_bottom_navigator';
import {AccountNavigator} from './account/account_navigation';
import {ImageViewer} from './common/image_viewer';
import {AccountNavigator2} from './account1/acc_stack';
import {storage} from './common';
import {createStackNavigator} from '@react-navigation/stack';
import {
  containFirstTime,
  containLogin,
  getLogin,
} from './functions/storageMMKV';
import {ItemDetails} from './home/item_detail_screen';
import {Search} from './home/search_screen';
import {ItemSearch} from './home/item_search_screen';
import {RestaurantMoreDetails} from './home/rest_more_info_screen';
import {ProfileInfo} from './profile/profile_info';
import {Favourite} from './profile/favourite_screen';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {setProfile} from '../redux/profile_reducer';
import {Checkout} from './cart/checkout';
import {RideDetails} from './orders/ride_detail_screen';
import {navigationRef} from './RootNavigation';
import NavigationService from './NavigationService';
import {Chat} from './home/chat_screen';
import {RequestRide} from './home/request_ride';
import {DriverDetail} from './home/driver_detail_screen';
import {RideDetails2} from './orders/ride_detail_screen2';
import {Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';

const AppTAB = createStackNavigator();

export const AppNavigator = () => {
  // const dispatch = useDispatch()
  // useEffect(() => {
  //     if (containLogin()) {
  //         const profile = getLogin()
  //         dispatch(setProfile(profile))
  //     }
  // }, [])

  return (
    <NavigationContainer ref={re => NavigationService.setTopLevelNavigator(re)}>
      <AppTAB.Navigator
        // initialRouteName="StartupScreen"
        // initialRouteName="StartupScreen"
        initialRouteName={
          containFirstTime()
            ? containLogin()
              ? 'HomeBottomNavigator'
              : 'AccountNavigator'
            : 'StartupScreen'
        }
        screenOptions={{
          animation: 'fade',
          headerShown: false,
        }}>
        <AppTAB.Screen component={StartupNavigator} name="StartupNavigator" />
        <AppTAB.Screen component={AccountNavigator2} name="AccountNavigator" />
        <AppTAB.Screen
          component={HomeBottomNavigator}
          name="HomeBottomNavigator"
        />

        {/* Home */}
        <AppTAB.Screen component={Search} name="Search" />
        <AppTAB.Screen component={Chat} name="Chat" />
        <AppTAB.Screen component={RequestRide} name="RequestRide" />
        <AppTAB.Screen component={DriverDetail} name="DriverDetail" />

        {/* PROFILE */}
        <AppTAB.Screen component={ProfileInfo} name="ProfileInfo" />
        <AppTAB.Screen component={Favourite} name="Favourite" />
        <AppTAB.Screen component={Checkout} name="Checkout" />
        <AppTAB.Screen component={RideDetails} name="OrderDetails" />
        <AppTAB.Screen component={RideDetails2} name="OrderDetails2" />
      </AppTAB.Navigator>
    </NavigationContainer>
  );
};
