import React, { useEffect } from 'react';
import { Dimensions, View, Platform, StatusBar, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { MMKV } from 'react-native-mmkv';
import { myColors } from '../ultils/myColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { myFontSize, myFonts, myLetSpacing } from '../ultils/myFonts';
import Animated, { BounceInUp, FadeInUp, FadeOutUp, SlideInUp } from 'react-native-reanimated';
const { height, width } = Dimensions.get('window')
export const ios = Platform.OS == 'ios'
export const stutusH = StatusBar.currentHeight
import { Chase, Fold, Grid, Swing } from "react-native-animated-spinkit"
import { useDispatch, useSelector } from 'react-redux';
import { setErrorAlert } from '../redux/error_reducer';

export function printWithPlat(print) {
    console.log(`${Platform.OS} => ${print} ${height} ${StatusBar.currentHeight}`)
}
export function myHeight(per) {
    if (ios) {

        return (per * height) / 100
    }
    if (stutusH) {
        return (per * (height - stutusH)) / 100
    }
    return (per * (height)) / 100

}
export function myWidth(per) {
    const myHeight = (per * width) / 100
    return myHeight
}

export const Spacer = ({ paddingEnd = 0, paddingT = 0 }) => (
    <View style={{ paddingEnd: paddingEnd, paddingTop: paddingT }} />
)
export const Loader = () => (
    <View
        style={{
            height: '100%', width: myWidth(100), position: 'absolute', zIndex: 10,
            justifyContent: 'center', alignItems: 'center',
            backgroundColor: '#00000020'
        }}>
        <Grid size={myHeight(12)} color={myColors.primaryT} />

    </View>
)
export const MyError = ({ message = '' }) => {

    return (
        <Animated.View
            entering={FadeInUp}
            exiting={FadeOutUp}
            style={{
                marginTop: StatusBar.currentHeight + myHeight(1.5),
                zIndex: 100, position: 'absolute',
                paddingVertical: myHeight(0.7), paddingHorizontal: myWidth(4),
                width: myWidth(90), backgroundColor: myColors.ligRed,
                alignItems: 'center', alignSelf: 'center',
                borderRadius: myWidth(100)
            }}>

            <Text
                style={{
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.heading,
                    color: myColors.background,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                }}
            >{message}</Text>
        </Animated.View>
    )
}

export const bottomTab = {
    backgroundColor: myColors.background,
    paddingHorizontal: myWidth(3.5),
    alignItems: 'center',
    justifyContent: 'center',
    height: myHeight(7.5),
    paddingBottom: ios ? myHeight(2.2) : myHeight(0.5),
    paddingTop: myHeight(2),
    borderTopWidth: 1.5,
}
export const storage = new MMKV()

export const StatusBarShow = () => (
    <StatusBar backgroundColor={myColors.background} translucent={false} />
)
export const StatusBarBlack = () => (
    <StatusBar backgroundColor={myColors.text} translucent={false} />
)
export const StatusBarHide = () => (
    <StatusBar backgroundColor={'transparent'} translucent={true} />
)

export const StatusbarH = () => (
    <View style={{ height: StatusBar.currentHeight }} />
)


export const errorTime = 2000
export const NotiAlertNew = () => {
    const { error } = useSelector(state => state.error)
    const dispatch = useDispatch()
    useEffect(() => {
        if (error) {
            setTimeout(() => {
                dispatch(setErrorAlert(null))
            }, 4000)
        }
    }, [error])
    if (error == null) {
        return null
    }
    const { Title, Body, Status } = error
    return (
        <View style={{ position: 'absolute', zIndex: 10, width: '100%', backgroundColor: 'transparent' }}>
            <Animated.View entering={SlideInUp.duration(500)}>

                <StatusbarH />
                <Spacer paddingT={myHeight(2)} />
                <TouchableOpacity disabled activeOpacity={0.8} style={{
                    // height: myHeight(11),
                    backgroundColor: myColors.background, marginHorizontal: myWidth(4),
                    borderRadius: myWidth(3), borderWidth: 1, borderColor: myColors.offColor7, elevation: 3,
                    flexDirection: 'row', overflow: 'hidden',
                }}>
                    <View style={{
                        width: myWidth(2), height: '100%',
                        backgroundColor: Status == 0 ? myColors.red : Status == 1 ? myColors.offColor : myColors.primary
                    }} />
                    <View style={{
                        paddingHorizontal: myWidth(2.4),
                        paddingVertical: myHeight(1.2)
                    }}>
                        {
                            Title &&
                            <Text style={[styles.textCommon, {
                                fontSize: myFontSize.body,
                                fontFamily: myFonts.bodyBold,

                            }]}>{Title}</Text>
                        }

                        {
                            Body &&
                            <Text style={[styles.textCommon, {
                                fontSize: myFontSize.xxSmall,
                                fontFamily: myFonts.body,

                            }]}>{Body}</Text>
                        }
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: myColors.background
    },


    //Text
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

})