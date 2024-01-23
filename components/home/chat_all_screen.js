import { Image, Keyboard, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { myColors } from '../../ultils/myColors'
import { MyError, Spacer, StatusbarH, ios, myHeight, myWidth } from '../common'
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts'
import database from '@react-native-firebase/database';
import { dataFullData, verificationCode } from '../functions/functions'
import { useDispatch, useSelector } from 'react-redux'
import { FlashList } from '@shopify/flash-list'
import { setErrorAlert } from '../../redux/error_reducer'
import { RFValue } from 'react-native-responsive-fontsize'


export const ChatList = ({ navigation, route }) => {
    const [message, setMessage] = useState(null)
    const scrollRef = useRef(null)

    const [focus, setFocus] = useState(false)
    const [fromTouch, setFromTouch] = useState(false)
    const [first, setFirst] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)
    const [showScrollToLast, setShowScrollToLast] = useState(false)
    const { chats, totalUnread } = useSelector(state => state.chats)
    const { profile } = useSelector(state => state.profile)
    const dispatch = useDispatch()


    useEffect(() => {

    }, []);


    return (
        <>

            <SafeAreaView style={{ flex: 1, backgroundColor: myColors.background, }}>
                <StatusbarH />
                <View style={{ paddingBottom: myHeight(0) }}>
                    <View style={{
                        paddingVertical: myHeight(1.5),
                        shadowOpacity: 0.2, backgroundColor: myColors.background,
                        shadowRadius: 2, flexDirection: 'row', alignItems: 'center'
                    }}>


                        <Spacer paddingEnd={myWidth(5)} />
                        {/* Name & Last seen */}
                        <View style={{}}>
                            <Text style={[styles.textCommon, {
                                fontSize: myFontSize.medium0,
                                fontFamily: myFonts.heading,
                            }]}>{'Chats'} {totalUnread ? `(${totalUnread})` : ''}</Text>
                            {/* <Text style={[styles.textCommon, {
                                fontSize: myFontSize.body,
                                fontFamily: myFonts.body,
                            }]}>Last seen {'12:09'}</Text> */}
                        </View>
                    </View>


                    {/* Divider */}
                    <View style={{
                        borderTopWidth: myHeight(0.08),
                        borderColor: myColors.offColor2, width: '100%'
                    }} />
                </View>


                {/* Chats */}
                <FlashList


                    extraData={chats}
                    data={chats}
                    ItemSeparatorComponent={() =>
                        <View style={{ borderTopWidth: myHeight(0.08), borderColor: myColors.offColor, width: "100%" }} />
                    }
                    keyExtractor={(item, index) => index.toString()}
                    estimatedItemSize={200}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                style={{
                                    paddingVertical: myHeight(1.2), width: '100%',
                                    paddingHorizontal: myWidth(4)
                                }}
                                onPress={() => navigation.navigate('Chat',
                                    { user2: item.user2 }
                                )}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                    <Text numberOfLines={1} style={[styles.textCommon, {
                                        flex: 1,
                                        fontSize: myFontSize.xxBody,
                                        fontFamily: myFonts.bodyBold,
                                    }]}>{item.user2.name}</Text>
                                    <Text numberOfLines={1} style={[styles.textCommon, {
                                        fontSize: myFontSize.xxSmall,
                                        fontFamily: myFonts.body,
                                    }]}>{item.statusTime}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                    <Text numberOfLines={1} style={[styles.textCommon, {
                                        flex: 1,
                                        fontSize: myFontSize.body2,
                                        fontFamily: (item.senderId != profile.uid && item.unreadmasseges) ? myFonts.bodyBold : myFonts.body,
                                    }]}>{item.senderId == profile.uid ? 'You: ' : ''}{item.message}</Text>
                                    {
                                        item.unreadmasseges ?

                                            <Text numberOfLines={1} style={[styles.textCommon, {
                                                fontSize: myFontSize.small3,
                                                fontFamily: myFonts.body,
                                                color: myColors.background,
                                                // padding: myHeight(0.5),
                                                minWidth: RFValue(22),
                                                minHeight: RFValue(22),
                                                textAlign: 'center',
                                                textAlignVertical: 'center',
                                                borderRadius: 5000,
                                                backgroundColor: myColors.primaryT
                                            }]}>{item.unreadmasseges > 9 ? '9+' : item.unreadmasseges}</Text>
                                            : null
                                    }

                                </View>
                            </TouchableOpacity>
                        )

                    }

                    } />
                {/* Bottom */}


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