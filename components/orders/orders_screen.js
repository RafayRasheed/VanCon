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


export const RidesScreen = ({ navigation }) => {
    const { pending, progress, history } = useSelector(state => state.orders)
    console.log(pending.length, progress.length, history.length)
    const [i, setI] = useState(0);
    const [search, setSearch] = useState(null)
    const { profile } = useSelector(state => state.profile)
    const dispatch = useDispatch()

    useEffect(() => {
    }, [])
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
                        style={[styles.containerButtonOrder_Hist, { backgroundColor: i == 0 ? myColors.primaryT : myColors.primaryL2 }]}>
                        <Text style={[styles.textHist_Order, { color: i == 0 ? myColors.background : myColors.text }]}>In Progress ({progress.length})</Text>
                    </TouchableOpacity>
                    {/* History */}
                    <TouchableOpacity activeOpacity={0.6} onPress={() => setI(1)}
                        style={[styles.containerButtonOrder_Hist, { backgroundColor: i == 1 ? myColors.primaryT : myColors.primaryL2 }]}>
                        <Text style={[styles.textHist_Order, { color: i == 1 ? myColors.background : myColors.text }]}>Pending ({pending.length})</Text>
                    </TouchableOpacity>

                    {/* History */}
                    <TouchableOpacity activeOpacity={0.6} onPress={() => setI(2)}
                        style={[styles.containerButtonOrder_Hist, { backgroundColor: i == 2 ? myColors.primaryT : myColors.primaryL2 }]}>
                        <Text style={[styles.textHist_Order, { color: i == 2 ? myColors.background : myColors.text }]}>History ({history.length})</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Spacer paddingT={myHeight(2)} />
            <View style={styles.containerLine} />
            {/* <Spacer paddingT={myHeight(0.86)} /> */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.containerContentScroll}>
                {i == 0 &&
                    progress.map((item, ind) =>
                        <TouchableOpacity key={ind} activeOpacity={0.95}
                            onPress={() => navigation.navigate('OrderDetails', { item })}>

                            {ind != 0 &&
                                <View style={{

                                    height: myHeight(0.16),
                                    backgroundColor: myColors.divider,
                                }} />
                            }

                            <RequestInfo item={item} />
                        </TouchableOpacity>
                    )
                }

                {i == 1 &&
                    pending.map((item, ind) =>
                        <TouchableOpacity key={ind} activeOpacity={0.95}
                            onPress={() => navigation.navigate('OrderDetails', { item })}>
                            {ind != 0 &&
                                <View style={{
                                    height: myHeight(0.16),
                                    backgroundColor: myColors.divider,
                                }} />
                            }
                            <RequestInfo item={item} />
                        </TouchableOpacity>

                    )
                }
                {i == 2 &&
                    history.map((item, ind) =>
                        <TouchableOpacity key={ind} activeOpacity={0.95}
                            onPress={() => navigation.navigate('OrderDetails', { item })}>
                            {ind != 0 &&
                                <View style={{
                                    height: myHeight(0.16),
                                    backgroundColor: myColors.divider,
                                }} />
                            }
                            <RequestInfo item={item} />
                        </TouchableOpacity>

                    )
                }
            </ScrollView>
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
        paddingHorizontal: myWidth(3.5),
        paddingVertical: myHeight(0.5),
        borderRadius: myWidth(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerLine: {
        height: myHeight(0.06),
        backgroundColor: myColors.line,
    },

    containerContentScroll: {
        paddingHorizontal: myWidth(3.5),
    },



    //Text
    textActivity: {
        fontSize: myFontSize.xBody,
        fontFamily: myFonts.bodyBold,
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