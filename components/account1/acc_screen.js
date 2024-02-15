import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import { Image, ScrollView } from "react-native";
import { View, Text, Dimensions, StyleSheet, StatusBar, TouchableOpacity, BackHandler } from "react-native";
import { errorTime, Loader, MyError, myHeight, myWidth, Spacer, StatusbarH } from "../common";
import { myFontSize, myFonts, myLetSpacing } from "../../ultils/myFonts";
import { myColors } from "../../ultils/myColors";
import { Login } from "./acc.components/login";
import { CreateAcc } from "./acc.components/create_acc";
import Animated, { SlideInDown } from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SelectCity } from "./select_city";
import { Modalize } from "react-native-modalize";
import Lottie from 'lottie-react-native';

// import Animated, { SlideInDown, FadeInUp, FadeOutUp } from 'react-native-reanimated';
export const AccScreen = ({ navigation }) => {
    const modalizeRef = useRef();

    const [onLogin, setOnLogin] = useState(false)

    const [errorMsg, setErrorMsg] = useState(null)
    const [loading, setLoading] = useState(false)

    const [city, setCity] = useState(null)
    const [showCityModal, setShowCityModal] = useState(false)

    function showError(message) {
        setLoading(false)
        setErrorMsg(message)
    }
    // const onBackPress = () => {
    //     if (showCityModal) {
    //         setShowCityModal(false)
    //         return true
    //     }
    //     if (onAcc) {
    //         setOnAcc(false)
    //         return true
    //     }
    //     return false
    // };



    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                setLoading(false)
                setErrorMsg(null)
            }
                , errorTime)
        }
    }, [errorMsg, showCityModal])

    // useLayoutEffect(
    //     React.useCallback(() => {

    //         BackHandler.addEventListener(
    //             'hardwareBackPress', onBackPress
    //         );
    //         return () =>
    //             BackHandler.removeEventListener(
    //                 'hardwareBackPress', onBackPress
    //             );
    //     }, [onAcc])
    // );

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    return (
        <>

            <View style={styles.container}>
                <StatusbarH />
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Spacer paddingT={myHeight(6)} />

                    <Image resizeMode="contain" style={{
                        maxWidth: myWidth(75),
                        maxHeight: myHeight(27.7)
                    }}
                        source={require('../assets/account/welcome.png')} />

                    <Spacer paddingT={myHeight(8.5)} />
                    {/* <Lottie
                        autoPlay={true}
                        loop={true}
                        source={require('../assets/lottie/van.json')}
                        style={{
                            // backgroundColor: 'red',
                            height: myWidth(55),
                        }}
                    /> */}
                    {/* T Welcome */}
                    <Text style={styles.textWel}>Welcome</Text>

                    <Spacer paddingT={myHeight(1)} />
                    {/* T Detail */}
                    <Text style={styles.textDetail}>
                        Before enjoying Food media services Please register first</Text>
                    <Spacer paddingT={myHeight(18)} />

                    {/* B Create Acc */}
                    <TouchableOpacity activeOpacity={0.8} style={[styles.bigButton, { backgroundColor: myColors.primary }]}
                        onPress={() => {
                            // setOnAcc(true)
                            onOpen()
                            setOnLogin(false)
                        }}
                    >
                        <Text style={styles.textCreateAcc}>Create Account</Text>
                    </TouchableOpacity>

                    <Spacer paddingT={myHeight(2)} />
                    {/* B Create Login */}
                    <TouchableOpacity activeOpacity={0.8} style={[styles.bigButton, { backgroundColor: myColors.primaryL5 }]}
                        onPress={() => {
                            // setOnAcc(true)
                            onOpen()

                            setOnLogin(true)
                            // navigation.navigate('ForgetPass')
                        }}>
                        <Text style={styles.textLogin}>Login</Text>
                    </TouchableOpacity>

                    <View style={{ flex: 1 }} />
                    {/* T Term & Policy */}
                    <Text style={styles.textTerm}>By logging in or registering, you have agreed to{'\n'}
                        <Text onPress={() => null} style={{ color: myColors.primary }}> The Terms and Conditions</Text> And
                        <Text onPress={() => null} style={{ color: myColors.primary }}> Privacy Policy</Text>
                    </Text>
                    <Spacer paddingT={myHeight(2)} />
                </View>



                <Modalize ref={modalizeRef}
                >

                    <TouchableOpacity activeOpacity={1} style={{ flex: 1, alignItems: 'center' }}>
                        <Spacer paddingT={myHeight(1)} />
                        {/* Back line */}
                        {/* <View style={{ width: myWidth(15), height: myHeight(0.8), borderRadius: 20, backgroundColor: myColors.dot }} /> */}

                        <Spacer paddingT={myHeight(3)} />
                        {/* Navigator */}
                        <View style={{ alignSelf: 'flex-start', flexDirection: 'row' }}>
                            <Spacer paddingEnd={myWidth(9.6)} />
                            <View style={{ flexDirection: 'row', width: myWidth(63.5), justifyContent: 'space-between' }}>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => setOnLogin(false)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: myFontSize.xBody, fontFamily: myFonts.heading, color: onLogin ? myColors.textL4 : myColors.primary }}>Create Account</Text>
                                    <Spacer paddingT={myHeight(0.2)} />
                                    <View style={{ width: '80%', height: 3, backgroundColor: onLogin ? myColors.background : myColors.primary }} />
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => setOnLogin(true)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: myFontSize.xBody, fontFamily: myFonts.heading, color: onLogin ? myColors.primary : myColors.textL4 }}>Login</Text>
                                    <Spacer paddingT={myHeight(0.2)} />
                                    <View style={{ width: '80%', height: 3, backgroundColor: onLogin ? myColors.primary : myColors.background }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* <Spacer paddingT={myHeight(4.4)}/> */}
                        {onLogin ?
                            <Login navigation={navigation} showError={showError} showLoading={setLoading} />
                            :
                            <CreateAcc navigate={navigation.navigate} showError={showError} showLoading={setLoading} city={city} setShowCityModal={setShowCityModal} />}
                        {/* <Spacer paddingT={myHeight(4)}/> */}
                    </TouchableOpacity>
                    {errorMsg && <MyError message={errorMsg} />}
                    {loading && <Loader />}
                </Modalize>








            </View>


            {showCityModal &&
                <SelectCity showCityModal={setShowCityModal} setCity={setCity} city={city} />
            }

        </>

    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center', 
        backgroundColor: myColors.background,

    },
    textTerm: {
        maxWidth: myWidth(85), textAlign: 'center',
        color: myColors.text, fontSize: myFontSize.xxSmall,
        textTransform: 'capitalize',
    },
    bigButton: {
        width: myWidth(68), height: myHeight(6.1),
        borderRadius: myHeight(1.47), justifyContent: 'center',
        alignItems: 'center',
    },
    textWel: {
        color: myColors.black, fontSize: myFontSize.large, fontFamily: myFonts.heading
    },
    textDetail: {
        maxWidth: myWidth(66.6), color: myColors.textL4, fontSize: myFontSize.xxSmall,
        fontFamily: myFonts.bodyBold, textTransform: 'capitalize', textAlign: 'center'
    },
    textCreateAcc: {
        color: myColors.background, fontSize: myFontSize.body, fontFamily: myFonts.headingBold,
    },
    textLogin: {
        color: myColors.primary, fontSize: myFontSize.body, fontFamily: myFonts.headingBold
    },




})