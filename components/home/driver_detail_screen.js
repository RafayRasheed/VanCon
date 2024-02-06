import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView, StyleSheet, TouchableOpacity, Image,
  View, Text, StatusBar,
  Linking, Platform, ImageBackground, BackHandler, TextInput,
} from 'react-native';
import { Loader, MyError, Spacer, StatusBarHide, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { ItemInfo } from './home.component/item_info';
import { useDispatch, useSelector } from 'react-redux';
import { addFavoriteRest, removeFavoriteRest } from '../../redux/favorite_reducer';
import { useFocusEffect } from '@react-navigation/native';
import { ImageUri } from '../common/image_uri';
import { dataFullData, deccodeInfo } from '../functions/functions';
import Collapsible from 'react-native-collapsible';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { Stars } from './home.component/star';
import firestore from '@react-native-firebase/firestore';

export const DriverDetail = ({ navigation, route }) => {
  const driver = route.params.driver;
  const backScreen = route.params.backScreen
  const [inside, setInside] = useState(true);
  const [RatingModal, setRatinModal] = useState(false)
  const [starI, setStarI] = useState(undefined)
  const [review, setReview] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  //Back Functions
  const { profile } = useSelector(state => state.profile)


  function hideModal() {
    setRatinModal(false)
  }
  function onDone() {
    if (starI && review) {
      setIsLoading(true)
      firestore().collection('drivers').doc(driver.uid).get()
        .then((data) => {
          const res = data.data()
          const noOfRatings = res.noOfRatings ? res.noOfRatings : 0
          const ratingTotal = res.ratingTotal ? res.ratingTotal : 0
          const reviews = res.reviews ? res.reviews : []

          const newRatingTotal = ratingTotal + starI + 1
          const newnoOfRatings = noOfRatings + 1
          const newrating = newRatingTotal / newnoOfRatings


          const date = dataFullData()
          const reviewNew =
          {
            dateInt: date.dateInt,
            id: profile.uid,
            name: profile.name,
            rating: starI + 1,
            date: date.date,
            review: review,
          }
          // console.log(reviewNew)
          // return
          const newReview = [
            ...reviews,
            reviewNew
          ]

          const update = {
            noOfRatings: newnoOfRatings,
            ratingTotal: newRatingTotal,
            reviews: newReview,
            rating: newrating
          }

          firestore().collection('drivers').doc(driver.uid).update(update)
            .then((data) => {
              setIsLoading(false)
              hideModal()
            }).catch((er) => {
              console.log('Error on Get Users for fav', er)
              setErrorMsg('Something Wrong')
              setIsLoading(false)

            })
        }).catch((er) => {
          console.log('Error on Get Users for fav', er)
          setErrorMsg('Something Wrong')
          setIsLoading(false)

        })


    }

    else (
      setErrorMsg('PLease Add Review and rate')
    )
    // hideModal()
  }
  const onBackPress = () => {

    if (backScreen) {
      // navigation.navigate(backScreen, route.params.params)
      navigation.goBack()
      return true
    }

    return false
  };
  useFocusEffect(
    React.useCallback(() => {

      BackHandler.addEventListener(
        'hardwareBackPress', onBackPress
      );
      return () =>
        BackHandler.removeEventListener(
          'hardwareBackPress', onBackPress
        );
    }, [backScreen])
  );


  function back() {
    if (backScreen) {
      navigation.navigate(backScreen, route.params.params)
      return
    }
    navigation.goBack()
  }

  const { favoriteDrivers } = useSelector(state => state.favorite)
  const dispatch = useDispatch()

  const checkFav = favoriteDrivers.find(redID => redID == driver.uid)
  const [isFav, setIsFav] = useState(checkFav != null)

  function changeFav() {
    if (!isFav) {
      dispatch(addFavoriteRest({ resId: driver.uid }))
    } else {
      dispatch(removeFavoriteRest({ resId: driver.uid }))
    }
    setIsFav(!isFav)
  }
  useEffect(() => {
    // console.log(driver)
    setIsFav(checkFav != null)
  }, [checkFav])
  return (
    <View style={{ flex: 1, backgroundColor: myColors.background }}>

      <View style={{
        width: '100%',
        height: myHeight(28),

        borderBottomLeftRadius: myWidth(4),
        borderBottomRightRadius: myWidth(4),
        overflow: 'hidden',
      }} >
        <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={driver.vehicleImage} />

        {/* Back */}
        <TouchableOpacity
          style={{
            backgroundColor: myColors.background,
            padding: myHeight(1),
            borderRadius: myHeight(5),
            position: 'absolute',
            top: StatusBar.currentHeight + myHeight(0.6),
            left: myWidth(4),
          }}
          activeOpacity={0.8}
          onPress={back}>
          <Image
            style={{
              width: myHeight(2.6),
              height: myHeight(2.6),
              resizeMode: 'contain',
            }}
            source={require('../assets/home_main/home/back.png')}
          />
        </TouchableOpacity>

        <View style={{
          backgroundColor: 'transparent',
          position: 'absolute',
          top: StatusBar.currentHeight + myHeight(0.6),
          right: myWidth(4),
          flexDirection: 'row'
        }}>

          {/* Search */}
          {/* <TouchableOpacity
            style={{
              backgroundColor: myColors.background,
              padding: myHeight(1),
              borderRadius: myHeight(5),

            }}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ItemSearch', { items: allItems, driver })}>
            <Image
              style={{
                width: myHeight(2.6),
                height: myHeight(2.6),
                resizeMode: 'contain',
              }}
              source={require('../assets/home_main/home/search.png')}
            />
          </TouchableOpacity> */}

        </View>

      </View>

      {/* Content */}
      {/* Restuarant Info */}
      <TouchableOpacity disabled activeOpacity={0.96} onPress={() => navigation.navigate('RestaurantMoreDetails', { driver: driver })}
        style={{
          // height:'100%',
          //    position:'absolute', left:0,
          backgroundColor: myColors.background,
          marginTop: -myHeight(5.5),
          borderRadius: myHeight(3),
          borderTopStartRadius: myHeight(3),
          borderTopEndRadius: myHeight(3),
          marginHorizontal: myWidth(3.5),
          elevation: 10,
          paddingHorizontal: myWidth(4),

          //    backgroundColor:'#ffffff30'
        }}>
        {/* Icon */}
        <View
          style={{
            width: myHeight(6.5),
            height: myHeight(6.5),
            borderRadius: myHeight(6),
            borderWidth: myHeight(0.15),
            marginTop: -myHeight(3),
            borderColor: myColors.primaryT,
            alignSelf: 'center',
            overflow: 'hidden',
            backgroundColor: myColors.background

          }}>
          <Image style={{
            width: '100%', height: '100%',
            resizeMode: 'contain', marginTop: myHeight(0.0), tintColor: myColors.text
          }}
            source={require('../assets/home_main/home/driver.png')} />
          {/* <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={driver.vehicleImage} borderRadius={5000} /> */}
        </View>


        {/* Heart */}
        <TouchableOpacity
          style={{
            backgroundColor: myColors.background,
            padding: myHeight(2.5),
            paddingTop: myHeight(1.5),
            borderRadius: myHeight(5),
            top: myHeight(0),
            right: myWidth(0),
            position: 'absolute'
          }}
          activeOpacity={0.8}
          onPress={changeFav}>
          <Image style={{
            height: myHeight(3),
            width: myHeight(3),
            resizeMode: 'contain',
            tintColor: myColors.red
          }}
            source={isFav ? require('../assets/home_main/home/heart.png') : require('../assets/home_main/home/heart_o.png')} />
        </TouchableOpacity>
        <Spacer paddingT={myHeight(0.3)} />
        {/* name */}
        <Text
          numberOfLines={2}
          style={[
            styles.textCommon,
            {
              textAlign: 'center',
              fontSize: myFontSize.medium0,
              fontFamily: myFonts.heading,
            },
          ]}>
          {driver.name}
        </Text>
        <Spacer paddingT={myHeight(1)} />

        {/* Rating & Rate Us */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{
            width: myHeight(2.6), height: myHeight(2.6),
            marginLeft: -myWidth(0.5), marginTop: -myHeight(0.2),
            resizeMode: 'contain', tintColor: myColors.primaryT
          }}
            source={require('../assets/home_main/home/navigator/van2.png')} />
          <Spacer paddingEnd={myWidth(0.8)} />

          {/* Name */}
          <Text numberOfLines={1}
            style={{
              flex: 1,
              fontSize: myFontSize.xBody,
              color: myColors.text, fontFamily: myFonts.heading
            }}>{driver.vehicleName} <Text style={{
              fontSize: myFontSize.body4,
              color: myColors.text, fontFamily: myFonts.body
            }}>({driver.vehicleModal})</Text></Text>



          <Spacer paddingEnd={myWidth(1.5)} />

          <Image style={{
            width: myHeight(3.5), height: myHeight(3.5),
            resizeMode: 'contain', marginTop: myHeight(0.5), tintColor: myColors.primaryT
          }}
            source={require('../assets/home_main/home/ac.png')} />
          <Spacer paddingEnd={myWidth(2.5)} />

          <Text

            style={{
              fontSize: myFontSize.xBody,
              fontFamily: myFonts.heading,
              color: myColors.text,
              letterSpacing: myLetSpacing.common,
              includeFontPadding: false,
              padding: 0,
            }}>{driver.ac ? 'AC' : 'Non AC'}</Text>
          <Spacer paddingEnd={myWidth(2.5)} />

          <Image style={{
            width: myHeight(2.8), height: myHeight(2.8),
            resizeMode: 'contain', marginTop: myHeight(0),
            tintColor: driver.isWifi ? myColors.primaryT : myColors.offColor
          }}
            source={driver.isWifi ? require('../assets/home_main/home/wifi.png') : require('../assets/home_main/home/wifiO.png')} />

        </View>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>
          {/* Rating */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* Star */}
            <Image
              style={{
                width: myHeight(2.1),
                height: myHeight(2.1),
                resizeMode: 'contain',
                // tintColor: myColors.primaryT
              }}
              source={require('../assets/home_main/home/star.png')}
            />
            <Spacer paddingEnd={myWidth(1.4)} />
            {/* Rating */}
            <Text
              numberOfLines={2}
              style={[
                styles.textCommon,
                {
                  fontSize: myFontSize.body2,
                  fontFamily: myFonts.heading,
                  color: myColors.text,
                },
              ]}>
              {`${driver.rating} `}
            </Text>
            {/* Rate us */}
            <TouchableOpacity disabled activeOpacity={1} onPress={() => null}>
              <Text
                numberOfLines={2}
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.body2,
                    fontFamily: myFonts.heading,
                    color: myColors.textL4,
                  },
                ]}>
                {`(${driver.noOfRatings})`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ paddingHorizontal: myWidth(2.5) }} activeOpacity={1} onPress={() => setRatinModal(true)}>
              <Text
                numberOfLines={2}
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.xBody,
                    fontFamily: myFonts.heading,
                    color: myColors.primaryT,
                  },
                ]}>
                Rate
              </Text>
            </TouchableOpacity>
          </View>

          {/*more */}
          {/* <TouchableOpacity activeOpacity={0.8} onPress={() => null}> 
            </TouchableOpacity>
            */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

            <Image style={{
              width: myHeight(2), height: myHeight(2),
              resizeMode: 'contain', marginTop: myHeight(0.0), tintColor: myColors.primaryT
            }}
              source={require('../assets/home_main/home/seatSF.png')} />
            <Spacer paddingEnd={myWidth(1.5)} />

            <Text

              style={{
                fontSize: myFontSize.body3,
                fontFamily: myFonts.bodyBold,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>{driver.vehicleSeats} Seater</Text>
            <Spacer paddingEnd={myWidth(1.5)} />
          </View>
        </View>


        <Spacer paddingT={myHeight(1.5)} />
      </TouchableOpacity>


      <Spacer paddingT={myHeight(1)} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacer paddingT={myHeight(1)} />

        {/*Phone &  Chat */}
        <View style={{
          flexDirection: 'row',
          borderTopWidth: myWidth(0.2), borderWidth: myWidth(0.2),
          borderColor: myColors.textL, marginHorizontal: myWidth(4),
          borderRadius: myWidth(50)
        }}>
          {/* Phone */}
          <TouchableOpacity activeOpacity={0.7} onPress={() => { Linking.openURL(`tel:${driver.contact}`); }}
            style={{
              width: '50%', flexDirection: 'row', paddingVertical: myHeight(1.2),
              alignItems: 'center', justifyContent: 'center', borderEndWidth: myWidth(0.2),
              borderColor: myColors.textL,
            }}>
            <Image source={require('../assets/home_main/home/phone.png')}
              style={{
                width: myHeight(2.28),
                height: myHeight(2.28),
                resizeMode: 'contain',
                tintColor: myColors.primaryT
              }}
            />
            <Spacer paddingEnd={myWidth(3)} />
            <Text style={[
              styles.textCommon,
              {
                fontSize: myFontSize.body2,
                fontFamily: myFonts.heading,
                color: myColors.text
              }
            ]}>CALL</Text>
          </TouchableOpacity>

          {/* Chat */}
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Chat',
            { user2: driver }
          )}
            style={{
              width: '50%', flexDirection: 'row', paddingVertical: myHeight(1.2),
              alignItems: 'center', justifyContent: 'center'
            }}>
            <Image source={require('../assets/home_main/home/navigator/chat2.png')}
              style={{
                width: myHeight(2.38),
                height: myHeight(2.38),
                resizeMode: 'contain',
                tintColor: myColors.primaryT
              }}
            />
            <Spacer paddingEnd={myWidth(3)} />
            <Text style={[
              styles.textCommon,
              {
                fontSize: myFontSize.body2,
                fontFamily: myFonts.heading,
                color: myColors.text
              }
            ]}>CHAT</Text>
          </TouchableOpacity>
        </View>

        <Spacer paddingT={myHeight(1.5)} />

        {/* Details */}
        <View style={{ paddingHorizontal: myWidth(4) }}>
          {/* Description */}
          <View>
            <Text

              style={{
                fontSize: myFontSize.body4,
                fontFamily: myFonts.bodyBold,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>Description</Text>

            <Text

              style={{
                fontSize: myFontSize.body,
                fontFamily: myFonts.body,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>{driver.description}</Text>
          </View>

          <Spacer paddingT={myHeight(1.5)} />

          {/* Paid */}
          <View style={{}}>
            <Text

              style={{
                fontSize: myFontSize.body4,
                fontFamily: myFonts.bodyBold,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>Paid Options</Text>

            <Spacer paddingT={myHeight(0.4)} />
            <View style={{ width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
              {
                driver.packages.map((it, i) => (

                  <Text numberOfLines={1}

                    style={{

                      fontSize: myFontSize.body3,
                      fontFamily: myFonts.bodyBold,
                      color: myColors.primaryT,
                      letterSpacing: myLetSpacing.common,
                      includeFontPadding: false,
                      padding: 0,
                    }}>{`● ${it}     `}</Text>
                ))
              }
            </View>
          </View>


          <Spacer paddingT={myHeight(1.5)} />
          {/* Daily */}
          <View style={{}}>
            <Text

              style={{
                fontSize: myFontSize.body4,
                fontFamily: myFonts.bodyBold,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>Pick & Drop Days</Text>

            <Spacer paddingT={myHeight(0.5)} />
            <View style={{ width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
              {
                driver.oneRideDays.map((it, i) => (


                  <Text key={i}
                    style={{

                      fontSize: myFontSize.body3,
                      fontFamily: myFonts.bodyBold,
                      color: myColors.primaryT,
                      letterSpacing: myLetSpacing.common,
                      includeFontPadding: false,
                      padding: 0,
                    }}>{`● ${it}    `}</Text>

                ))
              }
            </View>

          </View>

          <Spacer paddingT={myHeight(1.5)} />
          {/* Event Book */}
          <View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: myFontSize.body4,
                  fontFamily: myFonts.bodyBold,
                  color: myColors.text,
                  letterSpacing: myLetSpacing.common,
                  includeFontPadding: false,
                  padding: 0,
                }}>{driver.isOneRide ? 'Event Booking Days' : 'Event Booking Service'}</Text>
              {
                !driver.isOneRide ?
                  <Text
                    style={{

                      fontSize: myFontSize.body4,
                      fontFamily: myFonts.body,
                      color: myColors.red,
                      letterSpacing: myLetSpacing.common,
                      includeFontPadding: false,
                      padding: 0,
                    }}>Not Availabe</Text>
                  : null
              }

            </View>

            <Spacer paddingT={myHeight(0.5)} />
            {
              driver.isOneRide ?
                (<View style={{ width: '100%', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
                  {
                    driver.oneRideDays.map((it, i) => (


                      <Text key={i}
                        style={{

                          fontSize: myFontSize.body3,
                          fontFamily: myFonts.bodyBold,
                          color: myColors.primaryT,
                          letterSpacing: myLetSpacing.common,
                          includeFontPadding: false,
                          padding: 0,
                        }}>{`● ${it}    `}</Text>

                    ))
                  }
                </View>)
                : null
            }
          </View>


          <Spacer paddingT={myHeight(1.2)} />
          {/* Inside Uni */}
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: myFontSize.body4,
                  fontFamily: myFonts.bodyBold,
                  color: myColors.text,
                  letterSpacing: myLetSpacing.common,
                  includeFontPadding: false,
                  padding: 0,
                }}>{driver.isInsideUni ? 'Inside Universities Service' : 'Inside Universities Service'}</Text>

              {
                !driver.isInsideUni ?
                  <Text
                    style={{

                      fontSize: myFontSize.body4,
                      fontFamily: myFonts.body,
                      color: myColors.red,
                      letterSpacing: myLetSpacing.common,
                      includeFontPadding: false,
                      padding: 0,
                    }}>Not Availabe</Text>
                  :
                  <TouchableOpacity style={{
                  }} activeOpacity={0.7} onPress={() => setInside(!inside)}>

                    <Image style={{
                      height: myHeight(2.5),
                      width: myHeight(2.5),
                      resizeMode: 'contain',
                      marginTop: myHeight(0.4),
                      tintColor: myColors.primaryT,
                      transform: [{ rotate: !inside ? '90deg' : '270deg' }],

                    }} source={require('../assets/home_main/home/go.png')} />
                  </TouchableOpacity>
              }


            </View>
            <Collapsible style={{ paddingHorizontal: myWidth(1) }} collapsed={!inside}>
              {driver.insideUniversities.map((it, j) => (
                <View style={{ flexDirection: 'row', paddingVertical: myHeight(0.65) }}>
                  <Text style={[styles.textCommon, {
                    width: myWidth(0.2) + myFontSize.body * 2,
                    fontFamily: myFonts.bodyBold,
                    fontSize: myFontSize.body,
                  }]}>  {j + 1}.</Text>
                  <TouchableOpacity disabled activeOpacity={0.75} style={{
                    backgroundColor: myColors.background,
                    flex: 1,
                    paddingEnd: myWidth(2),

                  }}
                    onPress={() => null}>
                    <Text numberOfLines={2} style={[styles.textCommon, {
                      // flex: 1,
                      fontFamily: myFonts.bodyBold,
                      fontSize: myFontSize.body,
                    }]}>{it}</Text>
                  </TouchableOpacity>
                  <Spacer paddingEnd={myWidth(2)} />

                </View>
              ))}
            </Collapsible>

          </View>
          <Spacer paddingT={myHeight(1.2)} />

          {/* Reviews */}
          <View style={{}}>
            <Text numberOfLines={2} style={[styles.textCommon, {
              width: '100%',
              fontSize: myFontSize.xxBody,
              fontFamily: myFonts.bodyBold,
              paddingEnd: myWidth(3),
              textAlign: 'center',
            }]}>Reviews</Text>
            {/* <Spacer paddingT={myHeight(0.5)} /> */}

            <FlashList
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              data={driver.reviews}

              contentContainerStyle={{ flexGrow: 1 }}
              ItemSeparatorComponent={() =>
                <View style={{ borderTopWidth: myHeight(0.08), borderColor: myColors.offColor, width: "100%" }} />
              }
              estimatedItemSize={myHeight(10)}
              renderItem={({ item, index }) => {
                // const item = data

                return (
                  <View key={index}>
                    <Spacer paddingT={myHeight(1.5)} />


                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {/* <Spacer paddingEnd={myWidth(2)} /> */}
                      <Text style={[styles.textCommon, {
                        fontSize: myFontSize.body3,
                        fontFamily: myFonts.heading,
                        paddingEnd: myWidth(3)
                      }]}>{item.name}</Text>

                      <Text style={[styles.textCommon, {
                        flex: 1,
                        // textAlign: 'right',
                        fontSize: myFontSize.body2,
                        fontFamily: myFonts.body,
                      }]}>{item.date}</Text>
                      {item.rating &&
                        <Stars num={item.rating} />
                      }

                    </View>
                    <Spacer paddingT={myHeight(0.5)} />
                    <Text style={[styles.textCommon, {
                      fontSize: myFontSize.body,
                      fontFamily: myFonts.body,
                      paddingEnd: myWidth(3)
                    }]}>{item.review}</Text>

                    <Spacer paddingT={myHeight(1.8)} />

                  </View>
                )
              }
              } />

          </View>



          <Spacer paddingT={myHeight(4)} />


        </View>
      </ScrollView>







      {
        RatingModal &&
        <TouchableOpacity activeOpacity={1} onPress={() => null}
          style={{
            width: '100%', height: '100%', position: 'absolute',
            backgroundColor: '#00000050', justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Animated.View
            entering={ZoomIn.duration(200)}
            exiting={ZoomOut.duration(50)}
            style={{
              paddingHorizontal: myWidth(8), width: myWidth(90),
              backgroundColor: myColors.background, borderRadius: myWidth(6)
            }}>

            {/* <Spacer paddingT={myHeight(3)} /> */}
            {/* <Image
                            style={{
                                width: myHeight(12),
                                height: myHeight(12),
                                resizeMode: 'contain',
                                borderRadius: myHeight(10),
                                borderWidth: myHeight(0.15),
                                marginTop: -myHeight(5),
                                borderColor: myColors.primaryT,
                                alignSelf: 'center',
                                backgroundColor: myColors.background,
                            }}
                            source={restaurant.icon}
                        /> */}
            <View
              style={{
                width: myHeight(12),
                height: myHeight(12),
                borderRadius: myHeight(10),
                borderWidth: myHeight(0.15),
                marginTop: -myHeight(5),
                borderColor: myColors.primaryT,
                alignSelf: 'center',
                overflow: 'hidden',
                backgroundColor: myColors.background
              }}
            >
              {/* <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={null} /> */}
              <Image style={{
                width: '100%', height: '100%',
                resizeMode: 'contain', marginTop: myHeight(0.0), tintColor: myColors.text
              }}
                source={require('../assets/home_main/home/driver.png')} />
            </View>
            <Spacer paddingT={myHeight(0.5)} />
            <Text
              numberOfLines={1}
              style={[
                styles.textCommon,
                {
                  alignSelf: 'center',
                  paddingHorizontal: myWidth(4),
                  fontSize: myFontSize.medium,
                  fontFamily: myFonts.heading,
                },
              ]}>
              {driver.name}

            </Text>
            <Spacer paddingT={myHeight(3)} />

            {/* All Stars */}
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
              <TouchableOpacity activeOpacity={0.9} style={{ paddingHorizontal: myWidth(2.5) }}
                onPress={() => setStarI(0)}>
                <Image source={require('../assets/home_main/home/star.png')}
                  style={[styles.star,
                  {
                    tintColor: starI >= 0 ? myColors.star : myColors.offColor
                  }]}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.9} style={{ paddingHorizontal: myWidth(2.5) }} onPress={() => setStarI(1)}>
                <Image source={require('../assets/home_main/home/star.png')}
                  style={[styles.star,
                  {
                    tintColor: starI >= 1 ? myColors.star : myColors.offColor
                  }]}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.9} style={{ paddingHorizontal: myWidth(2.5) }} onPress={() => setStarI(2)}>
                <Image source={require('../assets/home_main/home/star.png')}
                  style={[styles.star,
                  {
                    tintColor: starI >= 2 ? myColors.star : myColors.offColor
                  }]}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.9} style={{ paddingHorizontal: myWidth(2.5) }} onPress={() => setStarI(3)}>
                <Image source={require('../assets/home_main/home/star.png')}
                  style={[styles.star,
                  {
                    tintColor: starI >= 3 ? myColors.star : myColors.offColor
                  }]}
                />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.9} style={{ paddingHorizontal: myWidth(2.5) }} onPress={() => setStarI(4)}>
                <Image source={require('../assets/home_main/home/star.png')}
                  style={[styles.star,
                  {
                    tintColor: starI >= 4 ? myColors.star : myColors.offColor
                  }]}
                />
              </TouchableOpacity>
            </View>

            <Spacer paddingT={myHeight(3)} />
            {/* Review Input */}
            <TextInput placeholder="Write your review"
              multiline={true}
              autoCorrect={false}
              numberOfLines={2}
              placeholderTextColor={myColors.textL4}
              selectionColor={myColors.primary}
              cursorColor={myColors.primaryT}
              value={review} onChangeText={setReview}
              style={{
                height: myHeight(11),
                textAlignVertical: 'top',
                borderRadius: myWidth(2),
                width: '100%',
                alignSelf: 'center',
                paddingBottom: ios ? myHeight(1.2) : myHeight(100) > 600 ? myHeight(0.8) : myHeight(0.1),
                paddingTop: ios ? myHeight(1.2) : myHeight(100) > 600 ? myHeight(1.2) : myHeight(0.1),
                fontSize: myFontSize.body,
                color: myColors.text,
                includeFontPadding: false,
                fontFamily: myFonts.body,
                paddingHorizontal: myWidth(3),
                backgroundColor: '#00000010'
              }}
            />

            <Spacer paddingT={myHeight(2.5)} />

            {/* Cancle & Done Buttons */}
            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
              <TouchableOpacity activeOpacity={0.8} onPress={hideModal}>
                <Text style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.body4,
                    fontFamily: myFonts.heading,
                    color: myColors.primaryT,
                    paddingEnd: myWidth(5)
                  }
                ]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8} onPress={onDone}>
                <Text style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.body4,
                    fontFamily: myFonts.heading,
                    color: myColors.primaryT,
                  }
                ]}>Done</Text>
              </TouchableOpacity>

            </View>
            <Spacer paddingT={myHeight(4)} />

          </Animated.View>

        </TouchableOpacity>
      }
      {isLoading && <Loader />}
      {errorMsg && <MyError message={errorMsg} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: myColors.background,
  },

  //Text
  textCommon: {
    color: myColors.text,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
  star: {
    width: myHeight(4.2),
    height: myHeight(4.2),
    marginEnd: myWidth(0.5),
    resizeMode: 'contain',
  }
});
