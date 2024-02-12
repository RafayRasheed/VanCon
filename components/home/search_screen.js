import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView, StyleSheet, TouchableOpacity, Image,
    View, Text, StatusBar, TextInput,
    Linking, Platform, ImageBackground, SafeAreaView,
} from 'react-native';
import { MyError, Spacer, StatusbarH, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { Restaurants } from './home_data';
import { DriverInfoFull } from './home.component/driver_info_full';
import Lottie from 'lottie-react-native';
import { Filter } from './home.component/filter';
import { useDispatch, useSelector } from 'react-redux';
import { ItemInfo } from './home.component/item_info';
import { FlashList } from '@shopify/flash-list';
import database from '@react-native-firebase/database';
import { sendPushNotification } from '../functions/firebase';
import { setErrorAlert } from '../../redux/error_reducer';
import storeRedux from '../../redux/store_redux';

const CommonFaci = ({ name, fac, setFAc }) => (
    <TouchableOpacity activeOpacity={0.75}
        onPress={() => {
            setFAc(!fac)
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <View style={{
                height: myHeight(3.5),
                width: myHeight(3.5),
                paddingTop: myHeight(0.75)
            }}>
                <View style={{ width: myHeight(2.1), height: myHeight(2.1), borderWidth: 1.5, borderColor: myColors.textL4 }} />
                {
                    fac &&
                    <Image style={{
                        height: myHeight(3.3),
                        width: myHeight(3.3),
                        resizeMode: 'contain',
                        tintColor: myColors.primaryT,
                        marginTop: -myHeight(3.1)
                    }} source={require('../assets/home_main/home/check2.png')} />
                }
            </View>
            <Spacer paddingEnd={myWidth(0)} />
            <Text style={[styles.textCommon,
            {
                fontFamily: myFonts.bodyBold,
                fontSize: myFontSize.body4,

            }]}>{name}</Text>
        </View>
    </TouchableOpacity>
)
function containString(contain, thiss) {
    return (contain.toLowerCase().includes(thiss.toLowerCase()))
}
export const Search = ({ navigation, route }) => {
    const { AllDrivers } = useSelector(State => State.data)
    const { allRequest } = useSelector(State => State.orders)


    const [request, setRequest] = useState(null)

    const [search, setSearch] = useState(null)
    const [load, setLoad] = useState([])
    const [filterModal, setFilterModal] = useState(null)
    const [topRated, setTopRated] = useState(false)
    const [ac, setAc] = useState(false)
    const [wifi, setWifi] = useState(false)

    const [allItems, setAllItems] = useState([])
    const [filterItems, setFilterItems] = useState([])

    const dispatch = useDispatch()
    const requestId = route.params.requestId
    // const [fullRest, setFullRest] = useState([])
    const Loader = () => (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{
                marginTop: -myHeight(15),
                alignItems: 'center',
            }}>
                <Lottie
                    autoPlay={true}
                    loop={true}
                    source={require('../assets/lottie/spoonL.json')}
                    style={{
                        height: myHeight(38), width: myHeight(38),
                    }}
                />

                <Text style={[styles.textCommon, {
                    fontSize: myFontSize.body3,
                    color: myColors.textL4,
                    fontFamily: myFonts.bodyBold,
                    marginTop: -myHeight(11)
                }]}>Loading....</Text>
            </View>
        </View>
    )
    useEffect(() => {
        if (allRequest.length) {

            setRequest(allRequest.find(it => it.id == requestId))
        }
    }, [allRequest])
    useEffect(() => {
        if (request) {
            const simple = []
            const jugaar = []

            AllDrivers.map((driver, i) => {
                let includeDays = true
                let includePackage = true
                const alreadySend = request.sendDrivers ? request.sendDrivers.findIndex(it => it.did == driver.uid) != -1 : false
                request.selectedDays.map(it2 => {
                    if (includeDays && driver.dailyDays.findIndex(it => it == it2) == -1) {
                        includeDays = false
                    }

                })
                includePackage = driver.packages.findIndex(it => it == request.packages) != -1

                if (!alreadySend && includeDays && includePackage) {



                    if ((driver.allRoutes.findIndex(it => it.id == request.pickup.id) != -1) &&
                        (driver.allRoutes.findIndex(it => it.id == request.dropoff.id) != -1)) {

                        simple.push(driver)
                    }

                    else {
                        jugaar.push(driver)

                    }
                }
                setAllItems([...simple, ...jugaar])

            })
        }
    }, [request])

    function onSend(driver) {
        setLoad(load.push[driver.uid])
        // return
        const driverDetail = { status: 1, did: driver.uid, name: driver.name, vehicleName: driver.vehicleName, contact: driver.contact }
        const sendDrivers = request.sendDrivers ? [...request.sendDrivers, driverDetail] : [driverDetail]
        const status = request.status == 1 ? 2 : request.status
        const newUpdate = { status, sendDrivers }
        database()
            .ref(`/requests/${request.uid}/${request.id}`)
            .update(newUpdate).then(() => {
                storeRedux.dispatch(setErrorAlert({ Title: `Request Send to ${driver.name} Successfully`, Status: 2 }))
                database()
                    .ref(`/requests/${driver.uid}/${request.id}`)
                    .update({ ...request, ...newUpdate, unread: true }).then(() => {
                        setLoad(load.filter(it => it != driver.uid))
                        sendPushNotification('New Request', `You have a ride request from ${request.name}`, 2, [driver.deviceToken])

                    }).catch((err) => {
                        setLoad(load.filter(it => it != driver.uid))

                        console.log('error on send request', err)
                    })

            }).catch((err) => {
                setLoad(load.filter(it => it != driver.uid))

                console.log('error on send request', err)
            })
    }
    function onGoToItem(item) {
        // const req= AllRest.filter(res => res.uid == item.resId)[0]
        // console.log(restaurant)
        // navigation.navigate('ItemDetails', { item, restaurant })
    }
    useEffect(() => {
        // return
        if (allItems.length) {
            const newR = allItems?.filter(item => (ac ? item.ac : true) && (wifi ? item.isWifi : true) && (search ? containString(item.vehicleName, search) : true))

            if (topRated) {

                setFilterItems(newR.sort(function (a, b) { return b.rating - a.rating }))
            } else {

                setFilterItems(newR)
            }
        }
        else {
            setFilterItems([])
        }
    }, [allItems, search, topRated, wifi, ac])


    // useEffect(() => {
    //     if (load) {
    //         setTimeout(() =>
    //             setLoad(false)
    //             , 3000)
    //     }
    // }, [topRated, wifi, ac])
    return (

        <>

            <SafeAreaView style={{
                flex: 1, backgroundColor: myColors.background,
            }}>
                <StatusbarH />
                <Spacer paddingT={myHeight(1)} />
                {/* Top */}
                {/* Search */}
                <View style={{ paddingHorizontal: myWidth(4), flexDirection: 'row', alignItems: 'center' }}>

                    {/* Search */}
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: myWidth(4),
                        borderRadius: myWidth(2.5),
                        backgroundColor: myColors.offColor7,
                        // marginHorizontal: myWidth(4)
                    }}>
                        {/* Arrow */}
                        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={{}}>
                            <Image style={{
                                height: myHeight(2.3),
                                width: myHeight(2.3),
                                resizeMode: 'contain',
                                tintColor: myColors.textL0
                            }} source={require('../assets/home_main/home/back.png')} />
                        </TouchableOpacity>
                        <Spacer paddingEnd={myWidth(2.5)} />
                        <TextInput placeholder=" Search"
                            placeholderTextColor={myColors.textL5}
                            autoCorrect={false}
                            selectionColor={myColors.primaryT}
                            style={{
                                flex: 1,
                                textAlignVertical: 'center',
                                paddingVertical: ios ? myHeight(0.6) : myHeight(100) > 600 ? myHeight(0.5) : myHeight(0.1),
                                fontSize: myFontSize.xxSmall,
                                color: myColors.text,
                                includeFontPadding: false,
                                fontFamily: myFonts.bodyBold,
                            }}
                            cursorColor={myColors.primaryT}
                            value={search} onChangeText={setSearch}
                        // value={search} onChangeText={(val) => null}
                        />
                    </View>
                    {/* <Spacer paddingEnd={myWidth(3)} />
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setFilterModal(true)} style={{}}>
                        <Image style={{
                            height: myHeight(4.2),
                            width: myHeight(4.2),
                            resizeMode: 'contain',
                            tintColor: myColors.textL0
                        }} source={require('../assets/home_main/home/filter.png')} />
                    </TouchableOpacity> */}
                </View>
                <Spacer paddingT={myHeight(1.5)} />

                <View style={{ marginHorizontal: myWidth(5), flexDirection: 'row', justifyContent: 'space-between' }}>

                    <CommonFaci name={'Top Rated'} fac={topRated} setFAc={setTopRated} />
                    <CommonFaci name={'With AC'} fac={ac} setFAc={setAc} />
                    <CommonFaci name={'With Wifi'} fac={wifi} setFAc={setWifi} />
                </View>

                <Spacer paddingT={myHeight(1.2)} />

                {/* Icon Empty Or Content */}
                <View style={{ height: myHeight(0.30), marginHorizontal: myWidth(4), backgroundColor: myColors.divider }} />

                <View style={{ flex: 1 }}>
                    {filterItems.length ?

                        <FlashList
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            data={filterItems}
                            extraData={[request, load]}
                            // extraData={[ac, wifi, topRated, search]}
                            // contentContainerStyle={{ flexGrow: 1 }}
                            ItemSeparatorComponent={() =>
                                <View style={{ borderTopWidth: myHeight(0.08), borderColor: myColors.offColor, width: "100%" }} />
                            }
                            estimatedItemSize={myHeight(10)}
                            renderItem={({ item, index }) => {
                                const isLoad = (load && load.findIndex(it => it == item.uid) != -1)
                                return (
                                    <TouchableOpacity disabled key={index} activeOpacity={0.85}
                                        onPress={() => navigation.navigate('DriverDetail', { driver: item, request })}>
                                        <DriverInfoFull onSend={onSend} isLoad={isLoad} driver={item} request={request} />
                                    </TouchableOpacity>
                                )
                            }
                            }
                        />
                        :
                        <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.textCommon,
                            {
                                fontFamily: myFonts.bodyBold,
                                fontSize: myFontSize.body4,

                            }]}>No Drivers Available</Text>
                        </View>
                    }

                </View>


            </SafeAreaView>

            {
                filterModal &&
                <Filter setModal={setFilterModal} />
            }
        </>
    )
}


const styles = StyleSheet.create({

    //Text
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
})