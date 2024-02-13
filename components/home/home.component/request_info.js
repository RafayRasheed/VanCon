
import { Image, TouchableOpacity, SafeAreaView, StyleSheet, Text, View, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Spacer, myHeight, myWidth } from "../../common"
import { myFontSize, myFonts, myLetSpacing } from "../../../ultils/myFonts"
import { myColors } from "../../../ultils/myColors"
import { useDispatch, useSelector } from 'react-redux'
import { addFavoriteRest, removeFavoriteRest } from '../../../redux/favorite_reducer'
import { ImageUri } from '../../common/image_uri'
import database from '@react-native-firebase/database';
import { FirebaseUser, sendPushNotification } from '../../functions/firebase'
import { setErrorAlert } from '../../../redux/error_reducer'
import firestore from '@react-native-firebase/firestore';

export const RequestInfo = ({ item, navigation, code }) => {
    console.log(item)
    const { profile } = useSelector(state => state.profile)
    const [load, setLoad] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (item.unread) {
            database()
                .ref(`/requests/${profile.uid}/${item.id}`).update({ unread: false }).
                then(() => { console.log('To Unread successfully') })
                .catch((err) => { console.log('error on update unread err') })
        }
    }, [item])

    function onRemove() {


        setLoad(true)
        database()
            .ref(`/requests/${profile.uid}/${item.id}`).update({ status: -5 })
            .then(() => {
                console.log('To onRemove successfully')
                dispatch(setErrorAlert({ Title: 'Request Remove Successfully', Body: null, Status: 2 }))
                setTimeout(() => {

                    setLoad(false)
                }, item.status == 1 ? 0 : 1000)

                if (item.status != 1) {
                    item.sendDrivers.map(di => {
                        if (di.status == 1) {
                            database()
                                .ref(`/requests/${di.did}/${item.id}`).update({ status: -5 })
                                .then(() => {
                                    firestore().collection('drivers').doc(di.did).get().then((data) => {
                                        const captain = data.data()
                                        const token = captain.deviceToken
                                        sendPushNotification('Request Cancelled', `Request ${item.id} is cancelled by ${profile.name}`, 0, [token])

                                    }).catch((err) => { console.log(err) })
                                }).catch((err) => {
                                    console.log('error on accept unread err', err)


                                })
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
                marginBottom: myHeight(1), marginTop: myHeight(1),
                borderBottomWidth: myHeight(0.2), borderColor: myColors.divider
            }}>
            <Spacer paddingT={myHeight(1)} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    style={{
                        width: myHeight(2.3),
                        height: myHeight(2.3),
                        resizeMode: 'contain',
                        tintColor: myColors.primaryT
                    }} source={item.twoWay ? require('../../assets/home_main/home/twoArrow.png') : require('../../assets/home_main/home/oneArrow.png')}
                />

                <Spacer paddingEnd={myWidth(2.4)} />
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>

                    <Text
                        style={[
                            styles.textCommon,
                            {

                                fontSize: myFontSize.body,
                                fontFamily: myFonts.body,
                            },
                        ]}
                    >ID: {item.id} </Text>
                    <Spacer paddingEnd={myWidth(2)} />

                    <Image
                        style={{
                            width: myHeight(2),
                            height: myHeight(2),
                            resizeMode: 'contain',
                            tintColor: myColors.primaryT
                        }} source={require('../../assets/home_main/home/distance.png')}
                    />
                    <Spacer paddingEnd={myWidth(1.2)} />

                    <Text
                        style={[
                            styles.textCommon,
                            {

                                fontSize: myFontSize.xSmall,
                                fontFamily: myFonts.bodyBold,
                            },
                        ]}
                    >{item.distance} </Text>

                    <Spacer paddingEnd={myWidth(2.5)} />

                    <Image
                        style={{

                            width: myHeight(1.6),
                            height: myHeight(1.6),
                            resizeMode: 'contain',
                            tintColor: myColors.primaryT
                        }}
                        source={require('../../assets/home_main/home/seatSF.png')}
                    />
                    <Spacer paddingEnd={myWidth(1)} />
                    <Text
                        style={[
                            styles.textCommon,
                            {
                                flex: 1,
                                fontSize: myFontSize.body,
                                fontFamily: myFonts.bodyBold,
                            },
                        ]}
                    >{item.seats}
                    </Text>
                </View>

                {
                    code == 2 ?
                        <>
                            {
                                item.status == 1 &&
                                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('RequestRide', { preReq: item })}>
                                    <Text
                                        style={[
                                            styles.textCommon,
                                            {
                                                fontSize: myFontSize.body2,
                                                fontFamily: myFonts.heading,
                                                color: myColors.primaryT,
                                                paddingStart: myWidth(3)
                                            },
                                        ]}
                                    >{'EDIT'}</Text>
                                </TouchableOpacity>
                            }
                        </>
                        :
                        null
                }



            </View>
            <Spacer paddingT={myHeight(1.2)} />

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
                        <Image
                            style={{
                                width: myHeight(2),
                                height: myHeight(2),
                                resizeMode: 'contain',
                                tintColor: myColors.primaryT
                            }} source={require('../../assets/home_main/home/clock.png')}
                        />
                        <Spacer paddingEnd={myWidth(1.3)} />

                        <Text style={[
                            styles.textCommon,
                            {
                                fontSize: myFontSize.xxSmall,
                                fontFamily: myFonts.body,
                            },
                        ]}>{item.pickupTime.time}
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
                                    <Image
                                        style={{
                                            width: myHeight(2),
                                            height: myHeight(2),
                                            resizeMode: 'contain',
                                            tintColor: myColors.primaryT
                                        }} source={require('../../assets/home_main/home/clock.png')}
                                    />
                                    <Spacer paddingEnd={myWidth(1.3)} />
                                    <Text style={[
                                        styles.textCommon,
                                        {
                                            fontSize: myFontSize.xxSmall,
                                            fontFamily: myFonts.body,
                                        },
                                    ]}>{item.dropoffTime.time}
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
            <Spacer paddingT={myHeight(1.2)} />

            {
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
                                            color: myColors.primaryT
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
                                                    color: myColors.primaryT
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
                                            tintColor: myColors.primaryT
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
                                        color: item.status < 0 ? 'red' : myColors.primaryT
                                    },
                                ]}
                            >{item.status < 0 ? 'Cancelled' : item.status == 5 ? 'Completed' : `In Progress`}</Text>
                        </View>
                    </>

            }
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
