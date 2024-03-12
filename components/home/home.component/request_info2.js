
import { Image, TouchableOpacity, SafeAreaView, StyleSheet, Text, View, ImageBackground, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Spacer, myHeight, myWidth } from "../../common"
import { myFontSize, myFonts, myLetSpacing } from "../../../ultils/myFonts"
import { myColors } from "../../../ultils/myColors"
import { useDispatch, useSelector } from 'react-redux'
import { addFavoriteRest, removeFavoriteRest } from '../../../redux/favorite_reducer'
import { ImageUri } from '../../common/image_uri'
import database from '@react-native-firebase/database';
import { FirebaseUser, getTokenAndServerKey, sendPushNotification } from '../../functions/firebase'
import { setErrorAlert } from '../../../redux/error_reducer'
import firestore from '@react-native-firebase/firestore';

export const RequestInfo2 = ({ item, navigation, code }) => {
    const { profile } = useSelector(state => state.profile)
    const [load, setLoad] = useState(false)
    const dispatch = useDispatch()

    const isOnline = item.isOnline
    useEffect(() => {
        if (item.unread) {
            setTimeout(() => {

                database()
                    .ref(`/requests/${profile.uid}/${item.id}`).update({ unread: false }).
                    then(() => { console.log('To Unread successfully') })
                    .catch((err) => { console.log('error on update unread err') })
            }, 3000)
        }
    }, [item])
    function onCancelRide() {

        // console.log(item.tokens)
        // return
        setLoad(true)
        const update = { status: -5 }
        item.sendDrivers?.map(diii => {
            const di = item[diii.did]
            update[diii.did] = { ...di, unread: true }
        })
        database()
            .ref(`/requests/${profile.uid}/${item.id}`).update(update)
            .then(() => {
                console.log('To onRemove successfully')
                dispatch(setErrorAlert({ Title: 'Request Cancelled Successfully', Body: null, Status: 2 }))
                setTimeout(() => {

                    setLoad(false)
                }, item.status == 1 ? 0 : 1000)

                if (item.status != 1) {
                    let tokens = []
                    item.sendDrivers?.map(diii => {
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
                    const navigate = { screen: 'RIDES', params: { index: 2 } }


                    sendPushNotification('Request Cancelled', `Request is cancelled by ${profile.name}`, 0, tokens, navigate)

                }


            })
            .catch((err) => {
                console.log('error on accept unread err', err)
                setLoad(false)

            })
    }
    function onRemove() {


        setLoad(true)
        const update = { status: -5 }
        item.sendDrivers?.map(diii => {
            const di = item[diii.did]
            update[diii.did] = { ...di, unread: true }
        })
        database()
            .ref(`/requests/${profile.uid}/${item.id}`).update(update)
            .then(() => {
                console.log('To onRemove successfully')
                dispatch(setErrorAlert({ Title: 'Request Cancelled Successfully', Body: null, Status: 2 }))
                setTimeout(() => {

                    setLoad(false)
                }, item.status == 1 ? 0 : 1000)

                if (item.status != 1) {
                    item.sendDrivers?.map(diii => {
                        const di = item[diii.did]
                        if (di.status == 1) {

                            firestore().collection('drivers').doc(di.did).get().then((data) => {
                                const captain = data.data()
                                const token = captain.deviceToken
                                const navigate = { screen: 'RIDES', params: { index: 2 } }

                                sendPushNotification('Request Cancelled', `Request ${item.id} is cancelled by ${profile.name}`, 0, [token], navigate)
                                console.log('Successfully')

                            }).catch((err) => { console.log(err) })

                        }
                    })
                }


            })
            .catch((err) => {
                console.log('error on accept unread err', err)
                setLoad(false)

            })
    }
    return (
        <View

            style={{
                backgroundColor: myColors.background, elevation: 5,
                borderRadius: myWidth(1.5), paddingHorizontal: myWidth(3),
                marginBottom: myHeight(1), marginTop: myHeight(4),
                borderWidth: myHeight(0.1), borderColor: item.unread ? myColors.green : myColors.divider
            }}>

            <View style={{
                paddingVertical: myHeight(0.6), paddingHorizontal: myWidth(4),
                marginTop: -myHeight(2),
                backgroundColor: myColors.text, alignSelf: 'center',
                borderRadius: myWidth(100), flexDirection: 'row', alignItems: 'center'
            }}>
                {
                    isOnline ?
                        <View style={{
                            paddingVertical: myHeight(0.3), paddingHorizontal: myWidth(4),
                            marginEnd: myWidth(1),
                            backgroundColor: myColors.background, alignSelf: 'center',
                            borderRadius: myWidth(100), flexDirection: 'row', alignItems: 'center'
                        }}>
                            <Text
                                style={[
                                    styles.textCommon,
                                    {

                                        fontSize: myFontSize.xxSmall,
                                        fontFamily: myFonts.heading,
                                        color: myColors.text
                                    },
                                ]}
                            >Vanpool</Text>
                        </View>
                        :
                        <Image
                            style={{
                                width: myHeight(2),
                                height: myHeight(2),
                                resizeMode: 'contain',
                                tintColor: myColors.divider
                            }} source={item.twoWay ? require('../../assets/home_main/home/twoArrow.png') : require('../../assets/home_main/home/oneArrow.png')}
                        />
                }


                <Spacer paddingEnd={myWidth(2.2)} />
                <Text
                    style={[
                        styles.textCommon,
                        {

                            fontSize: myFontSize.xxSmall,
                            fontFamily: myFonts.body,
                            color: myColors.background
                        },
                    ]}
                >ID: {item.id} </Text>
            </View>
            <Spacer paddingT={myHeight(1)} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    {
                        (item.status == 2 && isOnline) ?
                            <>
                                <Text
                                    style={[
                                        styles.textCommon,
                                        {
                                            flex: 1,
                                            fontSize: myFontSize.body,
                                            fontFamily: myFonts.body,
                                            color: item.accepted ? myColors.green : 'red'
                                        },
                                    ]}
                                >{item.accepted ? `${item.accepted} ${item.accepted == 1 ? 'driver is' : 'drivers are'} waiting for your response` : 'No driver responded yet'}</Text>

                            </>
                            : null
                    }

                    {
                        (code == 2 && !isOnline) ?
                            <>
                                <Text
                                    style={[
                                        styles.textCommon,
                                        {
                                            flex: 1,
                                            fontSize: myFontSize.body,
                                            fontFamily: myFonts.body,
                                            color: item.status == 1 ? 'red' : myColors.text
                                        },
                                    ]}
                                >{item.status == 1 ? 'Not sent to any driver yet' : `Sent to ${item.sendDrivers?.length} ${item.sendDrivers?.length > 1 ? 'drivers' : 'driver'}`}</Text>

                            </>

                            :
                            <>

                                {
                                    item.driverName &&
                                    <>
                                        <Spacer paddingEnd={myWidth(0.3)} />

                                        <Image
                                            style={{
                                                width: myHeight(1.9),
                                                height: myHeight(1.9),
                                                resizeMode: 'contain',
                                                tintColor: myColors.primaryT
                                            }}
                                            source={require('../../assets/home_main/home/driver.png')}
                                        />
                                        <Spacer paddingEnd={myWidth(3)} />
                                        <Text
                                            style={[
                                                styles.textCommon,
                                                {
                                                    flex: 1,
                                                    fontSize: myFontSize.body2,
                                                    fontFamily: myFonts.bodyBold,
                                                },
                                            ]}
                                        >{item.driverName}
                                        </Text>
                                    </>
                                }
                            </>

                    }

                </View>

                {
                    (code == 2 && !isOnline) ?
                        <>
                            {
                                (item.status == 1 || item.status == 2) &&
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: myColors.background,
                                        padding: myHeight(1.2),
                                        borderRadius: myHeight(5),
                                        position: 'absolute',
                                        top: -myHeight(4),
                                        right: -myWidth(1),
                                        elevation: 4,

                                    }}
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('RequestRide', { preReq: item })}
                                >
                                    <Image style={{
                                        height: myHeight(2),
                                        width: myHeight(2),
                                        resizeMode: 'contain',
                                        tintColor: myColors.text,

                                    }}
                                        source={require('../../assets/home_main/home/edit2.png')} />
                                </TouchableOpacity>
                            }
                        </>
                        :
                        null
                }

                {
                    (code != 1) ? null :
                        <>
                            {console.log(item.driverContact)}
                            {item.driverContact ?

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity activeOpacity={0.85} style={{
                                        padding: myHeight(0.8), backgroundColor: myColors.background,
                                        elevation: 3,
                                        borderRadius: 100
                                    }}
                                        onPress={() => { Linking.openURL(`tel:${item.driverContact}`); }}
                                    >
                                        <Image source={require('../../assets/home_main/home/phone.png')}
                                            style={{
                                                width: myHeight(1.8),
                                                height: myHeight(1.8),
                                                resizeMode: 'contain',
                                                tintColor: myColors.text
                                            }}
                                        />

                                    </TouchableOpacity>
                                    <Spacer paddingEnd={myWidth(3.5)} />

                                    <TouchableOpacity activeOpacity={0.85} style={{
                                        padding: myHeight(0.8), backgroundColor: myColors.background,
                                        elevation: 3,
                                        borderRadius: 100
                                    }}
                                        onPress={() => {
                                            navigation.navigate('Chat',
                                                { user2: { uid: item.did, name: item.driverName } }
                                            )
                                        }}
                                    >
                                        <Image source={require('../../assets/home_main/home/navigator/chat2.png')}
                                            style={{
                                                width: myHeight(1.8),
                                                height: myHeight(1.8),
                                                resizeMode: 'contain',
                                                tintColor: myColors.text
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                : null
                            }
                        </>



                }


            </View>
            <Spacer paddingT={myHeight(1)} />

            <View style={{ flexDirection: 'row' }}>
                {/* Circles & Line*/}
                <View
                    style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: myHeight(0.5),
                        marginBottom: 0
                    }}
                >
                    <View
                        style={{
                            height: myHeight(2),
                            width: myHeight(2),
                            borderRadius: myHeight(3),
                            borderWidth: myHeight(0.07),
                            borderColor: myColors.primaryT,
                            backgroundColor: myColors.background,
                        }}
                    />
                    <View
                        style={{
                            flex: 1,
                            width: myWidth(0.5),
                            backgroundColor: myColors.primaryT,
                            marginVertical: myHeight(0.4),
                        }}
                    />
                    <View
                        style={{
                            height: myHeight(2),
                            width: myHeight(2),
                            borderRadius: myHeight(3),
                            backgroundColor: myColors.primaryT,
                        }}
                    />
                </View>

                <Spacer paddingEnd={myWidth(3)} />
                {/* Text Pick & Desti */}
                <View style={{ flex: 1 }}>
                    {/* Pick */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={[
                                styles.textCommon,
                                {
                                    flex: 1,
                                    fontSize: myFontSize.xxSmall,
                                    fontFamily: myFonts.bodyBold,
                                },
                            ]}
                        >
                            PickUp</Text>
                        {/* <Image
                            style={{
                                width: myHeight(2),
                                height: myHeight(2),
                                resizeMode: 'contain',
                                tintColor: myColors.textL4
                            }} source={require('../../assets/home_main/home/clock.png')}
                        /> */}
                        <Spacer paddingEnd={myWidth(1.3)} />

                        <Text style={[
                            styles.textCommon,
                            {
                                fontSize: myFontSize.xSmall,
                                fontFamily: myFonts.bodyBold,
                                color: myColors.textL4
                            },
                        ]}>{item.pickupTime?.time}
                        </Text>
                    </View>
                    <Text numberOfLines={2}
                        style={[
                            styles.textCommon,
                            {
                                fontSize: myFontSize.small,
                                fontFamily: myFonts.body,
                            },
                        ]}
                    >{item.pickup.name}</Text>

                    <Spacer paddingT={myHeight(1.3)} />

                    {/* Destination */}
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <Text
                                style={[
                                    styles.textCommon,
                                    {
                                        flex: 1,
                                        fontSize: myFontSize.xxSmall,
                                        fontFamily: myFonts.bodyBold,
                                    },
                                ]}
                            >
                                DropOff
                            </Text>



                            {
                                item.twoWay &&
                                <>
                                    {/* <Image
                                        style={{
                                            width: myHeight(2),
                                            height: myHeight(2),
                                            resizeMode: 'contain',
                                            tintColor: myColors.textL4
                                        }} source={require('../../assets/home_main/home/clock.png')}
                                    /> */}
                                    <Spacer paddingEnd={myWidth(1.3)} />
                                    <Text style={[
                                        styles.textCommon,
                                        {
                                            fontSize: myFontSize.xSmall,
                                            fontFamily: myFonts.bodyBold,
                                            color: myColors.textL4
                                        },
                                    ]}>{item.dropoffTime?.time}
                                    </Text>
                                </>

                            }
                        </View>

                        <Text
                            numberOfLines={2}
                            style={[
                                styles.textCommon,
                                {
                                    fontSize: myFontSize.small,
                                    fontFamily: myFonts.body,
                                },
                            ]}
                        >{item.dropoff.name} </Text>
                    </View>
                </View>
            </View>
            <Spacer paddingT={myHeight(1.6)} />

            <View style={{ height: myHeight(0.15), backgroundColor: myColors.dot }} />


            <Spacer paddingT={myHeight(0.7)} />


            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Image
                    style={{

                        width: myHeight(1.6),
                        height: myHeight(1.6),
                        resizeMode: 'contain',
                        tintColor: myColors.text
                    }}
                    source={require('../../assets/home_main/home/seatSF.png')}
                />
                <Spacer paddingEnd={myWidth(1.8)} />
                <Text
                    style={[
                        styles.textCommon,
                        {

                            fontSize: myFontSize.body,
                            fontFamily: myFonts.body,
                        },
                    ]}
                >{item.seats}
                </Text>
                <Spacer paddingEnd={myWidth(3)} />

                <View style={{ height: '100%', width: myHeight(0.25), backgroundColor: myColors.dot }} />
                <Spacer paddingEnd={myWidth(3)} />

                <Image
                    style={{
                        width: myHeight(2),
                        height: myHeight(2),
                        resizeMode: 'contain',
                        tintColor: myColors.text
                    }} source={require('../../assets/home_main/home/distance.png')}
                />
                <Spacer paddingEnd={myWidth(1.8)} />

                <Text
                    style={[
                        styles.textCommon,
                        {
                            flex: 1,
                            fontSize: myFontSize.xxSmall,
                            fontFamily: myFonts.body,
                        },
                    ]}
                >{item.distance} </Text>
                {
                    isOnline ?
                        <>
                            {
                                (code == 1 && item.status == 2) ?
                                    <>
                                        {
                                            load ?
                                                <Text
                                                    style={[
                                                        styles.textCommon,
                                                        {

                                                            fontSize: myFontSize.body,
                                                            fontFamily: myFonts.bodyBold,
                                                            color: myColors.green
                                                        },
                                                    ]}
                                                >Loading...</Text>
                                                :
                                                <>

                                                    <TouchableOpacity activeOpacity={0.7} onPress={() => onCancelRide()}>
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
                                                    </TouchableOpacity>


                                                    {/* <Spacer paddingEnd={myWidth(3)} /> */}


                                                </>
                                        }
                                    </>

                                    :
                                    <>

                                        <Text
                                            style={[
                                                styles.textCommon,
                                                {

                                                    fontSize: myFontSize.body2,
                                                    fontFamily: myFonts.bodyBold,
                                                    color: item.status < 0 ? 'red' : myColors.green
                                                },
                                            ]}
                                        >{item.status < 0 ? 'Cancelled' : item.status == 5 ? 'Completed' : `In Progress`}</Text>
                                    </>

                            }
                        </>
                        :
                        <>
                            {
                                code == 2 ?
                                    <>
                                        {
                                            load ?
                                                <Text
                                                    style={[
                                                        styles.textCommon,
                                                        {

                                                            fontSize: myFontSize.body,
                                                            fontFamily: myFonts.bodyBold,
                                                            color: myColors.green
                                                        },
                                                    ]}
                                                >Loading...</Text>
                                                :
                                                <>

                                                    <TouchableOpacity activeOpacity={0.7} onPress={() => onRemove()}>
                                                        <Text
                                                            style={[
                                                                styles.textCommon,
                                                                {
                                                                    fontSize: myFontSize.body,
                                                                    fontFamily: myFonts.heading,
                                                                    color: myColors.red
                                                                },
                                                            ]}
                                                        >{'Remove'}</Text>
                                                    </TouchableOpacity>
                                                    <Spacer paddingEnd={myWidth(3)} />

                                                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Search', { requestId: item.id, code, name: 'Ride Request' })}>
                                                        <Text
                                                            style={[
                                                                styles.textCommon,
                                                                {
                                                                    fontSize: myFontSize.body,
                                                                    fontFamily: myFonts.heading,
                                                                    color: myColors.green
                                                                },
                                                            ]}
                                                        >{'Send'}</Text>
                                                    </TouchableOpacity>
                                                </>
                                        }
                                    </>

                                    :
                                    <>

                                        <Text
                                            style={[
                                                styles.textCommon,
                                                {

                                                    fontSize: myFontSize.body2,
                                                    fontFamily: myFonts.bodyBold,
                                                    color: item.status < 0 ? 'red' : myColors.green
                                                },
                                            ]}
                                        >{item.status < 0 ? 'Cancelled' : item.status == 5 ? 'Completed' : `Active`}</Text>
                                    </>

                            }
                        </>
                }
            </View>
            {/* {
                code == 2 ?
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={[
                                styles.textCommon,
                                {
                                    flex: 1,
                                    fontSize: myFontSize.body,
                                    fontFamily: myFonts.body,
                                    color: item.status == 1 ? 'red' : myColors.text
                                },
                            ]}
                        >{item.status == 1 ? 'Not send to any driver yet' : `Send to ${item.sendDrivers.length} ${item.sendDrivers.length > 1 ? 'drivers' : 'driver'} yet`}</Text>

                        {
                            load ?
                                <Text
                                    style={[
                                        styles.textCommon,
                                        {

                                            fontSize: myFontSize.body,
                                            fontFamily: myFonts.bodyBold,
                                            color: myColors.green
                                        },
                                    ]}
                                >Loading...</Text>
                                :
                                <>

                                    <TouchableOpacity activeOpacity={0.7} onPress={() => onRemove()}>
                                        <Text
                                            style={[
                                                styles.textCommon,
                                                {
                                                    fontSize: myFontSize.body,
                                                    fontFamily: myFonts.heading,
                                                    color: myColors.red
                                                },
                                            ]}
                                        >{'Remove'}</Text>
                                    </TouchableOpacity>
                                    <Spacer paddingEnd={myWidth(3)} />

                                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Search', { requestId: item.id, code })}>
                                        <Text
                                            style={[
                                                styles.textCommon,
                                                {
                                                    fontSize: myFontSize.body,
                                                    fontFamily: myFonts.heading,
                                                    color: myColors.green
                                                },
                                            ]}
                                        >{'Send'}</Text>
                                    </TouchableOpacity>
                                </>
                        }

                    </View>
                    :
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {
                                item.driverName &&
                                <>

                                    <Image
                                        style={{
                                            width: myHeight(2),
                                            height: myHeight(2),
                                            resizeMode: 'contain',
                                            tintColor: myColors.textL4
                                        }}
                                        source={require('../../assets/home_main/home/driver.png')}
                                    />
                                    <Spacer paddingEnd={myWidth(2)} />
                                    <Text
                                        style={[
                                            styles.textCommon,
                                            {
                                                flex: 1,
                                                fontSize: myFontSize.body2,
                                                fontFamily: myFonts.bodyBold,
                                            },
                                        ]}
                                    >{item.driverName}
                                    </Text>
                                </>
                            }
                            <View style={{ flex: 1 }} />

                            <Text
                                style={[
                                    styles.textCommon,
                                    {

                                        fontSize: myFontSize.body2,
                                        fontFamily: myFonts.bodyBold,
                                        color: item.status < 0 ? 'red' : myColors.green
                                    },
                                ]}
                            >{item.status < 0 ? 'Cancelled' : item.status == 5 ? 'Completed' : `In Progress`}</Text>
                        </View>
                    </>

            } */}
            <Spacer paddingT={myHeight(1.5)} />
        </View>
    )

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: myColors.background,
    },

    //Text
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
});
