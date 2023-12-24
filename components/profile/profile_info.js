import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView, StyleSheet, TouchableOpacity, Image,
    View, Text, StatusBar, TextInput,
    Linking, Platform, ImageBackground, SafeAreaView, FlatList,
} from 'react-native';
import { Loader, MyError, Spacer, StatusbarH, errorTime, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { useDispatch, useSelector } from 'react-redux';
import { deccodeInfo, encodeInfo } from '../functions/functions';
import firestore from '@react-native-firebase/firestore';
import { setProfile } from '../../redux/profile_reducer';
import { SelectCity } from '../account1/select_city';
import { FirebaseUser } from '../functions/firebase';


export const ProfileInfo = ({ navigation }) => {
    const { profile } = useSelector(state => state.profile)
    const pass = (deccodeInfo(profile.password))
    const [isLoading, setIsLoading] = useState(false)

    const [name, setName] = useState(profile.name)
    const [password, setPass] = useState(pass)
    const [hidePass, setHidePass] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [city, setCity] = useState(profile.city)
    const [showCityModal, setShowCityModal] = useState(false)


    const disptach = useDispatch()
    useEffect(() => {
        if (errorMsg) {
            setTimeout(() => {
                setIsLoading(false)
                setErrorMsg(null)
            }
                , errorTime)
        }
    }, [errorMsg])

    function verifyName() {
        if (name) {
            if (name.length > 2) {
                return true
            }
            setErrorMsg('Name is too Short')
            return false
        }
        setErrorMsg('Please Enter a Name')
        return false
    }
    function verifyPass() {
        if (password) {
            if (password.length > 5) {
                return true
            }
            setErrorMsg('Password must be at least 6 character')
            return false
        }
        setErrorMsg('Please Enter a Password')
        return false
    }

    function checking() {
        if (isEditMode) {

            if (profile.name == name && pass == password && city == profile.city) {
                setIsEditMode(false)
                return false

            }
            if (profile.name != name) {
                if (!verifyName()) {
                    return false
                }

            }
            if (password != pass) {
                if (!verifyPass()) {
                    return false
                }
            }

            return true
        }

        else {
            setIsEditMode(true)
            return false
        }
    }

    function goToDone() {
        const updaProfile = {
            ...profile,
            name: name,
            password: encodeInfo(password),
            city: city
        }
        disptach(setProfile(updaProfile))
        setIsEditMode(false)
        setIsLoading(false)
        navigation.goBack()

    }
    function onSave() {
        if (checking()) {
            setIsLoading(true)
            FirebaseUser.doc(profile.uid)
                .update({
                    name: name,
                    password: encodeInfo(password),
                    city: city
                })
                .then((data) => {
                    goToDone()
                }).catch(err => {
                    setErrorMsg('Something wrong')
                    console.log('Internal error while Updating a Password')
                });
        }

    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: myColors.background }}>
            <StatusbarH />
            {/* Top */}
            <View>
                <Spacer paddingT={myHeight(2)} />
                <View style={{ paddingEnd: myWidth(4), flexDirection: 'row', alignItems: 'center' }}>

                    {/* Arrow */}
                    <TouchableOpacity activeOpacity={0.7}
                        onPress={() => navigation.goBack()} style={{ paddingHorizontal: myWidth(4), }}>
                        <Image style={{
                            height: myHeight(2.4),
                            width: myHeight(2.4),
                            resizeMode: 'contain',
                            tintColor: myColors.textL0
                        }} source={require('../assets/home_main/home/back.png')} />
                    </TouchableOpacity>
                    {/* <Spacer paddingEnd={myWidth(2.5)} /> */}
                    <Text style={[styles.textCommon,
                    {
                        fontFamily: myFonts.heading,
                        fontSize: myFontSize.xBody2
                    }]}>Profile Info </Text>
                </View>

                <Spacer paddingT={myHeight(1.5)} />
                <View style={{ height: myHeight(0.5), width: myWidth(100), marginStart: -myWidth(4), backgroundColor: myColors.divider }} />

                {/* <View style={{ height: myHeight(0.6), backgroundColor: myColors.divider }} /> */}
            </View>

            <Spacer paddingT={myHeight(1.5)} />

            <View style={{ flex: 1, paddingHorizontal: myWidth(4) }}>
                {/* email Portion */}
                <View>
                    <Text style={[styles.heading, { color: myColors.text }]}>Email</Text>
                    <View style={[styles.containerInput, { borderColor: myColors.textL4 }]}>

                        <TextInput placeholder="Full Name"
                            placeholderTextColor={myColors.textL4}
                            autoCorrect={false}
                            editable={false}

                            style={[styles.input,]} cursorColor={myColors.primary}
                            value={profile.email}
                        />
                    </View>
                </View>

                <Spacer paddingT={myHeight(0.98)} />
                {/* name Portion */}
                <View>
                    <Text style={[styles.heading, { color: myColors.text }]}>Name</Text>
                    <View style={[styles.containerInput, { borderColor: isEditMode ? myColors.primaryT : myColors.textL4 }]}>

                        <TextInput placeholder="Full Name"
                            placeholderTextColor={myColors.textL4}
                            autoCorrect={false}
                            editable={isEditMode}
                            style={[styles.input,]} cursorColor={myColors.primary}
                            value={name} onChangeText={setName}
                        />
                    </View>
                </View>

                <Spacer paddingT={myHeight(0.98)} />
                {/* password Portion */}
                <View>
                    <Text style={[styles.heading, { color: myColors.text }]}>Password</Text>

                    <View style={[styles.containerInput, { borderColor: isEditMode ? myColors.primaryT : myColors.textL4 }]}>

                        <TextInput placeholder="Password"

                            autoCorrect={false}
                            editable={isEditMode}
                            placeholderTextColor={myColors.textL4}
                            style={styles.input} cursorColor={myColors.primary}
                            value={password} onChangeText={setPass}
                            secureTextEntry={hidePass}
                            autoCapitalize='none'

                        />
                        <TouchableOpacity activeOpacity={0.6} onPress={() => setHidePass(!hidePass)}>
                            <Image style={styles.imageEye}
                                source={hidePass ? require('../assets/account/eyeC.png') : require('../assets/account/eyeO.png')} />
                        </TouchableOpacity>
                    </View>

                </View>
                <Spacer paddingT={myHeight(0.98)} />

                {/* City */}
                <View>
                    <Text style={[styles.heading, { color: myColors.text }]}>City</Text>
                    <TouchableOpacity activeOpacity={isEditMode ? 0.8 : 1} onPress={() => {
                        if (isEditMode) {

                            setShowCityModal(true)
                        }
                    }}
                        style={[styles.containerInput, { borderColor: isEditMode ? myColors.primaryT : myColors.textL4 }]}>
                        <View>
                            <Image style={{
                                height: myHeight(2.8),
                                width: myHeight(2.8),
                                paddingHorizontal: myWidth(4),
                                resizeMode: 'contain',
                            }}
                                source={require('../assets/account/flag.png')} />
                        </View>
                        <Spacer paddingEnd={myWidth(1)} />
                        <TextInput placeholder="Select Your City"
                            placeholderTextColor={myColors.textL4}
                            autoCorrect={false}
                            editable={false}
                            style={[styles.input,]} cursorColor={myColors.primary}
                            value={city}
                        />
                    </TouchableOpacity>
                </View>

            </View>


            <TouchableOpacity onPress={onSave}
                activeOpacity={0.8}
                style={{
                    width: myWidth(92), alignSelf: 'center', paddingVertical: myHeight(1.3),
                    borderRadius: myHeight(1.4), alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'row', backgroundColor: myColors.primaryT,
                    // borderWidth: myHeight(0.15), borderColor: myColors.primaryT
                }}>
                <Text style={[styles.textCommon, {
                    fontFamily: myFonts.heading,
                    fontSize: myFontSize.body3,
                    color: myColors.background
                }]}>{isEditMode ? 'Save Profile' : 'Edit Profile'}</Text>
            </TouchableOpacity>
            <Spacer paddingT={myHeight(5)} />

            {isLoading && <Loader />}
            {errorMsg && <MyError message={errorMsg} />}
            {showCityModal &&
                <SelectCity showCityModal={setShowCityModal} setCity={setCity} city={city} />
            }

        </SafeAreaView>
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
        borderWidth: myHeight(0.14),
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


    textForgetP: {
        fontFamily: myFonts.heading, fontSize: myFontSize.body, color: myColors.primary,
        paddingVertical: myHeight(0.8)
    },


    imageEye: {
        height: myHeight(2.8),
        width: myHeight(2.8),
        paddingHorizontal: myWidth(4),
        resizeMode: 'contain',
        tintColor: myColors.textL4

    }
})