import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Alert, TextInput, TouchableOpacity, View, SafeAreaView, Image, Text, ScrollView, StatusBar, Easing, Linking } from 'react-native';
import { Loader, MyError, Spacer, StatusbarH, errorTime, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFonts, myLetSpacing, myFontSize } from '../../ultils/myFonts';
import firestore, { Filter } from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import { ImageUri } from '../common/image_uri';
import { FlashList } from '@shopify/flash-list';
import { useDispatch, useSelector } from 'react-redux';
import { sendPushNotification } from '../functions/firebase';
import { setErrorAlert } from '../../redux/error_reducer';
import { getDistanceFromRes } from '../functions/functions';



export const RideDetails2 = ({ navigation, route }) => {
    const req = route.params.item
    const code = route.params.code
    const [errorMsg, setErrorMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { onlineDrivers } = useSelector(state => state.data)
    const { current, history } = useSelector(state => state.location)
    const [sendDrivers, setSendDrivers] = useState([])
    const [statusMessages, setStatusMessages] = useState(null)
    const { profile } = useSelector(state => state.profile)
    const [load, setLoad] = useState(false)

    const { allRequest } = useSelector(State => State.orders)
    const [item, setRequest] = useState(null)
    const item2 = item

    const dispatch = useDispatch()

    // const driver = item?.sendDrivers[0]

    useEffect(() => {
        if (allRequest.length) {

            setRequest(allRequest.find(it => it.id == req.id))
        }
    }, [allRequest])

    useEffect(() => {
        if (item) {
            const statusMessages = code == 1 ? 'Active' : code == 2 ?
                item.status == 1 ? 'Not send to any driver yet' : `Send to ${item.sendDrivers?.length} ${item.sendDrivers?.length > 1 ? 'drivers' : 'driver'} yet` : item.status < 0 ?
                    'Cancelled' : 'Completed'

            setStatusMessages(statusMessages)
            // const ind = item.sendDrivers.findIndex(it => item[it.did].status >= 2)
            // if(ind!=-1){
            //     driver.push(item[item.sendDrivers[ind].did])
            // }
            let driver = []

            let dri = null
            const others = []
            const others2 = []
            item.sendDrivers?.map((it, i) => {
                const d = item[it.did]
                let dri2 = onlineDrivers.find(it => it.did == d.did)
                const from = dri2 ? dri2.location : it.location
                const { distance, string } = getDistanceFromRes(from, current ? current : { "latitude": 0, "longitude": 0 }, true)
                d.distanceInt = distance
                d.distance = string
                if (d.status >= 2) {
                    dri = d
                }
                else if (d.status == 1.5) {
                    others.push(d)
                }
                else if (d.status == 1) {
                    others2.push(d)
                }
                else {
                    driver.push(d)
                }
            })


            driver = [...others, ...others2, ...driver]


            if (dri) {
                driver = [dri, ...driver]
            }
            setSendDrivers(driver)
        }
    }, [item, current, onlineDrivers])
    useEffect(() => {

        if (errorMsg) {
            setTimeout(() => {
                setIsLoading(false)
                setErrorMsg(null)
            }
                , errorTime)
        }

    }, [errorMsg])


    function onCancelRide() {


        setLoad(true)
        const update = { status: -5 }
        item.sendDrivers.map(diii => {
            const di = item[diii.did]
            update[diii.did] = { ...di, unread: true }
        })
        database()
            .ref(`/requests/${profile.uid}/${item.id}`).update(update)
            .then(() => {
                console.log('To onRemove successfully')
                dispatch(setErrorAlert({ Title: 'Request Remove Successfully', Body: null, Status: 2 }))

                navigation.goBack()
                setTimeout(() => {

                    setLoad(false)
                }, item.status == 1 ? 0 : 1000)

                if (item.status != 1) {
                    let tokens = []
                    item.sendDrivers.map(diii => {
                        const di = item[diii.did]
                        if (di.status == 1) {
                            tokens.push(diii.token)
                            // firestore().collection('drivers').doc(di.did).get().then((data) => {
                            //     const captain = data.data()
                            //     const token = captain.deviceToken
                            //     sendPushNotification('Request Cancelled', `Request ${item.id} is cancelled by ${profile.name}`, 0, [token])
                            //     console.log('Successfully')

                            // }).catch((err) => { console.log(err) })

                        }
                    })
                    sendPushNotification('Request Cancelled', `Request is cancelled by ${profile.name}`, 0, tokens)

                }


            })
            .catch((err) => {
                console.log('error on accept unread err', err)
                setLoad(false)

            })
    }

    function onRideReject(dr) {
        database()
            .ref(`/requests/${item.uid}/${item.id}/${dr.did}`).update({ status: -1 }).
            then(() => {


                sendPushNotification('Request Rejected', `Request is rejected by ${profile.name}`, 0, [dr.token])
                console.log('To onRideReject successfully')
            })
            .catch((err) => {


                console.log('error on update unread err')
            })

    }
    function onRideAccept(dr) {

        const update = { did: dr.did, driverName: dr.name, driverContact: dr.contact, status: 3 }
        update[dr.did] = { ...dr, status: 2, unread: true }

        const rejectTokens = []
        item.sendDrivers?.map((it, i) => {
            const d = item[it.did]
            if (d.did != dr.did && (d.status == 1.5)) {
                update[it.did] = { ...d, status: -5, unread: true }
                rejectTokens.push(d.token)
            }

        })

        database()
            .ref(`/requests/${item.uid}/${item.id}`).update({ ...update, unread: true })
            .then(() => {
                console.log('To accept user successfully')
                dispatch(setErrorAlert({ Title: 'Request Accept Successfully', Body: null, Status: 2 }))
                sendPushNotification('Request Accepted', `Ride confirm by the ${profile.name}`, 2, [dr.token])
                sendPushNotification('Request Rejected', `Request is rejected by ${profile.name}`, 0, rejectTokens)


            })
            .catch((err) => {
                console.log('error on accept unread err', err)

            })
    }

    if (!item) {
        return
    }

    const CommonItem = ({ text, text2, items = [], color = null }) => {
        return (
            <View style={{}}>
                <Text style={styles.heading}>{text}</Text>
                <View style={{ marginHorizontal: myWidth(2) }}>

                    {
                        text2 ?
                            <Text style={styles.tesxH}>{text2}</Text>
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

                                    <Text

                                        style={{
                                            fontSize: myFontSize.body,
                                            fontFamily: myFonts.bodyBold,
                                            color: color ? color : myColors.text,
                                            letterSpacing: myLetSpacing.common,
                                            includeFontPadding: false,
                                            padding: 0,
                                        }}>{item}</Text>
                                </View>
                            )
                        })
                    }

                </View>
                <Spacer paddingT={myHeight(2.5)} />
            </View>
        )
    }
    return (
        <>
            {/* <StatusBar backgroundColor={orderModal ? '#00000030' : myColors.background} /> */}
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: myColors.background,
            }}>
                <StatusbarH />
                {/* Top  */}
                <Spacer paddingT={myHeight(1.2)} />

                <View style={{
                    flexDirection: 'row', paddingHorizontal: myWidth(4),
                    alignItems: 'center'
                }}>
                    {/* Back */}

                    <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={{
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


                    <Text numberOfLines={1} style={[styles.textCommon, {
                        flex: 1,
                        fontFamily: myFonts.bodyBold, fontSize: myFontSize.xBody2
                    }]}>Request Details</Text>

                </View>
                <Spacer paddingT={myHeight(1.8)} />

                {/* Content */}
                <ScrollView style={{ flex: 1 }} bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{
                    backgroundColor: myColors.background, flexGrow: 1, paddingHorizontal: myWidth(4)
                }}>
                    <Spacer paddingT={myHeight(1)} />

                    {item.sendDrivers ?


                        <>


                            <Text numberOfLines={1} style={styles.heading}>Drivers</Text>
                            <Spacer paddingT={myHeight(0.3)} />

                            <FlashList
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={false}
                                data={sendDrivers}
                                extraData={item}
                                // extraData={[ac, wifi, topRated, search]}
                                // contentContainerStyle={{ flexGrow: 1 }}
                                // ItemSeparatorComponent={() =>
                                //     <View style={{ borderTopWidth: myHeight(0.08), borderColor: myColors.offColor, width: "100%" }} />
                                // }
                                estimatedItemSize={myHeight(10)}
                                renderItem={({ item, index }) => {
                                    const driver = item
                                    const showChat = item.status > 0 && (!item2.did || item2.did == item.did)
                                    return (
                                        <TouchableOpacity disabled key={index} activeOpacity={0.85}
                                            onPress={() => navigation.navigate('DriverDetail', { driver: item })}>

                                            <View style={{
                                                backgroundColor: myColors.background,
                                                // flexDirection: 'row', alignItems: 'center',
                                                paddingHorizontal: myWidth(3), borderRadius: myWidth(2),
                                                marginVertical: myHeight(1),
                                                borderWidth: myHeight(0.1), borderColor: myColors.dot



                                            }}>

                                                <Spacer paddingT={myHeight(0.8)} />


                                                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                                    <Text numberOfLines={1}
                                                        style={{
                                                            flex: 1,

                                                            fontSize: myFontSize.body2,
                                                            fontFamily: myFonts.heading,
                                                        }}>{driver.name}</Text>
                                                    {/* Name */}
                                                    <Text numberOfLines={1}

                                                        style={[
                                                            styles.textCommon,
                                                            {

                                                                fontSize: myFontSize.body2,
                                                                fontFamily: myFonts.heading,
                                                            },
                                                        ]}>{driver.vehicleName}</Text>

                                                </View>
                                                {/* <Spacer paddingT={myHeight(0.4)} /> */}





                                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', height: myHeight(3), flex: 1, }}>
                                                        {
                                                            showChat ?
                                                                <>
                                                                    <TouchableOpacity activeOpacity={0.85} style={{
                                                                        padding: myHeight(0.8), backgroundColor: myColors.primaryT,
                                                                        elevation: 1,
                                                                        borderRadius: myWidth(1.5),

                                                                    }}
                                                                        onPress={() => { Linking.openURL(`tel:${driver.contact}`); }}
                                                                    >
                                                                        <Image source={require('../assets/home_main/home/phone.png')}
                                                                            style={{
                                                                                width: myHeight(1.8),
                                                                                height: myHeight(1.8),
                                                                                resizeMode: 'contain',
                                                                                tintColor: myColors.background
                                                                            }}
                                                                        />

                                                                    </TouchableOpacity>
                                                                    <Spacer paddingEnd={myWidth(2.5)} />

                                                                    <TouchableOpacity activeOpacity={0.85} style={{
                                                                        padding: myHeight(0.8), backgroundColor: myColors.primaryT,
                                                                        elevation: 1,
                                                                        borderRadius: myWidth(1.5),
                                                                    }}
                                                                        onPress={() => {
                                                                            console.log(driver)
                                                                            navigation.navigate('Chat',
                                                                                { user2: { ...driver, uid: driver.did } }
                                                                            )
                                                                        }}
                                                                    >
                                                                        <Image source={require('../assets/home_main/home/navigator/chat2.png')}
                                                                            style={{
                                                                                width: myHeight(1.8),
                                                                                height: myHeight(1.8),
                                                                                resizeMode: 'contain',
                                                                                tintColor: myColors.background
                                                                            }}
                                                                        />
                                                                    </TouchableOpacity>

                                                                    <Spacer paddingEnd={myWidth(4.5)} />

                                                                    <Image
                                                                        style={{
                                                                            width: myHeight(2.5),
                                                                            height: myHeight(2.5),
                                                                            resizeMode: 'contain',
                                                                            tintColor: myColors.primaryT
                                                                        }} source={require('../assets/home_main/home/distance.png')}
                                                                    />
                                                                    <Spacer paddingEnd={myWidth(1.8)} />

                                                                    <Text
                                                                        style={[
                                                                            styles.textCommon,
                                                                            {
                                                                                flex: 1,
                                                                                fontSize: myFontSize.body,
                                                                                fontFamily: myFonts.body,
                                                                            },
                                                                        ]}
                                                                    >{driver.distance} Away</Text>
                                                                </>

                                                                : null
                                                        }
                                                    </View>
                                                    {
                                                        (item2.status == 2 && driver.status == 1.5) ?
                                                            <>
                                                                <Spacer paddingT={myHeight(1)} />

                                                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                    <>

                                                                        <TouchableOpacity activeOpacity={0.7} onPress={() => onRideReject(driver)}>
                                                                            <Text
                                                                                style={[
                                                                                    styles.textCommon,
                                                                                    {
                                                                                        fontSize: myFontSize.body,
                                                                                        fontFamily: myFonts.heading,
                                                                                        color: myColors.red
                                                                                    },
                                                                                ]}
                                                                            >{'Reject'}</Text>
                                                                        </TouchableOpacity>
                                                                        <Spacer paddingEnd={myWidth(3)} />

                                                                        <TouchableOpacity activeOpacity={0.7}
                                                                            onPress={() => onRideAccept(driver)}>
                                                                            <Text
                                                                                style={[
                                                                                    styles.textCommon,
                                                                                    {
                                                                                        fontSize: myFontSize.body,
                                                                                        fontFamily: myFonts.heading,
                                                                                        color: myColors.green
                                                                                    },
                                                                                ]}
                                                                            >{'Accept'}</Text>
                                                                        </TouchableOpacity>
                                                                    </>
                                                                </View>

                                                            </>
                                                            :
                                                            <Text numberOfLines={1}
                                                                style={[
                                                                    styles.textCommon,
                                                                    {


                                                                        fontSize: myFontSize.body3,
                                                                        fontFamily: myFonts.bodyBold,
                                                                        letterSpacing: myLetSpacing.common,
                                                                        includeFontPadding: false,
                                                                        padding: 0,

                                                                        color: driver.status < 0 ? myColors.red : driver.status == 1 ? myColors.textL4 : myColors.green
                                                                    },
                                                                ]}>{driver.status < 0 ? 'Rejected' : driver.status == 1 ? 'Sended' : 'Accepted'}</Text>
                                                    }


                                                </View>



                                                <Spacer paddingT={myHeight(1.5)} />


                                            </View>

                                        </TouchableOpacity>
                                    )
                                }
                                }
                            />
                        </>
                        :
                        null
                    }

                    <Spacer paddingT={myHeight(2)} />

                    <CommonItem text={'Ride ID'} text2={'The ride id of the request.'}
                        items={[item.id]} />


                    <CommonItem text={'Status'} text2={'The status of the request.'}
                        items={[statusMessages]} color={(item.status < 0 || item.status == 1) ? myColors.red : myColors.green} />

                    <CommonItem text={'Date'} text2={'The date of the request.'}
                        items={[`${item.date}`]} />



                    <CommonItem text={'Pickup'} text2={'Pickup location and timing.'}
                        items={[item.pickup.name, item.pickupTime?.time]} />

                    <CommonItem text={'Dropoff'} text2={'Dropoff location and timing.'}
                        items={[item.dropoff.name, item.twoWay ? item.dropoffTime?.time : null]} />



                    <CommonItem text={'Seats'} text2={'Amount of seats booked.'}
                        items={[item.seats]} />



                    <CommonItem text={'Distance Traveled '} text2={'The distance traveled from the pickup to dropoff'}
                        items={[item.distance]} />

                    {item.instruction ?
                        <CommonItem text={'Instruction '} items={[item.instruction]} />
                        :

                        null
                    }



                    <Spacer paddingT={myHeight(5.6)} />

                </ScrollView>
                <View style={{
                    maxHeight: myHeight(50), borderWidth: myHeight(0.1), borderTopRightRadius: myWidth(6),
                    borderTopLeftRadius: myWidth(6), overflow: 'hidden', borderColor: myColors.offColor
                }}>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{
                        backgroundColor: myColors.background, paddingHorizontal: myWidth(4)
                    }}>

                        <Spacer paddingT={myHeight(1.8)} />







                    </ScrollView>
                    {
                        (code == 1 && item.status == 2) ?
                            <TouchableOpacity activeOpacity={0.7} onPress={() => onCancelRide()} style={{
                                width: myWidth(92), alignSelf: 'center', paddingVertical: myHeight(1.2),
                                borderRadius: myHeight(1.4), alignItems: 'center', justifyContent: 'center',
                                flexDirection: 'row', backgroundColor: myColors.background,
                                borderWidth: myHeight(0.15), borderColor: myColors.red, marginVertical: myHeight(1)
                            }}>
                                <>
                                    {
                                        load ?
                                            <Text
                                                style={[
                                                    styles.textCommon,
                                                    {

                                                        fontSize: myFontSize.body,
                                                        fontFamily: myFonts.bodyBold,
                                                        color: myColors.red
                                                    },
                                                ]}
                                            >Loading...</Text>
                                            :
                                            <>

                                                <View >
                                                    <Text
                                                        style={[
                                                            styles.textCommon,
                                                            {
                                                                fontSize: myFontSize.body,
                                                                fontFamily: myFonts.heading,
                                                                color: myColors.red
                                                            },
                                                        ]}
                                                    >{'Cancel Ride'}</Text>
                                                </View>


                                                {/* <Spacer paddingEnd={myWidth(3)} /> */}


                                            </>
                                    }
                                </>

                            </TouchableOpacity>
                            : null


                    }

                </View>




            </SafeAreaView>

            {isLoading && <Loader />}
            {errorMsg && <MyError message={errorMsg} />}



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
        paddingHorizontal: myWidth(4), width: '100%',
        paddingVertical: myHeight(1), borderRadius: myWidth(2),
        backgroundColor: myColors.primaryL6,
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
        color: myColors.textL4,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
})