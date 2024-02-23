import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ios, Loader, myHeight, myWidth, Spacer } from "../../common";
import { myFontSize, myFonts } from "../../../ultils/myFonts";
import { myColors } from "../../../ultils/myColors";
import firestore from '@react-native-firebase/firestore';
import { deccodeInfo } from "../../functions/functions";
import { setLogin } from "../../functions/storageMMKV";
import { useDispatch } from "react-redux";
import { setProfile } from "../../../redux/profile_reducer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FirebaseUser, updateDeviceTokenToFireBase } from "../../functions/firebase";

export const Login = ({ navigation, showError, showLoading }) => {


    const dispatch = useDispatch()

    // const [email, setEmail] = useState(null)
    // const [password, setPass] = useState()
    const [hidePass, setHidePass] = useState(true);



    function verifyEmail() {
        if (email) {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if (reg.test(email)) {
                return true
            }
            showError('Please Enter a Valid Email')
            return false
        }
        showError('Please Enter a Email')
    }
    function verifyPass() {
        if (password) {
            if (password.length > 5) {
                return true
            }
            showError('Password must be at least 6 character')
            return false
        }
        showError('Please Enter a Password')
        return false
    }

    function onVerifying() {
        if (verifyEmail() && verifyPass()) {
            checkUser()
        }
    }
    function goToLogin(myUser) {
        const decodePass = deccodeInfo(myUser.password.toString())
        if (decodePass == password) {
            dispatch(setProfile(myUser))
            updateDeviceTokenToFireBase(myUser.uid)

            // setLogin(myUser)
            showLoading(false)
            navigation.replace("HomeBottomNavigator")
        }
        else {
            showError('Incorrect email or password')
            console.log('Internal Password')
        }
    }

    function checkUser() {
        showLoading(true)
        FirebaseUser
            .where('email', '==', email).get()
            .then(result => {
                if (result.empty) {
                    showError('Incorrect email or password')
                    console.log('User not exists with this email')
                }
                else {
                    result.forEach(documentSnapshot => {
                        // console.log(documentSnapshot.data());
                        goToLogin(documentSnapshot.data())

                    });

                }
            })
            .catch(err => {
                showError('Something wrong')
                console.log(err)
            })
    }




    // useEffect(()=>{
    //     storeData("yes")
    // },[])
    return (

        <View style={{
            flex: 1, width: myWidth(87), height: myHeight(78),
            justifyContent: 'center', justifyContent: 'space-between',
            marginVertical: myHeight(4),
        }}>
            <View>
                {/* email Portion */}
                <View>
                    <Text style={[styles.heading, { color: email ? myColors.textL4 : myColors.text }]}>Email address</Text>
                    <View style={styles.containerInput}>

                        <TextInput placeholder="Eg namaemail@emailkamu.com"
                            placeholderTextColor={myColors.textL4}
                            autoCorrect={false}
                            style={styles.input} cursorColor={myColors.primaryT}
                            value={email} onChangeText={setEmail}
                            autoCapitalize='none'
                        />
                    </View>
                </View>

                <Spacer paddingT={myHeight(0.98)} />
                {/* password Portion */}
                <View>
                    <Text style={[styles.heading, { color: password ? myColors.textL4 : myColors.text }]}>Password</Text>

                    <View style={styles.containerInput}>

                        <TextInput placeholder="Password"

                            autoCorrect={false}
                            placeholderTextColor={myColors.textL4}
                            style={styles.input} cursorColor={myColors.primaryT}
                            value={password} onChangeText={setPass}
                            secureTextEntry={hidePass}
                            autoCapitalize='none'

                        />
                        <TouchableOpacity activeOpacity={0.6} onPress={() => setHidePass(!hidePass)}>
                            <Image style={styles.imageEye}
                                source={hidePass ? require('../../assets/account/eyeC.png') : require('../../assets/account/eyeO.png')} />
                        </TouchableOpacity>
                    </View>
                    <Spacer paddingT={myHeight(0.4)} />
                    {/* Forget Password */}
                    <TouchableOpacity activeOpacity={0.8} style={{ alignSelf: 'flex-end' }}
                        onPress={() => navigation.navigate('ForgetPass')}>
                        <Text style={styles.textForgetP}>Forget Password?</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <Spacer paddingT={myHeight(4.1)} /> */}
            <View style={{ alignItems: 'center' }}>
                {/* Button Login */}
                {/* <TouchableOpacity onPress={() => verifyLog ? navigate('HomeNavigator') : null} */}
                <TouchableOpacity onPress={onVerifying}
                    activeOpacity={0.8}
                    style={[styles.button, { backgroundColor: myColors.primaryT }]}>
                    <Text style={styles.textReg}>Login</Text>
                </TouchableOpacity>

                <Spacer paddingT={myHeight(1.2)} />
                <View style={{ width: myWidth(75), height: 0.8, backgroundColor: myColors.divider }} />
                <Spacer paddingT={myHeight(1.2)} />

                <TouchableOpacity onPress={() => null} activeOpacity={0.8} style={[styles.button, { backgroundColor: myColors.offColor4 }]}>
                    <Image style={{ resizeMode: 'contain', width: myWidth(5.3), height: myWidth(5.3) }}
                        source={require('../../assets/account/google.png')} />
                    <Spacer paddingEnd={myWidth(6.4)} />
                    <Text style={styles.textGoogle}>Login with Google</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    heading: {
        paddingVertical: myHeight(0.8),
        fontFamily: myFonts.heading,
        fontSize: myFontSize.body,
    },
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: myWidth(2.5),
        paddingHorizontal: myWidth(2),
        borderWidth: myHeight(0.12),
        borderColor: myColors.textL4,
        backgroundColor: myColors.background,
    },

    input: {
        flex: 1,
        textAlignVertical: 'center',
        paddingVertical: ios ? myHeight(1) : myHeight(100) > 600 ? myHeight(0.8) : myHeight(0.2),
        fontSize: myFontSize.body,
        color: myColors.text,
        includeFontPadding: false,
        fontFamily: myFonts.bodyBold,
    },
    button: {
        height: myHeight(6.1), width: myWidth(86),
        borderRadius: myHeight(1.47), alignItems: 'center', justifyContent: 'center',
        flexDirection: 'row',
    },
    textGoogle: {
        color: myColors.black2, fontFamily: myFonts.heading,
        fontSize: myFontSize.body
    },
    textForgetP: {
        fontFamily: myFonts.heading, fontSize: myFontSize.body, color: myColors.primaryT,
        paddingVertical: myHeight(0.8)
    },
    textReg: {
        color: myColors.background, fontFamily: myFonts.headingBold,
        fontSize: myFontSize.body
    },

    imageEye: {
        height: myHeight(2.8),
        width: myHeight(2.8),
        paddingHorizontal: myWidth(4),
        resizeMode: 'contain',
        tintColor: myColors.primaryT

    }

})
const styles2 = (verifyLog) => StyleSheet.create({
    textReg: {
        color: verifyLog ? myColors.background : myColors.textL4, fontFamily: myFonts.headingBold,
        fontSize: myFontSize.body
    },

})