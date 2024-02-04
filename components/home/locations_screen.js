import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView, StyleSheet,
    //  TouchableOpacity,
    Image,
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
import { TouchableOpacity } from 'react-native-gesture-handler'


function containString(contain, thiss) {
    return (contain.toLowerCase().includes(thiss.toLowerCase()))
}

export const Search = ({ locat, selected, index, setSelected, setShowLoc }) => {
    // const { location } = useSelector(state => state.location)
    const { areas, profile } = useSelector(state => state)
    const location = areas.areas

    const [search, setSearch] = useState(null)
    const [longEnable, setLongEnable] = useState(locat ? locat.length != 0 : 0)
    const [filterItems, setFilterItems] = useState([])
    const [selectedItem, setSelectedItems] = useState(locat ? [...locat] : [])

    // const [fullRest, setFullRest] = useState([])
    function onLongPress(item) {

        if (!longEnable) {

            setLongEnable(true)
            onSinglePress(item, true)

        }
    }
    function onDone(single) {
        // selected[index].locations = [single]
        const newArr = []
        selected.map((it, i) => {

            const { id, time, show, locations } = it
            if (i == index) {

                newArr.push({ id, time, show, locations: single ? [single] : [...selectedItem] })
            } else {
                newArr.push({ id, time, show, locations })
            }
        })
        setSelected([...newArr])
        setShowLoc(false)

    }
    function onSelect(item) {
        setSelected(item)
        setShowLoc(false)
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
        } else {


            onDone(item)
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
    //     }





    // }, [location])

    useEffect(() => {

        if (search) {
            const newR = location.filter(item => (containString(item.name, search)))
            setFilterItems(newR)
        }

        else {

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
                position: 'absolute', zIndex: 1, height: '100%', width: '100%',
                // flex: 1,
                backgroundColor: myColors.background,
                paddingTop: StatusBar.currentHeight
            }}>
                {/* <StatusbarH /> */}
                <Spacer paddingT={myHeight(1.5)} />
                {/* Top */}
                {/* Search */}

                {
                    longEnable ?
                        <View style={{ paddingHorizontal: myWidth(4), flexDirection: 'row', alignItems: 'center', }}>


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

                                <TouchableOpacity activeOpacity={0.7} onPress={() => onDone()} style={{}}>
                                    <Text style={[styles.textCommon, {
                                        fontFamily: myFonts.bodyBold,
                                        fontSize: myFontSize.body4,
                                        color: myColors.primaryT,
                                    }]}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        :
                        null
                }


                <View style={{ paddingHorizontal: myWidth(4), flexDirection: 'row', alignItems: 'center', }}>

                    {/* Search */}
                    <View style={{
                        flex: 1,

                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: myWidth(4),
                        // paddingVertical: myHeight(0.5),
                        height: myHeight(5),
                        alignItems: 'center',
                        borderRadius: myWidth(2.5),
                        backgroundColor: myColors.offColor7,

                        // marginHorizontal: myWidth(4)
                    }}>

                        {/* Arrow */}
                        {
                            !longEnable &&

                            <>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => { setShowLoc(false) }} style={{}}>
                                    <Image style={{
                                        height: myHeight(2.3),
                                        width: myHeight(2.3),
                                        resizeMode: 'contain',
                                        tintColor: myColors.textL0
                                    }} source={require('../assets/home_main/home/back.png')} />
                                </TouchableOpacity>
                                <Spacer paddingEnd={myWidth(2.5)} />
                            </>

                        }
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

                                        <TouchableOpacity activeOpacity={0.75} style={{ paddingVertical: myHeight(1), paddingHorizontal: myWidth(4.5), backgroundColor: selItisSlected ? myColors.dot : myColors.background }}
                                            onPress={() => onSelect(item)}>
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