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
const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const RequestRide = ({ navigation }) => {
    const disptach = useDispatch()
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


    const [vehicleName, setVehicleName] = useState(profile.vehicleName ? profile.vehicleName : null)
    const [vehicleModal, setVehicleModal] = useState(profile.vehicleModal ? profile.vehicleModal : null)
    const [description, SetDescription] = useState(profile.description)
    const [vehicleImage, setVehicleImage] = useState(profile.vehicleImage ? profile.vehicleImage : null);
    const [vehicleNum, setVehicleNum] = useState(profile.vehicleNum)
    const [vehicleSeats, setVehicleSeats] = useState(profile.vehicleSeats)

    const [contact, setContact] = useState(profile.contact)
    const [licence, setLicence] = useState(profile.licence)

    const [packages, setPackages] = useState(profile.packages ? [...profile.packages] : [])
    const [dailyDays, setDailyDays] = useState(profile.dailyDays ? [...profile.dailyDays] : allDays)
    const [isOneRide, setOneRide] = useState(profile.isOneRide ? profile.isOneRide : false)
    const [oneRideDays, setOneRideDays] = useState(profile.oneRideDays ? [...profile.oneRideDays] : allDays)

    const [isInsideUni, setIsInsideUni] = useState(profile.isInsideUni ? profile.isInsideUni : false)
    const [insideShift, setInsideShift] = useState(profile.insideShift ? profile.insideShift : ['Morning', 'Evening'])
    const [insideUniversities, setInsideUniversities] = useState(profile.insideUniversities ? [...profile.insideUniversities] : [])
    const [allUnies, setAllUnies] = useState([])

    const [departCharges, SetDepartCharges] = useState(profile.departCharges ? profile.departCharges : null)
    const [DeliveryFee, SetDeliveryFee] = useState(profile.deliveryCharges ? profile.deliveryCharges.toString() : null)
    const [DeliveryTime, SetDeliveryTime] = useState(profile.delivery)
    const [locLink, setLocLink] = useState(profile.locationLink);
    const [MenuImages, setMenuImages] = useState(profile.menu ? profile.menu : [])
    const [timmings, setTimmings] = useState(profile.timmings ? profile.timmings : temp)

    const [imageLoading, setImageLoading] = useState(null)

    const [showTimeModal, setShowTimeModal] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [change, setChange] = useState(null)
    const [showChangeModal, setShowChangeModal] = useState(false)
    const [selectedItem, setSelectedItems] = useState(profile.routes ? getInitialRoutes() : [...TimeAndLoc])
    const [showLoc, setShowLoc] = useState(false)

    function getInitialRoutes() {
        if (profile.routes.length == TimeAndLoc.length) {
            return [...profile.routes]
        }
        const FullArr = TimeAndLoc
        profile.routes.map(it => {
            const index = TimeAndLoc.findIndex(it2 => it2.id == it.id)
            FullArr[index] = { ...it }
        })

        return (FullArr)

    }
    useEffect(() => {
        firestore().collection('universities').doc(profile.city).get().then((result) => {
            if (result.exists) {

                const uniii = result.data()
                let AllUnies = []
                for (const [key, value] of Object.entries(uniii)) {
                    AllUnies.push(value)
                }
                setAllUnies(AllUnies)

            }

        }).catch((ERR) => {
            console.log('ERROR ON getAreasLocations', ERR)
        })
    }, [])
    function checkPackages() {
        if (packages.length) {
            // if (Delivery) {
            //     if (DeliveryFee) {
            //         if (isNaN(DeliveryFee) || DeliveryFee < 0) {
            //             setErrorMsg('Invalid Delivery Charges')
            //             return false
            //         }
            //     }
            //     else {

            //         setErrorMsg('Please Enter Delivery Charges')
            //         return false
            //     }
            //     if (DeliveryTime) {
            //         if (isNaN(DeliveryTime) || DeliveryTime < 0) {
            //             setErrorMsg('Invalid DeliveryTime')
            //             return false
            //         }
            //     }
            //     else {

            //         setErrorMsg('Please Enter Delivery Time in Minutes')
            //         return false
            //     }
            // }


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
    function checkDepartCharges() {
        if (departCharges) {
            if (isNaN(departCharges) || departCharges < 0) {
                setErrorMsg('Invalid Depart Charges')
                return false
            }
            return true
        }
        setErrorMsg('Please Enter Depart Charges')
        return false

    }
    function checkData() {

        if (!vehicleImage) {
            setErrorMsg('Please Upload Car Image')
            return false
        }

        if (!checkNameAndModal()) {
            return false
        }
        if (!checkNumAndModal()) {
            return false
        }
        if (!checkDescription()) {
            return false
        }
        if (!checkNumber()) {
            return false
        }
        if (!checkPackages()) {
            return false
        }

        if (!dailyDays.length) {
            setErrorMsg('Please Select Your Ride Days')
            return false
        }

        if (!checkRoutes()) {
            return false
        }
        if (isInsideUni && !insideUniversities.length) {
            setErrorMsg('Please Select At Least One Univesity')
            return false
        }
        if (isInsideUni && !(checkDepartCharges())) {
            return false
        }
        if (isOneRide && !oneRideDays.length) {
            setErrorMsg('Please Select One Time Ride Days')
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
            const newProfile = {
                ...profile,
                description,
                packages,
                vehicleImage,
                vehicleName,
                vehicleModal,
                vehicleNum,
                vehicleSeats,
                licence,
                contact,
                dailyDays,
                routes: formatRoutes(),
                isOneRide,
                oneRideDays,
                isInsideUni,
                insideUniversities,
                departCharges,



            }

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

    async function chooseFileMenu(i) {
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
        const fac = packages.findIndex(it => it == name) != -1
        return (
            <TouchableOpacity activeOpacity={0.75}
                onPress={() => {
                    if (fac) {
                        setPackages(packages.filter(it => it != name))
                    } else {
                        setPackages([name, ...packages])
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
                        fontSize: myFontSize.xBody,

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
                <View style={{ flexDirection: 'row', width: myWidth(23), alignItems: 'center', }}>
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
                        fontSize: myFontSize.xBody,
                        color: isAll && name != 'All' ? myColors.offColor : myColors.text

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
    function onChangeImage(param) {
        chooseFileMenu(param)
    }
    function onViewImage() {
        navigation.navigate("ImageViewer", { images: [{ uri: vehicleImage }], i: 0 })
    }


    function onPaste() {
        if (locLink) {
            setLocLink(null)
            return
        }
        verifyLink()
    }

    const TimingsCom = ({ i }) => {
        const single = timmings[i]
        return (
            <View key={i} style={{ marginVertical: myHeight(1), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.textCommon,
                {
                    flex: 1,
                    fontFamily: myFonts.body,
                    fontSize: myFontSize.xxBody,
                    color: myColors.text,
                    textAlignVertical: 'center',
                    // marginTop: -myHeight(0.5)

                }]}>{single.day}</Text>


                {
                    single.open &&

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <TouchableOpacity activeOpacity={0.7} onPress={() => {
                            setShowTimeModal({ i, start: true, current: single.startCurrent })
                        }} style={{
                            paddingVertical: myHeight(0.8), paddingHorizontal: myWidth(2),
                            backgroundColor: myColors.offColor7, borderRadius: 7
                        }}>
                            <Text numberOfLines={1} style={[styles.textCommon,
                            {
                                fontFamily: myFonts.bodyBold,
                                fontSize: myFontSize.body,
                                minWidth: myFontSize.body + myWidth(13),
                                textAlign: 'center',
                                color: single.startTime ? myColors.text : myColors.textL4

                            }]}>{single.startTime ? single.startTime : 'SELECT'}</Text>
                        </TouchableOpacity>

                        <Spacer paddingEnd={myWidth(1)} />
                        <Text numberOfLines={1} style={[styles.textCommon,
                        {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.body,

                        }]}>-</Text>
                        <Spacer paddingEnd={myWidth(1)} />

                        <TouchableOpacity activeOpacity={0.7} onPress={() => {
                            setShowTimeModal({ i, start: false, current: single.endCurrent })
                        }} style={{

                            paddingVertical: myHeight(0.8), paddingHorizontal: myWidth(2),
                            backgroundColor: myColors.offColor7, borderRadius: 7
                        }}>
                            <Text numberOfLines={1} style={[styles.textCommon,
                            {
                                fontFamily: myFonts.bodyBold,
                                fontSize: myFontSize.body,
                                minWidth: myFontSize.body + myWidth(13),
                                textAlign: 'center',
                                color: single.endTime ? myColors.text : myColors.textL4

                            }]}>{single.endTime ? single.endTime : 'SELECT'}</Text>
                        </TouchableOpacity>
                    </View>

                }


                <Spacer paddingEnd={myWidth(4)} />

                {/* Button */}
                <TouchableOpacity activeOpacity={0.7}
                    onPress={() => {
                        const copy = [...timmings]
                        copy[i].open = !single.open

                        setTimmings(copy)
                        setChange(!change)


                    }} style={{
                        paddingVertical: myHeight(0.8), paddingHorizontal: myWidth(4),
                        borderRadius: 5,
                        backgroundColor: single.open ? myColors.primaryT : 'red',
                    }}>
                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.body,
                        fontSize: myFontSize.body,
                        color: myColors.background

                    }]}>{single.open ? 'Open' : 'Close'}</Text>

                </TouchableOpacity>


            </View>
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

    function checkTime(val, date, content) {
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


    return (
        <>

            <SafeAreaView style={{ flex: 1, backgroundColor: myColors.background }}>
                <StatusbarH />
                {/* Top */}
                <View>
                    <Spacer paddingT={myHeight(1.5)} />
                    <View style={{ paddingEnd: myWidth(4), flexDirection: 'row', alignItems: 'center' }}>
                        {/* Search */}

                        {/* Arrow */}
                        <TouchableOpacity activeOpacity={0.7}
                            onPress={() => navigation.goBack()} style={{ paddingHorizontal: myWidth(4), }}>
                            <Image style={{
                                height: myHeight(2.4),
                                width: myHeight(2.4),
                                resizeMode: 'contain',
                                tintColor: myColors.textL0
                            }} source={require('../assets/home_main/home/back.png')} />
                        </TouchableOpacity>
                        {/* <Spacer paddingEnd={myWidth(2.5)} /> */}
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2
                        }]}>
                            Driver Details
                        </Text>
                    </View>
                    <Spacer paddingT={myHeight(1.5)} />

                    <View style={{ height: myHeight(0.6), backgroundColor: myColors.divider }} />
                </View>
                <KeyboardAwareScrollView
                    // scrollEnabled={isEditMode} 
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: myWidth(4) }} showsVerticalScrollIndicator={false}>


                    <Spacer paddingT={myHeight(1.5)} />
                    {/* Background Image */}
                    <TouchableOpacity disable={imageLoading == 'vehicle'}
                        activeOpacity={0.75} onPress={() => {
                            // if (vehicleImage) {
                            //     setShowChangeModal(true)
                            // }
                            // else {
                            //     chooseFile()
                            // }
                            chooseFile()

                            // onChangeImage()

                        }}
                        style={{
                            height: myHeight(20), justifyContent: 'center', alignItems: 'center',
                            borderRadius: myWidth(4), backgroundColor: myColors.offColor7
                        }}>
                        {
                            imageLoading == 'vehicle' ?
                                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: myColors.offColor7 }} >
                                    <Text style={[styles.textCommon,
                                    {
                                        fontFamily: myFonts.body,
                                        fontSize: myFontSize.body,
                                        textAlign: 'center'

                                    }]}>Loading...</Text>
                                </View>

                                :

                                vehicleImage ?
                                    <ImageUri width={'100%'} height={'100%'} resizeMode='cover' borderRadius={0} uri={vehicleImage} />
                                    :
                                    <View>

                                        <Text style={[styles.textCommon,
                                        {
                                            fontFamily: myFonts.body,
                                            fontSize: myFontSize.body4,

                                        }]}>
                                            Upload Vehicle Image *
                                        </Text>
                                        <Text style={[styles.textCommon,
                                        {
                                            fontFamily: myFonts.body,
                                            fontSize: myFontSize.body,
                                            textAlign: 'center'

                                        }]}>
                                            (maximum size 1 MB)
                                        </Text>
                                    </View>
                        }

                    </TouchableOpacity>


                    <Spacer paddingT={myHeight(2.7)} />
                    {/* Vehicle Details */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Vehicle Details *</Text>
                        <Spacer paddingT={myHeight(1)} />
                        {/*Vehicle Name & Modal Year*/}

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                borderRadius: myWidth(1.5),
                                flex: 1,
                                paddingVertical: myHeight(0.5),
                                paddingHorizontal: myWidth(3),
                                color: myColors.text,
                                backgroundColor: myColors.offColor7,
                                // borderWidth: 0.7,
                                // borderColor: myColors.primaryT
                            }}>

                                <TextInput placeholder="Vehicle Name Ex HiRoof"
                                    autoCorrect={false}
                                    maxLength={35}
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={vehicleName} onChangeText={setVehicleName}
                                    style={{
                                        padding: 0,
                                        backgroundColor: myColors.offColor7,
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body


                                        // textAlign: 'center'
                                    }}
                                />

                            </View>
                            <Spacer paddingEnd={myWidth(2)} />
                            <View style={{
                                borderRadius: myWidth(1.5),
                                width: myWidth(30),
                                paddingVertical: myHeight(0.5),
                                paddingHorizontal: myWidth(3),
                                color: myColors.text,
                                backgroundColor: myColors.offColor7,
                                // borderWidth: 0.7,
                                // borderColor: myColors.primaryT
                            }}>

                                <TextInput placeholder="Modal Year"
                                    autoCorrect={false} maxLength={4}
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={vehicleModal} onChangeText={setVehicleModal}
                                    keyboardType='numeric'
                                    style={{

                                        padding: 0,
                                        backgroundColor: myColors.offColor7,
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body

                                        // textAlign: 'center'
                                    }}
                                />


                            </View>



                        </View>
                        <Spacer paddingT={myHeight(1)} />
                        {/* Number Plate &  Capacity*/}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                borderRadius: myWidth(1.5),
                                flex: 1,
                                paddingVertical: myHeight(0.5),
                                paddingHorizontal: myWidth(3),
                                color: myColors.text,
                                backgroundColor: myColors.offColor7,
                                // borderWidth: 0.7,
                                // borderColor: myColors.primaryT
                            }}>

                                <TextInput placeholder="Vehicle Number Ex MKV-150"
                                    autoCorrect={false}
                                    maxLength={35}
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={vehicleNum} onChangeText={setVehicleNum}
                                    style={{
                                        padding: 0,
                                        backgroundColor: myColors.offColor7,
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body


                                        // textAlign: 'center'
                                    }}
                                />

                            </View>

                            <Spacer paddingEnd={myWidth(2)} />


                            <View style={{
                                borderRadius: myWidth(1.5),
                                width: myWidth(25),
                                paddingVertical: myHeight(0.5),
                                paddingHorizontal: myWidth(3),
                                color: myColors.text,
                                backgroundColor: myColors.offColor7,
                                // borderWidth: 0.7,
                                // borderColor: myColors.primaryT
                            }}>

                                <TextInput placeholder="Capacity"
                                    autoCorrect={false} maxLength={4}
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={vehicleSeats} onChangeText={setVehicleSeats}
                                    keyboardType='numeric'
                                    style={{

                                        padding: 0,
                                        backgroundColor: myColors.offColor7,
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body

                                        // textAlign: 'center'
                                    }}
                                />


                            </View>



                        </View>
                        <Spacer paddingT={myHeight(1)} />
                        {/* Licence & Contact */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                borderRadius: myWidth(1.5),
                                flex: 1,
                                paddingVertical: myHeight(0.5),
                                paddingHorizontal: myWidth(3),
                                color: myColors.text,
                                backgroundColor: myColors.offColor7,
                                // borderWidth: 0.7,
                                // borderColor: myColors.primaryT
                            }}>

                                <TextInput placeholder="Driving Licence No"
                                    autoCorrect={false}
                                    keyboardType='numeric'
                                    maxLength={15}
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={licence} onChangeText={setLicence}
                                    style={{
                                        padding: 0,
                                        backgroundColor: myColors.offColor7,
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body


                                        // textAlign: 'center'
                                    }}
                                />


                            </View>
                            <Spacer paddingEnd={myWidth(2)} />
                            <View style={{
                                borderRadius: myWidth(1.5),
                                width: myWidth(28),
                                flex: 0.7,
                                paddingVertical: myHeight(0.5),
                                paddingHorizontal: myWidth(3),
                                color: myColors.text,
                                backgroundColor: myColors.offColor7,
                                // borderWidth: 0.7,
                                // borderColor: myColors.primaryT
                            }}>

                                <TextInput placeholder="Contact No Ex 03"
                                    autoCorrect={false}
                                    maxLength={11}
                                    keyboardType='numeric'

                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={contact} onChangeText={setContact}
                                    style={{
                                        padding: 0,
                                        backgroundColor: myColors.offColor7,
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body


                                        // textAlign: 'center'
                                    }}
                                />

                            </View>



                        </View>

                    </View>
                    <Spacer paddingT={myWidth(2.5)} />

                    {/* Description */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Description *</Text>
                        <Spacer paddingT={myHeight(1)} />
                        <TextInput placeholder="About yourself & services"
                            multiline={true}
                            autoCorrect={false}
                            maxLength={100}
                            numberOfLines={2}
                            placeholderTextColor={myColors.offColor}
                            selectionColor={myColors.primary}
                            cursorColor={myColors.primaryT}
                            value={description} onChangeText={SetDescription}
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


                    <Spacer paddingT={myHeight(2)} />
                    {/*Customer Pakages */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Customer Packages *</Text>
                        <Spacer paddingT={myHeight(0.8)} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                            <CommonFaciPackage name={'Weekly'} />
                            <CommonFaciPackage name={'Monthly'} />
                            <CommonFaciPackage name={'Yearly'} />
                        </View>
                    </View>

                    <Spacer paddingT={myHeight(1.5)} />

                    {/*Ride Informatons */}
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,


                        }]}>Ride Informatons *</Text>
                        <Spacer paddingT={myHeight(0.1)} />
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.body3,


                        }]}>Select Days</Text>
                        <Spacer paddingT={myHeight(0.2)} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            <CommonFaciDays dailyDays={dailyDays} setDailyDays={setDailyDays} name={'All'} />

                            {

                                allDays.map(it => <CommonFaciDays dailyDays={dailyDays} setDailyDays={setDailyDays} name={it} />)
                            }

                        </View>
                        <Spacer paddingT={myHeight(0.8)} />

                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.body3,


                        }]}>Select current routes against time at least 1</Text>
                        <Spacer paddingT={myHeight(0.2)} />
                        {
                            selectedItem.map((it, i) => {
                                return (
                                    <View key={i} style={{ marginVertical: myHeight(0.0), }}>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                            <Text style={[styles.textCommon,
                                            {
                                                fontFamily: myFonts.headingBold,
                                                fontSize: myFontSize.body,


                                            }]}>{it.time}</Text>

                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                                <TouchableOpacity activeOpacity={0.7}
                                                    onPress={() => {
                                                        setShowLoc({ ...it, index: i })

                                                    }} style={{
                                                        paddingVertical: myHeight(0.7), paddingHorizontal: myWidth(3),
                                                        borderRadius: 5,
                                                        // backgroundColor: myColors.primaryT,
                                                    }}>
                                                    <Text style={[styles.textCommon,
                                                    {
                                                        fontFamily: myFonts.heading,
                                                        fontSize: myFontSize.body,
                                                        color: myColors.primaryT

                                                    }]}>{it.locations.length ? `(${it.locations.length}) Edit Locations` : 'Select Locations'}</Text>

                                                </TouchableOpacity>
                                                <Spacer paddingEnd={myWidth(2)} />
                                                <TouchableOpacity activeOpacity={0.7}
                                                    onPress={() => {
                                                        selectedItem[i] = { ...selectedItem[i], show: !it.show }
                                                        setSelectedItems([...selectedItem])

                                                    }} style={{ width: myWidth(1) + myHeight(1.6), paddingVertical: myHeight(0.5) }} disabled={it.locations.length == 0}>
                                                    {
                                                        it.locations.length ?

                                                            <Image style={{
                                                                height: myHeight(1.8),
                                                                width: myHeight(1.8),
                                                                resizeMode: 'contain',
                                                                tintColor: myColors.primaryT,
                                                                paddingHorizontal: myWidth(1),
                                                                transform: [{ rotate: it.show ? '270deg' : '90deg' }]

                                                            }} source={require('../assets/home_main/home/go.png')} />
                                                            : null
                                                    }
                                                </TouchableOpacity>
                                            </View>

                                        </View>
                                        <Collapsible collapsed={!it.show} style={{}}>
                                            {
                                                it.locations.map((loc, j) =>
                                                    <View style={{ flexDirection: 'row', paddingVertical: myHeight(0.65) }}>
                                                        <Text style={[styles.textCommon, {
                                                            width: myWidth(0.2) + myFontSize.body * 2,
                                                            fontFamily: myFonts.bodyBold,
                                                            fontSize: myFontSize.xxSmall,
                                                        }]}>  {j + 1}.</Text>
                                                        <TouchableOpacity disabled activeOpacity={0.75} style={{
                                                            backgroundColor: myColors.background,
                                                            flex: 1,
                                                            paddingEnd: myWidth(3),

                                                        }}
                                                            onPress={() => null}>
                                                            <Text numberOfLines={2} style={[styles.textCommon, {
                                                                // flex: 1,
                                                                fontFamily: myFonts.body,
                                                                fontSize: myFontSize.xxSmall,
                                                            }]}>{loc.name}</Text>
                                                        </TouchableOpacity>
                                                        <Spacer paddingEnd={myWidth(2)} />

                                                        <TouchableOpacity activeOpacity={0.7}
                                                            onPress={() => {
                                                                selectedItem[i] = { ...selectedItem[i], locations: selectedItem[i].locations.filter(it => it.id != loc.id) }
                                                                setSelectedItems([...selectedItem])

                                                            }} style={{ width: myWidth(1) + myHeight(1.6), paddingHorizontal: myWidth(0), paddingTop: myHeight(0.8) }} >
                                                            {


                                                                <Image style={{
                                                                    height: myHeight(1.6),
                                                                    width: myHeight(1.6),
                                                                    resizeMode: 'contain',
                                                                    tintColor: myColors.primaryT,
                                                                    paddingHorizontal: myWidth(1),

                                                                }} source={require('../assets/account/close.png')} />

                                                            }
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            }
                                        </Collapsible>
                                    </View>
                                )
                            })
                        }

                        {/* Inside University */}
                        <Spacer paddingT={myHeight(0.8)} />
                        <CommonFaci fac={isInsideUni} setFAc={setIsInsideUni} name={'Available For Inside Universities'} />
                        <Collapsible collapsed={!isInsideUni} style={{ paddingStart: myWidth(3) }}>
                            <Spacer paddingT={myHeight(0.2)} />

                            <Text style={[styles.textCommon,
                            {
                                fontFamily: myFonts.bodyBold,
                                fontSize: myFontSize.body3,


                            }]}>Select Universities</Text>
                            <Spacer paddingT={myHeight(0.2)} />

                            <View style={{ justifyContent: 'space-between', }}>

                                {

                                    allUnies.map(it => <CommonFaciUnies name={it.name} small={true} />)
                                }

                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.textCommon,
                                {
                                    flex: 1,
                                    fontFamily: myFonts.bodyBold,
                                    fontSize: myFontSize.body2,

                                }]}>Charges to Departs*</Text>


                                <View style={{
                                    flexDirection: 'row',
                                    borderRadius: myWidth(2),
                                    width: myFontSize.body2 + myWidth(22),
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
                                    <TextInput placeholder="Ex 50"
                                        maxLength={3242}
                                        autoCorrect={false}
                                        placeholderTextColor={myColors.offColor}
                                        selectionColor={myColors.primary}
                                        cursorColor={myColors.primaryT}
                                        value={departCharges} onChangeText={SetDepartCharges}
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

                            </View>

                            <Spacer paddingT={myHeight(0.5)} />

                            <View style={{ height: myHeight(0.2), backgroundColor: myColors.divider }} />
                        </Collapsible>

                        {/* Available for one time */}
                        <Spacer paddingT={myHeight(0.8)} />
                        <CommonFaci fac={isOneRide} setFAc={setOneRide} name={'Available For One Time Ride'} />
                        <Collapsible collapsed={!isOneRide} >
                            <Spacer paddingT={myHeight(0.2)} />

                            <Text style={[styles.textCommon,
                            {
                                fontFamily: myFonts.bodyBold,
                                fontSize: myFontSize.body3,


                            }]}>Select Days</Text>
                            <Spacer paddingT={myHeight(0.2)} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                                <CommonFaciDays dailyDays={oneRideDays} setDailyDays={setOneRideDays} name={'All'} />

                                {

                                    allDays.map(it => <CommonFaciDays dailyDays={oneRideDays} setDailyDays={setOneRideDays} name={it} />)
                                }

                            </View>
                            <Spacer paddingT={myHeight(0.5)} />


                            {/* <View style={{ height: myHeight(0.2), backgroundColor: myColors.divider }} /> */}
                        </Collapsible>



                    </View>
                    {/* Delivery Charges & Time */}
                    <Collapsible collapsed={true}>
                        <Spacer paddingT={myHeight(2.7)} />

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.textCommon,
                            {
                                flex: 1,
                                fontFamily: myFonts.heading,
                                fontSize: myFontSize.xBody2,

                            }]}>Delivery Charges *</Text>


                            <View style={{
                                flexDirection: 'row',
                                borderRadius: myWidth(2),
                                width: myFontSize.body2 + myWidth(22),
                                paddingVertical: myHeight(0.2),
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
                                        fontSize: myFontSize.body,
                                        backgroundColor: myColors.offColor7,

                                        // textAlign: 'center'
                                    }}
                                />
                                <TextInput placeholder="Ex 50"
                                    autoCorrect={false}
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={DeliveryFee} onChangeText={SetDeliveryFee}
                                    keyboardType='numeric'
                                    style={{
                                        fontFamily: myFonts.body,
                                        fontSize: myFontSize.body,
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
                                        fontSize: myFontSize.body,
                                        backgroundColor: myColors.offColor7,

                                        // textAlign: 'center'
                                    }}
                                />


                            </View>

                        </View>

                        <Spacer paddingT={myHeight(2.7)} />

                        {/* Delivery  Time */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.textCommon,
                            {
                                flex: 1,
                                fontFamily: myFonts.heading,
                                fontSize: myFontSize.xBody2,

                            }]}>Delivery Time *</Text>


                            <View style={{
                                flexDirection: 'row',
                                borderRadius: myWidth(2),
                                width: myFontSize.body2 + myWidth(22),
                                paddingVertical: myHeight(0.2),
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
                                        fontSize: myFontSize.body,
                                        backgroundColor: myColors.offColor7,

                                        // textAlign: 'center'
                                    }}
                                />
                                <TextInput placeholder="Ex 50"
                                    autoCorrect={false}
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    value={DeliveryTime} onChangeText={SetDeliveryTime}
                                    keyboardType='numeric'
                                    style={{
                                        flex: 1,
                                        padding: 0,
                                        backgroundColor: myColors.offColor7,
                                        fontFamily: myFonts.body,
                                        fontSize: myFontSize.body,

                                        // textAlign: 'center'
                                    }}
                                />

                                <TextInput placeholder=" Min"
                                    autoCorrect={false}
                                    placeholderTextColor={myColors.text}
                                    selectionColor={myColors.primary}
                                    cursorColor={myColors.primaryT}
                                    editable={false}
                                    style={{

                                        padding: 0,
                                        textAlignVertical: 'center',
                                        fontFamily: myFonts.body,
                                        fontSize: myFontSize.body,
                                        backgroundColor: myColors.offColor7,

                                        // textAlign: 'center'
                                    }}
                                />

                                {/* <Text style={[styles.textCommon,
                                    {
                                        flex: 1,
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body2,

                                    }]}>Min</Text> */}
                            </View>
                        </View>
                    </Collapsible>


                    <Spacer paddingT={myHeight(2)} />
                    {/* Location */}
                    {/* <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Location *</Text>
                        <Spacer paddingT={myHeight(1)} />
                        <TextInput placeholder="Type Restaurant Address"
                            multiline={true}
                            autoCorrect={false}
                            numberOfLines={2}
                            placeholderTextColor={myColors.offColor}
                            selectionColor={myColors.primary}
                            cursorColor={myColors.primaryT}
                            value={address} onChangeText={setAddress}
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


                    <Spacer paddingT={myHeight(2.5)} />
                   
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Map Link</Text>
                        <Spacer paddingT={myHeight(1)} />

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    flexGrow: 1,
                                    paddingVertical: myHeight(1.2), paddingHorizontal: myWidth(3),
                                    backgroundColor: myColors.offColor7, borderRadius: 5
                                }}>
                                <Text numberOfLines={1} style={[styles.textCommon,
                                {
                                    fontFamily: myFonts.bodyBold,
                                    fontSize: myFontSize.body3,
                                    color: locLink ? myColors.text : myColors.textL3

                                }]}>{locLink ? locLink : 'Ex: http://maps.google.com/..'}</Text>
                            </ScrollView>
                            <Spacer paddingEnd={myWidth(4)} />
                            <TouchableOpacity activeOpacity={0.7} onPress={onPaste} style={{
                                paddingVertical: myHeight(1), paddingHorizontal: myWidth(5),
                                backgroundColor: myColors.primaryT, borderRadius: 5
                            }}>
                                <Text style={[styles.textCommon,
                                {
                                    fontFamily: myFonts.body,
                                    fontSize: myFontSize.body3,
                                    color: myColors.background

                                }]}>{locLink ? 'Clear' : 'Paste'}</Text>

                            </TouchableOpacity>
                        </View>
                    </View>


                    <Spacer paddingT={myHeight(2.5)} />
                   
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Timmings *</Text>
                        <Spacer paddingT={myHeight(1)} />
                        {
                            timmings.map((item, i) =>
                                <TimingsCom key={i} item={item} i={i} />
                            )
                        }
                    </View>


                    <Spacer paddingT={myHeight(2.5)} />
                   
                    <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Offer Tag</Text>
                        <Spacer paddingT={myHeight(1)} />
                        <View style={{
                            borderRadius: myWidth(1.5),
                            width: '100%',
                            paddingVertical: myHeight(0.2),
                            paddingHorizontal: myWidth(3),
                            color: myColors.text,
                            backgroundColor: myColors.offColor7,
                            // borderWidth: 0.7,
                            // borderColor: myColors.primaryT
                        }}>

                            <TextInput placeholder="Ex 30% OFF On Family Pack"
                                autoCorrect={false}
                                maxLength={30}
                                placeholderTextColor={myColors.offColor}
                                selectionColor={myColors.primary}
                                cursorColor={myColors.primaryT}
                                value={offer} onChangeText={Setoffer}
                                style={{
                                    flex: 1,
                                    padding: 0,
                                    backgroundColor: myColors.offColor7,
                                    fontFamily: myFonts.body,
                                    fontSize: myFontSize.body,
                                    // textAlign: 'center'
                                }}
                            />

                        </View>
                    </View>


                    <Spacer paddingT={myHeight(2.5)} /> */}

                    {/* Menu Images */}
                    {/* <View>
                        <Text style={[styles.textCommon,
                        {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.xBody2,

                        }]}>Menu Images</Text>
                        <Spacer paddingT={myHeight(1)} />


                        <View style={{ flexDirection: 'row', }}>

                            {
                                MenuImages.map((image, index) =>


                                    <TouchableOpacity key={index} disabled={imageLoading && imageLoading == index + 1}
                                        activeOpacity={0.75} onPress={() => {
                                            chooseFileMenu(index)


                                        }}

                                        style={{
                                            height: myHeight(18), width: myWidth(28), justifyContent: 'center', alignItems: 'center',
                                            borderRadius: myWidth(4), backgroundColor: myColors.offColor7, marginEnd: myWidth(4)
                                        }}>
                                        {
                                            (imageLoading && imageLoading == index + 1) ?
                                                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: myColors.offColor7 }} >
                                                    <Text style={[styles.textCommon,
                                                    {
                                                        fontFamily: myFonts.body,
                                                        fontSize: myFontSize.body,
                                                        textAlign: 'center'

                                                    }]}>Loading...</Text>
                                                </View>
                                                :

                                                <ImageUri width={'100%'} height={'100%'} resizeMode='cover' borderRadius={0} uri={image} />
                                        }



                                    </TouchableOpacity>
                                )
                            }
                            {
                                MenuImages.length < 3 &&
                                <TouchableOpacity disabled={imageLoading && imageLoading == 'new'} activeOpacity={0.75} onPress={() => {
                                    chooseFileMenu(null)

                                }}
                                    style={{
                                        height: myHeight(18), width: myWidth(28), justifyContent: 'center', alignItems: 'center',
                                        borderRadius: myWidth(4), backgroundColor: myColors.offColor7,
                                    }}>



                                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>

                                        {
                                            (imageLoading && imageLoading == 'new') ?
                                                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: myColors.offColor7 }} >
                                                    <Text style={[styles.textCommon,
                                                    {
                                                        fontFamily: myFonts.body,
                                                        fontSize: myFontSize.body,
                                                        textAlign: 'center'

                                                    }]}>Loading...</Text>
                                                </View>
                                                :
                                                <Text style={[styles.textCommon,
                                                {
                                                    fontFamily: myFonts.bodyBold,
                                                    fontSize: myFontSize.body,
                                                    textAlign: 'center'


                                                }]}>
                                                    Upload
                                                </Text>
                                        }

                                    </View>


                                </TouchableOpacity>
                            }


                        </View>
                    </View> */}

                    <Spacer paddingT={myHeight(3)} />



                    {/* {
                        !isEditMode &&
                        <View style={{ height: '100%', width: myWidth(100), position: 'absolute', backgroundColor: '#00000015' }} />
                    } */}
                </KeyboardAwareScrollView>


                <View style={{ backgroundColor: myColors.background, }}>
                    <View style={{ height: 1, backgroundColor: myColors.offColor }} />

                    <Spacer paddingT={myHeight(3)} />

                    <TouchableOpacity onPress={onSave}
                        activeOpacity={0.8}
                        style={{
                            width: myWidth(92), alignSelf: 'center', paddingVertical: myHeight(1.3),
                            borderRadius: myHeight(1.4), alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'row', backgroundColor: myColors.primaryT,
                            // borderWidth: myHeight(0.15), borderColor: myColors.primaryT
                        }}>
                        <Text style={[styles.textCommon, {
                            fontFamily: myFonts.heading,
                            fontSize: myFontSize.body3,
                            color: myColors.background
                        }]}>Save</Text>
                    </TouchableOpacity>

                    <Spacer paddingT={myHeight(3)} />

                </View>

                {
                    showTimeModal &&
                    <CalenderDate show={setShowTimeModal} content={showTimeModal} value={checkTime} />
                }
                {errorMsg && <MyError message={errorMsg} />}

                {isLoading && <Loader />}

            </SafeAreaView>

            {
                showLoc ?
                    <Search selected={selectedItem} setShowLoc={setShowLoc}
                        setSelected={setSelectedItems} />
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
})