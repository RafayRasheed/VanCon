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
import { FirebaseUser } from '../functions/firebase';
import { setErrorAlert } from '../../redux/error_reducer';
import { Search } from './locations_screen';
import { CalenderDate } from './home.component/calender';
import { RFValue } from 'react-native-responsive-fontsize';
import { offers } from './home_data';
import { dataFullData, getDistanceFromRes } from '../functions/functions';
const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const RequestRide = ({ navigation, route }) => {
    const disptach = useDispatch()
    const preReq = route.params ? route.params.preReq : null
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

    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [showTimeModal, setShowTimeModal] = useState(false)
    const [showLoc, setShowLoc] = useState(false)


    const [pickup, setPickup] = useState(preReq ? preReq.pickup : null)
    const [dropoff, setDropoff] = useState(preReq ? preReq.dropoff : null)
    const [twoWay, setTwoWay] = useState(preReq ? preReq.twoWay : true)

    const [pickupTime, setPickupTime] = useState(preReq ? preReq.pickupTime : null)
    const [dropoffTime, setDropoffTime] = useState(preReq ? preReq.dropoffTime : null)


    const [selectedDays, setSelectedDays] = useState(preReq ? [...preReq.selectedDays] : [])
    const [seats, setSeats] = useState(preReq ? preReq.seats : 1)
    const [packages, setPackages] = useState(preReq ? preReq.packages : null)
    const [offer, setOffer] = useState(preReq ? preReq.offer : null)

    const [instruction, setInstruction] = useState(preReq ? preReq.instruction : null)


    useEffect(() => {

    }, [])
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
    function checkNumber() {
        if (contact) {
            if (contact.length == 11) {
                if (licence) {
                    if (licence.length == 15) {

                        return true
                    }
                    setErrorMsg('Invalid Licence Number')
                    return false
                }
                setErrorMsg('Invalid Licence Number')
                return false
            }
            setErrorMsg('Invalid Contact Number')
            return false
        }
        setErrorMsg('Please Add Contact Number')
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
        if (!pickupTime) {
            setErrorMsg('Please Select Pickup Time')
            return false
        }
        if (!dropoff) {
            setErrorMsg('Please Select Dropoff Address')
            return false
        }
        if (twoWay && !dropoffTime) {
            setErrorMsg('Please Select Dropoff Time')
            return false
        }
        if (!selectedDays.length) {
            setErrorMsg('Please Select Days')
            return false
        }
        if (!packages) {
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

                distance: string, actualDistance: distance,
                pickup, pickupTime, dropoff,
                dropoffTime, seats, selectedDays,
                packages, offer, instruction,
                status: preReq ? preReq.status : 1,
                name: profile.name,
                uid: profile.uid,
                sendDrivers: (preReq && preReq.sendDrivers) ? preReq.sendDrivers : [],
                did: null,
                driverName: null,
                driverContact: null,
                twoWay,
                unread: true,

            }
            console.log('New Profile', newProfile)

            database()
                .ref(`/requests/${profile.uid}/${id}`).update(newProfile).then(() => {

                    setIsLoading(false)
                    // navigation.goBack()
                    setTimeout(() => {
                        console.log(id)
                        navigation.replace('Search', { requestId: id, code: 2 })
                    }, 200)
                })
                .catch((er) => {
                    setIsLoading(false)

                    console.log('error on save newProfile', er)
                    setErrorMsg('Something Wrong')
                })
            return
            // setAddress(JSON.stringify(newProfile))
            FirebaseUser.doc(profile.uid)
                .update(newProfile)
                .then(() => {
                    setIsLoading(false)
                    disptach(setErrorAlert({ Title: "Profile Updated Successfully", Status: 2 }))
                    disptach(setProfile(newProfile))
                    navigation.goBack()



                }).catch(err => {
                    setErrorMsg('Something wrong')
                    console.log('Internal error while Updating a Restaurant')
                });


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

    async function chooseFile() {
        const options = {
            mediaType: 'photo',
            selectionLimit: 1,
        }
        // launchCamera(options, callback => {
        //     if (callback.assets) {
        //         console.log(callback.assets)
        //     }
        //     else if (callback.didCancel) {
        //         console.log('didCancel')
        //     }
        //     else if (callback.errorCode) {
        //         console.log('errorCode')
        //     }

        // });



    };


    const uploadImage = async (uri, name, i) => {
        const path = `images/drivers/${profile.uid}/${name}`
        storage()
            .ref(path)
            .putFile(uri)
            .then((s) => {
                storage().ref(path).getDownloadURL().then((uri) => {
                    if (name == 'vehicle') {

                        setVehicleImage(uri)
                        setImageLoading(null)
                        console.log('uri recieved background', uri)

                    } else {
                        // MenuImagesURI.push(uri)
                        // setMenuImagesURI(MenuImagesURI)
                        // console.log('uri recieved' + name)
                        if (i != null) {
                            let copy = [...MenuImages]
                            copy[i] = uri
                            setMenuImages(copy)

                            console.log('uri recieved ', name, typeof i)

                            setChange(!change)

                        } else {

                            let copy = [...MenuImages]
                            copy.push(uri)
                            setMenuImages(copy)
                            console.log('uri recieved ', name)

                        }
                        setImageLoading(null)

                    }

                }).catch((e) => {
                    setImageLoading(null)
                    setErrorMsg('Something Wrong')

                    console.log('er', e)

                })

            }).catch((e) => {
                setImageLoading(null)
                setErrorMsg('Something Wrong')

                console.log('er', e)

            })

        // try {
        //     await task;
        // } catch (e) {
        //     console.error(e);
        // }

    };

    const CommonFaciUnies = ({ name, small = false }) => {
        const fac = insideUniversities.findIndex(it => it == name) != -1
        return (
            <TouchableOpacity activeOpacity={0.75}
                onPress={() => {
                    if (fac) {
                        setInsideUniversities(insideUniversities.filter(it => it != name))
                    } else {
                        setInsideUniversities([name, ...insideUniversities])
                    }
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
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
                    {/* <Spacer paddingEnd={myWidth(0.3)} /> */}
                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.bodyBold,
                        fontSize: small ? myFontSize.body : myFontSize.xBody,

                    }]}>{name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
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

                <View style={{
                    flexDirection: 'row', paddingHorizontal: myWidth(4),
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: fac ? myColors.text2 : myColors.background
                    , borderRadius: myHeight(100), paddingVertical: myHeight(0.4),

                }}>


                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.bodyBold,
                        fontSize: myFontSize.body2,
                        // alignItems: 'center',
                        color: fac ? myColors.background : myColors.text

                    }]}>{name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    // For Days

    const CommonFaciDays = ({ name, setDailyDays, dailyDays }) => {
        const isAll = dailyDays.length == 7
        const fac = (name == 'All' && isAll) ? true : (dailyDays.findIndex(it => it == name) != -1 && !isAll)
        return (
            <TouchableOpacity disabled={isAll && name != 'All'} activeOpacity={0.75}
                onPress={() => {
                    if (name == 'All') {
                        setDailyDays(isAll ? [] : allDays)
                    }
                    else {
                        setDailyDays(fac ? dailyDays.filter(it => it != name) : [name, ...dailyDays])
                    }
                }}>
                {/* <View style={{ flexDirection: 'row', width: myWidth(23), alignItems: 'center', }}>
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
                        color: isAll && name != 'All' ? myColors.offColor : myColors.text

                    }]}>{name}</Text>
                </View> */}
                <View style={{
                    flexDirection: 'row', width: myWidth(21),
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: isAll && name != 'All' ? myColors.background : fac ? myColors.text2 : myColors.background
                    , borderRadius: myHeight(100), paddingVertical: myHeight(0.2),
                    marginHorizontal: myWidth(1), marginVertical: myHeight(0.5)
                }}>


                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.heading,
                        fontSize: myFontSize.body2,
                        // alignItems: 'center',
                        color: isAll && name != 'All' ? myColors.textL4 : fac ? myColors.background : myColors.text

                    }]}>{name}</Text>
                </View>
            </TouchableOpacity>
        )
    }
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
                    <View style={{ width: myHeight(2.3), height: myHeight(2.3), borderWidth: 1.5, borderColor: myColors.textL4 }} />
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
                {/* <Spacer paddingEnd={myWidth(0.3)} /> */}
                <Text style={[styles.textCommon,
                {
                    fontFamily: myFonts.bodyBold,
                    fontSize: myFontSize.body3,

                }]}>{name}</Text>
            </View>
        </TouchableOpacity>
    )

    const verifyLink = async () => {
        const text = '2'
        const isValid = text.toString().includes(('https' || 'http') && 'maps')
        //    (https|http)maps
        if (isValid) {
            setLocLink(text)
            return
        } else {

            setErrorMsg('Invalid Url')
        }

        // setLocLink(text);
    };




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
                                    setList(is ? dailyDays.filter(it2 => it2 != it) : [it, ...dailyDays])
                                } style={[styles.backItem, {
                                    backgroundColor: is ? myColors.primaryT : myColors.divider, width: myWidth(11.82), paddingVertical: myHeight(0.6),
                                    paddingHorizontal: myWidth(0), justifyContent: 'center'
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
    const YesNo = ({ fav, setFac }) => {
        return (
            <View style={{ width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>

                <TouchableOpacity activeOpacity={0.8} onPress={() =>
                    setFac(true)
                } style={[styles.backItem, {
                    backgroundColor: fav ? myColors.primaryT : myColors.divider,
                    paddingVertical: myHeight(0.6), width: myWidth(18),
                    paddingHorizontal: myWidth(0), justifyContent: 'center'
                }]}>


                    <Text numberOfLines={1}

                        style={{
                            fontSize: myFontSize.body,
                            fontFamily: myFonts.bodyBold,
                            color: fav ? myColors.background : myColors.text,
                            letterSpacing: myLetSpacing.common,
                            includeFontPadding: false,
                            padding: 0,
                        }}>Yes</Text>

                </TouchableOpacity>
                <Spacer paddingEnd={myWidth(2.5)} />

                <TouchableOpacity activeOpacity={0.8} onPress={() =>
                    setFac(false)
                } style={[styles.backItem, {
                    backgroundColor: !fav ? myColors.primaryT : myColors.background,
                    paddingVertical: myHeight(0.6), width: myWidth(18),
                    paddingHorizontal: myWidth(0), justifyContent: 'center'
                }]}>


                    <Text numberOfLines={1}

                        style={{
                            fontSize: myFontSize.body,
                            fontFamily: myFonts.bodyBold,
                            color: !fav ? myColors.background : myColors.text,
                            letterSpacing: myLetSpacing.common,
                            includeFontPadding: false,
                            padding: 0,
                        }}>No</Text>

                </TouchableOpacity>

            </View>
        )
    }
    const CommonFaci2 = ({ name, fac, setFAc, ImageSize = 0, ImageSrc = null }) => (
        <TouchableOpacity style={[styles.backItem, { backgroundColor: fac ? myColors.primaryT : myColors.background }]} activeOpacity={0.75}
            onPress={() => {
                setFAc(!fac)
            }}>
            {
                ImageSrc ?
                    <>
                        <Image style={{
                            width: ImageSize, height: ImageSize,
                            resizeMode: 'contain', marginTop: myHeight(0), tintColor: fac ? myColors.background : myColors.textL4
                        }}
                            source={ImageSrc} />


                        <Spacer paddingEnd={myWidth(1.5)} />
                    </>
                    : null
            }

            <Text

                style={{
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.bodyBold,
                    color: fac ? myColors.background : myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                }}>{name}</Text>

        </TouchableOpacity>
    )
    const CommonItem = ({ text, text2, items = [] }) => {
        return (
            <View style={{}}>
                <Text style={styles.heading}>text</Text>
                {
                    text2 ?
                        <Text style={styles.tesxH}>Amenities</Text>
                        : null
                }

                <Spacer paddingT={myHeight(1)} />

                {
                    items.map((item, i) => {
                        if (item == null) {
                            return
                        }
                        return (

                            <View key={i} style={styles.backItem}>
                                <Image style={{
                                    width: myHeight(1.75), height: myHeight(1.75),
                                    resizeMode: 'contain', marginTop: -myHeight(0.2), tintColor: myColors.textL4
                                }}
                                    source={require('../assets/home_main/home/seatSF.png')} />
                                <Spacer paddingEnd={myWidth(1.8)} />

                                <Text

                                    style={{
                                        fontSize: myFontSize.body,
                                        fontFamily: myFonts.bodyBold,
                                        color: myColors.text,
                                        letterSpacing: myLetSpacing.common,
                                        includeFontPadding: false,
                                        padding: 0,
                                    }}>{'drive'}</Text>
                            </View>
                        )
                    })
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
                            height: myHeight(4),
                            width: myHeight(4),
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
                        }]}>
                            Book Ride
                        </Text>
                    </View>
                    {/* <Spacer paddingT={myHeight(1.5)} /> */}

                </View>
                {/* <View style={{ height: myHeight(0.6), backgroundColor: myColors.divider }} /> */}

                <KeyboardAwareScrollView contentContainerStyle={{ paddingHorizontal: myWidth(4) }}>

                    <Spacer paddingT={myHeight(1.5)} />
                    {/* Aminities */}

                    {/* Pickup Details */}
                    <View>

                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.xBody,

                        }]}>Pickup Details</Text>
                        <Spacer paddingT={myHeight(0.6)} />
                        <TouchableOpacity onPress={() => { setShowLoc(1) }}
                            activeOpacity={0.8}
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                // borderWidth: myHeight(0.15), borderColor: myColors.primaryT
                            }}>
                            <Text numberOfLines={2} style={[styles.textCommon, {
                                fontFamily: myFonts.heading,
                                fontSize: myFontSize.body3,
                                color: myColors.text
                            }]}>Address: <Text style={[styles.textCommon, {
                                flex: 1,
                                fontFamily: myFonts.bodyBold,
                                fontSize: myFontSize.body,
                                paddingTop: RFValue(3.5),
                                color: pickup ? myColors.text : myColors.textL5,
                            }]}>{pickup ? `${pickup.name}` : 'Tap to Select'}</Text></Text>



                        </TouchableOpacity>
                        <Spacer paddingT={myHeight(0.8)} />

                        <TouchableOpacity onPress={() => { setShowTimeModal(1) }}
                            activeOpacity={0.8}
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                // borderWidth: myHeight(0.15), borderColor: myColors.primaryT
                            }}>
                            <Text style={[styles.textCommon, {
                                fontFamily: myFonts.heading,
                                fontSize: myFontSize.body3,
                                color: myColors.text
                            }]}>Time: </Text>

                            <Text numberOfLines={3} style={[styles.textCommon, {
                                flex: 1,
                                fontFamily: myFonts.bodyBold,
                                fontSize: myFontSize.body,
                                paddingTop: RFValue(1.5),
                                color: pickupTime ? myColors.text : myColors.textL5,
                            }]}>{pickupTime ? `${pickupTime.time}` : 'Tap to Select'}</Text>

                        </TouchableOpacity>
                    </View>

                    <Spacer paddingT={myHeight(1.5)} />
                    {/* Dropoff Details */}
                    <View>

                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.xBody,

                        }]}>Dropoff Details</Text>
                        <Spacer paddingT={myHeight(0.6)} />

                        <TouchableOpacity onPress={() => { setShowLoc(2) }}
                            activeOpacity={0.8}
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                // borderWidth: myHeight(0.15), borderColor: myColors.primaryT
                            }}>
                            <Text numberOfLines={2} style={[styles.textCommon, {
                                fontFamily: myFonts.heading,
                                fontSize: myFontSize.body3,
                                color: myColors.text
                            }]}>Address: <Text style={[styles.textCommon, {
                                flex: 1,
                                fontFamily: myFonts.bodyBold,
                                fontSize: myFontSize.body,
                                paddingTop: RFValue(3.5),
                                color: dropoff ? myColors.text : myColors.textL5,
                            }]}>{dropoff ? `${dropoff.name}` : 'Tap to Select'}</Text></Text>



                        </TouchableOpacity>

                        <Spacer paddingT={myHeight(0.8)} />
                        {/* Time */}
                        <Collapsible collapsed={!twoWay}>
                            <TouchableOpacity onPress={() => { setShowTimeModal(2) }}
                                activeOpacity={0.8}
                                style={{
                                    width: '100%',
                                    flexDirection: 'row',
                                    // borderWidth: myHeight(0.15), borderColor: myColors.primaryT
                                }}>
                                <Text style={[styles.textCommon, {
                                    fontFamily: myFonts.heading,
                                    fontSize: myFontSize.body3,
                                    color: myColors.text
                                }]}>Time: </Text>

                                <Text numberOfLines={3} style={[styles.textCommon, {
                                    flex: 1,
                                    fontFamily: myFonts.bodyBold,
                                    fontSize: myFontSize.body,
                                    paddingTop: RFValue(1.5),
                                    color: dropoffTime ? myColors.text : myColors.textL5,
                                }]}>{dropoffTime ? `${dropoffTime.time}` : 'Tap to Select'}</Text>

                            </TouchableOpacity>
                            <Spacer paddingT={myHeight(0.5)} />
                        </Collapsible>

                        {/* Two Way */}
                        <TouchableOpacity activeOpacity={0.75}
                            onPress={() => {
                                setTwoWay(!twoWay)
                            }}>
                            <View style={{ paddingStart: myWidth(0.5), flexDirection: 'row', alignItems: 'center', }}>
                                <View style={{
                                    height: myHeight(3.5),
                                    width: myHeight(3.5),
                                    paddingTop: myHeight(0.75)
                                }}>
                                    <View style={{ width: myHeight(2), height: myHeight(2), borderWidth: 1.5, borderColor: myColors.textL4 }} />
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
                                    fontSize: myFontSize.body2,

                                }]}>{'Drop to Pickup'}</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                    <Spacer paddingT={myHeight(0.8)} />
                    {/* Seats */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.xBody,
                            flex: 1,


                        }]}>Passenger</Text>
                        <Spacer paddingT={myHeight(0.4)} />

                        {/* plus miunus*/}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity activeOpacity={0.75} onPress={() => {
                                if (seats > 1) {
                                    setSeats(seats - 1)
                                }
                            }}>
                                <Image style={{
                                    height: myHeight(4),
                                    width: myHeight(4),
                                    marginTop: myHeight(0.7),
                                    resizeMode: 'contain',
                                }} source={require('../assets/home_main/home/minusBtn.png')} />
                            </TouchableOpacity>

                            <View style={{ minWidth: myWidth(17), alignItems: 'center' }}>

                                <Text numberOfLines={1} style={[styles.textCommon, {
                                    fontSize: myFontSize.medium,
                                    fontFamily: myFonts.body,
                                }]}>{seats}</Text>

                            </View>

                            {/* plus */}
                            <TouchableOpacity activeOpacity={0.75} onPress={() => {

                                setSeats(seats + 1)

                            }}>
                                <Image style={{
                                    height: myHeight(4),
                                    width: myHeight(4),
                                    marginTop: myHeight(0.7),
                                    resizeMode: 'contain',
                                }} source={require('../assets/home_main/home/plusBtn.png')} />
                            </TouchableOpacity>
                        </View>


                    </View>
                    <Spacer paddingT={myHeight(0.8)} />
                    {/* Days */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.xBody,


                        }]}>Select Days</Text>
                        <Spacer paddingT={myHeight(0.2)} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            <CommonFaciDays dailyDays={selectedDays} setDailyDays={setSelectedDays} name={'All'} />

                            {

                                allDays.map((it, i) => <CommonFaciDays key={i} dailyDays={selectedDays} setDailyDays={setSelectedDays} name={it} />)
                            }

                        </View>
                    </View>



                    <Spacer paddingT={myHeight(1.6)} />
                    {/*Customer Pakages */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.xBody,

                        }]}>Select Paid</Text>
                        <Spacer paddingT={myHeight(0.8)} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <CommonFaciPackage name={'Weekly'} />
                            <CommonFaciPackage name={'Monthly'} />
                            <CommonFaciPackage name={'Yearly'} />
                        </View>
                    </View>

                    <Collapsible style={{ paddingTop: myHeight(2), flexDirection: 'row', alignItems: 'center' }} collapsed={!packages}>

                        <Text style={[styles.textCommon,
                        {
                            flex: 1,
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.body4,

                        }]}>Your {packages} Offer</Text>


                        <View style={{
                            flexDirection: 'row',
                            borderRadius: myWidth(2),
                            width: myFontSize.body2 + myWidth(26),
                            paddingVertical: myHeight(0),
                            paddingHorizontal: myWidth(3),
                            color: myColors.text,
                            backgroundColor: myColors.offColor7,
                            borderWidth: 0.7,
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
                                    backgroundColor: myColors.offColor7,

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
                                    backgroundColor: myColors.offColor7,

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
                                    backgroundColor: myColors.offColor7,

                                    // textAlign: 'center'
                                }}
                            />


                        </View>

                    </Collapsible>

                    <Spacer paddingT={myHeight(1.2)} />

                    {/* Instruction */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.xBody,

                        }]}>Instructions</Text>
                        <Spacer paddingT={myHeight(1)} />
                        <TextInput placeholder="Add Instruction"
                            multiline={true}
                            autoCorrect={false}
                            maxLength={100}
                            numberOfLines={2}
                            placeholderTextColor={myColors.offColor}
                            selectionColor={myColors.primary}
                            cursorColor={myColors.primaryT}
                            value={instruction} onChangeText={setInstruction}
                            style={{
                                height: myFontSize.body * 2 + myHeight(6),
                                textAlignVertical: 'top',
                                borderRadius: myWidth(2),
                                width: '100%',
                                paddingBottom: ios ? myHeight(1.2) : myHeight(100) > 600 ? myHeight(0.8) : myHeight(0.1),
                                paddingTop: ios ? myHeight(1.2) : myHeight(100) > 600 ? myHeight(1.2) : myHeight(0.3),
                                fontSize: myFontSize.body,
                                color: myColors.text,
                                includeFontPadding: false,
                                fontFamily: myFonts.body,
                                paddingHorizontal: myWidth(3),
                                backgroundColor: myColors.offColor7
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
                            borderWidth: myHeight(0.15), borderColor: myColors.text
                        }}>
                        <Text style={[styles.textCommon, {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.body3,
                            color: myColors.textL4
                        }]}>Book Now</Text>
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
    backItem: {
        paddingHorizontal: myWidth(5), width: '100%',
        paddingVertical: myHeight(0.7), borderRadius: myWidth(2),
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
        paddingHorizontal: myWidth(3),
        color: myColors.textL4,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
})