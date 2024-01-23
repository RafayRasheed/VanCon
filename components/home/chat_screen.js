import { ActivityIndicator, Alert, Image, Keyboard, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { myColors } from '../../ultils/myColors'
import { MyError, Spacer, StatusbarH, ios, myHeight, myWidth } from '../common'
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts'
import database from '@react-native-firebase/database';
import { dataFullData, statusDate, verificationCode } from '../functions/functions'
import { useDispatch, useSelector } from 'react-redux'
import { FlashList } from '@shopify/flash-list'
import { setErrorAlert } from '../../redux/error_reducer'
import { RFValue } from 'react-native-responsive-fontsize'
import firestore from '@react-native-firebase/firestore';
import { sendPushNotification } from '../functions/firebase'

const MyMessage = ({ item }) => {
    return (
        <View style={{
            borderRadius: myWidth(2.5), borderBottomRightRadius: 0,
            paddingStart: myWidth(2.5),
            paddingEnd: myWidth(3),
            paddingTop: myHeight(0.7),
            backgroundColor: myColors.primary, maxWidth: myWidth(70),
            alignSelf: 'flex-end', marginVertical: myHeight(0.7),
            // borderWidth: myHeight(0.1),
            // borderColor: myColors.primaryT,
        }}>
            <Text style={[styles.textCommon, {
                fontSize: myFontSize.body,
                fontFamily: myFonts.bodyBold,
                color: myColors.background,
            }]}>{item.message}</Text>

            <Spacer paddingT={myHeight(0.2)} />

            <Text style={[styles.textCommon, {
                textAlign: 'right',
                fontSize: myFontSize.small3,
                fontFamily: myFonts.bodyBold,
                color: myColors.background
            }]}>{item.time}</Text>
            <Spacer paddingT={myHeight(0.5)} />
        </View>
    )
}
const OtherMessage = ({ item }) => {
    return (
        <View style={{ flexDirection: 'row', marginVertical: myHeight(0.7) }}>
            <View style={{
                maxWidth: myWidth(70),
                borderRadius: myWidth(2.5), borderBottomLeftRadius: 0,
                paddingStart: myWidth(2.5),
                paddingEnd: myWidth(2),

                paddingTop: myHeight(0.6),
                borderWidth: myHeight(0.1),
                borderColor: myColors.textL5,
                alignSelf: 'flex-start', backgroundColor: '#f1f1f1'
            }}>
                <Text style={[styles.textCommon, {
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.bodyBold,
                }]}>{item.message}</Text>
                <Spacer paddingT={myHeight(0.1)} />

                <Text style={[styles.textCommon, {
                    textAlign: 'right',
                    fontSize: myFontSize.small3,
                    fontFamily: myFonts.bodyBold,
                }]}>{item.time}</Text>
                <Spacer paddingT={myHeight(0.3)} />
            </View>
        </View>
    )
}
export const Chat = ({ navigation, route }) => {
    const [message, setMessage] = useState(null)
    const scrollRef = useRef(null)

    const [focus, setFocus] = useState(false)
    const [fromTouch, setFromTouch] = useState(false)
    const [firstTime, setFirstTime] = useState(true)
    const [showUnread, setShowUnread] = useState(0)
    const [loader, setLoader] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)
    const [showScrollToLast, setShowScrollToLast] = useState(false)
    const { user2 } = route.params
    const { profile } = useSelector(state => state.profile)
    const { chats } = useSelector(state => state.chats)
    const chatId = user2.uid + profile.uid
    const [chatss, setChatss] = useState([])
    const dispatch = useDispatch()
    function scrollToBottom() {
        setFromTouch(false)
        setShowScrollToLast(false)
        scrollRef?.current?.scrollToOffset({ animated: true, offset: 0 })
        // scrollRef?.current?.scrollToIndex({
        //     animated: true,
        //     index: 0,
        // });
    }
    function scrollToIndex(i) {
        scrollRef?.current?.scrollToIndex({
            animated: false,
            index: i,
        });
    }
    function handleScrollView(event) {
        const posY = event.nativeEvent.contentOffset.y
        // console.log(posY)
        if (fromTouch && (posY >= 10) != showScrollToLast) {

            setShowScrollToLast(posY >= 10)
        }

    }
    useEffect(() => {
        if (!showScrollToLast) {
            setUnreadCount(0)
        }
    }, [showScrollToLast])
    useEffect(() => {
        const myChat = chats.filter(it => it.chatId == chatId)
        if (myChat.length) {

            //     setChatss()
            let lastDate = null
            const data = []
            let allMsg = [...myChat[0].allMessages]
            allMsg = allMsg.sort(function (a, b) { return a.dateInt - b.dateInt })

            // return
            let alreadyUnread = false
            let initaiIndex = 0
            allMsg.map((msg, i) => {
                if (msg.date != lastDate) {
                    lastDate = msg.date
                    data.push(statusDate(msg.date))

                }


                if ((msg.senderId != profile.uid && msg.read == false && !alreadyUnread)) {

                    if (firstTime || showScrollToLast) {

                        console.log('AAAHIUAHSUI')
                        setShowUnread(data.length)
                        data.push('new messages')
                        alreadyUnread = true
                    }


                } else if (showUnread != 0 && !alreadyUnread && showUnread == data.length) {
                    if (firstTime || showScrollToLast) {
                        console.log('BBBBBBBBBBB')

                        setShowUnread(data.length)
                        data.push('new messages')
                        alreadyUnread = true
                    }
                } else {

                }
                data.push(msg)

                // if (i == snapshot.numChildren() - 1) {
                // console.log(chatss.length != 0, chatss.length, data.length)
                // if (chatss.length != 0) {
                //     console.log(unreadCount)
                //     const s = unreadCount + 1
                //     setUnreadCount(s)
                // }

                // }

            });
            setChatss(data.reverse())
            setFirstTime(false)
            const allUnread = myChat[0].allUnreadMessagesToRead
            const unreadleangth = Object.keys(allUnread).length
            if (showScrollToLast && unreadCount == 0 && unreadleangth) {
                setUnreadCount(1)
            }

            setTimeout(() => {
                setLoader(false)
            }, 250)
            if (data.length != chatss.length && unreadleangth) {
                console.log('unread to read work')
                database()
                    .ref(`/chats/${chatId}/messages`).update(allUnread).then(() => { })
                    .catch((er) => { console.log('error on send message444', er) })

            }
        }

    }, [chats])


    // useEffect(() => {
    //     const onValueChange = database()
    //         .ref(`/chats/${chatId}`).child('messages').orderByChild('dateInt')
    //         .on('value', snapshot => {

    //             if (snapshot.exists()) {

    //                 let lastDate = null
    //                 const data = []
    //                 snapshot.forEach((documentSnapshot1, i) => {
    //                     const msg = documentSnapshot1.val()
    //                     if (msg.date != lastDate) {
    //                         lastDate = msg.date
    //                         data.push(statusDate(msg.date))

    //                     }
    //                     data.push(msg)
    //                     if (i == snapshot.numChildren() - 1) {
    //                         // console.log(chatss.length != 0, chatss.length, data.length)
    //                         // if (chatss.length != 0) {
    //                         //     console.log(unreadCount)
    //                         //     const s = unreadCount + 1
    //                         //     setUnreadCount(s)
    //                         // }
    //                         setChatss(data.reverse())

    //                     }

    //                 });
    //             } else {
    //                 setChatss([])
    //             }
    //         });

    //     // Stop listening for updates when no longer required
    //     return () => database().ref(`/chats/${chatId}`).off('value', onValueChange);
    // }, []);
    function onSendMsg() {

        if (message === null) {

            dispatch(setErrorAlert({ Title: 'Text field is empty', Status: 0 }))
            return
        }
        const { actualDate, dateInt, date } = dataFullData()
        const msgId = dateInt.toString() + verificationCode().toString().slice(0, 3)
        const dddT = actualDate.toLocaleTimeString()
        const fSpace = dddT.split(' ')
        const fDot = fSpace[0].split(':')
        const timeFor = `${fDot[0]}:${fDot[1]} ${fSpace[1]}`
        const mssss = {

            date: actualDate.toLocaleDateString(),
            dateInt,
            time: timeFor,
            msgId,
            read: false,
            senderId: user2.uid,
            recieverId: profile.uid,
            // senderId: profile.uid,
            // recieverId: user2.uid,
            message: message,

        }
        setMessage(null)
        Keyboard.dismiss()
        const isNew = chatss.length == 0
        database()
            .ref(`/chats/${chatId}`).child('messages').child(msgId)
            .update(mssss).then(() => {
                firestore().collection('users').doc(user2.uid).get().then((data) => {
                    const captain = data.data()
                    const token = captain.deviceToken
                    const otherUpdates = {
                        // user: {
                        //     uid: profile.uid, name: profile.name,
                        // },
                        // captain: {
                        //     uid: captain.uid, name: captain.name,
                        // }
                        user: {
                            uid: captain.uid, name: captain.name,
                        },
                        captain: {
                            uid: profile.uid, name: profile.name,
                        }
                    }
                    if (isNew) {
                        database()
                            .ref(`/chats/${chatId}`).update(otherUpdates).then(() => { })
                            .catch((er) => { console.log('error on send message333', er) })
                    }
                    sendPushNotification(profile.name, message, 0, [token])
                })

                // database().ref(`/chats/${chatId}`).child('lastUpdate')
                //     .update({ dateInt, date, time: timeFor }).then(() => {
                //         console.log('dg')
                //     })
                //     .catch((err) => { console.log('error on send message22', err) })
            })
            .catch((err) => { console.log('error on send message', err) })

    }

    return (
        <>

            <SafeAreaView style={{ flex: 1, backgroundColor: myColors.background, }}>
                <StatusbarH />

                {/* Back & Others */}
                <View style={{ paddingBottom: myHeight(0) }}>
                    <View style={{
                        elevation: 0, shadowColor: '#000',
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
                                height: myHeight(2.5),
                                width: myHeight(2.5),
                                resizeMode: "contain",
                                tintColor: myColors.text
                            }} source={require('../assets/home_main/home/back.png')} />
                        </TouchableOpacity>

                        <Spacer paddingEnd={myWidth(1)} />
                        {/* Name & Last seen */}
                        <View>
                            <Text style={[styles.textCommon, {
                                fontSize: myFontSize.xBody2,
                                fontFamily: myFonts.heading,
                            }]}>{user2.name ? user2.name : 'Someone'}</Text>
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
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'handled'} bounces={false}
                    showsVerticalScrollIndicator={false} contentContainerStyle={{ flex: 1 }}>

                    {/* Chats */}
                    <FlashList

                        ref={scrollRef}
                        onScrollBeginDrag={() => {
                            setFromTouch(true)
                        }}
                        showsVerticalScrollIndicator={false}
                        onScrollEndDrag={() => {
                        }}
                        onScroll={handleScrollView}
                        extraData={chatss}
                        data={chatss}
                        inverted
                        contentContainerStyle={{
                            flex: 1, paddingHorizontal: myWidth(5),
                            justifyContent: 'flex-end', paddingVertical: myHeight(0.5)
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        estimatedItemSize={200}

                        renderItem={({ item }) => {
                            if (typeof item == 'string') {
                                return (

                                    <View style={{
                                        backgroundColor: myColors.offColor7, borderRadius: 1000,
                                        alignSelf: 'center', marginVertical: myHeight(0.6),
                                        paddingVertical: myHeight(0.5), paddingHorizontal: myWidth(5)
                                    }}>
                                        <Text style={[styles.textCommon, {
                                            fontSize: myFontSize.xxSmall,
                                            fontFamily: myFonts.body,
                                        }]}>{item}</Text>
                                    </View>
                                )

                            }
                            if (item.senderId == profile.uid) {
                                return (
                                    <MyMessage item={item} />
                                )
                            } else {

                                return (
                                    <OtherMessage item={item} />
                                )
                            }

                        }

                        } />
                    {
                        loader ?
                            <View style={{ height: '100%', width: '100%', position: 'absolute', backgroundColor: myColors.background, justifyContent: 'center', alignItems: 'center' }}>

                                <ActivityIndicator size={myHeight(10)} />
                            </View>
                            : null
                    }

                    {/* Bottom */}

                    <View style={{ height: myHeight(0.2), backgroundColor: myColors.divider, marginHorizontal: myWidth(0) }} />

                    <View style={{ backgroundColor: myColors.background, paddingHorizontal: myWidth(4) }}>
                        {
                            (unreadCount && showScrollToLast) ?
                                <View style={{
                                    width: myHeight(5.2),
                                    height: myHeight(5.2),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute', zIndex: 100,
                                    right: myWidth(5), top: - myHeight(12)
                                }}>
                                    <Text style={[styles.textCommon, {
                                        fontSize: myFontSize.small3,
                                        fontFamily: myFonts.body,
                                        color: myColors.background,
                                        // padding: myHeight(0.5),
                                        width: RFValue(15),
                                        height: RFValue(15),
                                        textAlign: 'center',
                                        textAlignVertical: 'center',
                                        borderRadius: 5000,
                                        backgroundColor: myColors.primaryT
                                    }]}>{''}</Text>
                                </View>
                                : null
                        }
                        {
                            showScrollToLast ?
                                <View style={{
                                    position: 'absolute', zIndex: 100,
                                    right: myWidth(5), top: - myHeight(7)
                                }}>



                                    <TouchableOpacity style={{
                                        height: myHeight(5.2),
                                        width: myHeight(5.2),
                                        borderRadius: myHeight(7),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: myColors.offColor7
                                    }}
                                        onPress={() => scrollToBottom()} activeOpacity={0.7}>
                                        <Image style={{
                                            height: myHeight(2.3),
                                            width: myHeight(2.3),
                                            resizeMode: "contain",
                                            tintColor: myColors.text,
                                            transform: [{ rotate: '270deg' }]
                                        }} source={require('../assets/home_main/home/back.png')} />
                                    </TouchableOpacity>
                                </View>
                                : null
                        }
                        <Spacer paddingT={myHeight(1)} />

                        {/*Input &&  Send But*/}
                        <View style={{ flexDirection: 'row', }}>
                            {/* Input Container */}
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                flex: 1,
                                borderRadius: myHeight(2),
                                paddingHorizontal: myWidth(3.5),
                                borderWidth: myHeight(0.1),
                                borderColor: focus ? myColors.primaryT : myColors.text,
                                backgroundColor: myColors.background,

                            }}>

                                <TextInput placeholder="Start typing here ...."
                                    multiline
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
                            <View>
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