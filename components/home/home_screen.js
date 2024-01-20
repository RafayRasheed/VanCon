import React, { useEffect, useState } from 'react';
import { SafeAreaView, Alert, ScrollView, StyleSheet, TouchableOpacity, Image, View, Text, FlatList, Modal, UIManager, LayoutAnimation } from 'react-native'
import { MyError, NotiAlertNew, Spacer, StatusbarH, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { Categories, Restaurants, } from './home_data'
import { ResturantH } from './home.component/resturant_hori';
import { Banners } from './home.component/banner';
import { RestaurantInfo } from './home.component/restaurant_info';
import { RestRating } from './rest_rating_screen';
import { getCartLocal, getLogin, setLogin } from '../functions/storageMMKV';
import { setCart } from '../../redux/cart_reducer';
import { useDispatch, useSelector } from 'react-redux';
import firestore, { Filter } from '@react-native-firebase/firestore';
import { setFavoriteItem, setFavoriteRest } from '../../redux/favorite_reducer';
import { RestaurantInfoSkeleton } from '../common/skeletons';
import { HomeSkeleton } from './home.component/home_skeleton';
import { ImageUri } from '../common/image_uri';
import storage from '@react-native-firebase/storage';
import { setAllItems, setAllRest, setNearby, setRecommend } from '../../redux/data_reducer';
import { setHistoryOrderse, setPendingOrderse, setProgressOrderse } from '../../redux/order_reducer';
import database from '@react-native-firebase/database';
import { SetErrorAlertToFunction, deccodeInfo, getCurrentLocations } from '../functions/functions';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { FirebaseUser, getAreasLocations, getDeviceToken, sendPushNotification, updateDeviceTokenToFireBase } from '../functions/firebase';
import { NotiAlert } from '../common/noti_Alert';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { setProfile } from '../../redux/profile_reducer';

if (!ios && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}
export const HomeScreen = ({ navigation }) => {
    const name = "Someone";
    const { profile } = useSelector(state => state.profile)

    const [isLoading, setIsLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [nearbyRestaurant, setNearbyRestaurant] = useState([])
    const [RecommendRestaurant, setRecommendRestaurant] = useState([])
    const [startPro, setStartPro] = useState({})




    const dispatch = useDispatch()



    function getAllRestuarant() {
        firestore().collection('restaurants')
            .where('update', '==', true)
            .where('city', '==', profile.city)
            .get().then((result) => {
                if (!result.empty) {
                    let rest = []
                    let items = []

                    result.forEach((res, i) => {
                        const restaurant = res.data()
                        rest.push(restaurant)
                        restaurant.foodCategory.map((subCat, ind) => {
                            subCat.items?.map((item, i) => {
                                items.push(item)
                            })

                        })
                        // catArray.push(cat.data())

                    })

                    dispatch(setAllRest(rest))

                }
                else {

                    console.log('empty')


                    // setCategories(catArray)
                }
            }).catch((er) => {
                // Alert.alert(er.toString())

                console.log('Error on Get all Restaurant', er)
            })
    }




    useEffect(() => {
        const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
            console.log('Message handled in the foreground:');
            SetErrorAlertToFunction({
                Title: remoteMessage.notification.title,
                Body: remoteMessage.notification.body,
                Status: remoteMessage.data.status
            })
        });

        return () => {
            unsubscribeOnMessage();
        };
    }, []);

    async function onDisplayNotification(remoteMessage) {
        // Request permissions (required for iOS)
        await notifee.requestPermission()

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: remoteMessage.messageId.toString(),
            name: 'Orders'
        });


        // Display a notification
        await notifee.displayNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            android: {
                channelId,
                // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'default',
                },
            },
        });
    }

    function getProfileFromFirebase() {
        FirebaseUser.doc(profile.uid).get().then((documentSnapshot) => {
            const prf = documentSnapshot.data()
            dispatch(setProfile(prf))


        }).catch(err => {
            console.log('Internal error while  getProfileFrom')
        });
    }
    useEffect(() => {
        getProfileFromFirebase()
        // updateDeviceTokenToFireBase(profile.uid)
        // sendPushNotification('hi', 'bye',2 )

        // getCurrentLocations()
        // const interval = setInterval(() => {
        //     getCurrentLocations()

        // }, 120000);
        // return () => clearInterval(interval);

    }, [])

    // Realtime
    useEffect(() => {
        if (profile.city) {
            getAreasLocations(profile.city)
        }
        // database()
        //     .ref(`/orders/${profile.uid}`)
        //     .on('value', snapshot => {
        //         let pending = []
        //         let progress = []
        //         let history = []
        //         snapshot.forEach(documentSnapshot1 => {
        //             const order = documentSnapshot1.val()
        //             if (order.status == -1 || order.status == 100 || order.status == -2) {
        //                 history.push(order)
        //             }
        //             else if (order.status == 0) {
        //                 pending.push(order)
        //             }
        //             else {
        //                 progress.push(order)
        //             }

        //         });
        //         pending.sort((a, b) => b.dateInt - a.dateInt);
        //         progress.sort((a, b) => b.dateInt - a.dateInt);
        //         history.sort((a, b) => b.dateInt - a.dateInt);
        //         dispatch(setPendingOrderse(pending))
        //         dispatch(setHistoryOrderse(history))
        //         dispatch(setProgressOrderse(progress))

        //         console.log('User data: ', pending.length, progress.length, history.length);
        //     });

    }, [profile.city]);


    return (

        <SafeAreaView style={styles.container}>
            <StatusbarH />
            {
                isLoading ? <HomeSkeleton />
                    :
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >

                        <Spacer paddingT={myHeight(1.4)} />
                        <Text style={[styles.textCommon, {
                            fontSize: myFontSize.medium2,
                            fontFamily: myFonts.heading,
                            alignSelf: 'center',

                        }]}>Van<Text style={{ color: myColors.primaryT }}>Con</Text></Text>



                        <Spacer paddingT={myHeight(3)} />

                        {/* Banner */}
                        {/* <Banners />



                        <Spacer paddingT={myHeight(3)} />

                        {
                            profile.ready ? <View style={{ height: myHeight(20), width: myWidth(80), backgroundColor: myColors.primary }}>

                            </View> :
                                <View style={{ width: '100%', alignItems: 'center' }}>

                                    <Text style={[styles.textCommon,
                                    {
                                        color: myColors.text, fontSize: myFontSize.body,
                                        fontFamily: myFonts.bodyBold
                                    }]
                                    }>Click on Apply & fill the form to get rides</Text>
                                    <Spacer paddingT={myHeight(1.5)} />

                                    <TouchableOpacity onPress={null}
                                        activeOpacity={0.8}
                                        style={{
                                            width: myWidth(50), alignSelf: 'center', paddingVertical: myHeight(1.2),
                                            borderRadius: myHeight(0.8), alignItems: 'center', justifyContent: 'center',
                                            flexDirection: 'row', backgroundColor: myColors.primary,
                                            // borderWidth: myHeight(0.15), borderColor: myColors.primaryT
                                        }}>
                                        <Text style={[styles.textCommon, {
                                            fontFamily: myFonts.heading,
                                            fontSize: myFontSize.body,
                                            color: myColors.background
                                        }]}>Apply</Text>
                                    </TouchableOpacity>
                                </View>

                        } */}
                        {/* New Arrival  Complete*/}
                        {/* <View>
                            <View style={{ paddingHorizontal: myWidth(4), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={[styles.textCommon, {
                                    fontSize: myFontSize.xxBody,
                                    fontFamily: myFonts.bodyBold,
                                }]}>New Arrivals</Text>

                                <TouchableOpacity style={{
                                    flexDirection: 'row', alignItems: 'center', paddingVertical: myHeight(0.4),
                                    paddingStart: myWidth(2)
                                }} activeOpacity={0.6} onPress={() => navigation.navigate('RestaurantAll', { name: 'New Arrivals' })}>

                                    <Text
                                        style={[styles.textCommon, {
                                            fontSize: myFontSize.body2,
                                            fontFamily: myFonts.bodyBold,
                                            color: myColors.primaryT
                                        }]}>See All</Text>
                                    <Image style={{
                                        height: myHeight(1.5), width: myHeight(1.5), marginStart: myWidth(1),
                                        resizeMode: 'contain', tintColor: myColors.primaryT
                                    }} source={require('../assets/home_main/home/go.png')} />
                                </TouchableOpacity>
                            </View>

                            <Spacer paddingT={myHeight(1.3)} />
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: myWidth(4) }}>
                                <View style={{
                                    flexDirection: 'row',
                                }}>
                                    {nearbyRestaurant.slice(0, 3).map((item, i) =>
                                        <TouchableOpacity key={i} activeOpacity={0.95}
                                            onPress={() => navigation.navigate('RestaurantDetail', { item })} >
                                            <RestaurantInfo restaurant={item} />
                                        </TouchableOpacity>
                                    )}
                                </View>

                            </ScrollView>
                        </View> */}


                        {/* <Spacer paddingT={myHeight(3)} /> */}
                    </ScrollView>
            }

        </SafeAreaView>
    )
}






const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: myColors.background
    },


    //Text
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

})