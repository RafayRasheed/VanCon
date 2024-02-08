
import { Image, TouchableOpacity, SafeAreaView, StyleSheet, Text, View, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Spacer, myHeight, myWidth } from "../../common"
import { myFontSize, myFonts, myLetSpacing } from "../../../ultils/myFonts"
import { myColors } from "../../../ultils/myColors"
import { useDispatch, useSelector } from 'react-redux'
import { addFavoriteRest, removeFavoriteRest } from '../../../redux/favorite_reducer'
import { ImageUri } from '../../common/image_uri'

export const RequestInfo = ({ item, navigation, code }) => {
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
                {
                    code != 2 &&
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
                        <Spacer paddingEnd={myWidth(2.8)} />
                        <Text
                            style={[
                                styles.textCommon,
                                {
                                    flex: 1,
                                    fontSize: myFontSize.body4,
                                    fontFamily: myFonts.bodyBold,
                                },
                            ]}
                        >{item.name}
                        </Text>
                    </>
                }

                <Text
                    style={[
                        styles.textCommon,
                        {
                            flex: code == 2 ? 1 : null,
                            fontSize: myFontSize.body2,
                            fontFamily: myFonts.body,
                        },
                    ]}
                >ID: {item.id}</Text>
                {
                    code == 2 &&
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
                    <View>
                        <Text
                            style={[
                                styles.textCommon,
                                {
                                    fontSize: myFontSize.xxSmall,
                                    fontFamily: myFonts.bodyBold,
                                },
                            ]}
                        >
                            PickUp
                        </Text>
                        <Text numberOfLines={2}
                            style={[
                                styles.textCommon,
                                {
                                    fontSize: myFontSize.small,
                                    fontFamily: myFonts.body,
                                },
                            ]}
                        >{item.pickup.name}</Text>
                    </View>

                    <Spacer paddingT={myHeight(1.3)} />

                    {/* Destination */}
                    <View>
                        <Text
                            style={[
                                styles.textCommon,
                                {
                                    fontSize: myFontSize.xxSmall,
                                    fontFamily: myFonts.bodyBold,
                                },
                            ]}
                        >
                            DropOff
                        </Text>
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
                code == 2 &&
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
                    >{item.status == 1 ? 'Not send to any driver yet' : `Send to ${item.sendDrivers.length} drivers yet`}</Text>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => null}>
                        <Text
                            style={[
                                styles.textCommon,
                                {
                                    fontSize: myFontSize.body,
                                    fontFamily: myFonts.heading,
                                    color: myColors.primaryT
                                },
                            ]}
                        >{item.status == 1 ? 'Send Now' : 'Send More'}</Text>
                    </TouchableOpacity>
                </View>
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
