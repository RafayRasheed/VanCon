import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView, StyleSheet, TouchableOpacity, Image,
    View, Text, StatusBar, TextInput, Alert,
    Linking, Platform, ImageBackground, SafeAreaView, FlatList,
} from 'react-native';
import { Loader, MyError, NotiAlertNew, Spacer, StatusbarH, errorTime, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { useDispatch, useSelector } from 'react-redux';
import database from '@react-native-firebase/database';


import storage from '@react-native-firebase/storage';
import { ImageUri } from '../common/image_uri';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Collapsible from 'react-native-collapsible';
import firestore from '@react-native-firebase/firestore';
import { setProfile } from '../../redux/profile_reducer';
import { FirebaseUser, sendPushNotification } from '../functions/firebase';
import { setErrorAlert } from '../../redux/error_reducer';
import { Search } from './locations_screen';
import { CalenderDate } from './home.component/calender';
import { RFValue } from 'react-native-responsive-fontsize';
import { offers } from './home_data';
import { dataFullData, getCurrentLocations, getDistanceFromRes } from '../functions/functions';
import { DriverInfoFull } from './home.component/driver_info_full';
const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const RequestRide = ({ navigation, route }) => {
    const disptach = useDispatch()
    const { onlineDrivers } = useSelector(state => state.data)

    const preReq = route.params ? route.params.preReq : null
    const online = route.params ? route.params.online : null
    const driver = route.params ? route.params.driver : null

    const TimeAndLoc = [
        { id: 59, time: '5AM - 9AM', locations: [], show: false },
        { id: 912, time: '9AM - 12PM', locations: [], show: false },
        { id: 1215, time: '12PM - 3PM', locations: [], show: false },
        { id: 1518, time: '3PM - 6PM', locations: [], show: false },
        { id: 1824, time: '6PM - 12AM', locations: [], show: false },
    ]
    const temp = [
        {
            day: 'Mon',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Tue',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Wed',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Thu',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Fri',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Sat',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
        {
            day: 'Sun',
            open: true, startTime: '', startCurrent: null, endTime: '', endCurrent: null
        },
    ]
    // const [, set] = useState(true)
    const { profile } = useSelector(state => state.profile)
    const { current, history, nearest } = useSelector(state => state.location)

    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [showTimeModal, setShowTimeModal] = useState(false)
    const [showLoc, setShowLoc] = useState(false)
    const [contact, setContact] = useState(preReq ? preReq.contact : null)


    const [pickup, setPickup] = useState(online ? nearest : preReq ? preReq.pickup : null)
    const [dropoff, setDropoff] = useState(preReq ? preReq.dropoff : null)
    const [twoWay, setTwoWay] = useState(preReq ? preReq.twoWay : true)

    const [pickupTime, setPickupTime] = useState(preReq ? preReq.pickupTime : null)
    const [dropoffTime, setDropoffTime] = useState(preReq ? preReq.dropoffTime : null)


    const [selectedDays, setSelectedDays] = useState(preReq ? [...preReq.selectedDays] : [])
    const [seats, setSeats] = useState(preReq ? preReq.seats : 1)
    const [packages, setPackages] = useState(preReq ? preReq.packages : null)
    const [offer, setOffer] = useState(preReq ? preReq.offer : null)

    const [instruction, setInstruction] = useState(preReq ? preReq.instruction : null)

    const [alreadySend, setAlreadySend] = useState([])

    useEffect(() => {


        getCurrentLocations()



    }, [])
    function checkNumber() {
        if (contact) {
            if (contact.length == 11) {
                return true
            }
            setErrorMsg('Invalid Contact Number')
            return false
        }
        setErrorMsg('Please Add Contact Number')
        return false
    }
    function checkPackages() {
        if (packages.length) {
            return true
        } else {
            setErrorMsg('Please Select Customer Packages')
            return false
        }
    }
    function checkDescription() {
        if (description) {
            if (description.length < 20) {
                setErrorMsg('Enter Description Minimum 20 Characters')
                return false
            }
            return true
        }
        setErrorMsg('Please Add Description')
        return false
    }
    function checkNameAndModal() {
        if (vehicleName) {

            if (vehicleModal) {
                const date = new Date()

                if (!isNaN(vehicleModal) && vehicleModal.length == 4 && (parseInt(vehicleModal) <= parseInt(date.getFullYear()))) {
                    return true
                }
                setErrorMsg('Incorrect Vehicle Modal')
                return false
            }
            setErrorMsg('Please Enter Vehicle Modal')
            return false

        }
        setErrorMsg('Please Add Vehicle Name')
        return false
    }
    function checkNumAndModal() {
        if (vehicleNum) {

            if (vehicleSeats) {

                return true

            }
            setErrorMsg('Please Enter Vehicle Capacity')
            return false

        }
        setErrorMsg('Please Add Vehicle Number')
        return false
    }

    function checkTimmings() {
        let s = true
        timmings.map(time => {
            if (time.open && (!time.startTime || !time.endTime)) {
                s = false
            }
        })
        return s
    }
    function checkRoutes() {
        if (selectedItem.filter(it => it.locations.length != 0).length) {
            return true
        }
        setErrorMsg('Please Add at Least 1 Route')
        return false
    }
    function checkOffer() {
        if (offer) {
            if (isNaN(offer) || offer < 0) {
                setErrorMsg('Invalid Offer Value')
                return false
            }
            return true
        }
        setErrorMsg('Please Enter Your Offer')
        return false

    }
    function checkData() {

        if (!pickup) {
            setErrorMsg('Please Select Pickup Address')
            return false
        }

        if (!online && !pickupTime) {
            setErrorMsg('Please Select Pickup Time')
            return false
        }
        if (!dropoff) {
            setErrorMsg('Please Select Dropoff Address')
            return false
        }
        if (!online && twoWay && !dropoffTime) {
            setErrorMsg('Please Select Dropoff Time')
            return false
        }
        if (!checkNumber()) {
            return false
        }
        if (!online && !selectedDays.length) {
            setErrorMsg('Please Select Days')
            return false
        }
        if (!online && !packages) {
            setErrorMsg('Please Select Paid')
            return false
        }
        if (!checkOffer()) {
            return false
        }



        return true
    }
    function formatRoutes() {
        const newArr = []
        selectedItem.filter(it => {
            if (it.locations.length != 0) {

                newArr.push({ ...it, show: false })
            }

        })
        return newArr
    }
    function onSave() {




        if (checkData()) {
            setIsLoading(true)

            let { date, time, dateInt, actualDate, smallCode } = dataFullData()
            const id = preReq ? preReq.id : smallCode
            dateInt = preReq ? preReq.dateInt : dateInt
            actualDate = preReq ? preReq.actualDate : actualDate
            date = preReq ? preReq.date : date
            time = preReq ? preReq.time : time

            const { distance, string } = getDistanceFromRes(
                { latitude: pickup.latitude, longitude: pickup.longitude },
                { latitude: dropoff.latitude, longitude: dropoff.longitude },
                true
            )
            const newProfile = {
                id,
                dateInt, actualDate,
                date, time,
                isOnline: online,
                distance: string, actualDistance: distance,
                pickup, pickupTime, dropoff,
                dropoffTime, seats, selectedDays,
                packages, offer, instruction,
                status: preReq ? preReq.status : online ? 2 : 1,
                name: profile.name,
                uid: profile.uid,
                sendDrivers: (preReq && preReq.sendDrivers) ? preReq.sendDrivers : [],
                did: null,
                driverName: null,
                driverContact: null,
                twoWay,
                unread: true,
                contact,
                location: current ? current : { "latitude": 0, "longitude": 0 }

            }
            console.log('New Profile', newProfile)

            if (online) {
                const checkDriver = (it) => {
                    if (!it) {
                        return false
                    }
                    const update = new Date(it.lastUpdate)
                    const isReady = ((actualDate - update) / 1000) <= 50

                    const alrea = alreadySend.find(l => l == it.uid) != -1
                    const from = it.location
                    const { distance } = getDistanceFromRes(from, current ? current : { "latitude": 0, "longitude": 0 })
                    console.log(from, current, distance, isReady, update, actualDate)


                    if (isReady && distance < 3000) {
                        return true
                    }
                    return false
                }


                const Drivers = driver ? checkDriver(onlineDrivers.find(it => driver.did == it.did)) ? [driver] : []
                    : onlineDrivers.filter(it => checkDriver(it))
                if (Drivers.length == 0) {
                    setIsLoading(false)
                    disptach(setErrorAlert({ Title: 'No Driver Found', Body: 'Please retry after sometime', Status: 0 }))
                    return

                }
                newProfile.token = profile.deviceToken,
                    newProfile.sendDrivers = Drivers
                newProfile.isSpecific = driver ? true : false

                //    profile.sendDrivers = sendDrivers
                const tokens = []

                Drivers.map((dr) => {
                    const driverDetail = { ...dr, status: 1, unread: true }
                    tokens.push(dr.token)
                    newProfile[dr.uid] = driverDetail
                })
                newProfile.tokens = tokens
                // console.log(tokens)
                // setIsLoading(false)
                // return

                // .ref(`online/${profile.city}/requests/${profile.uid}/${newProfile.id}`)
                database()
                    .ref(`/requests/${profile.uid}/${newProfile.id}`)
                    .update(newProfile).then(() => {
                        disptach(setErrorAlert({ Title: `Request Sent Successfully`, Body: `Request sent to ${Drivers.length} ${Drivers.length == 1 ? 'driver' : 'drivers'}`, Status: 10 }))
                        sendPushNotification('New Vanpool Request', `You have a vanpool request from ${profile.name}`, 10, tokens)
                        setIsLoading(false)

                        navigation.replace("OrderDetails2", { item: newProfile, code: 1 })


                    }).catch((err) => {
                        setIsLoading(false)

                        console.log('error on send request', err)
                    })
            }
            else {

                database()
                    .ref(`/requests/${profile.uid}/${id}`).update(newProfile).then(() => {

                        setIsLoading(false)
                        // navigation.goBack()
                        setTimeout(() => {
                            console.log(id)
                            navigation.replace('Search', { requestId: id, code: 2, name: 'Ride Request' })
                        }, 200)
                    })
                    .catch((er) => {
                        setIsLoading(false)

                        console.log('error on save newProfile', er)
                        setErrorMsg('Something Wrong')
                    })
            }
            // setAddress(JSON.stringify(newProfile))


        }
        //  else {
        //     setIsEditMode(true)
        // }

    }

    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                setIsLoading(false)
                setErrorMsg(null)
            }
                , errorTime)
        }
    }, [errorMsg])



    // For Packages
    const CommonFaciPackage = ({ name }) => {
        // const fac = packages.findIndex(it => it == name) != -1
        const fac = packages == name
        return (
            <TouchableOpacity activeOpacity={0.75}
                onPress={() => {
                    if (fac) {
                        // setPackages(packages.filter(it => it != name))
                    } else {
                        // setPackages([name, ...packages])
                        setPackages(name)
                    }
                }}>
                {/* <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{
                        height: myHeight(3.5),
                        width: myHeight(3.5),
                        paddingTop: myHeight(0.75)
                    }}>
                        <View style={{ width: myHeight(2.2), height: myHeight(2.2), borderWidth: 1.5, borderColor: myColors.textL4 }} />
                        {
                            fac &&
                            <Image style={{
                                height: myHeight(3.3),
                                width: myHeight(3.3),
                                resizeMode: 'contain',
                                tintColor: myColors.primaryT,
                                marginTop: -myHeight(3.1)
                            }} source={require('../assets/home_main/home/check.png')} />
                        }
                    </View>
                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.bodyBold,
                        fontSize: myFontSize.xBody,

                    }]}>{name}</Text>
                </View> */}

                <View style={[styles.backItem,
                {
                    flexDirection: 'row', paddingHorizontal: myWidth(0),
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: fac ? myColors.primaryT : myColors.divider
                    , borderRadius: myHeight(100), width: myWidth(20), paddingVertical: myHeight(0.5)

                }]}>


                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.bodyBold,
                        fontSize: myFontSize.xxSmall,
                        // alignItems: 'center',
                        color: fac ? myColors.background : myColors.text

                    }]}>{name}</Text>
                </View>
            </TouchableOpacity>
        )
    }



    function isFirstTime(isStart) {
        if (isStart) {
            const fil = timmings.filter(time => time.startTime.length > 0)
            return fil.length == 0
        }
        else {
            const fil = timmings.filter(time => time.endTime.length > 0)
            return fil.length == 0
        }

    }

    function validateTime(pickupTime, dropoffTime) {
        return
        console.log(pickupTime, dropoffTime)
        if (pickupTime && dropoffTime) {
            const dif = dropoffTime.current - pickupTime.current
            if (dif < 0) {
                setDropoffTime({ ...pickupTime })
                setErrorMsg('Invalid Dropoff Time')
            }
        }
    }

    function checkTime(val, date, content, show) {
        const s = { current: date, time: val }

        if (show == 1) {
            validateTime(s, dropoffTime)

            setPickupTime({ ...s })
        }
        else {
            setDropoffTime({ ...s })
            validateTime(pickupTime, s)
        }




        return
        const isFirst = isFirstTime(content.start)
        let copy = timmings
        if (content.start) {
            if (isFirst) {
                copy = []
                timmings.map(time => {
                    const newDay = {
                        ...time,
                        startTime: val,
                        startCurrent: date,
                    }
                    copy.push(newDay)
                })

            }
            else {

                copy[content.i].startTime = val
                copy[content.i].startCurrent = date
            }

        }
        else {
            if (isFirst) {
                copy = []
                timmings.map(time => {
                    const newDay = {
                        ...time,
                        endTime: val,
                        endCurrent: date,
                    }
                    copy.push(newDay)
                })

            }
            else {
                copy[content.i].endTime = val
                copy[content.i].endCurrent = date
            }
        }
        setTimmings(copy)
        setChange(!change)
    }

    const DaysShow = ({ list = [], setList }) => {
        return (
            <View style={{ width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
                {
                    allDays.map((it, i) => {
                        const is = list.findIndex(li => li == it) != -1

                        return (

                            <>
                                <TouchableOpacity key={i} activeOpacity={0.8} onPress={() =>
                                    setList(is ? list.filter(it2 => it2 != it) : [it, ...list])
                                } style={[styles.backItem, {
                                    backgroundColor: is ? myColors.primaryT : myColors.divider, width: myWidth(11.82), paddingVertical: myHeight(0.6),
                                    paddingHorizontal: myWidth(0), justifyContent: 'center', borderRadius: myWidth(100)
                                }]}>


                                    <Text numberOfLines={1}

                                        style={{
                                            fontSize: myFontSize.small3,
                                            fontFamily: myFonts.bodyBold,
                                            color: is ? myColors.background : myColors.text,
                                            letterSpacing: myLetSpacing.common,
                                            includeFontPadding: false,
                                            padding: 0,
                                        }}>{it}</Text>

                                </TouchableOpacity>
                                {
                                    i != 6 &&
                                    <Spacer key={i} paddingEnd={myWidth(1.5)} />
                                }
                            </>

                        )
                    }
                    )
                }
            </View>
        )
    }


    return (
        <>

            <SafeAreaView style={{ flex: 1, backgroundColor: myColors.background }}>

                <StatusbarH />
                {/* Top */}
                <View>
                    <Spacer paddingT={myHeight(1.5)} />
                    <View style={{ marginHorizontal: myWidth(4), flexDirection: 'row', alignItems: 'center' }}>
                        {/* Search */}

                        {/* Arrow */}
                        {/* <TouchableOpacity activeOpacity={0.7}
                            onPress={() => navigation.goBack()} style={{ paddingHorizontal: myWidth(4), }}>
                            <Image style={{
                                height: myHeight(2.4),
                                width: myHeight(2.4),
                                resizeMode: 'contain',
                                tintColor: myColors.textL0
                            }} source={require('../assets/home_main/home/back.png')} />
                        </TouchableOpacity> */}


                        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8} style={{
                            backgroundColor: myColors.primaryT,
                            height: myHeight(3.5),
                            width: myHeight(3.5),
                            borderRadius: myHeight(3),
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}  >
                            <Image style={
                                {
                                    height: myHeight(2),
                                    width: myHeight(2),
                                    resizeMode: 'contain'
                                }
                            } source={require('../assets/startup/goL.png')} />
                        </TouchableOpacity>
                        <Spacer paddingEnd={myWidth(5)} />
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xxBody
                        }]}>{online ? 'Vanpool' : 'Book Ride'}</Text>
                    </View>
                    <Spacer paddingT={myHeight(1)} />

                </View>
                {/* <View style={{ height: myHeight(0.6), backgroundColor: myColors.divider }} /> */}

                <KeyboardAwareScrollView contentContainerStyle={{ paddingHorizontal: myWidth(4) }}>


                    <Spacer paddingT={myHeight(1.5)} />
                    {
                        driver ?

                            <View>
                                <TouchableOpacity activeOpacity={0.8} style={{}} onPress={() => {

                                    navigation.navigate('DriverDetail', { driver: driver })
                                }}>

                                    <DriverInfoFull driver={driver} code={104} />
                                </TouchableOpacity>
                                <Spacer paddingT={myHeight(1)} />

                            </View>
                            :
                            null
                    }
                    {/* Pickup */}
                    <View style={{}}>
                        <Text

                            style={styles.heading}>Pickup Info</Text>


                        <View style={{ paddingHorizontal: myWidth(2) }}>
                            <Text

                                style={styles.tesxH}>Enter your pickup location and timing.</Text>
                            <Spacer paddingT={myHeight(0.8)} />
                            <TouchableOpacity onPress={() => { setShowLoc(1) }}
                                activeOpacity={0.8}
                                style={styles.backItem}>
                                <Text numberOfLines={2} style={[styles.textCommon, {
                                    flex: 1,
                                    fontFamily: myFonts.bodyBold,
                                    fontSize: myFontSize.body2,
                                    color: pickup ? myColors.text : myColors.offColor
                                }]}>{pickup ? pickup.name : 'Address'} </Text>
                                {pickup ? null :
                                    <Text style={[styles.textCommon, {

                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body,
                                        paddingTop: RFValue(3.5),
                                        color: myColors.primaryT
                                    }]}>{'Tap to Select'}</Text>
                                }
                            </TouchableOpacity>

                            {
                                online ? null
                                    :
                                    <>
                                        <Spacer paddingT={myHeight(0.4)} />
                                        <TouchableOpacity onPress={() => { setShowTimeModal(1) }}
                                            activeOpacity={0.8}
                                            style={styles.backItem}>
                                            <Text numberOfLines={2} style={[styles.textCommon, {
                                                flex: 1,
                                                fontFamily: myFonts.bodyBold,
                                                fontSize: myFontSize.body2,
                                                color: pickupTime ? myColors.text : myColors.offColor
                                            }]}>{pickupTime ? pickupTime.time : 'Time'} </Text>
                                            {pickupTime ? null :
                                                <Text style={[styles.textCommon, {

                                                    fontFamily: myFonts.bodyBold,
                                                    fontSize: myFontSize.body,
                                                    paddingTop: RFValue(3.5),
                                                    color: myColors.primaryT
                                                }]}>{'Tap to Select'}</Text>
                                            }
                                        </TouchableOpacity>
                                    </>
                            }
                        </View>
                    </View>


                    <Spacer paddingT={myHeight(2.5)} />

                    {/* Drop-Off Info */}
                    <View style={{}}>
                        <Text

                            style={styles.heading}>Drop-Off Info</Text>


                        <View style={{ paddingHorizontal: myWidth(2) }}>
                            <Text

                                style={styles.tesxH}>Enter your drop-off location and timing.</Text>
                            <Spacer paddingT={myHeight(0.8)} />

                            <TouchableOpacity onPress={() => { setShowLoc(2) }}
                                activeOpacity={0.8}
                                style={styles.backItem}>
                                <Text numberOfLines={2} style={[styles.textCommon, {
                                    flex: 1,
                                    fontFamily: myFonts.bodyBold,
                                    fontSize: myFontSize.body2,
                                    color: dropoff ? myColors.text : myColors.offColor
                                }]}>{dropoff ? dropoff.name : 'Address'} </Text>
                                {dropoff ? null :
                                    <Text style={[styles.textCommon, {

                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body,
                                        paddingTop: RFValue(3.5),
                                        color: myColors.primaryT
                                    }]}>{'Tap to Select'}</Text>
                                }
                            </TouchableOpacity>

                            {
                                online ? null
                                    :
                                    <>
                                        <Collapsible collapsed={!twoWay}>

                                            <Spacer paddingT={myHeight(0.4)} />
                                            <TouchableOpacity onPress={() => { setShowTimeModal(2) }}
                                                activeOpacity={0.8}
                                                style={styles.backItem}>
                                                <Text numberOfLines={2} style={[styles.textCommon, {
                                                    flex: 1,
                                                    fontFamily: myFonts.bodyBold,
                                                    fontSize: myFontSize.body2,
                                                    color: dropoffTime ? myColors.text : myColors.offColor
                                                }]}>{dropoffTime ? dropoffTime.time : 'Time'} </Text>
                                                {dropoffTime ? null :
                                                    <Text style={[styles.textCommon, {

                                                        fontFamily: myFonts.bodyBold,
                                                        fontSize: myFontSize.body,
                                                        paddingTop: RFValue(3.5),
                                                        color: myColors.primaryT
                                                    }]}>{'Tap to Select'}</Text>
                                                }
                                            </TouchableOpacity>
                                        </Collapsible>

                                        <Spacer paddingT={myHeight(0.4)} />

                                        <TouchableOpacity activeOpacity={0.75}
                                            onPress={() => {
                                                setTwoWay(!twoWay)
                                            }}>
                                            <View style={{ paddingStart: myWidth(0.5), flexDirection: 'row', alignItems: 'center', }}>
                                                <View style={{
                                                    height: myHeight(3.5),
                                                    width: myHeight(3.5),
                                                    paddingTop: myHeight(0.55),
                                                }}>
                                                    <View style={{
                                                        width: myHeight(2.4), height: myHeight(2.4), borderRadius: myWidth(1)
                                                        , borderWidth: 1, borderColor: myColors.primaryL2, backgroundColor: myColors.primaryL5
                                                    }} />
                                                    {
                                                        twoWay &&
                                                        <Image style={{
                                                            height: myHeight(2.8),
                                                            width: myHeight(2.8),
                                                            resizeMode: 'contain',
                                                            tintColor: myColors.primaryT,
                                                            marginTop: -myHeight(2.8)
                                                        }} source={require('../assets/home_main/home/check.png')} />
                                                    }
                                                </View>
                                                {/* <Spacer paddingEnd={myWidth(0.3)} /> */}
                                                <Text style={[styles.textCommon,
                                                {
                                                    fontFamily: myFonts.bodyBold,
                                                    fontSize: myFontSize.body,

                                                }]}>{'Choose drop-off same as pick-up?'}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </>
                            }

                        </View>
                    </View>

                    <Spacer paddingT={myHeight(1.5)} />
                    {/* Contact */}
                    <View style={{}}>
                        <Text

                            style={styles.heading}>Contact</Text>


                        <View style={{ paddingHorizontal: myWidth(2) }}>
                            <Text

                                style={styles.tesxH}>Enter your contact number.</Text>
                            <Spacer paddingT={myHeight(0.8)} />
                            <View style={styles.inputCont}>

                                <TextInput placeholder="Contact - e.g 03XXXXXXXXX"
                                    autoCorrect={false}
                                    maxLength={11}
                                    keyboardType='numeric'

                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={contact} onChangeText={setContact}
                                    style={{
                                        padding: 0,
                                        backgroundColor: myColors.background,
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body


                                        // textAlign: 'center'
                                    }}
                                />
                            </View>

                        </View>
                    </View>

                    <Spacer paddingT={myHeight(2.5)} />

                    {
                        online ?
                            <>
                                {/* Contact */}
                                <View style={{}}>
                                    <Text

                                        style={styles.heading}>Offer</Text>


                                    <View style={{ paddingHorizontal: myWidth(2) }}>
                                        <Text

                                            style={styles.tesxH}>Enter your Offer.</Text>
                                        <Spacer paddingT={myHeight(0.8)} />
                                        <View style={[styles.backItem, { flexDirection: 'row', alignItems: 'center' }]}>

                                            <Text style={[styles.heading,
                                            {
                                                flex: 1,
                                                fontSize: myFontSize.body,


                                            }]}>Your Offer</Text>


                                            <View style={{
                                                flexDirection: 'row',
                                                // borderRadius: myWidth(2),
                                                width: myFontSize.body2 + myWidth(26),
                                                paddingVertical: myHeight(0),
                                                paddingHorizontal: myWidth(3),
                                                color: myColors.text,
                                                backgroundColor: myColors.background,
                                                borderBottomWidth: 0.7,
                                                borderColor: myColors.primaryT
                                            }}>

                                                <TextInput placeholder=""
                                                    autoCorrect={false}
                                                    placeholderTextColor={myColors.text}
                                                    selectionColor={myColors.primary}
                                                    cursorColor={myColors.primaryT}
                                                    editable={false}
                                                    style={{
                                                        width: 0,
                                                        padding: 0,
                                                        textAlignVertical: 'center',
                                                        fontFamily: myFonts.body,
                                                        fontSize: myFontSize.xxSmall,
                                                        backgroundColor: myColors.background,

                                                        // textAlign: 'center'
                                                    }}
                                                />
                                                <TextInput placeholder="Ex 5000"
                                                    maxLength={3242}
                                                    autoCorrect={false}
                                                    placeholderTextColor={myColors.offColor}
                                                    selectionColor={myColors.primary}
                                                    cursorColor={myColors.primaryT}
                                                    value={offer} onChangeText={setOffer}
                                                    keyboardType='numeric'
                                                    style={{
                                                        fontFamily: myFonts.body,
                                                        fontSize: myFontSize.xxSmall,
                                                        flex: 1,
                                                        padding: 0,
                                                        backgroundColor: myColors.background,

                                                        // textAlign: 'center'
                                                    }}
                                                />

                                                <TextInput placeholder=" Rs"
                                                    autoCorrect={false}
                                                    placeholderTextColor={myColors.text}
                                                    selectionColor={myColors.primary}
                                                    cursorColor={myColors.primaryT}
                                                    editable={false}
                                                    style={{

                                                        padding: 0,
                                                        textAlignVertical: 'center',
                                                        fontFamily: myFonts.body,
                                                        fontSize: myFontSize.xxSmall,
                                                        backgroundColor: myColors.background,

                                                        // textAlign: 'center'
                                                    }}
                                                />


                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <Spacer paddingT={myHeight(2.5)} />
                            </>
                            : null
                    }


                    {/* Seats */}
                    <View style={[styles.backItem, { flexDirection: 'row', alignItems: 'center' }]}>
                        <Text style={[styles.textCommon,
                        {
                            ...styles.heading,
                            color: myColors.text,
                            flex: 1,


                        }]}>Seats</Text>
                        <Spacer paddingT={myHeight(0.4)} />

                        {/* plus miunus*/}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity activeOpacity={0.75} onPress={() => {
                                if (seats > 1) {
                                    setSeats(seats - 1)
                                }
                            }}
                                style={{
                                    backgroundColor: myColors.primaryT,
                                    height: myHeight(2.7),
                                    width: myHeight(2.7),
                                    borderRadius: myHeight(3),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}  >
                                <Image style={
                                    {
                                        height: myHeight(1.5),
                                        width: myHeight(1.5),
                                        resizeMode: 'contain',
                                        transform: [{ rotate: '270deg' }]
                                    }
                                } source={require('../assets/startup/goL.png')} />
                            </TouchableOpacity>

                            <View style={{ minWidth: myWidth(14), alignItems: 'center' }}>

                                <Text numberOfLines={1} style={[styles.textCommon, {
                                    fontSize: myFontSize.body4,
                                    fontFamily: myFonts.heading,
                                }]}>{seats}</Text>

                            </View>

                            {/* plus */}
                            <TouchableOpacity activeOpacity={0.75} onPress={() => {

                                setSeats(seats + 1)

                            }} style={{
                                backgroundColor: myColors.primaryT,
                                height: myHeight(2.7),
                                width: myHeight(2.7),
                                borderRadius: myHeight(3),
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}  >
                                <Image style={
                                    {
                                        height: myHeight(1.5),
                                        width: myHeight(1.5),
                                        resizeMode: 'contain',
                                        transform: [{ rotate: '90deg' }]

                                    }
                                } source={require('../assets/startup/goL.png')} />
                            </TouchableOpacity>
                        </View>


                    </View>

                    <Spacer paddingT={myHeight(2.5)} />

                    {/* Days */}
                    {
                        online ? null
                            :
                            <>
                                <View style={{}}>

                                    <Text

                                        style={styles.heading}>Select Days</Text>



                                    <Spacer paddingT={myHeight(0.8)} />
                                    <DaysShow list={selectedDays} setList={setSelectedDays} />

                                </View>
                                <Spacer paddingT={myHeight(2.5)} />
                            </>
                    }

                    {
                        online ? null
                            :
                            <>
                                {/*Customer Pakages */}
                                <View>
                                    <Text style={styles.heading}>Billing Method</Text>
                                    <Spacer paddingT={myHeight(0.8)} />

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <CommonFaciPackage name={'Daily'} />
                                        <CommonFaciPackage name={'Weekly'} />
                                        <CommonFaciPackage name={'Monthly'} />
                                        <CommonFaciPackage name={'Yearly'} />
                                    </View>
                                </View>

                                <Collapsible collapsed={!packages}>
                                    <Spacer paddingT={myHeight(0.5)} />

                                    <View style={[styles.backItem, { flexDirection: 'row', alignItems: 'center' }]}>

                                        <Text style={[styles.heading,
                                        {
                                            flex: 1,
                                            fontSize: myFontSize.body,


                                        }]}>Your {packages} Offer</Text>


                                        <View style={{
                                            flexDirection: 'row',
                                            // borderRadius: myWidth(2),
                                            width: myFontSize.body2 + myWidth(26),
                                            paddingVertical: myHeight(0),
                                            paddingHorizontal: myWidth(3),
                                            color: myColors.text,
                                            backgroundColor: myColors.background,
                                            borderBottomWidth: 0.7,
                                            borderColor: myColors.primaryT
                                        }}>

                                            <TextInput placeholder=""
                                                autoCorrect={false}
                                                placeholderTextColor={myColors.text}
                                                selectionColor={myColors.primary}
                                                cursorColor={myColors.primaryT}
                                                editable={false}
                                                style={{
                                                    width: 0,
                                                    padding: 0,
                                                    textAlignVertical: 'center',
                                                    fontFamily: myFonts.body,
                                                    fontSize: myFontSize.xxSmall,
                                                    backgroundColor: myColors.background,

                                                    // textAlign: 'center'
                                                }}
                                            />
                                            <TextInput placeholder="Ex 5000"
                                                maxLength={3242}
                                                autoCorrect={false}
                                                placeholderTextColor={myColors.offColor}
                                                selectionColor={myColors.primary}
                                                cursorColor={myColors.primaryT}
                                                value={offer} onChangeText={setOffer}
                                                keyboardType='numeric'
                                                style={{
                                                    fontFamily: myFonts.body,
                                                    fontSize: myFontSize.xxSmall,
                                                    flex: 1,
                                                    padding: 0,
                                                    backgroundColor: myColors.background,

                                                    // textAlign: 'center'
                                                }}
                                            />

                                            <TextInput placeholder=" Rs"
                                                autoCorrect={false}
                                                placeholderTextColor={myColors.text}
                                                selectionColor={myColors.primary}
                                                cursorColor={myColors.primaryT}
                                                editable={false}
                                                style={{

                                                    padding: 0,
                                                    textAlignVertical: 'center',
                                                    fontFamily: myFonts.body,
                                                    fontSize: myFontSize.xxSmall,
                                                    backgroundColor: myColors.background,

                                                    // textAlign: 'center'
                                                }}
                                            />


                                        </View>
                                    </View>

                                </Collapsible>

                                <Spacer paddingT={myHeight(2.5)} />
                            </>
                    }

                    {/* Instruction */}
                    <View>
                        <Text style={[styles.heading,
                        {


                        }]}>Instructions</Text>
                        <Spacer paddingT={myHeight(1)} />
                        <TextInput placeholder="Add Instruction"
                            multiline={true}
                            autoCorrect={false}
                            maxLength={100}
                            numberOfLines={2}
                            placeholderTextColor={myColors.textL4}
                            selectionColor={myColors.primary}
                            cursorColor={myColors.primaryT}
                            value={instruction} onChangeText={setInstruction}
                            style={{
                                height: myFontSize.body * 2 + myHeight(8),
                                textAlignVertical: 'top',
                                borderRadius: myWidth(2),
                                width: '100%',
                                paddingBottom: ios ? myHeight(1.2) : myHeight(100) > 600 ? myHeight(0.8) : myHeight(0.1),
                                paddingTop: ios ? myHeight(1.2) : myHeight(100) > 600 ? myHeight(1.2) : myHeight(0.3),
                                fontSize: myFontSize.xxSmall,
                                color: myColors.text,
                                includeFontPadding: false,
                                fontFamily: myFonts.body,
                                paddingHorizontal: myWidth(3),
                                backgroundColor: myColors.background,
                                borderWidth: myHeight(0.1),
                                borderColor: myColors.dot,
                            }}
                        />
                    </View>
                    <Spacer paddingT={myHeight(3)} />
                </KeyboardAwareScrollView>

                <View style={{ backgroundColor: myColors.background, }}>
                    <View style={{ height: 1, backgroundColor: myColors.offColor }} />

                    <Spacer paddingT={myHeight(3)} />

                    <TouchableOpacity onPress={onSave}
                        activeOpacity={0.8}
                        style={{
                            width: myWidth(92), alignSelf: 'center', paddingVertical: myHeight(1.3),
                            borderRadius: myHeight(1.4), alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'row', backgroundColor: myColors.background,
                            borderWidth: myHeight(0.15), borderColor: myColors.textL4
                        }}>
                        <Text style={[styles.textCommon, {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.body3,
                            color: myColors.text
                        }]}>{online ? 'Book Now' : 'Generate Request'}</Text>
                    </TouchableOpacity>

                    <Spacer paddingT={myHeight(3)} />

                </View>

                {
                    showTimeModal &&
                    <CalenderDate show={setShowTimeModal} showVal={showTimeModal}
                        content={showTimeModal == 1 ? pickupTime : dropoffTime} value={checkTime} />
                }
                {errorMsg && <MyError message={errorMsg} />}

                {isLoading && <Loader />}
            </SafeAreaView>


            {
                showLoc ?
                    <Search selected={showLoc == 1 ? pickup : dropoff} setShowLoc={setShowLoc}
                        setSelected={showLoc == 1 ? setPickup : setDropoff} />
                    : null
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
    inputCont: {
        borderRadius: myWidth(1.5),
        flex: 1,
        paddingVertical: myHeight(0.7),
        paddingHorizontal: myWidth(3),
        color: myColors.text,
        borderWidth: myHeight(0.1),
        borderRadius: myWidth(2),
        backgroundColor: myColors.background,
        // borderWidth: 0.7,
        borderColor: myColors.dot
    },
    backItem: {
        paddingHorizontal: myWidth(4), width: '100%',
        paddingVertical: myHeight(0.85), borderRadius: myWidth(2),
        backgroundColor: myColors.background,
        borderWidth: myHeight(0.1), borderColor: myColors.dot,
        flexDirection: 'row', alignItems: 'center', marginVertical: myHeight(0.5)
    },
    heading: {
        fontSize: myFontSize.body4,
        fontFamily: myFonts.bodyBold,
        color: myColors.textL4,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
    tesxH: {
        fontSize: myFontSize.xxSmall,
        fontFamily: myFonts.bodyBold,
        // paddingHorizontal: myWidth(3),
        color: myColors.textL4,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
})