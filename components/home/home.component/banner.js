import React, { useEffect, useRef, useState } from "react";
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Spacer, myHeight, myWidth } from "../../common"
import { myFontSize, myFonts, myLetSpacing } from "../../../ultils/myFonts"
import { myColors } from "../../../ultils/myColors"
import { offers2 } from "../home_data";

export const Banners = () => {
    const [i, setI] = useState(0)
    const dotArr = []
    const scrollRef = useRef(null)
    const offerWidthSScroll = myWidth(95)
    const lenOffers = offers2.length

    // Loop for dots
    for (let j = 0; j < lenOffers; j++) {
        dotArr.push(<View key={j} style={[{
            height: myHeight(1), width: j == i ? myHeight(1.5) : myHeight(1),
            margin: 3, borderRadius: myHeight(0.8),
            backgroundColor: j == i ? myColors.primary : myColors.dot,
        }]} />)
    }
    useEffect(() => {
        //  setInterval(() => {
        //     scrollRef.current.scrollTo({ x: myWidth(95) * (i + 1), animated: true });
        //     console.log(i, i == lenOffers - 1 ? 0 : i + 1)
        //     setI(i == lenOffers - 1 ? 0 : i + 1)
        // }, 2000)

        // const intervalId = setInterval(() => {
        //     setI(prevI => (prevI === lenOffers - 1 ? 0 : prevI + 1));
        //     scrollRef.current?.scrollTo({ x: myWidth(95) * (i + 1), animated: true });
        // }, 2000);

        // return () => clearInterval(intervalId); // Clear the interval on component unmount

    }, [i])
    //Offer Scroll
    function handleScroll(event) {
        const a = (event.nativeEvent.contentOffset.x) / offerWidthSScroll
        let b = Math.round(a)
        if (i != b && b < lenOffers) {
            setI(b)
        }
    }

    return (
        <View>
            <ScrollView
                onScroll={handleScroll}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1, justifyContent: 'center',
                    paddingHorizontal: myWidth(5)
                }}
                ref={scrollRef}
                pagingEnabled
                snapToInterval={offerWidthSScroll}
                scrollEventThrottle={1}
            >
                {offers2.map((item, i) => {
                    return (
                        <View key={i} style={{ flex: 1, }}>
                            {/* Offers */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    width: myWidth(90), height: myWidth(90) * 0.47,
                                    borderRadius: myHeight(5), borderWidth: 1, borderColor: myColors.offColor2,
                                    marginEnd: myWidth(5), overflow: 'hidden'
                                }}

                            >
                                {/* Image Offers */}
                                <Image style={{
                                    maxWidth: '100%', maxHeight: '100%', justifyContent: 'flex-end',
                                    resizeMode: 'stretch',
                                    // resizeMode: 'cover',
                                }} source={item.image} />
                            </View>

                        </View>
                    )
                }
                )
                }
            </ScrollView>
            <Spacer paddingT={myHeight(1.6)} />
            {/*Dots */}
            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                {dotArr}
            </View>
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
