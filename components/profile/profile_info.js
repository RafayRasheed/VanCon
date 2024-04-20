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
import { deccodeInfo, encodeInfo, updateProfileToFirebase } from '../functions/functions';
import firestore from '@react-native-firebase/firestore';
import { setProfile } from '../../redux/profile_reducer';
import { SelectCity } from '../account1/select_city';
import { FirebaseUser } from '../functions/firebase';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { ImageUri } from '../common/image_uri';
import { setErrorAlert } from '../../redux/error_reducer';


export const ProfileInfo = ({ navigation }) => {
    const { profile } = useSelector(state => state.profile)
    const pass = profile.password ? deccodeInfo(profile.password) : null
    const [isLoading, setIsLoading] = useState(false)

    const [name, setName] = useState(profile.name)
    const [password, setPass] = useState(pass)
    const [hidePass, setHidePass] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [city, setCity] = useState(profile.city)
    const [showCityModal, setShowCityModal] = useState(false)

    const [image, setImage] = useState(profile.image ? profile.image : null);
    const [imageLoading, setImageLoading] = useState(null)


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

    async function chooseFile() {
        const options = {
            mediaType: 'photo',
            selectionLimit: 1,
        }
        // launchCamera(options, callback => {
        //     if (callback.assets) {
        //         console.log(callback.assets)
        //     }
        //     else if (callback.didCancel) {
        //         console.log('didCancel')
        //     }
        //     else if (callback.errorCode) {
        //         console.log('errorCode')
        //     }

        // });

        launchImageLibrary(options, callback => {
            if (callback.assets) {
                const asset = callback.assets[0]
                const sizeKB = asset.fileSize / 1000000
                const source = asset.uri
                console.log(sizeKB)
                if (sizeKB <= 1) {
                    setImageLoading(true)
                    uploadImage(source, 'icon')

                }
                else {
                    setErrorMsg(`Maximum Icon Size is 1 MB`)
                }
                // console.log(source);
            }
            else if (callback.didCancel) {
                console.log('didCancel')
            }
            else if (callback.errorCode) {
                console.log('errorCode')
            }

        });


    };


    const uploadImage = async (uri, name, i) => {
        const path = `images/restaurants/${profile.uid}/${name}`
        storage()
            .ref(path)
            .putFile(uri)
            .then((s) => {
                storage().ref(path).getDownloadURL().then((uri) => {


                    setImage(uri)
                    updateProfileToFirebase({ image: uri })
                    disptach(setErrorAlert({ Title: 'Profile Updated Successfully', Status: 10 }))
                    setImageLoading(null)
                    console.log('uri recieved icon')

                }).catch((e) => {
                    setImageLoading(null)
                    setErrorMsg('Something Wrong')

                    console.log('er', e)

                })

            }).catch((e) => {
                setImageLoading(null)
                setErrorMsg('Something Wrong')

                console.log('er', e)

            })

        // try {
        //     await task;
        // } catch (e) {
        //     console.error(e);
        // }

    };
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
            {/* Top */}
            <View
                style={{
                    width: '100%', overflow: 'hidden', backgroundColor: myColors.text,
                    borderBottomStartRadius: myHeight(50), borderBottomEndRadius: myHeight(50), alignItems: 'center'
                }}>
                <Spacer paddingT={myHeight(2)} />
                <StatusbarH />

                <View style={{ width: '100%', paddingHorizontal: myWidth(5) }}>

                    <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={{
                        backgroundColor: myColors.primaryT,
                        height: myHeight(4.2),
                        width: myHeight(4.2),
                        borderRadius: myHeight(3),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}  >
                        <Image style={
                            {
                                height: myHeight(2),
                                width: myHeight(2),
                                resizeMode: 'contain'
                            }
                        } source={require('../assets/startup/goL.png')} />
                    </TouchableOpacity>
                </View>
                {/* image */}
                <TouchableOpacity disabled={imageLoading}
                    activeOpacity={0.75} onPress={() => {

                        chooseFile()


                    }}
                    style={{
                        borderRadius: myWidth(100),
                        overflow: 'hidden',
                        width: myHeight(13),
                        height: myHeight(13),
                        // backgroundColor: myColors.primaryL5, padding: myHeight(1.3),
                        // borderWidth: myWidth(0.1), borderColor: myColors.textL4, 
                    }}>


                    {
                        imageLoading ?
                            <View style={{
                                width: '100%', height: '100%',
                                alignItems: 'center', justifyContent: 'center',
                                backgroundColor: myColors.offColor7
                            }} >
                                <Text style={[styles.textCommon,
                                {
                                    fontFamily: myFonts.body,
                                    fontSize: myFontSize.body,
                                    textAlign: 'center',


                                }]}>Loading...</Text>
                            </View>

                            :
                            <>



                                {
                                    image ?

                                        <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={image} />
                                        :
                                        <Image source={require('../assets/profile/profile.png')}
                                            style={{
                                                width: myHeight(13),
                                                height: myHeight(13),
                                                resizeMode: 'contain',
                                                // tintColor: myColors.primaryT
                                            }}
                                        />
                                }

                            </>

                    }


                </TouchableOpacity>
                <Spacer paddingT={myHeight(0.8)} />

                <Text style={[styles.textCommon,
                {
                    fontFamily: myFonts.body,
                    fontSize: myFontSize.body,
                    textAlign: 'center',
                    color: myColors.background


                }]}>Change Profile</Text>
                <Spacer paddingT={myHeight(6)} />




            </View>

            <Spacer paddingT={myHeight(1.5)} />

            <View style={{ flex: 1, paddingHorizontal: myWidth(4) }}>
                {/* email Portion */}
                <View>
                    <Text style={[styles.heading, { color: myColors.primaryT }]}>Email</Text>
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
                    <Text style={[styles.heading, { color: myColors.primaryT }]}>Name</Text>
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
                    <Text style={[styles.heading, { color: myColors.primaryT }]}>Password</Text>

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
                    <Text style={[styles.heading, { color: myColors.primaryT }]}>City</Text>
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
        // paddingVertical: myHeight(0.8),
        paddingTop: myHeight(1.5),
        fontFamily: myFonts.heading,
        fontSize: myFontSize.body,
    },
    containerInput: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderRadius: myWidth(2.5),
        // paddingHorizontal: myWidth(2),
        borderBottomWidth: myHeight(0.14),
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