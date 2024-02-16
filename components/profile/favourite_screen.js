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
    const { AllDrivers, } = useSelector(State => State.data)

    const { favoriteDrivers } = useSelector(state => state.favorite)
    const DriversLength = favoriteDrivers.length
    const [favItems, setFavItems] = useState([])
    const [favRest, setFavRest] = useState([])
    const [isLoadingRes, setIsLoadingRes] = useState(true)
    useEffect(() => {

    }, [])

    function onGoToItem(item) {

        navigation.navigate('ItemDetails', { item, restaurant })
    }


    useEffect(() => {
        setIsLoadingRes(DriversLength != 0)
        const favR = AllDrivers.filter(res => favoriteDrivers.findIndex(fr => fr == res.uid) != -1)
        setFavRest(favR)
        setIsLoadingRes(false)
    }, [favoriteDrivers])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: myColors.background }}>
            <StatusbarH />
            {/* Top */}
            <View>
                <Spacer paddingT={myHeight(2)} />
                <View style={{ paddingEnd: myWidth(4), flexDirection: 'row', alignItems: 'center' }}>
                    {/* Search */}

                    {/* Arrow */}
                    <View style={{ paddingHorizontal: myWidth(4) }}>

                        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={{
                            backgroundColor: myColors.primaryT,
                            height: myHeight(3.5),
                            width: myHeight(3.5),
                            borderRadius: myHeight(3),
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}  >
                            <Image style={
                                {
                                    height: myHeight(1.7),
                                    width: myHeight(1.7),
                                    resizeMode: 'contain'
                                }
                            } source={require('../assets/startup/goL.png')} />
                        </TouchableOpacity>
                    </View>
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


            <Spacer paddingT={myHeight(1)} />
            {/* Line */}
            <View style={{ height: myHeight(0.3), backgroundColor: myColors.divider }} />

            {
                (!favRest.length) &&
                <Text style={[styles.textCommon, {
                    fontFamily: myFonts.bodyBold,
                    fontSize: myFontSize.medium0,
                    alignSelf: 'center',
                    textAlignVertical: 'center',
                    marginTop: myHeight(2)
                }]}>{'No Favorites Found!'}</Text>
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
                data={favRest}
                keyExtractor={item => item.uid}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    // return null
                    return (

                        <TouchableOpacity activeOpacity={0.8} key={i} onPress={() => navigation.navigate('DriverDetail', { driver: item })}>

                            <DriverInfoFull driver={item} />
                        </TouchableOpacity>
                    )

                }

                }
            />
            <Spacer paddingT={myHeight(1)} />

            {/* Loading for Restaurant */}
            {
                (isLoadingRes) &&
                <>
                    <RestaurantInfoSkeleton isFull={true} />
                    <RestaurantInfoSkeleton isFull={true} />
                    <RestaurantInfoSkeleton isFull={true} />
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