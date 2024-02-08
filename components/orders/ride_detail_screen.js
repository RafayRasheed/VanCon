import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Alert, TextInput, TouchableOpacity, View, SafeAreaView, Image, Text, ScrollView, StatusBar, Easing } from 'react-native';
import { Loader, MyError, Spacer, StatusbarH, errorTime, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFonts, myLetSpacing, myFontSize } from '../../ultils/myFonts';
import firestore, { Filter } from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import { ImageUri } from '../common/image_uri';



export const RideDetails = ({ navigation, route }) => {
    const { item, code } = route.params
    const [errorMsg, setErrorMsg] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {

        if (errorMsg) {
            setTimeout(() => {
                setIsLoading(false)
                setErrorMsg(null)
            }
                , errorTime)
        }
    }, [errorMsg])



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
                    paddingHorizontal: myWidth(4), backgroundColor: myColors.background, flexGrow: 1
                }}>
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