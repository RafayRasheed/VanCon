import React, { useEffect, useState } from 'react';
import { SafeAreaView, Alert, ScrollView, StyleSheet, TouchableOpacity, Image, View, Text, FlatList, Modal, UIManager, LayoutAnimation } from 'react-native'
import { MyError, NotiAlertNew, Spacer, StatusbarH, ios, myHeight, myWidth } from '../common';
import { getAvatarColor, myColors } from '../../ultils/myColors';
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
import { setFavoriteDrivers, } from '../../redux/favorite_reducer';
import { RestaurantInfoSkeleton } from '../common/skeletons';
import { HomeSkeleton } from './home.component/home_skeleton';
import { ImageUri } from '../common/image_uri';
import storage from '@react-native-firebase/storage';
import { setAllDriver, setOnlineDriver, } from '../../redux/data_reducer';
import { setAllRequest, setAllUnread, setHistoryOrderse, setOnlineReq, setPendingOrderse, setProgressOrderse } from '../../redux/order_reducer';
import database from '@react-native-firebase/database';
import { SetErrorAlertToFunction, dataFullData, deccodeInfo, getAllRestuarant, getAreasLocations, getCurrentLocations, getDistanceFromRes, getProfileFromFirebase, statusDate } from '../functions/functions';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { FirebaseUser, getDeviceToken, sendPushNotification, updateDeviceTokenToFireBase } from '../functions/firebase';
import { NotiAlert } from '../common/noti_Alert';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { setProfile } from '../../redux/profile_reducer';
import { setChats, setTotalUnread } from '../../redux/chat_reducer';
import { DriverInfoFull } from './home.component/driver_info_full';
import { Status } from './home.component/status';
import { FlashList } from '@shopify/flash-list';
import storeRedux from '../../redux/store_redux';

if (!ios && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}
export const HomeScreen = ({ navigation }) => {
    const name = "Someone";
    const { profile } = useSelector(state => state.profile)
    const { AllDrivers, onlineDrivers } = useSelector(state => state.data)
    const { current, history } = useSelector(state => state.location)

    const [isLoading, setIsLoading] = useState(true)
    const [categories, setCategories] = useState([])
    const [nearbyRestaurant, setNearbyRestaurant] = useState([])
    const [RecommendRestaurant, setRecommendRestaurant] = useState([])
    const [startPro, setStartPro] = useState({})
    const { pending, progress, onlineReq } = useSelector(state => state.orders)




    const dispatch = useDispatch()
    function updateOnline() {

        return
        const plus = ''
        const reff = `/online/${profile.city}/drivers/${profile.uid}` + plus


        const { actualDate } = dataFullData()
        const data = {
            did: profile.uid + plus,
            uid: profile.uid + plus,
            name: profile.name,
            contact: '100000000000',
            lastUpdate: actualDate.toString(),
            vehicleName: 'jeee',
            token: profile.deviceToken,

            location: current ? current : { latitude: 0, longitude: 0 }
        }
        database()
            .ref(reff).update(data).then(() => {
                console.log('updateOnline Successfullly')

            }).catch((er) => {
                // Alert.alert(er.toString())

                console.log('Error updateOnline', er)
            })



    }
    useEffect(() => {
        if (current) {
            updateOnline()

        }
    }, [current]);

    // Realtime
    useEffect(() => {

        // const reff = `/online/${profile.city}/requests/${profile.uid}`
        // const onValueChange = database()
        //     .ref(reff)
        //     .orderByChild('dateInt')
        //     .on('value', snapshot => {
        //         if (snapshot.exists()) {

        //             let Pending = []
        //             let InProgress = []
        //             let History = []
        //             let all = []
        //             const unread = []

        //             snapshot.forEach((documentSnapshot1, i) => {
        //                 const val = documentSnapshot1.val()
        //                 all.push(val)
        //                 // if ( val.status == 2) {
        //                 //     Pending.push(val)
        //                 //     if (val.unread) {
        //                 //         unread.push({ id: val.id, code: 2 })
        //                 //     }
        //                 // }

        //                 if (val.status == 2 || val.status == 3) {

        //                     InProgress.push(val)
        //                     if (val.unread) {
        //                         unread.push({ id: val.id, code: 1 })
        //                     }
        //                 }
        //                 else {
        //                     History.push(val)
        //                     if (val.unread) {
        //                         unread.push({ id: val.id, code: 3 })
        //                     }
        //                 }


        //             });

        //             console.log('online',)
        //             Pending.reverse()
        //             InProgress.reverse()
        //             History.reverse()
        //             // dispatch(setPendingOrderse(Pending))
        //             // dispatch(setProgressOrderse(InProgress))
        //             // dispatch(setHistoryOrderse(History))
        //             // dispatch(setAllRequest(all))
        //             // dispatch(setAllUnread(unread))

        //         } else {
        //             console.log('online not fount')

        //             // dispatch(setPendingOrderse([]))
        //             // dispatch(setProgressOrderse([]))
        //             // dispatch(setHistoryOrderse([]))
        //             // dispatch(setAllUnread([]))
        //             // dispatch(setAllRequest([]))

        //         }
        //     });

        // // Stop listening for updates when no longer required
        // return () => database().ref(reff).off('value', onValueChange);
    }, []);
    // Realtime
    useEffect(() => {
        const onValueChange = database()
            .ref(`/chats`)
            .on('value', snapshot => {
                if (snapshot.exists()) {
                    let Chats = []
                    let totalUnread = 0
                    snapshot.forEach((documentSnapshot1, i) => {
                        const key = documentSnapshot1.key.toString()
                        if (key.includes(profile.uid)) {
                            const val = documentSnapshot1.val()
                            if (val.captain && val.user) {

                                let messages = { ...val.messages }
                                let latest = null
                                let unreadmasseges = 0
                                let allMessages = []
                                let allUnreadMessagesToRead = {}
                                // messages = Object.keys(messages).sort(function (a, b) { return messages[a].dateInt - messages[b].dateInt })
                                Object.keys(messages).map((it, i) => {
                                    const mm = messages[it]
                                    allMessages.push(mm)
                                    if (latest == null || mm.dateInt > latest.dateInt) {
                                        latest = mm
                                    }
                                    if (mm.senderId != profile.uid && mm.read == false) {
                                        unreadmasseges += 1
                                        allUnreadMessagesToRead[it] = { ...mm, read: true }

                                    }
                                })
                                if (unreadmasseges) {

                                    totalUnread += 1
                                }
                                const chat = {
                                    ...latest, unreadmasseges, chatId: key,
                                    user2: val.captain,
                                    statusTime: statusDate(latest.date, latest.time),
                                    allMessages, allUnreadMessagesToRead,
                                    colorC: getAvatarColor(val.captain.name)
                                }
                                Chats.push(chat)
                            }
                        }

                    });
                    dispatch(setChats(Chats.sort(function (a, b) { return b.dateInt - a.dateInt })))
                    dispatch(setTotalUnread(totalUnread))
                } else {
                    dispatch(setChats([]))
                    dispatch(setTotalUnread(0))
                }
            });

        // Stop listening for updates when no longer required
        return () => database().ref(`/chats`).off('value', onValueChange);
    }, []);

    // Realtime
    useEffect(() => {
        const onValueChange = database()
            .ref(`/requests/${profile.uid}`).orderByChild('dateInt')
            .on('value', snapshot => {
                if (snapshot.exists()) {
                    let Pending = []
                    let InProgress = []
                    let History = []
                    let all = []
                    const unread = []


                    let onlineReq = null

                    snapshot.forEach((documentSnapshot1, i) => {
                        const val = documentSnapshot1.val()
                        all.push(val)
                        if (val.isOnline) {
                            if (val.status == 2 || val.status == 3) {
                                let valUpadate = val
                                let accepted = 0
                                val.sendDrivers.map(diii => {
                                    const di = val[diii.did]
                                    if (di.status == 2) {
                                        accepted += 1
                                    }

                                })
                                valUpadate.accepted = accepted
                                onlineReq = valUpadate
                                // InProgress.push(val)
                                if (val.unread) {
                                    unread.push({ id: val.id, code: 1 })
                                }
                            }
                            else {
                                History.push(val)
                                if (val.unread) {
                                    unread.push({ id: val.id, code: 3 })
                                }
                            }
                        }
                        else {

                            if (val.status == 1 || val.status == 2) {
                                Pending.push(val)
                                if (val.unread) {
                                    unread.push({ id: val.id, code: 2 })
                                }
                            }
                            else if (val.status == 3) {

                                InProgress.push(val)
                                if (val.unread) {
                                    unread.push({ id: val.id, code: 1 })
                                }
                            }
                            else {
                                History.push(val)
                                if (val.unread) {
                                    unread.push({ id: val.id, code: 3 })
                                }
                            }
                        }



                    });
                    if (onlineReq) {
                        InProgress = [...InProgress, onlineReq]
                        dispatch(setOnlineReq(onlineReq))

                    }
                    else {
                        dispatch(setOnlineReq(null))

                    }
                    Pending.reverse()
                    InProgress.reverse()
                    History.reverse()
                    dispatch(setPendingOrderse(Pending))
                    dispatch(setProgressOrderse(InProgress))
                    dispatch(setHistoryOrderse(History))
                    dispatch(setAllRequest(all))
                    dispatch(setAllUnread(unread))

                } else {
                    dispatch(setPendingOrderse([]))
                    dispatch(setProgressOrderse([]))
                    dispatch(setHistoryOrderse([]))
                    dispatch(setAllUnread([]))
                    dispatch(setAllRequest([]))
                    dispatch(setOnlineReq(null))


                }
            });

        // Stop listening for updates when no longer required
        return () => database().ref(`/requests/${profile.uid}`).off('value', onValueChange);
    }, []);
    // Realtime
    useEffect(() => {

        const reff = `/online/${profile.city}/drivers`
        const onValueChange = database()
            .ref(reff)
            .on('value', snapshot => {
                const { current } = storeRedux.getState().location

                if (snapshot.exists()) {
                    const driv = []
                    let { actualDate } = dataFullData()

                    snapshot.forEach((documentSnapshot1, i) => {
                        const key = documentSnapshot1.key.toString()
                        const val = documentSnapshot1.val()


                        const update = new Date(val.lastUpdate)
                        const isReady = ((actualDate - update) / 1000) <= 50

                        if (isReady) {

                            const from = val.location
                            // const distance = 10
                            const { distance, string } = getDistanceFromRes(from, current ? current : { "latitude": 0, "longitude": 0 }, true)
                            val.distanceInt = distance
                            val.distance = string

                            driv.push(val)
                        }



                    });
                    dispatch(setOnlineDriver(driv.sort(function (a, b) { return a.distanceInt - b.distanceInt })))
                    console.log('hai bhai hai', driv.length)
                } else {
                    console.log('nahi hai')
                    dispatch(setOnlineDriver([]))
                    // dispatch()
                }
            });

        // Stop listening for updates when no longer required
        return () => database().ref(reff).off('value', onValueChange);
    }, []);

    useEffect(() => {
        if (AllDrivers.length) {
            setTimeout(() => {

                setIsLoading(false)
            }, 1000)

        }
    }, [AllDrivers]);



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

    // function getProfileFromFirebase() {
    //     FirebaseUser.doc(profile.uid).get().then((documentSnapshot) => {
    //         const prf = documentSnapshot.data()
    //         dispatch(setProfile(prf))
    //         if (prf.favoriteDrivers && prf.favoriteDrivers.length) {
    //             dispatch(setFavoriteDrivers(prf.favoriteDrivers))
    //         }

    //     }).catch(err => {
    //         console.log('Internal error while  getProfileFrom')
    //     });
    // }
    useEffect(() => {
        getProfileFromFirebase()

    }, [])
    useEffect(() => {
        if (profile.city) {
            getAreasLocations(profile.city)

            getAllRestuarant(profile)

        }

        // updateDeviceTokenToFireBase(profile.uid)
        // sendPushNotification('hi', 'bye',2 )

        getCurrentLocations()
        // const interval = setInterval(() => {
        //     getCurrentLocations()

        // }, 120000);
        // return () => clearInterval(interval);

    }, [profile.city])
    useEffect(() => {

    }, [profile]);


    function Greeting() {
        let greet = '';
        const myDate = new Date();
        const hrs = myDate.getHours();
        if (hrs >= 5 && hrs < 12) greet = 'Good Morning';
        else if (hrs >= 12 && hrs < 16) greet = 'Good Afternoon';
        else if (hrs >= 16 && hrs < 20) greet = 'Good Evening';
        else if (hrs >= 20 && hrs < 24) greet = 'Good Night';
        else if (hrs >= 0 && hrs < 5) greet = 'Mid Night Owl...';
        return greet;
    }

    const CommonMain = ({ Deriver = [], code = 0, name = '' }) => {
        return (
            <View>

                <View style={{ paddingHorizontal: myWidth(4), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{
                        fontSize: myFontSize.xxBody,
                        fontFamily: myFonts.heading,
                        color: myColors.text,
                        letterSpacing: myLetSpacing.common,
                        includeFontPadding: false,
                        padding: 0,
                    }}>{name}</Text>

                    <TouchableOpacity style={{
                        flexDirection: 'row', alignItems: 'center', paddingVertical: myHeight(0.4),
                        paddingStart: myWidth(2)
                    }} activeOpacity={0.6} onPress={() => navigation.navigate('Search', { name })}>

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
                        <Image style={{
                            height: myHeight(1.5), width: myHeight(1.5), marginStart: -myWidth(1),
                            resizeMode: 'contain', tintColor: myColors.primaryT
                        }} source={require('../assets/home_main/home/go.png')} />
                    </TouchableOpacity>
                </View>
                <FlashList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}

                    contentContainerStyle={{
                        // flexGrow: 1,
                        paddingHorizontal: myWidth(4)
                    }}

                    data={Deriver.slice(0, 4)}
                    keyExtractor={(item, index) => index.toString()}
                    estimatedItemSize={myHeight(30)}

                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity activeOpacity={0.8} key={index} style={{ marginEnd: myWidth(4) }} onPress={() => navigation.navigate('DriverDetail', { driver: item })}>

                                <DriverInfoFull isSmall={true} driver={item} code={code} />
                            </TouchableOpacity>
                        )

                    }
                    }


                />
            </View>
        )
    }
    return (

        <SafeAreaView style={styles.container}>
            <StatusbarH />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} >

                <Spacer paddingT={myHeight(2)} />
                {/* <Text style={[styles.textCommon, {
                            fontSize: myFontSize.medium2,
                            fontFamily: myFonts.heading,
                            alignSelf: 'center',

                        }]}>Van<Text style={{ color: myColors.primaryT }}>Con</Text></Text> */}

                <View style={{ paddingHorizontal: myWidth(6) }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            color: myColors.text, fontSize: myFontSize.xxBody,
                            fontFamily: myFonts.bodyBold
                        }}>

                        {Greeting()}, <Text style={{ color: myColors.primaryT }}>{profile.name}</Text>
                    </Text>
                </View>


                <Spacer paddingT={myHeight(1.5)} />

                {/* Banner */}
                <Banners />
                <Spacer paddingT={myHeight(3)} />

                {/* <View style={{ width: '100%', height: myHeight(0.2), backgroundColor: myColors.primaryT }} /> */}
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    // paddingHorizontal: myWidth(4),
                    justifyContent: 'space-between',
                    borderWidth: myHeight(0.2), borderColor: myColors.primaryL5
                }}>

                    <TouchableOpacity activeOpacity={0.75} style={{
                        width: '49%', justifyContent: 'center',
                        flexDirection: 'row', alignItems: 'center', paddingVertical: myHeight(1)
                    }}
                        onPress={() => {

                            navigation.navigate('RequestRide', { online: false })
                        }}>

                        <Image style={{
                            height: myHeight(3.5), width: myHeight(3.5),
                            resizeMode: 'contain',
                        }} source={require('../assets/home_main/home/online.png')} />
                        <Spacer paddingEnd={myWidth(2.5)} />

                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.xBody,

                        }]}>Book Van</Text>

                    </TouchableOpacity>
                    {/* <Spacer paddingEnd={myWidth(7.5)} /> */}
                    <View style={{ height: '100%', width: myHeight(0.2), backgroundColor: myColors.divider }} />


                    <TouchableOpacity activeOpacity={0.75} style={{
                        width: '50%', justifyContent: 'center',
                        flexDirection: 'row', alignItems: 'center', paddingVertical: myHeight(1)
                    }}
                        onPress={() => {
                            if (onlineReq) {
                                navigation.navigate("OrderDetails2", { item: onlineReq, code: 1 })
                                return
                            }
                            navigation.navigate('RequestRide', { online: true })
                        }}>

                        <Image style={{
                            height: myHeight(3.5), width: myHeight(3.5),
                            resizeMode: 'contain',
                        }} source={require('../assets/home_main/home/online2.png')} />
                        <Spacer paddingEnd={myWidth(2.5)} />

                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.xBody,

                        }]}>Vanpool</Text>


                        {
                            onlineReq ?
                                <View style={{ position: 'absolute', top: myHeight(0.8), right: myWidth(2) }}>

                                    <View style={{
                                        height: myHeight(1.5), width: myHeight(1.5), borderRadius: myHeight(1),
                                        backgroundColor: myColors.primaryT
                                    }} />
                                </View>
                                : null
                        }

                    </TouchableOpacity>
                </View>
                {/* <View style={{ width: '100%', height: myHeight(0.2), backgroundColor: myColors.primaryT }} /> */}

                <Spacer paddingT={myHeight(2)} />

                {
                    AllDrivers.length ?
                        < CommonMain Deriver={AllDrivers} name='Inside Universities' />
                        : null
                }

                <Spacer paddingT={myHeight(1.5)} />

                {
                    onlineDrivers.length ?
                        < CommonMain Deriver={onlineDrivers} name='Nearby Drivers' />
                        : null
                }


                {

                }
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


                <Spacer paddingT={progress.length ? myHeight(25) : 0} />
            </ScrollView>

            {
                progress.length ?

                    <Status notifications={progress} />
                    : null
            }
            {isLoading && <HomeSkeleton />}

        </SafeAreaView >
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
    star: {
        width: myHeight(4.2),
        height: myHeight(4.2),
        marginEnd: myWidth(0.5),
        resizeMode: 'contain',
    },
    heading: {
        fontSize: myFontSize.medium0,
        fontFamily: myFonts.heading,
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

})