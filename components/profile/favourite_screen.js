import React, { useEffect, useRef, useState } from 'react';
import {
    ScrollView, StyleSheet, TouchableOpacity, Image,
    View, Text, StatusBar, TextInput,
    Linking, Platform, ImageBackground, SafeAreaView, FlatList,
} from 'react-native';
import { MyError, Spacer, StatusbarH, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ItemSkeleton, RestaurantInfoSkeleton, RestaurantInfoSkeletonHori } from '../common/skeletons';
import { ItemInfo } from '../home/home.component/item_info';
import { DriverInfoFull } from '../home/home.component/driver_info_full';


export const Favourite = ({ navigation }) => {
    const [i, setI] = useState(0)
    const { AllItems, AllRest } = useSelector(State => State.data)

    const { favoriteItem, favoriteRestuarnt } = useSelector(state => state.favorite)

    const restaurantLength = favoriteRestuarnt.length
    const ItemLength = favoriteItem.length
    const [favItems, setFavItems] = useState([])
    const [favRest, setFavRest] = useState([])
    const [isLoadingRes, setIsLoadingRes] = useState(true)
    const [isLoadingItem, setIsLoadingItem] = useState(true)
    useEffect(() => {

    }, [])

    function onGoToItem(item) {
        const restaurant = AllRest.filter(res => res.uid == item.resId)[0]
        console.log(restaurant)
        navigation.navigate('ItemDetails', { item, restaurant })
    }

    useEffect(() => {
        setIsLoadingItem(ItemLength != 0)
        const favI = AllItems.filter(item => favoriteItem.findIndex(fi => fi.itemId == item.id) != -1)
        setFavItems(favI)
        setIsLoadingItem(false)


    }, [favoriteItem])

    useEffect(() => {
        setIsLoadingRes(restaurantLength != 0)
        const favR = AllRest.filter(res => favoriteRestuarnt.findIndex(fr => fr == res.uid) != -1)
        setFavRest(favR)
        setIsLoadingRes(false)
    }, [favoriteRestuarnt])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: myColors.background }}>
            <StatusbarH />
            {/* Top */}
            <View>
                <Spacer paddingT={myHeight(2)} />
                <View style={{ paddingEnd: myWidth(4), flexDirection: 'row', alignItems: 'center' }}>
                    {/* Search */}

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
                    }]}>
                        Favourites
                    </Text>
                </View>
                {/* <View style={{ height: myHeight(0.6), backgroundColor: myColors.divider }} /> */}
            </View>

            <Spacer paddingT={myHeight(1.5)} />
            {/* Restaurants & Items Headings */}
            <View style={{ flexDirection: 'row', alignItems: "center", }}>
                <Spacer paddingEnd={myWidth(5)} />
                <TouchableOpacity activeOpacity={0.7} onPress={() => setI(0)}>
                    <View style={{
                        paddingHorizontal: myWidth(4),
                        paddingVertical: myHeight(0.6),
                        borderRadius: 500,
                        backgroundColor: i == 0 ? myColors.primary : myColors.divider,
                        alignItems: 'center'
                    }}>
                        <Text style={[styles.textCommon, {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.body,
                            color: i == 0 ? myColors.background : myColors.text
                        }]}>Restaurants</Text>
                    </View>
                    {/* <View style={[{
                        backgroundColor: myColors.primaryT,
                        borderRadius: myHeight(3),
                        height: myHeight(0.4),
                        marginTop: -myHeight(0.4)
                    }, i != 0 && { backgroundColor: myColors.background }]} /> */}
                </TouchableOpacity>

                <Spacer paddingEnd={myWidth(5)} />
                <TouchableOpacity activeOpacity={0.7} onPress={() => setI(1)}>
                    <View style={{
                        paddingHorizontal: myWidth(4),
                        paddingVertical: myHeight(0.6),
                        borderRadius: 500,
                        backgroundColor: i == 1 ? myColors.primary : myColors.divider,
                        alignItems: 'center'
                    }}>
                        <Text style={[styles.textCommon, {
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.body,
                            color: i == 1 ? myColors.background : myColors.text
                        }]}>Items</Text>
                    </View>
                    {/* <View style={[{
                        backgroundColor: myColors.primaryT,
                        borderRadius: myHeight(3),
                        height: myHeight(0.4),
                        marginTop: -myHeight(0.4)
                    }, i != 1 && { backgroundColor: myColors.background }]} /> */}
                </TouchableOpacity>
            </View>

            <Spacer paddingT={myHeight(1)} />
            {/* Line */}
            <View style={{ height: myHeight(0.3), backgroundColor: myColors.divider }} />

            {
                (!favRest.length && i == 0) &&
                <Text style={[styles.textCommon, {
                    fontFamily: myFonts.bodyBold,
                    fontSize: myFontSize.medium0,
                    alignSelf: 'center',
                    textAlignVertical: 'center',
                    marginTop: myHeight(2)
                }]}>{'No Restaurants Found!'}</Text>
            }
            {
                (!favItems.length && i == 1) &&
                <Text style={[styles.textCommon, {

                    fontFamily: myFonts.bodyBold,
                    fontSize: myFontSize.medium0,
                    alignSelf: 'center',
                    textAlignVertical: 'center',
                    marginTop: myHeight(2)

                }]}>{'No Items Found!'}</Text>
            }
            {/* {(!isLoadingItem && ItemLength && i == 1) &&
                <View style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ paddingHorizontal: myWidth(4.1) }} showsVerticalScrollIndicator={false}>
                        <Spacer paddingT={myHeight(1.3)} />

                        {favItems.map((item, i) =>
                            <TouchableOpacity key={i} activeOpacity={0.85} onPress={() => onGoToItem(item)}>
                                <ItemInfo item={item} />
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                </View>
            } */}

            <FlatList
                data={i == 0 ? favRest : favItems}
                keyExtractor={item => i == 0 ? item.uid : item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    if (i == 0) {
                        return (

                            <TouchableOpacity activeOpacity={0.95}
                                onPress={() => navigation.navigate('RestaurantDetail', { item })} >
                                <DriverInfoFull restaurant={item} />
                            </TouchableOpacity>
                        )
                    } else {
                        return (

                            <TouchableOpacity key={i} activeOpacity={0.85} style={{ marginHorizontal: myWidth(4) }} onPress={() => onGoToItem(item)}>
                                <ItemInfo item={item} />
                            </TouchableOpacity>
                        )
                    }
                }

                }
            />
            <Spacer paddingT={myHeight(1)} />

            {/* Loading for Restaurant */}
            {
                (isLoadingRes && i == 0) &&
                <>
                    <RestaurantInfoSkeleton isFull={true} />
                    <RestaurantInfoSkeleton isFull={true} />
                    <RestaurantInfoSkeleton isFull={true} />
                </>

            }
            {/* Loading for Items */}
            {
                (isLoadingItem && i == 1) &&
                <>
                    <ItemSkeleton />
                    <ItemSkeleton />
                    <ItemSkeleton />
                    <ItemSkeleton />
                    <ItemSkeleton />
                    <ItemSkeleton />
                </>

            }


            <Spacer paddingT={myHeight(2)} />

            {/* <FlatList
               
            /> */}

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
})