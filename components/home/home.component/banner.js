import React, { useEffect, useRef, useState } from "react";
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Spacer, myHeight, myWidth } from "../../common"
import { myFontSize, myFonts, myLetSpacing } from "../../../ultils/myFonts"
import { myColors } from "../../../ultils/myColors"
import { offers2 } from "../home_data";
import { FlashList } from "@shopify/flash-list";

export const Banners = () => {
    const [i, setI] = useState(0)
    const dotArr = []
    const scrollRef = useRef(null)
    const offerWidthSScroll = myWidth(100)
    const lenOffers = offers2.length
    const slideIntervalRef = useRef(null);

    const autoSlide = () => {
        if (typeof slideIntervalRef.current !== 'undefined') {
            clearInterval(slideIntervalRef.current);
        }

        slideIntervalRef.current = setInterval(() => {
            setI((prevI) => {
                const maxLength = lenOffers;

                if (prevI + 1 === maxLength) {
                    // scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
                    scrollRef.current?.scrollToOffset({ offset: 0, y: 0, animated: false });
                    return prevI;
                } else {

                    scrollRef.current?.scrollToOffset({ offset: (prevI + 1) * offerWidthSScroll, y: 0, animated: true });

                    return prevI;
                }
            });
        }, 3 * 1000);
    };

    useEffect(() => {
        // Start auto-slide on component mount
        autoSlide();

        // Cleanup interval on component unmount
        return () => {
            if (slideIntervalRef.current) {
                clearInterval(slideIntervalRef.current);
            }
        };
    }, []);

    // Loop for dots
    for (let j = 0; j < lenOffers; j++) {
        dotArr.push(<View key={j} style={[{
            height: myHeight(1), width: j == i ? myHeight(1.5) : myHeight(1),
            margin: 3, borderRadius: myHeight(0.8),
            backgroundColor: j == i ? myColors.primary : myColors.dot,
        }]} />)
    }

    // useEffect(() => {
    //     const dis = i * myWidth(95)

    //     scrollRef.current.scrollTo({ x: dis, animated: true });


    // }, [i])
    // useEffect(() => {

    //     const timer = setTimeout(() => {
    //         setI(i == lenOffers - 1 ? 0 : i + 1);

    //     }, 5000)
    //     return () => clearTimeout(timer);

    // }, [i])
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
            {/* <ScrollView onScroll={handleScroll}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1, justifyContent: 'center',
                    paddingHorizontal: myWidth(5)
                }}
                ref={scrollRef}
                onMomentumScrollEnd={() => console.log('hn')}
                onsc
                pagingEnabled
                snapToInterval={offerWidthSScroll}
                scrollEventThrottle={1} >
                {offers2.map((item, i) => <View key={i} style={{ flex: 1, }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            width: myWidth(90), height: myWidth(90) * 0.47,
                            borderRadius: myHeight(5), borderWidth: 1, borderColor: myColors.offColor2,
                            marginEnd: myWidth(5), overflow: 'hidden'
                        }}

                    >
                        <Image style={{
                            maxWidth: '100%', maxHeight: '100%', justifyContent: 'flex-end',
                            resizeMode: 'stretch',
                            // resizeMode: 'cover',
                        }} source={item.image} />
                    </View>

                </View>)}

            </ScrollView> */}

            <FlashList
                onScroll={handleScroll}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1, justifyContent: 'center',
                    // paddingHorizontal: myWidth(5)
                }}
                onScrollBeginDrag={() => { }}
                ref={scrollRef}
                pagingEnabled
                snapToInterval={offerWidthSScroll}
                scrollEventThrottle={1}
                onScrollEndDrag={() => { }}
                onScrollAnimationEnd={() => { }}
                extraData={[i]}
                data={offers2}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={87}
                ItemSeparatorComponent={() => (
                    <View style={{
                        height: myHeight(0.35),
                        backgroundColor: myColors.divider, marginHorizontal: myWidth(0)
                    }} />
                )}
                renderItem={({ item, index }) => {
                    return (

                        <View key={i} style={{
                            width: myWidth(100), height: myWidth(90) * 0.47, marginEnd: myWidth(0),
                            paddingHorizontal: myWidth(5)
                        }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    height: '100%', width: '100%',
                                    borderRadius: myHeight(5),
                                    borderWidth: 1, borderColor: myColors.offColor2,
                                    overflow: 'hidden'
                                }}

                            >
                                <Image style={{
                                    maxWidth: '100%', maxHeight: '100%', justifyContent: 'flex-end',
                                    resizeMode: 'stretch',
                                    // resizeMode: 'cover',
                                }} source={item.image} />
                            </View>

                        </View>
                    )
                }
                }


            />


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
