import { useEffect, useRef, useState } from "react"
import { Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { myFontSize, myFonts, myLetSpacing } from "../../ultils/myFonts"
import { myColors } from "../../ultils/myColors"
import { Spacer, ios, myHeight, myWidth } from "../common"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import PhoneInput from 'react-native-phone-input'
import { Flag } from "./account.component/phone_select"
import CountryPicker, { getAllCountries, getCallingCode } from 'react-native-country-picker-modal';



export const SignIn = ({ navigation }) => {

    const [email, setEmail] = useState(null)
    const [password, setPass] = useState(null)
    const [verifyLog, setVerifyLog] = useState(false)
    const phone = useRef()
    const onLogin = () => {

    }

    function verifyEmail() {
        if (email) {
            return true
        }
        return false
    }
    function verifyPass() {
        if (password) {
            return true
        }
        return false
    }

    useEffect(() => {
        if (verifyEmail() && verifyPass()) {
            setVerifyLog(true)
        }
        else {
            setVerifyLog(false)
        }
    }, [email, password])


    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
                {/* Content */}
                <View>
                    <View style={styles.containerContent}>
                        <Spacer paddingT={myHeight(6.5)} />
                        {/* Text Portion */}
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.textSignIn}>Sign In</Text>
                            <Spacer paddingT={myHeight(0.75)} />
                            <Text style={styles.textWelcome}>Welcome back! Please enter your details</Text>
                        </View>

                        <Spacer paddingT={myHeight(4.4)} />
                        {/* Input Portion */}
                        <View>
                            {/* Phone Portion */}
                            <View style={styles.containerInputPortion}>
                                <Flag />
                                <Spacer paddingEnd={myWidth(1.8)} />
                                <TextInput placeholder="Enter Number"
                                    autoCapitalize='none'
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primaryT}
                                    style={styles.containerInput}

                                    cursorColor={myColors.primaryT}
                                    value={email} onChangeText={setEmail}
                                    onEndEditing={() => verifyEmail()}
                                />
                            </View>
                            <Spacer paddingT={myHeight(2.4)} />

                            {/* Password Portion */}
                            <View style={styles.containerInputPortion}>
                                <Image style={styles.imageInput} source={require('../assets/account/iPass.png')} />
                                <Spacer paddingEnd={myWidth(1.5)} />
                                <TextInput placeholder="Password"
                                    secureTextEntry
                                    password={true}
                                    clearTextOnFocus={false}
                                    textContentType='password'
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primaryT}
                                    style={styles.containerInput} cursorColor={myColors.primaryT}
                                    value={password} onChangeText={setPass}
                                    onEndEditing={() => verifyEmail()}
                                />
                            </View>
                            <Spacer paddingT={myHeight(0.5)} />
                            <TouchableOpacity style={{ alignSelf: 'flex-end', paddingEnd: myWidth(1) }} onPress={() => null} activeOpacity={0.6} >
                                <Text style={styles.textForgot}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        <Spacer paddingT={myHeight(5.3)} />

                        {/* Sign Button */}
                        <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('HomeNavigator')} style={styles.containerSign}>
                            <Text style={styles.textSignInBu}>Sign in</Text>
                        </TouchableOpacity>
                    </View>

                    <Spacer paddingT={myHeight(4.3)} />

                    {/* Or sign with */}
                    <View style={styles.containerOrSignWith}>
                        <View style={styles.containerLine} />
                        <Text style={styles.textSignWith}>Or sign in with</Text>
                        <View style={styles.containerLine} />
                    </View>
                    <Spacer paddingT={myHeight(4.3)} />

                    {/* Social Portion */}
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        {/* Google Button */}
                        <TouchableOpacity activeOpacity={0.6} onPress={() => null}
                            style={styles.containerSocial}>

                            <Image style={styles.imageSocial} source={require('../assets/account/google.png')} />
                        </TouchableOpacity>
                        {/* Facebook Button */}
                        <Spacer paddingEnd={myWidth(4.4)} />

                        <TouchableOpacity activeOpacity={0.6} onPress={() => null}
                            style={styles.containerSocial}>

                            <Image style={styles.imageSocial} source={require('../assets/account/facebook.png')} />
                        </TouchableOpacity>
                        <Spacer paddingEnd={myWidth(4.4)} />
                        {/* Apple Button */}
                        <TouchableOpacity activeOpacity={0.6} onPress={() => null}
                            style={styles.containerSocial}>
                            <Image style={styles.imageSocial} source={require('../assets/account/apple.png')} />
                        </TouchableOpacity>
                    </View>
                    <Spacer paddingT={myHeight(4.3)} />

                    {/* Dont have an Acc*/}
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={styles.textDontHaveAcc}>Don't have an account? </Text>

                        <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.textSignUp}>Sign Up!</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <Spacer paddingT={myHeight(20)} /> */}
                </View>

                {/* Terms & Policy */}
                <View style={styles.containerTermCond}>
                    {/* First line */}
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.replace('StartupScreen')}>
                            <Text style={styles.textTermCondColor}>Terms & Conditions </Text>
                        </TouchableOpacity>

                        <Text style={styles.textTermCond}>and </Text>

                        <TouchableOpacity activeOpacity={0.6} onPress={() => null}>
                            <Text style={styles.textTermCondColor}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Second Line */}
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.textTermCond}>Copyrights 2023 </Text>

                        <TouchableOpacity activeOpacity={0.6} onPress={() => null}>
                            <Text style={styles.textTermCondColor}>M-Rides Inc</Text>
                        </TouchableOpacity>
                    </View>
                    <Spacer paddingT={myHeight(0.5)} />
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: myColors.background
    },
    containerContent: {
        // flex: 1,
        // justifyContent: 'space-around',
        paddingHorizontal: myWidth(10),

    },
    containerInputPortion: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: myHeight(1.47),
        paddingHorizontal: myWidth(2.5),
        borderWidth: myHeight(0.09),
        borderColor: myColors.primaryT,
    },
    containerInput: {
        flex: 1,
        textAlignVertical: 'center',
        paddingVertical: ios ? myHeight(1.2) : myHeight(100) > 600 ? myHeight(0.8) : myHeight(0.1),
        fontSize: myFontSize.body,
        color: myColors.text,
        includeFontPadding: false,
        fontFamily: myFonts.bodyBold,
        // lineHeight: 0,


    },
    containerSign: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: myColors.primaryT,
        paddingVertical: myHeight(1.25),
        borderRadius: myWidth(3.2),


    },
    containerOrSignWith: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row",
        paddingHorizontal: myWidth(4.6),
    },
    containerLine: {
        flex: 1,
        height: myHeight(0.085),
        backgroundColor: myColors.text,
    },
    containerSocial: {
        paddingHorizontal: myWidth(4.18),
        paddingVertical: myHeight(0.6),
        borderRadius: myWidth(1),
        borderWidth: myHeight(0.09),
        borderColor: myColors.primaryT,
    },

    containerTermCond: {
        justifyContent: 'center',
        alignItems: 'center',
    },



    //Text
    textTermCond: {
        fontSize: myFontSize.xSmall,
        fontFamily: myFonts.bodyBold,
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

    textTermCondColor: {
        fontSize: myFontSize.xSmall,
        fontFamily: myFonts.bodyBold,
        color: myColors.primaryT,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },
    textForgot: {
        fontSize: myFontSize.body,
        fontFamily: myFonts.body,
        color: myColors.textL4,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },
    textSignIn: {
        fontSize: myFontSize.xMedium,
        fontFamily: myFonts.bodyBold,
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },
    textWelcome: {
        fontSize: myFontSize.body,
        fontFamily: myFonts.bodyBold,
        color: myColors.offColor,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },
    textSignInBu: {
        fontSize: myFontSize.body2,
        fontFamily: myFonts.headingBold,
        color: myColors.background,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },
    textSignWith: {
        fontSize: myFontSize.xSmall,
        fontFamily: myFonts.heading,
        color: myColors.text,
        paddingHorizontal: myWidth(2.3),
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },
    textDontHaveAcc: {
        fontSize: myFontSize.xxSmall,
        fontFamily: myFonts.body,
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

    textSignUp: {
        fontSize: myFontSize.xxSmall,
        fontFamily: myFonts.body,
        color: myColors.primaryT,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },



    //Image 
    imageInput: {
        height: myHeight(2.2),
        width: myHeight(2.2),
        resizeMode: 'contain',
    },
    imageSocial: {
        height: myHeight(3.76),
        width: myHeight(3.76),
        resizeMode: 'contain',
    },

})