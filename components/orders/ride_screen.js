import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Spacer, StatusbarH, ios, myHeight, myWidth, printWithPlat } from '../common';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { myColors } from '../../ultils/myColors';
import { useDispatch, useSelector } from 'react-redux';
import { History_Order } from './order_component/order_history';
import { setHistoryOrderse, setPendingOrderse, setProgressOrderse } from '../../redux/order_reducer';
import firestore, { Filter } from '@react-native-firebase/firestore';
import { RequestInfo } from '../home/home.component/request_info';
import { FlashList } from '@shopify/flash-list';
import { containString } from '../functions/functions';


export const RidesScreen = ({ navigation }) => {
    const { pending, progress, history } = useSelector(state => state.orders)
    const pendingUnread = pending.filter(it => it.unread == true)
    const progressUnread = progress.filter(it => it.unread == true)
    const historyUnread = history.filter(it => it.unread == true)
    const [i, setI] = useState(0);
    const [pendingL, setPendingL] = useState([]);
    const [progressL, setProgressL] = useState([]);
    const [historyL, setHistoryL] = useState([]);
    const [search, setSearch] = useState(null)
    const { profile } = useSelector(state => state.profile)
    const dispatch = useDispatch()
    console.log(pendingUnread, progressUnread, historyUnread)

    useEffect(() => {
        if (search) {

            setPendingL(filter(pending))
            setHistoryL(filter(history))
            setProgressL(filter(progress))
        }
        else {
            setPendingL(pending)
            setHistoryL(history)
            setProgressL(progress)
        }
    }, [search, pending, progress, history])
    return (
        <SafeAreaView style={styles.container}>
            <StatusbarH />
            <Spacer paddingT={myHeight(2)} />
            {/* Top Container */}
            <View style={styles.containerTop}>
                {/* containerActivity_Ic */}
                <View style={styles.containerActivity_Ic}>
                    <Text style={styles.textActivity}>Rides</Text>
                </View>
                <Spacer paddingT={myHeight(0.5)} />



                {/* <Spacer paddingT={myHeight(1.5)} /> */}
                {/* Search */}
                {/* <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: myHeight(8),
                    paddingHorizontal: myWidth(4),
                    borderWidth: myHeight(0.09),
                    borderColor: myColors.primaryT,
                    backgroundColor: myColors.background,

                }}>
                    <TextInput placeholder="Search"
                        keyboardType={'number-pad'}
                        placeholderTextColor={myColors.offColor}
                        selectionColor={myColors.primaryT}
                        cursorColor={myColors.primaryT}
                        value={search} onChangeText={setSearch}
                        style={{
                            flex: 1,
                            textAlignVertical: 'center',
                            paddingVertical: ios ? myHeight(0.8) : myHeight(100) > 600 ? myHeight(0.6) : myHeight(0.1),
                            fontSize: myFontSize.xxSmall,
                            color: myColors.text,
                            includeFontPadding: false,
                            fontFamily: myFonts.bodyBold,
                        }}
                    />

                    <Spacer paddingEnd={myWidth(2)} />
                    <Image style={{
                        height: myHeight(2), width: myHeight(2), resizeMode: 'contain', tintColor: myColors.primaryT
                    }} source={require('../assets/home_main/search2.png')} />

                </View> */}

                <Spacer paddingT={myHeight(1.5)} />
                {/* Button Order & History */}
                <View style={styles.containerOrder_Hist}>
                    {/* Order */}
                    <TouchableOpacity activeOpacity={0.6} onPress={() => setI(0)}
                        style={[styles.containerButtonOrder_Hist, { backgroundColor: i == 0 ? myColors.primaryT : myColors.primaryL5 }]}>
                        <Text style={[styles.textHist_Order, { color: i == 0 ? myColors.background : myColors.text }]}>In Progress{progressUnread.length ? ` (${progressUnread.length})` : ''}</Text>
                    </TouchableOpacity>
                    {/* History */}
                    <TouchableOpacity activeOpacity={0.6} onPress={() => setI(1)}
                        style={[styles.containerButtonOrder_Hist, { backgroundColor: i == 1 ? myColors.primaryT : myColors.primaryL5 }]}>
                        <Text style={[styles.textHist_Order, { color: i == 1 ? myColors.background : myColors.text }]}>Pending{pendingUnread.length ? ` (${pendingUnread.length})` : ''}</Text>
                    </TouchableOpacity>

                    {/* History */}
                    <TouchableOpacity activeOpacity={0.6} onPress={() => setI(2)}
                        style={[styles.containerButtonOrder_Hist, { backgroundColor: i == 2 ? myColors.primaryT : myColors.primaryL5 }]}>
                        <Text style={[styles.textHist_Order, { color: i == 2 ? myColors.background : myColors.text }]}>History{historyUnread.length ? ` (${historyUnread.length})` : ''}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Spacer paddingT={myHeight(1.5)} />
            <View style={styles.containerLine} />

            {/* <Spacer paddingT={myHeight(0.86)} /> */}

            <FlashList
                showsVerticalScrollIndicator={false}
                // scrollEnabled={false}
                data={i == 0 ? progressL : i == 1 ? pendingL : historyL}
                extraData={i}
                // extraData={[ac, wifi, topRated, search]}
                contentContainerStyle={styles.containerContentScroll}

                estimatedItemSize={myHeight(10)}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity key={index} activeOpacity={0.95}
                            onPress={() => navigation.navigate('OrderDetails', { item, code: i + 1 })}>



                            <RequestInfo item={item} navigation={navigation} code={i + 1} />
                        </TouchableOpacity>
                    )
                }
                }
            />
            {/* <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.containerContentScroll}>
                {i == 0 &&
                    progress.map((item, ind) =>
                        <TouchableOpacity key={ind} activeOpacity={0.95}
                            onPress={() => navigation.navigate('OrderDetails', { item, code: 1 })}>

                            {ind != 0 &&
                                <View style={{

                                    height: myHeight(0.16),
                                    backgroundColor: myColors.divider,
                                }} />
                            }

                            <RequestInfo item={item} navigation={navigation} code={1} />
                        </TouchableOpacity>
                    )
                }

                {i == 1 &&
                    pending.map((item, ind) =>
                        <TouchableOpacity key={ind} activeOpacity={0.95}
                            onPress={() => navigation.navigate('OrderDetails', { item, code: 2 })}>
                            {ind != 0 &&
                                <View style={{
                                    height: myHeight(0.16),
                                    backgroundColor: myColors.divider,
                                }} />
                            }
                            <RequestInfo item={item} navigation={navigation} code={2} />
                        </TouchableOpacity>

                    )
                }
                {i == 2 &&
                    history.map((item, ind) =>
                        <TouchableOpacity key={ind} activeOpacity={0.95}
                            onPress={() => navigation.navigate('OrderDetails', { item, code: 3 })}>
                            {ind != 0 &&
                                <View style={{
                                    height: myHeight(0.16),
                                    backgroundColor: myColors.divider,
                                }} />
                            }
                            <RequestInfo item={item} navigation={navigation} code={3} />
                        </TouchableOpacity>

                    )
                }
            </ScrollView> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: myColors.background
    },
    containerTop: {
        paddingHorizontal: myWidth(5.58),
    },
    containerActivity_Ic: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    containerOrder_Hist: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    containerButtonOrder_Hist: {
        paddingHorizontal: myWidth(4.5),
        paddingVertical: myHeight(0.5),
        borderRadius: myWidth(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerLine: {
        height: myHeight(0.15),
        backgroundColor: myColors.divider,
    },

    containerContentScroll: {
        paddingHorizontal: myWidth(3.5),
    },



    //Text
    textActivity: {
        fontSize: myFontSize.large,
        fontFamily: myFonts.body,
        color: myColors.text,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,
    },
    textHist_Order: {
        fontSize: myFontSize.xxSmall,
        fontFamily: myFonts.bodyBold,
        letterSpacing: myLetSpacing.common,
        includeFontPadding: false,
        padding: 0,

    },


    // Image
    imageTopIcon: {
        height: myHeight(1.5),
        width: myWidth(3),
        resizeMode: 'contain',
    },
})