import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Alert, TextInput, TouchableOpacity, View, SafeAreaView, Image, Text, ScrollView, StatusBar, Easing, Linking } from 'react-native';
import { Loader, MyError, Spacer, StatusbarH, errorTime, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFonts, myLetSpacing, myFontSize } from '../../ultils/myFonts';
import firestore, { Filter } from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import { ImageUri } from '../common/image_uri';
import { FlashList } from '@shopify/flash-list';
import { useSelector } from 'react-redux';



export const RideDetails = ({ navigation, route }) => {
    const req = route.params.item
    const code = route.params.code
    const [errorMsg, setErrorMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const { allRequest } = useSelector(State => State.orders)
    const [item, setRequest] = useState(null)

    // const driver = item?.sendDrivers[0]

    useEffect(() => {
        if (allRequest.length) {

            setRequest(allRequest.find(it => it.id == req.id))
        }
    }, [allRequest])
    useEffect(() => {

        if (errorMsg) {
            setTimeout(() => {
                setIsLoading(false)
                setErrorMsg(null)
            }
                , errorTime)
        }
    }, [errorMsg])

    if (!item) {
        return
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
                    <TouchableOpacity
                        style={{
                            paddingEnd: myWidth(4)
                        }}
                        activeOpacity={0.8}
                        onPress={() => navigation.goBack()}>
                        <Image
                            style={{
                                width: myHeight(2.6),
                                height: myHeight(2.6),
                                resizeMode: 'contain',
                            }}
                            source={require('../assets/home_main/home/back.png')}
                        />
                    </TouchableOpacity>


                    <Text numberOfLines={1} style={[styles.textCommon, {
                        flex: 1,
                        fontFamily: myFonts.bodyBold, fontSize: myFontSize.xBody2
                    }]}>Request Details</Text>

                </View>
                <Spacer paddingT={myHeight(1.2)} />

                {/* Content */}
                <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{
                    backgroundColor: myColors.background, flexGrow: 1
                }}>
                    <Spacer paddingT={myHeight(1)} />


                    <View style={{ paddingHorizontal: myWidth(4), flexDirection: 'row' }}>
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
                                    height: myHeight(2.7),
                                    width: myHeight(2.7),
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
                                    height: myHeight(2.7),
                                    width: myHeight(2.7),
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
                                            fontSize: myFontSize.body4,
                                            fontFamily: myFonts.bodyBold,
                                        },
                                    ]}
                                >
                                    PickUp</Text>
                                <Image
                                    style={{
                                        width: myHeight(2.2),
                                        height: myHeight(2.2),
                                        resizeMode: 'contain',
                                        tintColor: myColors.primaryT
                                    }} source={require('../assets/home_main/home/clock.png')}
                                />
                                <Spacer paddingEnd={myWidth(1.3)} />

                                <Text style={[
                                    styles.textCommon,
                                    {
                                        fontSize: myFontSize.body,
                                        fontFamily: myFonts.body,
                                    },
                                ]}>{item.pickupTime.time}
                                </Text>
                            </View>
                            <Text numberOfLines={2}
                                style={[
                                    styles.textCommon,
                                    {
                                        fontSize: myFontSize.xxSmall,
                                        fontFamily: myFonts.body,
                                    },
                                ]}
                            >{item.pickup.name}</Text>

                            <Spacer paddingT={myHeight(1.8)} />

                            {/* Destination */}
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <Text
                                        style={[
                                            styles.textCommon,
                                            {
                                                flex: 1,
                                                fontSize: myFontSize.body4,
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
                                                    width: myHeight(2.2),
                                                    height: myHeight(2.2),
                                                    resizeMode: 'contain',
                                                    tintColor: myColors.primaryT
                                                }} source={require('../assets/home_main/home/clock.png')}
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
                                            fontSize: myFontSize.xxSmall,
                                            fontFamily: myFonts.body,
                                        },
                                    ]}
                                >{item.dropoff.name} </Text>
                            </View>
                        </View>
                    </View>

                    <Spacer paddingT={myHeight(2)} />

                    <View>
                        {item.sendDrivers ?


                            <>


                                <Text numberOfLines={1} style={[styles.textCommon, {
                                    flex: 1,
                                    paddingHorizontal: myWidth(4),
                                    fontFamily: myFonts.bodyBold, fontSize: myFontSize.xBody
                                }]}>Drivers</Text>
                                <Spacer paddingT={myHeight(0.3)} />

                                <FlashList
                                    showsVerticalScrollIndicator={false}
                                    scrollEnabled={false}
                                    data={item.sendDrivers}
                                    extraData={null}
                                    // extraData={[ac, wifi, topRated, search]}
                                    // contentContainerStyle={{ flexGrow: 1 }}
                                    // ItemSeparatorComponent={() =>
                                    //     <View style={{ borderTopWidth: myHeight(0.08), borderColor: myColors.offColor, width: "100%" }} />
                                    // }
                                    estimatedItemSize={myHeight(10)}
                                    renderItem={({ item, index }) => {
                                        const driver = item
                                        return (
                                            <TouchableOpacity disabled key={index} activeOpacity={0.85}
                                                onPress={() => navigation.navigate('DriverDetail', { driver: item })}>
                                                <View style={{
                                                    elevation: 5, backgroundColor: myColors.background,
                                                    flexDirection: 'row', alignItems: 'center',
                                                    paddingHorizontal: myWidth(2.5), borderRadius: myWidth(2),
                                                    paddingVertical: myHeight(1),
                                                    marginVertical: myHeight(1),
                                                    marginHorizontal: myWidth(4),



                                                }}>

                                                    <View style={{ flex: 1 }}>

                                                        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                                            <Image style={{
                                                                width: myHeight(2), height: myHeight(2),
                                                                marginLeft: -myWidth(0.3),
                                                                resizeMode: 'contain', marginTop: myHeight(0.2), tintColor: myColors.primaryT
                                                            }}
                                                                source={require('../assets/home_main/home/navigator/van2.png')} />
                                                            <Spacer paddingEnd={myWidth(1.5)} />
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
                                                        <Spacer paddingT={myHeight(0.4)} />

                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <Image style={{
                                                                width: myHeight(2), height: myHeight(2),
                                                                resizeMode: 'contain', marginTop: myHeight(0.0), tintColor: myColors.primaryT
                                                            }}
                                                                source={require('../assets/home_main/home/driver.png')} />
                                                            <Spacer paddingEnd={myWidth(1)} />

                                                            {/* Name */}
                                                            <Text numberOfLines={1}
                                                                style={{

                                                                    fontSize: myFontSize.body,
                                                                    fontFamily: myFonts.bodyBold,
                                                                    color: myColors.text,
                                                                    letterSpacing: myLetSpacing.common,
                                                                    includeFontPadding: false,
                                                                    padding: 0,
                                                                }}>{driver.name}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                        <Text numberOfLines={1}
                                                            style={[
                                                                styles.textCommon,
                                                                {

                                                                    fontSize: myFontSize.xxSmall,
                                                                    fontFamily: myFonts.heading,

                                                                    color: driver.status < 0 ? myColors.red : myColors.primaryT
                                                                },
                                                            ]}>{driver.status < 0 ? 'Rejected' : driver.status == 1 ? 'Sended' : 'Accepted'}</Text>
                                                        <Spacer paddingT={myHeight(0.6)} />

                                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                            <TouchableOpacity activeOpacity={0.85} style={{
                                                                padding: myHeight(0.8), backgroundColor: myColors.background,
                                                                elevation: 3,
                                                                borderRadius: 100
                                                            }}
                                                                onPress={() => { Linking.openURL(`tel:${driver.contact}`); }}
                                                            >
                                                                <Image source={require('../assets/home_main/home/phone.png')}
                                                                    style={{
                                                                        width: myHeight(1.8),
                                                                        height: myHeight(1.8),
                                                                        resizeMode: 'contain',
                                                                        tintColor: myColors.primaryT
                                                                    }}
                                                                />

                                                            </TouchableOpacity>
                                                            <Spacer paddingEnd={myWidth(2.5)} />

                                                            <TouchableOpacity activeOpacity={0.85} style={{
                                                                padding: myHeight(0.8), backgroundColor: myColors.background,
                                                                elevation: 3,
                                                                borderRadius: 100
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
                                                                        tintColor: myColors.primaryT
                                                                    }}
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    {/* <View style={{
                        position: 'absolute', zIndex: 2,
                        height: '100%', width: '100%', backgroundColor: '#00000010'
                    }} /> */}
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
                    </View>
                </ScrollView>




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

})