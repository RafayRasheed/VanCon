import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ios, myHeight, myWidth, Spacer } from "../../common";
import { myFontSize, myFonts } from "../../../ultils/myFonts";
import { myColors } from "../../../ultils/myColors";
import { Person } from "../../functions/structures";
import uuid from 'react-native-uuid';
import RNSmtpMailer from "react-native-smtp-mailer";
import { dataFullData, encodeInfo, verificationCode } from "../../functions/functions";
import firestore from '@react-native-firebase/firestore';
import { sendVerficationEmail } from "../../functions/email";
import { SelectCity } from "../select_city";
import { FirebaseUser } from "../../functions/firebase";


export const CreateAcc = ({ navigate, showError, showLoading, city, setShowCityModal }) => {
    // const [name, setName] = useState(null)
    // const [email, setEmail] = useState('shaheerkhan777.rr@gmail.com')
    // const [email, setEmail] = useState(null)
    // const [password, setPass] = useState()
    const [hidePass, setHidePass] = useState(true);

    function onGoogle() {

    }
    function verifyName() {
        if (name) {
            if (name.length > 2) {
                return true
            }
            showError('Name is too Short')
            return false
        }
        showError('Please Enter a Name')
        return false
    }
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
    function verifyCity() {
        if (city) {

            return true

        }
        showError('Please Select a City')
    }


    function verifyPass() {
        if (password) {
            if (password.length > 5) {
                const reg = /(?=.*[a-zA-Z])(?=.*\d)/
                if (reg.test(password)) {
                    return true
                }
                showError('Password must contain letter and a number')
                return false
            }
            showError('Password must be at least 6 character')
            return false
        }
        showError('Please Enter a Password')
        return false
    }

    function onVerifying() {
        if (verifyName() && verifyEmail() && verifyPass() && verifyCity()) {
            onRegister()
        }
    }

    function goToVerification(profile, code) {
        navigate('Verification', { code, profile, reset: false })
    }
    function sendEmail() {
        const dateData = dataFullData()
        const profile = new Person(uuid.v4(), name, email, city, encodeInfo(password), dateData.date, dateData.dateInt,)

        const code = verificationCode()
        sendVerficationEmail(profile, code)
            .then(success => {
                console.log(profile)
                showLoading(false)
                goToVerification(profile, code)
            })
            .catch(err => {
                showError('Something wrong')
                console.log('Internal error while sending an Email')
            });

    }

    function onRegister() {
        showLoading(true)
        FirebaseUser
            .where('email', '==', email).get()
            .then(result => {
                if (result.empty) {
                    sendEmail()
                }
                else {
                    showError('User already exists with this email')
                }
            })
            .catch(err => {
                showError('Something wrong')
                console.log('Internal error on getting data')
            })


        // sendVerificationCode()
        // createAccountFirebase(profile).then((res) => console.log(res)).catch((err) => console.log(err))
    }


    return (
        <View style={{
            flex: 1, width: myWidth(87), height: myHeight(78),
            justifyContent: 'center', justifyContent: 'space-between',
            marginVertical: myHeight(4)
        }}>
            <View>
                {/* Name Portion */}
                <View>
                    <Text style={[styles.heading, { color: myColors.text }]}>Full Name</Text>
                    <View style={styles.containerInput}>

                        <TextInput placeholder="Enter Your Full Name"
                            placeholderTextColor={myColors.textL4}
                            // ={false}
                            autoCorrect={false}
                            style={styles.input} cursorColor={myColors.primaryT}
                            value={name} onChangeText={setName}
                        />
                    </View>
                </View>
                <Spacer paddingT={myHeight(0.98)} />
                {/* email Portion */}
                <View>
                    <Text style={[styles.heading, { color: myColors.text }]}>Email address</Text>
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
                    <Text style={[styles.heading, { color: myColors.text }]}>Password</Text>
                    <View style={styles.containerInput}>
                        <TextInput placeholder="Password"
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
                </View>
                <Spacer paddingT={myHeight(0.98)} />
                {/* city Portion */}
                <View>
                    <Text style={[styles.heading, { color: myColors.text }]}>City</Text>

                    <TouchableOpacity activeOpacity={0.8} style={styles.containerInput} onPress={() => setShowCityModal(true)}>
                        <View>
                            <Image style={{
                                height: myHeight(2.8),
                                width: myHeight(2.8),
                                paddingHorizontal: myWidth(4),
                                resizeMode: 'contain',
                            }}
                                source={require('../../assets/account/flag.png')} />
                        </View>
                        <Spacer paddingEnd={myWidth(1)} />
                        <TextInput placeholder="Select Your City"
                            placeholderTextColor={myColors.textL4}
                            style={styles.input} cursorColor={myColors.primaryT}
                            value={city}
                            editable={false}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ alignItems: 'center' }}>
                {/* Button Register */}
                <TouchableOpacity onPress={onVerifying}
                    activeOpacity={0.8}
                    style={[styles.button]}>
                    <Text style={styles.textReg}>Register</Text>

                </TouchableOpacity>

                <Spacer paddingT={myHeight(1.2)} />
                <View style={{ width: myWidth(75), height: 0.8, backgroundColor: myColors.divider }} />
                <Spacer paddingT={myHeight(1.2)} />

                <TouchableOpacity onPress={onGoogle} activeOpacity={0.8} style={[styles.button, { backgroundColor: myColors.offColor4 }]}>
                    <Image style={{ resizeMode: 'contain', width: myWidth(5.3), height: myWidth(5.3) }}
                        source={require('../../assets/account/google.png')} />
                    <Spacer paddingEnd={myWidth(6.4)} />
                    <Text style={styles.textGoogle}>Sign up with Google</Text>
                </TouchableOpacity>
            </View>

        </View>

    )
}

const styles = StyleSheet.create({
    heading: {
        paddingVertical: myHeight(0.8),
        fontFamily: myFonts.heading, fontSize: myFontSize.body,
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
        flexDirection: 'row', backgroundColor: myColors.primaryT
    },
    textGoogle: {
        color: myColors.black2, fontFamily: myFonts.heading,
        fontSize: myFontSize.body
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
const styles2 = (verifyReg) => StyleSheet.create({
    textReg: {
        color: verifyReg ? myColors.background : myColors.textL4, fontFamily: myFonts.headingBold,
        fontSize: myFontSize.body
    },
})