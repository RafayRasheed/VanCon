import React, { useState } from 'react';
import { createNativeStackNavigator, } from "@react-navigation/native-stack";
import { HomeScreen } from "./home_screen";
import { Categories } from './home_data';
import { CategoryFull } from './category_full_screen';
import { myColors } from '../../ultils/myColors';
import { StatusBar } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { RestaurantMoreDetails } from './rest_more_info_screen';
import { RestaurantAll } from './res_all_screen';
import { ItemDetails } from './item_detail_screen';
import { bottomTab } from '../common';
import { Search } from './search_screen';
import { ItemSearch } from './item_search_screen';
import { DriverDetail } from './driver_detail_screen';



const HomeTAB = createNativeStackNavigator();
const hideStatusScreens = ['RestaurantDetail', 'RestaurantMoreDetails', 'ItemDetails']
const hideBottom = ['RestaurantMoreDetails',
    'ItemDetails', 'ItemSearch', 'Search']

export const HomeNavigator = ({ navigation, route }) => {
    const [hideStatus, setHideState] = useState(false)
    React.useLayoutEffect(() => {
        // if (hideStatusScreens.includes(getFocusedRouteNameFromRoute(route))) {
        //     setHideState(true)
        // } else {
        //     setHideState(false)
        // }
        if (hideBottom.includes(getFocusedRouteNameFromRoute(route))) {
            navigation.setOptions({ tabBarStyle: { display: 'none' } })
        }
        else {
            navigation.setOptions({ tabBarStyle: bottomTab })

        }
    }, [navigation, route]);
    return (
        <>
            {/* <StatusBar backgroundColor={hideStatus ? 'transparent' : myColors.background} translucent={hideStatus ? true : false} /> */}

            <HomeTAB.Navigator
                screenOptions={{
                    animation: 'fade',
                    headerShown: false
                }}
                initialRouteName="HomeScreen"
            >
                <HomeTAB.Screen component={HomeScreen} name="HomeScreen" />
                <HomeTAB.Screen component={CategoryFull} name="CategoryFull" />
                <HomeTAB.Screen component={DriverDetail} name="DriverDetail" />
                <HomeTAB.Screen component={RestaurantAll} name="RestaurantAll" />

                {/* <HomeTAB.Screen component={RestaurantMoreDetails} name="RestaurantMoreDetails" />
                <HomeTAB.Screen component={ItemDetails} name="ItemDetails" />
                <HomeTAB.Screen component={Search} name="Search" />
                <HomeTAB.Screen component={ItemSearch} name="ItemSearch" /> */}

            </HomeTAB.Navigator>
        </>
    )
} 