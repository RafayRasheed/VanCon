import React, { useEffect, useState } from "react";
import { View, ScrollView, FlatList, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { myFontSize, myFonts, myLetSpacing } from "../../ultils/myFonts"
import { myColors } from "../../ultils/myColors"
import { Categories, offers } from "./home_data";
import { Spacer, StatusbarH, myHeight, myWidth } from "../common";
import { RestaurantInfo } from "./home.component/restaurant_info";
import { DriverInfoFull } from "./home.component/driver_info_full";
import { useSelector } from "react-redux";
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
export const RestaurantAll = ({ navigation, route }) => {
    const { name } = route.params
    let restaurants = []
    const data = useSelector(State => State.data)

    const [filterRes, setFilterRes] = useState([])
    const [fullRest, setFullRest] = useState([])

    const [search, setSearch] = useState(null)
    const [DineIn, setDineIn] = useState(false)
    const [Delivery, setDelivery] = useState(false)
    const [TakeAway, setTakeAway] = useState(false)
    const [first, setFirst] = useState(true)


    useEffect(() => {
        if (!first) {
            const newR = fullRest.filter(res => (search ? containString(res.name, search) : true) && (Delivery ? res.homeDelivery == true : true) && (TakeAway ? res.takeAway == true : true) && (DineIn ? res.dineIn == true : true))
            setFilterRes(newR)

            // if (name == 'New Arrivals' || name == 'Recommended') {
            // }

            // else {
            //     const newR = filterRes.filter(res => res.categories.findIndex(name) != -1)
            //     setFilterRes(newR)
            // }

        }
        else {
            if (name == 'New Arrivals') {
                setFilterRes(data.nearby)
                setFullRest(data.nearby)
            }
            else if (name == 'Recommended') {
                setFilterRes(data.recommend)
                setFullRest(data.recommend)

            }
            else {
                const newR = data.AllRest.filter(res => (res.categories.findIndex(cat => cat == name) != -1))
                //  console.log()
                setFilterRes(newR)
                setFullRest(newR)

                // setFilterRes(data.AllRest)

            }
        }
        setFirst(false)
    }, [search, Delivery, DineIn, TakeAway])
    return (
        <View style={{ paddingHorizontal: myWidth(0), flex: 1, backgroundColor: myColors.background }}>
            <StatusbarH />
            <Spacer paddingT={myHeight(1)} />
            {/* Top */}
            <View style={{ paddingHorizontal: myWidth(4.5), flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity activeOpacity={0.6} style={{ padding: myHeight(1) }}
                    onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/common/back.png')} style={{
                        width: myHeight(2.4),
                        height: myHeight(2.4),
                        resizeMode: 'contain',
                    }} />
                </TouchableOpacity>
                <Spacer paddingEnd={myWidth(2)} />
                <Text style={[styles.textCommon, {
                    flex: 1,
                    fontSize: myFontSize.xBody2,
                    fontFamily: myFonts.heading,
                }]}>{name}</Text>
            </View>

            <Spacer paddingT={myHeight(1.5)} />
            <View style={{ paddingHorizontal: myWidth(4), flexDirection: 'row', alignItems: 'center' }}>
                {/* Search */}
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: myColors.divider, alignSelf: 'center',
                    paddingVertical: myHeight(0.8),
                    borderRadius: myHeight(1.2)
                }}>
                    <Spacer paddingEnd={myWidth(4)} />
                    <Image style={{
                        height: myHeight(2.2),
                        width: myHeight(2.2),
                        resizeMode: 'contain',
                        tintColor: myColors.textL4
                    }} source={require('../assets/home_main/home/search.png')} />
                    <Spacer paddingEnd={myWidth(3)} />

                    <TextInput
                        style={{
                            flex: 1,
                            padding: 0, fontSize: myFontSize.body,
                            fontFamily: myFonts.bodyBold, alignItems: 'center',
                            includeFontPadding: false,
                        }}
                        placeholder="Search Restaurants"
                        cursorColor={myColors.primaryT}
                        placeholderTextColor={myColors.offColor}
                        value={search}

                        onChangeText={setSearch}
                    />
                </View>
            </View>
            <Spacer paddingT={myHeight(1.5)} />
            <View style={{ marginHorizontal: myWidth(5), flexDirection: 'row', justifyContent: 'space-between' }}>

                <CommonFaci name={'Dine In'} fac={DineIn} setFAc={setDineIn} />
                <CommonFaci name={'Delivery'} fac={Delivery} setFAc={setDelivery} />
                <CommonFaci name={'Take Away'} fac={TakeAway} setFAc={setTakeAway} />
            </View>
            {/* <View style={{
                borderTopWidth: myHeight(0.1), alignSelf: 'flex-end',
                borderColor: myColors.offColor, width: "100%"
            }} /> */}

            <FlatList
                data={filterRes}
                keyExtractor={item => item.uid}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) =>
                    <TouchableOpacity activeOpacity={0.95}
                        onPress={() => navigation.navigate('RestaurantDetail', { item })} >
                        <DriverInfoFull restaurant={item} />
                    </TouchableOpacity>}
            />
            {/* <ScrollView showsVerticalScrollIndicator={false}>

                {filterRes.map((item, i) =>
                    <TouchableOpacity key={i} activeOpacity={0.95}
                        onPress={() => navigation.navigate('RestaurantDetail', { item })} >
                        <DriverInfoFull restaurant={item} />
                    </TouchableOpacity>
                )}
            </ScrollView> */}
        </View>
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
