import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView, StyleSheet, TouchableOpacity, Image,
    View, Text, StatusBar, TextInput,
    Linking, Platform, ImageBackground, SafeAreaView, Alert,
} from 'react-native';
import { MyError, Spacer, StatusbarH, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { Restaurants } from './home_data';
import { RestaurantInfoFull } from './home.component/restaurant_info_full';
import Lottie from 'lottie-react-native';
import { Filter } from './home.component/filter';
import { useSelector } from 'react-redux';
import { ItemInfo } from './home.component/item_info';
import { FlashList } from '@shopify/flash-list';
import { fromBase64 } from 'js-base64';
import { FirebaseLocation } from '../functions/firebase';
const CommonFaci = ({ name, fac, setFAc }) => (
    <TouchableOpacity activeOpacity={0.75}
        onPress={() => {
            setFAc(!fac)
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <View style={{
                height: myHeight(3.5),
                width: myHeight(3.5),
                paddingTop: myHeight(0.75)
            }}>
                <View style={{ width: myHeight(2.2), height: myHeight(2.2), borderWidth: 1.5, borderColor: myColors.textL4 }} />
                {
                    fac &&
                    <Image style={{
                        height: myHeight(3.5),
                        width: myHeight(3.5),
                        resizeMode: 'contain',
                        tintColor: myColors.primaryT,
                        marginTop: -myHeight(3.3)
                    }} source={require('../assets/home_main/home/check2.png')} />
                }
            </View>
            <Spacer paddingEnd={myWidth(1)} />
            <Text style={[styles.textCommon,
            {
                fontFamily: myFonts.bodyBold,
                fontSize: myFontSize.xBody,

            }]}>{name}</Text>
        </View>
    </TouchableOpacity>
)
function containString(contain, thiss) {
    return (contain.toLowerCase().includes(thiss.toLowerCase()))
}

export const Search = ({ navigation }) => {
    // const { location } = useSelector(state => state.location)
    const { areas, profile } = useSelector(state => state)
    const location = areas.areas

    const [search, setSearch] = useState(null)
    const [longEnable, setLongEnable] = useState(false)
    const [filterItems, setFilterItems] = useState([])
    const [selectedItem, setSelectedItems] = useState([])

    // const [fullRest, setFullRest] = useState([])
    function onLongPress(item) {

        if (!longEnable) {
            console.log(longEnable, item,)

            setLongEnable(true)
            onSinglePress(item, true)

        }
    }
    function onSinglePress(item, fromLong) {
        if (longEnable || fromLong) {
            const isOnArra = selectedItem.findIndex(it => it.id == item.id)
            if (isOnArra == -1) {
                setSelectedItems([...selectedItem, item])
            } else {
                if (selectedItem.length == 1) {
                    clearLongPress()
                }
                setSelectedItems(selectedItem.filter(it => it.id != item.id))
            }
        }
    }
    const Loader = () => (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={{
                marginTop: -myHeight(15),
                alignItems: 'center',
            }}>
                <Lottie
                    autoPlay={true}
                    loop={true}
                    source={require('../assets/lottie/spoonL.json')}
                    style={{
                        height: myHeight(38), width: myHeight(38),
                    }}
                />

                <Text style={[styles.textCommon, {
                    fontSize: myFontSize.body3,
                    color: myColors.textL4,
                    fontFamily: myFonts.bodyBold,
                    marginTop: -myHeight(11)
                }]}>Loading....</Text>
            </View>
        </View>
    )
    // useEffect(() => {

    //     const s = "Service Road, North Nazimabad Town, Karachi Central District, North Nazimabad Town, Sindh, 74700, Pakistan"
    //     const myArray = s.split(',')
    //     const modifiedArray = myArray.slice(0, myArray.length - 3);
    //     const resultString = modifiedArray.join(',');

    //     if (location.length) {
    //         const newLoc = []
    //         location.map((it, i) => {
    //             const { fullName, latitude, longitude } = it
    //             const myArray = fullName.split(',')
    //             const modifiedArray = myArray.slice(0, myArray.length - 3);
    //             const resultString = modifiedArray.join(',');
    //             newLoc.push({ id: i + 1, name: resultString, latitude, longitude })
    //         })
    //         FirebaseLocation.doc('Karachi').set({ areas: newLoc })
    //         console.log(newLoc.length)
    //     }





    // }, [location])

    useEffect(() => {

        if (search) {
            const newR = location.filter(item => (containString(item.name, search)))
            console.log(1, newR.length)
            setFilterItems(newR)
        }

        else {
            console.log(2, location.length)

            setFilterItems(location)

        }




    }, [search, location])
    function clearLongPress() {
        setLongEnable(false)
        setSelectedItems([])
    }

    // useEffect(() => {
    //     if (load) {
    //         setTimeout(() =>
    //             setLoad(false)
    //             , 3000)
    //     }
    // }, [DineIn, TakeAway, Delivery])

    return (

        <>
            <SafeAreaView style={{
                position: 'absolute', height: '100%', width: '100%',
                backgroundColor: myColors.background,
            }}>
                <StatusbarH />
                <Spacer paddingT={myHeight(1.5)} />
                {/* Top */}
                {/* Search */}
                <View style={{ paddingHorizontal: myWidth(4), flexDirection: 'row', alignItems: 'center', }}>

                    {/* Search */}
                    <View style={{
                        flex: 1,

                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: myWidth(longEnable ? 0 : 4),
                        // paddingVertical: myHeight(0.5),
                        height: myHeight(5),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: myWidth(2.5),
                        backgroundColor: longEnable ? myColors.background : myColors.offColor7,

                        // marginHorizontal: myWidth(4)
                    }}>

                        {
                            longEnable ?
                                <>
                                    <TouchableOpacity activeOpacity={0.7} onPress={clearLongPress} style={{}}>
                                        <Image style={{
                                            height: myHeight(2.3),
                                            width: myHeight(2.3),
                                            resizeMode: 'contain',
                                            tintColor: myColors.textL0
                                        }} source={require('../assets/home_main/home/back.png')} />
                                    </TouchableOpacity>
                                    <Spacer paddingEnd={myWidth(3.5)} />
                                    <Text style={[styles.textCommon, {
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.xBody2,
                                        flex: 1
                                    }]}>Select {selectedItem.length}</Text>

                                    <TouchableOpacity activeOpacity={0.7} onPress={() => {

                                    }} style={{}}>
                                        <Text style={[styles.textCommon, {
                                            fontFamily: myFonts.bodyBold,
                                            fontSize: myFontSize.body4,
                                            color: myColors.primaryT,
                                        }]}>Done</Text>
                                    </TouchableOpacity>
                                </>
                                :
                                <>

                                    {/* Arrow */}
                                    <TouchableOpacity activeOpacity={0.7} onPress={() => null} style={{}}>
                                        <Image style={{
                                            height: myHeight(2.3),
                                            width: myHeight(2.3),
                                            resizeMode: 'contain',
                                            tintColor: myColors.textL0
                                        }} source={require('../assets/home_main/home/back.png')} />
                                    </TouchableOpacity>
                                    <Spacer paddingEnd={myWidth(2.5)} />
                                    <TextInput placeholder=" Search location"
                                        placeholderTextColor={myColors.textL5}
                                        autoCorrect={false}
                                        selectionColor={myColors.primaryT}
                                        style={{
                                            flex: 1,
                                            textAlignVertical: 'center',
                                            paddingVertical: ios ? myHeight(0.6) : myHeight(100) > 600 ? myHeight(0.5) : myHeight(0.1),
                                            fontSize: myFontSize.body,
                                            color: myColors.text,
                                            includeFontPadding: false,
                                            fontFamily: myFonts.bodyBold,
                                        }}
                                        cursorColor={myColors.primaryT}
                                        value={search} onChangeText={setSearch}
                                    // value={search} onChangeText={(val) => null}
                                    />
                                </>
                        }
                    </View>
                </View>
                <Spacer paddingT={myHeight(1)} />
                <View style={{ width: '100%', height: 1, backgroundColor: myColors.divider }} />

                {/* <View style={{ marginHorizontal: myWidth(5), flexDirection: 'row', justifyContent: 'space-between' }}>

                    <CommonFaci name={'Dine In'} fac={DineIn} setFAc={setDineIn} />
                    <CommonFaci name={'Delivery'} fac={Delivery} setFAc={setDelivery} />
                    <CommonFaci name={'Take Away'} fac={TakeAway} setFAc={setTakeAway} />
                </View> */}
                {/* Icon Empty Or Content */}

                {/* 
                <TouchableOpacity activeOpacity={0.75} style={{ paddingVertical: myHeight(1), paddingHorizontal: myWidth(4.5), backgroundColor: myColors.background }}
                    onPress={() => null}>
                    <Text style={[styles.textCommon, {
                        fontFamily: myFonts.bodyBold,
                        fontSize: myFontSize.xBody,
                        paddingVertical: myHeight(0.8)
                    }]}>All of {profile.profile.city}</Text>

                </TouchableOpacity>
                <View style={{ height: myHeight(0.25), backgroundColor: myColors.divider, }} /> */}
                <View style={{ flex: 1, }}>
                    {
                        filterItems.length ?

                            <FlashList
                                extraData={[longEnable, selectedItem]}
                                data={filterItems}
                                contentContainerStyle={{}}
                                keyExtractor={(item, index) => index.toString()}
                                estimatedItemSize={87}
                                ItemSeparatorComponent={() => (
                                    <View style={{ height: myHeight(0.35), backgroundColor: myColors.divider, marginHorizontal: myWidth(0) }} />
                                )}
                                renderItem={({ item }) => {
                                    const selItisSlected = selectedItem.findIndex(it => it.id == item.id) != -1
                                    return (

                                        <TouchableOpacity activeOpacity={0.75} style={{ paddingVertical: myHeight(1), paddingHorizontal: myWidth(4.5), backgroundColor: selItisSlected ? myColors.dot : myColors.background }} onLongPress={() => { onLongPress(item) }}
                                            onPress={() => onSinglePress(item)}>
                                            <Text style={[styles.textCommon, {
                                                fontFamily: myFonts.bodyBold,
                                                fontSize: myFontSize.xBody,
                                            }]}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )
                                }

                                } />
                            :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[styles.textCommon, {
                                    fontFamily: myFonts.bodyBold,
                                    fontSize: myFontSize.xBody,
                                }]}>No location Found</Text>
                            </View>
                    }

                </View>



            </SafeAreaView>


        </>
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
})