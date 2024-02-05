import { Image, TouchableOpacity, SafeAreaView, StyleSheet, Text, View, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Spacer, myHeight, myWidth } from "../../common"
import { myFontSize, myFonts, myLetSpacing } from "../../../ultils/myFonts"
import { myColors } from "../../../ultils/myColors"
import { useDispatch, useSelector } from 'react-redux'
import { addFavoriteRest, removeFavoriteRest } from '../../../redux/favorite_reducer'
import { ImageUri } from '../../common/image_uri'
export const DriverInfoFull = ({ driver }) => {
    const { favoriteDrivers } = useSelector(state => state.favorite)
    const dispatch = useDispatch()

    const checkFav = favoriteDrivers.find(redID => redID == driver.uid)
    const [isFav, setIsFav] = useState(checkFav != null)

    function changeFav() {
        if (!isFav) {
            dispatch(addFavoriteRest({ resId: driver.uid }))
        } else {
            dispatch(removeFavoriteRest({ resId: driver.uid }))
        }
        setIsFav(!isFav)
    }
    useEffect(() => {
        setIsFav(checkFav != null)
    }, [checkFav])


    return (
        <View style={{ paddingVertical: myHeight(1.5) }}>
            <View style={styles.container}>
                {/* Image & Others*/}

                <View style={{
                    height: myHeight(16),
                    width: '100%',
                    // resizeMode: 'cover',
                    // borderRadius: myWidth(2.5),
                    borderTopRightRadius: myWidth(3.5),
                    borderTopLeftRadius: myWidth(3.5),
                    overflow: 'hidden'
                }}>

                    <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={driver.vehicleImage} />

                    <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', top: myHeight(0.8) }}>

                        <View style={{ flex: 1 }}>

                            {
                                driver.deal &&

                                <View style={{
                                    backgroundColor: myColors.primaryT,
                                    paddingHorizontal: myWidth(3),
                                    borderTopEndRadius: myWidth(1.5), paddingVertical: myHeight(0.3),
                                    borderBottomEndRadius: myWidth(1.5), alignSelf: 'flex-start'
                                }}>
                                    <Text numberOfLines={1} style={styles.textDeal}>{driver.deal}</Text>
                                </View>

                            }
                        </View>

                        {/* Heart */}
                        <TouchableOpacity activeOpacity={0.85}
                            onPress={changeFav}
                            style={styles.containerHeart}>
                            {/* <Text style={styles.textRating}>Dill</Text> */}
                            <Image style={styles.imageHeart}

                                source={isFav ? require('../../assets/home_main/home/heart.png') : require('../../assets/home_main/home/heart_o.png')} />
                        </TouchableOpacity>
                    </View>

                </View>
                <Spacer paddingT={myHeight(0.5)} />

                {/* Detals */}
                <View style={{ paddingHorizontal: myWidth(2) }}>

                    {/* Name & Rating */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        {/* Name */}
                        <Text numberOfLines={1}
                            style={styles.textName}>{driver.vehicleName} <Text style={{
                                fontSize: myFontSize.body4,
                                color: myColors.text, fontFamily: myFonts.body
                            }}>({driver.vehicleModal})</Text></Text>

                        <Spacer paddingEnd={myWidth(1.5)} />

                        <Image style={{
                            width: myHeight(2.9), height: myHeight(2.9),
                            resizeMode: 'contain', marginTop: myHeight(0.2), tintColor: myColors.texts
                        }}
                            source={require('../../assets/home_main/home/ac.png')} />
                        <Spacer paddingEnd={myWidth(2.5)} />

                        <Text

                            style={{
                                fontSize: myFontSize.body3,
                                fontFamily: myFonts.bodyBold,
                                color: myColors.text,
                                letterSpacing: myLetSpacing.common,
                                includeFontPadding: false,
                                padding: 0,
                            }}>{driver.ac ? 'AC' : 'Non AC'}</Text>
                        <Spacer paddingEnd={myWidth(1.5)} />

                        {/* Rating */}
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image style={styles.imageStar} source={require('../../assets/home_main/home/star.png')} />

        <Spacer paddingEnd={myWidth(1.6)} />
        <Text style={styles.textRating}>{driver.rating}</Text>
    </View> */}
                    </View>
                    <Spacer paddingT={myHeight(0.3)} />

                    {/* Name & Rating */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{
                            width: myHeight(2), height: myHeight(2),
                            resizeMode: 'contain', marginTop: myHeight(0.0), tintColor: myColors.text
                        }}
                            source={require('../../assets/home_main/home/driver.png')} />
                        <Spacer paddingEnd={myWidth(1.5)} />

                        {/* Name */}
                        <Text numberOfLines={1}
                            style={{
                                flex: 1,
                                fontSize: myFontSize.body2,
                                fontFamily: myFonts.bodyBold,
                                color: myColors.text,
                                letterSpacing: myLetSpacing.common,
                                includeFontPadding: false,
                                padding: 0,
                            }}>{driver.name}</Text>

                        <Spacer paddingEnd={myWidth(1.5)} />

                        <Image style={{
                            width: myHeight(2), height: myHeight(2),
                            resizeMode: 'contain', marginTop: myHeight(0.0), tintColor: myColors.textL
                        }}
                            source={require('../../assets/home_main/home/seatSF.png')} />
                        <Spacer paddingEnd={myWidth(1.5)} />

                        <Text

                            style={{
                                fontSize: myFontSize.body3,
                                fontFamily: myFonts.bodyBold,
                                color: myColors.text,
                                letterSpacing: myLetSpacing.common,
                                includeFontPadding: false,
                                padding: 0,
                            }}>{driver.vehicleSeats} Seats</Text>
                        <Spacer paddingEnd={myWidth(1.5)} />
                    </View>
                    {/* Location */}
                    {/* <View style={{ flexDirection: 'row', }}>
    <Image style={styles.imageLoc}
        source={require('../../assets/home_main/home/loc.png')} />
    <Spacer paddingEnd={myWidth(0.8)} />
    <Text numberOfLines={1} style={[styles.textCommon, {
        flex: 1,
        fontSize: myFontSize.body,
        fontFamily: myFonts.bodyBold,
        color: myColors.text,

    }]}>{driver.location}</Text>
</View> */}

                    {/* restaurants */}
                    {/* <Text numberOfLines={1} style={styles.textrestaurants}>{restaurants}</Text> */}
                    <Spacer paddingT={myHeight(1)} />

                </View>






            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: myWidth(92),
        backgroundColor: myColors.background,
        overflow: 'hidden',
        borderRadius: myWidth(3.5),
        elevation: 4,
        alignSelf: 'center',

    },

    containerIcon: {
        borderWidth: myHeight(0.1),
        borderColor: myColors.primaryT,
        borderRadius: myHeight(10),
        // position: 'absolute',
        // zIndex: 12,
        marginStart: myWidth(4),
        alignSelf: 'flex-start',
        marginTop: -myHeight(3.5),
    },
    containerVeri: {
        position: 'absolute',
        zIndex: 2,
        right: myWidth(0.7),
        bottom: -myHeight(0.1),
        backgroundColor: myColors.darkBlue,
        padding: myHeight(0.085),
        borderRadius: myHeight(2),
    },
    containerRating: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: myWidth(2.5),
        paddingVertical: myHeight(0.1),
        borderRadius: myWidth(1.5),
    },
    containerHeart: {
        alignSelf: 'flex-end',
        backgroundColor: myColors.background,
        padding: myHeight(0.8),
        borderRadius: myWidth(5),
        marginVertical: myHeight(0.5),
        marginHorizontal: myWidth(2)
    },
    containerImageEffect: {
        height: myHeight(13), top: 0,
        width: myWidth(52), zIndex: 0, position: 'absolute',
        backgroundColor: '#00000020'
    },

    //Text
    textName: {
        flex: 1,
        fontSize: myFontSize.xBody,
        fontFamily: myFonts.heading,
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
    textrestaurants: {
        fontSize: myFontSize.small3,
        fontFamily: myFonts.bodyBold,
        color: myColors.textL4,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
    textDelivery_Time: {
        // flex: 1,
        fontSize: myFontSize.xxSmall,
        fontFamily: myFonts.bodyBold,
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
    textRating: {
        // flex: 1,
        fontSize: myFontSize.xBody,
        fontFamily: myFonts.bodyBold,
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
    textDeal: {
        fontSize: myFontSize.body3,
        fontFamily: myFonts.bodyBold,
        color: myColors.background,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

    //Images
    imageRes: {
        height: myHeight(15),
        width: '100%',
        resizeMode: 'cover',
        // borderTopRightRadius: myWidth(2.5),
        // borderTopLeftRadius: myWidth(2.5),
    },
    imageDelivery: {
        height: myHeight(2.6),
        width: myHeight(2.6),
        resizeMode: 'contain',
    },
    imageTime: {
        height: myHeight(2),
        width: myHeight(2),
        resizeMode: 'contain',
    },
    imageIcon: {
        height: myHeight(7),
        width: myHeight(7),
        borderRadius: myHeight(4),
        resizeMode: 'contain',
        borderWidth: myHeight(0.2),
        borderColor: myColors.background,
        overflow: 'hidden'
    },
    imageVeri: {
        height: myHeight(1.2),
        width: myHeight(1.2),
        resizeMode: 'contain',
    },
    imageStar: {
        height: myHeight(2.1),
        width: myHeight(2.1),
        tintColor: myColors.star,
        resizeMode: 'contain',
    },
    imageHeart: {
        height: myHeight(2.6),
        width: myHeight(2.6),
        resizeMode: 'contain',
        tintColor: myColors.red,
    },
    imageLoc: {
        width: myHeight(2.2), height: myHeight(2.2),
        resizeMode: 'contain', marginTop: myHeight(0.2)

    }


})