import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import { Image, SafeAreaView, ScrollView } from "react-native";
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
import ActionSheet from "react-native-actions-sheet";

// import Animated, { SlideInDown, FadeInUp, FadeOutUp } from 'react-native-reanimated';
export const AccScreen = ({ navigation }) => {
    const modalizeRef = useRef();
    const actionSheetRef = useRef(null);

    const [onLogin, setOnLogin] = useState(null)

    const [errorMsg, setErrorMsg] = useState(null)
    const [loading, setLoading] = useState(false)

    const [city, setCity] = useState(null)
    const [showCityModal, setShowCityModal] = useState(false)



    const [name, setName] = useState(null)

    const [email, setEmail] = useState(null)
    const [password, setPass] = useState(null)

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
        if (showCityModal) {
            onClose()
        } else if (onLogin != null) {
            onOpen()
        }
    }, [showCityModal])


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

        // modalizeRef.current?.open();
        actionSheetRef?.current?.show()
    };
    const onClose = () => {

        // modalizeRef.current?.open();
        actionSheetRef?.current?.hide()
    };

    return (
        <>

            <View style={styles.container}>
                {/* <StatusbarH /> */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                    <View
                        style={{
                            height: myHeight(42), width: '100%', overflow: 'hidden', backgroundColor: myColors.text,
                            borderBottomStartRadius: myHeight(50), borderBottomEndRadius: myHeight(50), justifyContent: 'center', alignItems: 'center'
                        }}>
                        <Text style={{
                            color: myColors.background, fontSize: myFontSize.large2, fontFamily: myFonts.heading
                        }}>Get {'\n'}Started<Text style={{ color: myColors.primaryT }}>,</Text></Text>

                    </View>


                    <View style={{ alignItems: 'center' }}>


                        {/* <Image resizeMode="contain" style={{
                        maxWidth: myWidth(75),
                        maxHeight: myHeight(27.7)
                    }}
                        source={require('../assets/account/welcome.png')} />

                    <Spacer paddingT={myHeight(8.5)} /> */}

                        {/* T Welcome */}
                        <Text style={styles.textWel}>Welcome</Text>

                        <Spacer paddingT={myHeight(1)} />
                        <Text style={styles.textDetail}>
                            Before enjoying Food media services Please register first</Text>

                        <Spacer paddingT={myHeight(3)} />

                    </View>

                    <View>

                        {/* B Create Acc */}
                        <TouchableOpacity activeOpacity={0.8} style={[styles.bigButton, { backgroundColor: myColors.primaryT }]}
                            onPress={() => {
                                // setOnAcc(true)
                                onOpen()
                                setOnLogin(true)
                            }}
                        >
                            <Text style={styles.textCreateAcc}>Login</Text>
                        </TouchableOpacity>

                        <Spacer paddingT={myHeight(2)} />
                        {/* B Create Login */}
                        <TouchableOpacity activeOpacity={0.8} style={[styles.bigButton, { backgroundColor: myColors.offColor7 }]}
                            onPress={() => {
                                // setOnAcc(true)
                                onOpen()

                                setOnLogin(false)
                                // navigation.navigate('ForgetPass')
                            }}>
                            <Text style={styles.textLogin}>Sign Up</Text>
                        </TouchableOpacity>
                        <Spacer paddingT={myHeight(3)} />


                    </View>
                    <View>

                        {/* <Lottie
                            autoPlay={true}
                            loop={true}
                            source={require('../assets/lottie/van2.json')}
                            style={{
                                // backgroundColor: 'red',
                                height: myWidth(50),
                            }}
                        /> */}
                    </View>


                    {/* T Term & Policy */}
                    {/* <Text style={styles.textTerm}>By logging in or registering, you have agreed to{'\n'}
                        <Text onPress={() => null} style={{ color: myColors.primaryT }}> The Terms and Conditions</Text> And
                        <Text onPress={() => null} style={{ color: myColors.primaryT }}> Privacy Policy</Text>
                    </Text>
                    <Spacer paddingT={myHeight(2)} /> */}
                </View>

                {/* <ActionSheet indicatorStyle={{ height: 1 }} gestureEnabled snapPoints={[50, 95]} ref={actionSheetRef}
                    closeOnPressBack={true} closable={true}

                >
                    <SafeAreaView style={{ paddingBottom: myHeight(5), height: '100%', backgroundColor: 'white', borderRadius: myWidth(10) }}>

                        <Text style={{ color: 'black' }}>Hi, I am here.</Text>
                        <Text style={{ color: 'black' }}>Hi, I am here.</Text>
                        <Text style={{ color: 'black' }}>Hi, I am here.</Text>
                        <Text style={{ color: 'black' }}>Hi, I am here.</Text>
                        <Text style={{ color: 'black' }}>Hi, I am here.</Text>
                        <Text style={{ color: 'black' }}>Hi, I am here.</Text>
                        <Text style={{ color: 'black' }}>Hi, I am here.</Text>
                    </SafeAreaView>
                </ActionSheet> */}

                <ActionSheet zIndex={10} indicatorStyle={{ height: myHeight(0.8), width: myWidth(28), marginTop: myHeight(1) }}
                    gestureEnabled snapPoints={[95]} ref={actionSheetRef}
                    closeOnPressBack={true} onClose={() => { console.log('chalaaaaa') }} closable={true} containerStyle={{}}
                >

                    <TouchableOpacity activeOpacity={1} style={{ zIndex: 8, height: '100%', alignItems: 'center' }}>
                        <Spacer paddingT={myHeight(1)} />
                        {/* Back line */}
                        {/* <View style={{ width: myWidth(15), height: myHeight(0.8), borderRadius: 20, backgroundColor: myColors.dot }} /> */}

                        <Spacer paddingT={myHeight(3)} />
                        {/* Navigator */}
                        <View style={{ alignSelf: 'flex-start', flexDirection: 'row' }}>
                            <Spacer paddingEnd={myWidth(9.6)} />
                            <View style={{ flexDirection: 'row', width: myWidth(70), justifyContent: 'space-between' }}>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => setOnLogin(true)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: myFontSize.xBody, fontFamily: myFonts.heading, color: onLogin ? myColors.primaryT : myColors.textL4 }}>Login</Text>
                                    <Spacer paddingT={myHeight(0.2)} />
                                    <View style={{ width: '80%', height: 3, backgroundColor: onLogin ? myColors.primaryT : myColors.background }} />
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => setOnLogin(false)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: myFontSize.xBody, fontFamily: myFonts.heading, color: onLogin ? myColors.textL4 : myColors.primaryT }}>Create Account</Text>
                                    <Spacer paddingT={myHeight(0.2)} />
                                    <View style={{ width: '80%', height: 3, backgroundColor: onLogin ? myColors.background : myColors.primaryT }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* <Spacer paddingT={myHeight(4.4)}/> */}
                        {onLogin ?
                            <Login navigation={navigation} showError={showError} showLoading={setLoading}
                                email={email} setEmail={setEmail} password={password} setPass={setPass} onClose={onClose}
                            />
                            :
                            <CreateAcc navigate={navigation.navigate} showError={showError} showLoading={setLoading} city={city} setShowCityModal={setShowCityModal}

                                email={email} setEmail={setEmail} password={password} setPass={setPass} name={name} setName={setName} onClose={onClose}
                            />}
                        <Spacer paddingT={myHeight(4.4)} />

                    </TouchableOpacity>
                    {errorMsg && <MyError message={errorMsg} />}
                    {loading && <Loader />}


                </ActionSheet>








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
        width: myWidth(54), height: myHeight(6),
        borderRadius: myHeight(50), justifyContent: 'center',
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
        color: myColors.text, fontSize: myFontSize.body, fontFamily: myFonts.headingBold
    },




})