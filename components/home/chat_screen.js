import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { myColors } from '../../../../ultils/myColors'
import { Spacer, ios, myHeight, myWidth } from '../../../common'
import { myFontSize, myFonts, myLetSpacing } from '../../../../ultils/myFonts'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const MyMessage = ({ message }) => {
    return (
        <View style={{
            borderRadius: myWidth(2.5), borderBottomRightRadius: 0,
            paddingHorizontal: myWidth(4), paddingVertical: myHeight(1.2),
            backgroundColor: myColors.primary, maxWidth: myWidth(70),
            alignSelf: 'flex-end', marginVertical: myHeight(0.7),
            // borderWidth: myHeight(0.1),
            // borderColor: myColors.primaryT,
        }}>
            <Text style={[styles.textCommon, {
                fontSize: myFontSize.body,
                fontFamily: myFonts.heading,
                color: myColors.background,
            }]}>{message}</Text>
        </View>
    )
}
const OtherMessage = ({ message }) => {
    return (
        <View style={{ maxWidth: myWidth(70), flexDirection: 'row', marginVertical: myHeight(0.7) }}>
            {/* <Image source={require('../../../assets/home_main/driver.png')}
                style={{
                    width: myHeight(3),
                    height: myHeight(3),
                    resizeMode: 'contain',
                    borderRadius: myHeight(3.58),
                }}
            /> */}
            <Spacer paddingEnd={myWidth(2)} />
            <View style={{
                borderRadius: myWidth(2.5), borderBottomLeftRadius: 0,
                paddingHorizontal: myWidth(4), paddingVertical: myHeight(1.2),
                borderWidth: myHeight(0.1),
                borderColor: myColors.textL5,
                alignSelf: 'flex-start', backgroundColor: '#f1f1f1'
            }}>
                <Text style={[styles.textCommon, {
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.bodyBold,
                }]}>{message}</Text>
            </View>
        </View>
    )
}
export const Chat = ({ navigation }) => {
    const [message, setMessage] = useState(null)
    const [focus, setFocus] = useState(false)

    function onSendMsg() {
    }

    return (
        <>
            <SafeAreaView style={{ backgroundColor: myColors.primaryT }}></SafeAreaView>

            <SafeAreaView style={{ flex: 1, backgroundColor: myColors.background, }}>


                {/* Back & Others */}
                <View style={{ paddingBottom: myHeight(0.5) }}>
                    <View style={{
                        elevation: 8, shadowColor: '#000',
                        shadowOffset: { width: 0, height: 3 }, paddingVertical: myHeight(0.8),
                        shadowOpacity: 0.2, backgroundColor: myColors.background,
                        shadowRadius: 2, flexDirection: 'row', alignItems: 'center'
                    }}>
                        {/* Back */}
                        <TouchableOpacity style={{
                            height: myHeight(5),
                            width: myHeight(7),
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                            onPress={() => navigation.goBack()} activeOpacity={0.7}>
                            <Image style={{
                                height: myHeight(3.5),
                                width: myHeight(3.5) * 1.4,
                                resizeMode: "contain",
                                tintColor: myColors.text
                            }} source={require('../assets/home_main/home/back.png')} />
                        </TouchableOpacity>

                        <Spacer paddingEnd={myWidth(1)} />
                        {/* Name & Last seen */}
                        <View>
                            <Text style={[styles.textCommon, {
                                fontSize: myFontSize.xBody,
                                fontFamily: myFonts.heading,
                            }]}>Someone</Text>
                            <Text style={[styles.textCommon, {
                                fontSize: myFontSize.body,
                                fontFamily: myFonts.body,
                            }]}>Last seen {'12:09'}</Text>
                        </View>
                    </View>

                    <View style={{ paddingHorizontal: myWidth(4), paddingVertical: myHeight(1.6) }}>
                        <Text style={[styles.textCommon, {
                            fontSize: myFontSize.xBody,
                            fontFamily: myFonts.bodyBold,
                        }]}>Chat with your Captain</Text>
                    </View>
                    {/* Divider */}
                    <View style={{
                        borderTopWidth: myHeight(0.08),
                        borderColor: myColors.offColor2, width: '100%'
                    }} />
                </View>
                <KeyboardAwareScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ flex: 1 }}>

                    {/* Chats */}
                    <ScrollView style={{}}
                        contentContainerStyle={{
                            flex: 1, paddingHorizontal: myWidth(5),
                            justifyContent: 'flex-end', paddingVertical: myHeight(1.3)
                        }}>

                        <MyMessage message={'Hello Joboieb oweb we'} />
                        <MyMessage message={'Hello oweb we'} />

                        <OtherMessage message={'I am on the way....'} />
                        <OtherMessage message={'gmkrNxrN43mGpFauTYgAVc/Untitled?type=design&node-id=2195-3870&t=TdGB1vy7HeOJ0hPa-0'} />

                        <MyMessage message={'gmkrNxrN43mGpFauTYgAVc/Untitled?type=design&node-id=2195-3870&t=TdGB1vy7HeOJ0hPa-0'} />
                    </ScrollView>

                    {/* Bottom */}

                    <View style={{ backgroundColor: myColors.background, paddingHorizontal: myWidth(4) }}>
                        {/*Input &&  Send But*/}
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            {/* Input Container */}
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                flex: 1,
                                borderRadius: myHeight(10),
                                paddingHorizontal: myWidth(3.5),
                                borderWidth: myHeight(0.1),
                                borderColor: focus ? myColors.primaryT : myColors.text,
                                backgroundColor: myColors.background,

                            }}>

                                <TextInput placeholder="Start typing here ...."
                                    placeholderTextColor={myColors.offColor}
                                    selectionColor={myColors.primaryT}
                                    cursorColor={myColors.primaryT}
                                    value={message} onChangeText={setMessage}
                                    onFocus={() => setFocus(true)}
                                    onEndEditing={() => setFocus(false)}
                                    style={{
                                        flex: 1,
                                        textAlignVertical: 'center',
                                        paddingVertical: ios ? myHeight(1.4) : myHeight(100) > 600 ? myHeight(1) : myHeight(0.2),
                                        fontSize: myFontSize.body,
                                        color: myColors.text,
                                        includeFontPadding: false,
                                        fontFamily: myFonts.bodyBold,
                                    }}
                                />
                            </View>

                            <Spacer paddingEnd={myWidth(4)} />
                            {/* Send Button */}
                            <TouchableOpacity style={{
                                paddingVertical: myHeight(1.4),
                                paddingHorizontal: myWidth(6.5),
                                backgroundColor: myColors.primaryT,
                                borderRadius: myWidth(2)
                            }}
                                onPress={onSendMsg} activeOpacity={0.85}>
                                <Image style={{
                                    height: myHeight(2.6),
                                    width: myHeight(2.6),
                                    resizeMode: "contain",
                                }} source={require('../assets/home_main/home/send.png')} />
                            </TouchableOpacity>
                        </View>
                        <Spacer paddingT={myHeight(1.5)} />
                    </View>

                </KeyboardAwareScrollView>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    textCommon: {
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },

})