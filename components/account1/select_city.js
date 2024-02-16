import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { myFontSize, myFonts, myLetSpacing } from "../../ultils/myFonts"
import { myColors } from "../../ultils/myColors"
import { Spacer, StatusbarH, myHeight, myWidth } from "../common";
import BigList from "react-native-big-list";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

const pakCities = ["Abbottabad", "Abdul Hakeem", "Ahmadpur East", "Alipur Chatha", "Arifwala", "Attock", "Badah",
    "Badin", "Bahawalnagar", "Bahawalpur", "Bannu", "Basirpur", "Batkhela", "Bhakkar", "Bhalwal", "Bhera", "Burewala",
    "Chak Jhumra", "Chakwal", "Chaman", "Charsadda", "Chichawatni", "Chiniot", "Chishtian", "Chitral", "Chowk Azam",
    "Chuhar Kana", "Chunian", "Dadu", "Daharki", "Daska", "Dera Allah Yar", "Dera Ghazi Khan", "Dera Ismail Khan",
    "Dera Murad Jamali", "Dina", "Dinga", "Dipalpur", "Dullewala", "Dunyapur", "Faisalabad", "Ferozwala",
    "Fort Abbas", "Gakhars", "Ghotki", "Gojra", "Gujar Khan", "Gujranwala", "Gujrat", "Gwadar", "Hadali", "Hafizabad",
    "Hala, Sindh", "Hangu", "Haripur", "Harunabad", "Hasan Abdal", "Hasilpur", "Haveli Lakha", "Havelian",
    "Hub, Balochistan", "Hujra Shah Muqeem", "Hyderabad", "Islamabad", "Jacobabad", "Jalalpur", "Jalalpur Pirwala",
    "Jampur", "Jaranwala", "Jatoi", "Jauharabad", "Jehangira", "Jhang", "Jhelum", "Kabirwala",
    "Kahna Nau", "Kahror Pacca", "Kamalia", "Kamoke", "Kamra",
    "Kandhkot", "Karachi", "Kasur", "Khairpur", "Khalabat Township", "Khanewal", "Khanpur", "Kharan",
    "Kharian", "Khurrianwala", "Khushab", "Khuzdar", "Kohat", "Kot Abdul Malik", "Kot Adu", "Kot Moman",
    "Kot Radha Kishan", "Kotri", "Kundian", "Lahore", "Lakki Marwat", "Lalamusa", "Lalian", "Larkana",
    "Layyah", "Liaqauatpur", "Lodhran", "Loralai", "Ludhewala Waraich", "Mailsi", "Malakwal", "Mandi Bahauddin",
    "Mansehra", "Mardan", "Mastung", "Matli", "Mian Channu", "Mianwali", "Mingora",
    "Mirpur Khas", "Mirpur Mathelo", "Moro", "Multan", "Muridke", "Mustafabad, Punjab", "Muzaffargarh",
    "Nankana Sahib", "Narang, Gujrat", "Narowal", "Nawabshah", "Nowshera", "Nowshera Virkan", "Okara",
    "Pabbi", "Pakpattan", "Pano Aqil", "Pasni (city)", "Pasrur", "Pattoki", "Peshawar", "Phool Nagar",
    "Pindi Bhattian", "Pindigheb", "Pir Mahal", "Qambar", "Qila Didar Singh", "Quetta", "Rabwah",
    "Rahim Yar Khan", "Rajanpur", "Ratodero", "Rawalpindi", "Renala Khurd", "Risalpur", "Rohri",
    "Sadiqabad", "Sahiwal", "Sambrial", "Sammundri", "Sanghar", "Sangla Hill", "Sarai Alamgir", "Sargodha",
    "Sehwan Sharif", "Shabqadar", "Shahdadkot", "Shahdadpur", "Shahkot", "Shakargarh", "Sheikhupura",
    "Shikarpur", "Shorkot", "Shujabad", "Sialkot", "Sibi", "Sukkur", "Swabi", "Takht-i-Bahi", "Talagang", "Tandlianwala",
    "Tando Adam", "Tando Allahyar", "Tando Muhammad Khan", "Tank", "Taunsa Sharif", "Taxila", "Thatta",
    "Timergara", "Toba Tek Singh", "Topi, Khyber Pakhtunkhwa", "Turbat", "Umerkot", "Usta Mohammad", "Vehari", "Wah",
    "Wazirabad", "Zhob",
    "Zahir Pir"]

export const SelectCity = ({ showCityModal, setCity, city }) => {
    const [search, setSearch] = useState(null)
    const [filterList, setFilterList] = useState([])

    useEffect(() => {
        if (search) {
            const s = pakCities.filter((item) => item.toLowerCase().includes(search.toLowerCase()))
            setFilterList(s)
        } else {
            setFilterList(pakCities)
        }
    }, [search])

    function onSelect(name) {
        setCity(name)
        showCityModal(false)
    }
    return (
        <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={{ height: '100%', width: '100%', position: 'absolute', backgroundColor: myColors.background, zIndex: 10000 }}>
            <StatusbarH />
            <Spacer paddingT={myHeight(1)} />
            {/* Top */}
            <View style={{ paddingHorizontal: myWidth(4.5), flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity activeOpacity={0.6} style={{ padding: myHeight(1) }}
                    onPress={() => showCityModal(false)}>
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
                }]}>Select City</Text>
            </View>

            <Spacer paddingT={myHeight(1.5)} />
            {/* Search */}
            <View style={{
                flexDirection: 'row', alignItems: 'center', width: myWidth(92),
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
                    placeholder="Search City"
                    cursorColor={myColors.primaryT}
                    placeholderTextColor={myColors.offColor}
                    value={search}

                    onChangeText={setSearch}
                />
            </View>
            <Spacer paddingT={myHeight(1.5)} />

            {/* Selected Country */}
            {city &&
                <>
                    <Spacer paddingT={myHeight(0.7)} />

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: myWidth(5),
                        backgroundColor: myColors.background,
                    }}>
                        <Text style={{
                            fontSize: myFontSize.body3,
                            fontFamily: myFonts.heading,
                            color: myColors.text,
                            letterSpacing: myLetSpacing.common,
                            includeFontPadding: false,
                            padding: 0,
                        }}>{city}</Text>
                        <Spacer paddingEnd={myWidth(3)} />

                        <Image style={{
                            height: myHeight(2),
                            width: myHeight(2),
                            resizeMode: 'contain',
                            tintColor: myColors.textL4
                        }} source={require('../assets/account/check.png')} />
                    </View>
                    <Spacer paddingT={myHeight(1.5)} />

                </>
            }

            <View style={{ backgroundColor: myColors.divider, height: myHeight(0.3) }} />

            <BigList
                itemHeight={myFontSize.body2 + myHeight(4.2)}
                data={filterList}
                style={{ paddingHorizontal: myWidth(2) }}
                ItemSeparatorComponent={() => (
                    <View style={{ backgroundColor: myColors.divider, height: myHeight(0.3) }} />
                )}

                renderItem={({ item }) =>
                    <TouchableOpacity activeOpacity={0.5}
                        onPress={() => onSelect(item)}
                        style={{
                            justifyContent: 'center',
                            paddingHorizontal: myWidth(3),
                            backgroundColor: myColors.background,
                            paddingVertical: myHeight(1.8)
                        }}>
                        <Text style={{
                            fontSize: myFontSize.body2,
                            fontFamily: myFonts.heading,
                            color: myColors.text,
                            letterSpacing: myLetSpacing.common,
                            includeFontPadding: false,
                            padding: 0,
                        }}>{item}</Text>
                    </TouchableOpacity>


                }

                keyExtractor={item => item}
            />
            {/* <View style={{
                borderTopWidth: myHeight(0.1),
                borderColor: myColors.offColor, width: "100%"
            }} /> */}

            {/* <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    flexWrap: 'wrap', flexDirection: 'row',
                    alignItems: 'center',
                    paddingStart: myWidth(2),

                }}>

                    {filterList.map((item, i) =>
                        <TouchableOpacity key={i} activeOpacity={0.95} style={{
                            flexBasis: '43%', marginHorizontal: myWidth(3),
                            marginVertical: myHeight(1),
                            justifyContent: 'center', alignItems: 'center'
                        }} onPress={() =>null}>
                            <View style={{ paddingBottom: myHeight(1), }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: myColors.background, elevation: 3, borderRadius: myWidth(5), width: myWidth(43), height: myWidth(36), }}>
                                    <ImageUri width={myWidth(35)} height={myWidth(35)} resizeMode="contain" uri={item.image} />
                  
                                </View>
                            </View>
                            <Text
                                style={[styles.textCommon, {
                                    fontSize: myFontSize.xBody,
                                    fontFamily: myFonts.heading,
                                    alignSelf: 'center'
                                }]}>{item.name}</Text>
                            <Spacer paddingT={myHeight(0)} />

                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView> */}

            {/* THree */}
            {/* <TouchableOpacity key={i} activeOpacity={0.95} style={{
                            flexBasis: '25%', marginHorizontal: myWidth(4), marginVertical: myHeight(1),
                            alignItems: 'center',
                        }} onPress={() => null}>
                            <View style={{ paddingBottom: myHeight(1), }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: myColors.background, elevation: 6, borderRadius: myWidth(5), width: myWidth(28), height: myWidth(28) }}>
                                    <Image style={{
                                        height: myWidth(17), width: myWidth(17),
                                        resizeMode: 'contain',
                                    }} source={item.image} />
                                </View>
                            </View>
                            <Text
                                style={[styles.textCommon, {
                                    fontSize: myFontSize.body2,
                                    fontFamily: myFonts.heading,
                                    alignSelf: 'center'
                                }]}>{item.name}</Text>
                            <Spacer paddingT={myHeight(0.5)} />

                        </TouchableOpacity> */}


            {/* Two */}
            {/* <TouchableOpacity activeOpacity={0.95} style={{
                        flexBasis: '40%', marginHorizontal: myWidth(4), marginVertical: myHeight(1),
                        // justifyContent: 'center', alignItems: 'center', backgroundColor: 'red'
                    }} onPress={() => null}>
                        <View style={{ paddingBottom: myHeight(1), }}>
                            <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: myColors.background, elevation: 6, borderRadius: myWidth(5), width: myWidth(40), height: myWidth(23) + myHeight(4) }}>
                                <Image style={{
                                    height: myWidth(23), width: myWidth(23),
                                    resizeMode: 'contain',
                                }} source={item.image} />
                            </View>
                        </View>
                        <Text
                            style={[styles.textCommon, {
                                fontSize: myFontSize.xBody,
                                fontFamily: myFonts.heading,
                                alignSelf: 'center'
                            }]}>{item.name}</Text>
                        <Spacer paddingT={myHeight(0.5)} />

                    </TouchableOpacity> */}

        </Animated.View>
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
