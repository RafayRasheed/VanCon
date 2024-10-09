import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  LayoutAnimation,
  StatusBar,
  TextInput,
  Linking,
  Platform,
  ImageBackground,
  FlatList,
} from 'react-native';

import {
  Loader,
  MyError,
  Spacer,
  errorTime,
  ios,
  myHeight,
  myWidth,
} from '../common';
import {myColors} from '../../ultils/myColors';
import {myFontSize, myFonts, myLetSpacing} from '../../ultils/myFonts';
import {ImagesShortViewer} from './home.component/images_short_viewer';
import Collapsible from 'react-native-collapsible';
import {Stars} from './home.component/star';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {ImageUri} from '../common/image_uri';
import {dataFullData} from '../functions/functions';
import {useDispatch, useSelector} from 'react-redux';

export const RestaurantMoreDetails = ({navigation, route}) => {
  const {profile} = useSelector(state => state.profile);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {restaurant} = route.params;
  const [timmingClose, setTimingClose] = useState(true);
  const [infoClose, setInfoClose] = useState(true);
  const [menuClose, setMenuClose] = useState(true);
  const dayIndex = new Date().getDay();
  const todayTime = restaurant.timmings[dayIndex];

  const [RatingModal, setRatinModal] = useState(false);
  const [starI, setStarI] = useState(undefined);
  const [review, setReview] = useState(null);

  const disptach = useDispatch();
  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        setIsLoading(false);
        setErrorMsg(null);
      }, errorTime);
    }
  }, [errorMsg]);

  function hideModal() {
    setRatinModal(false);
  }
  function onDone() {
    if (starI && review) {
      setIsLoading(true);

      // firestore().collection('restaurants').doc(restaurant.uid).get()
      //     .then((data) => {
      //         const res = data.data()
      //         const noOfRatings = res.noOfRatings ? res.noOfRatings : 0
      //         const ratingTotal = res.ratingTotal ? res.ratingTotal : 0
      //         const rating = res.rating ? res.rating : 0
      //         const reviews = res.reviews ? res.reviews : []

      //         const newRatingTotal = ratingTotal + starI + 1
      //         const newnoOfRatings = noOfRatings + 1
      //         const newrating = newRatingTotal / newnoOfRatings

      //         const date = dataFullData()
      //         const reviewNew =
      //         {
      //             dateInt: date.dateInt,
      //             id: profile.uid,
      //             name: profile.name,
      //             rating: starI + 1,
      //             date: date.date,
      //             review: review,
      //         }
      //         const newReview = [
      //             ...reviews,
      //             reviewNew
      //         ]

      //         const update = {
      //             noOfRatings: newnoOfRatings,
      //             ratingTotal: newRatingTotal,
      //             reviews: newReview,
      //             rating: newrating
      //         }

      //         firestore().collection('restaurants').doc(restaurant.uid).update(update)
      //             .then((data) => {
      //                 setIsLoading(false)
      //                 hideModal()
      //             }).catch((er) => {
      //                 console.log('Error on Get Users for fav', er)
      //                 setErrorMsg('Something Wrong')

      //             })
      //     }).catch((er) => {
      //         console.log('Error on Get Users for fav', er)
      //         setErrorMsg('Something Wrong')

      //     })
    } else setErrorMsg('PLease Add Review and rate');
    // hideModal()
  }

  return (
    <>
      <View style={{flex: 1, backgroundColor: myColors.background}}>
        <ImagesShortViewer
          navigate={navigation.navigate}
          images={restaurant.images}
        />
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
          onPress={() => navigation.goBack()}>
          <Image
            style={{
              width: myHeight(2.6),
              height: myHeight(2.6),
              resizeMode: 'contain',
            }}
            source={require('../assets/home_main/home/back.png')}
          />
        </TouchableOpacity>

        <Spacer paddingT={myHeight(1.5)} />

        {/* name */}
        <View style={{paddingHorizontal: myWidth(4)}}>
          <Text
            numberOfLines={2}
            style={[
              styles.textCommon,
              {
                fontSize: myFontSize.medium,
                fontFamily: myFonts.heading,
              },
            ]}>
            {restaurant.name}
          </Text>
          <Spacer paddingT={myHeight(1.2)} />

          {/* Description */}
          {/* <Text
                        style={[
                            styles.textCommon,
                            {
                                fontSize: myFontSize.body,
                                fontFamily: myFonts.bodyBold,
                                color: myColors.textL4,
                            },
                        ]}>
                        {restaurant.description}
                    </Text>
                <Spacer paddingT={myHeight(1.5)} /> */}
        </View>

        {/* Divider */}
        <View
          style={{
            borderTopWidth: myHeight(0.13),
            borderColor: myColors.offColor,
            width: '100%',
          }}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Spacer paddingT={myHeight(2)} />
          {/* clock & open at && go */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setTimingClose(!timmingClose)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* Clock */}
            <View style={{width: myWidth(15), alignItems: 'center'}}>
              {/* clock */}
              <Image
                style={{
                  height: myHeight(3),
                  width: myHeight(3),
                  resizeMode: 'contain',
                  // marginTop: myHeight(0.2),
                  tintColor: myColors.primaryT,
                }}
                source={require('../assets/home_main/home/clockF.png')}
              />
            </View>

            {/* Open at */}
            <Text
              numberOfLines={2}
              style={{
                flex: 1,
                fontSize: myFontSize.xBody,
                fontFamily: myFonts.bodyBold,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>
              {todayTime.open
                ? `Open    ${todayTime.startTime} - ${todayTime.endTime}`
                : 'Closed'}
            </Text>
            {/*Go */}
            <View>
              <Image
                style={{
                  height: myHeight(2.6),
                  width: myHeight(2.6),
                  resizeMode: 'contain',
                  transform: [{rotate: timmingClose ? '90deg' : '270deg'}],
                  tintColor: timmingClose
                    ? myColors.primaryT
                    : myColors.offColor,
                }}
                source={require('../assets/home_main/home/go.png')}
              />
            </View>
            <Spacer paddingEnd={myWidth(4)} />
          </TouchableOpacity>
          {/* Timmings Collapse */}
          <Collapsible
            style={{paddingStart: myWidth(15), paddingEnd: myWidth(4)}}
            collapsed={timmingClose}>
            {restaurant.timmings?.map((item, i) => (
              <View key={i}>
                <Spacer paddingT={myHeight(1)} />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.textCommon,
                      {
                        fontSize: myFontSize.body3,
                        fontFamily: myFonts.heading,
                        width: myFontSize.body3 + myWidth(10),
                      },
                    ]}>
                    {item.day}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.textCommon,
                      {
                        fontSize: myFontSize.body2,
                        fontFamily: myFonts.bodyBold,
                      },
                    ]}>
                    {item.open
                      ? `${item.startTime} - ${item.endTime}`
                      : 'Closed'}
                  </Text>
                </View>
              </View>
            ))}
          </Collapsible>

          <Spacer paddingT={myHeight(2)} />
          {/* Divider */}
          <View
            style={{
              borderTopWidth: myHeight(0.13),
              alignSelf: 'flex-end',
              borderColor: myColors.offColor,
              width: '85%',
            }}
          />

          <Spacer paddingT={myHeight(2)} />
          {/* info & facilities && go */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setInfoClose(!infoClose)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* Clock */}
            <View style={{width: myWidth(15), alignItems: 'center'}}>
              {/* clock */}
              <Image
                style={{
                  height: myHeight(2.45),
                  width: myHeight(2.45),
                  resizeMode: 'contain',
                  marginTop: myHeight(0.2),
                  tintColor: myColors.primaryT,
                }}
                source={require('../assets/home_main/home/info.png')}
              />
            </View>

            {/* Open at */}
            <Text
              numberOfLines={2}
              style={{
                flex: 1,
                fontSize: myFontSize.xBody,
                fontFamily: myFonts.bodyBold,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>
              Facilities & Details
            </Text>
            {/*Go */}
            <View>
              <Image
                style={{
                  height: myHeight(2.6),
                  width: myHeight(2.6),
                  resizeMode: 'contain',
                  transform: [{rotate: infoClose ? '90deg' : '270deg'}],
                  tintColor: infoClose ? myColors.primaryT : myColors.offColor,
                }}
                source={require('../assets/home_main/home/go.png')}
              />
            </View>
            <Spacer paddingEnd={myWidth(4)} />
          </TouchableOpacity>
          {/* FAcility Collapse */}
          <Collapsible
            style={{paddingStart: myWidth(15), paddingEnd: myWidth(4)}}
            collapsed={infoClose}>
            <Spacer paddingT={myHeight(1)} />
            {/* Type & Description */}
            <View style={{}}>
              <Spacer paddingT={myHeight(0.7)} />
              <Text
                numberOfLines={2}
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.body2,
                    fontFamily: myFonts.heading,
                    paddingEnd: myWidth(3),
                  },
                ]}>
                Facilities
              </Text>

              <Spacer paddingT={myHeight(0.4)} />
              {/* Type */}
              <Text
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.body3,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.primaryT,
                  },
                ]}>
                {restaurant.dineIn && '● Dine In     '}
                {restaurant.takeAway && '● Take Away     '}
                {restaurant.homeDelivery && '● Delivery'}
              </Text>

              <Spacer paddingT={myHeight(1.5)} />

              <Text
                numberOfLines={2}
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.body2,
                    fontFamily: myFonts.heading,
                    paddingEnd: myWidth(3),
                  },
                ]}>
                Details
              </Text>

              <Spacer paddingT={myHeight(0.3)} />
              {/* Description */}
              <Text
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.textL4,
                  },
                ]}>
                {restaurant.description}
              </Text>
            </View>
          </Collapsible>
          {restaurant.menu.length > 0 && (
            <View>
              <Spacer paddingT={myHeight(2)} />
              {/* Divider */}
              <View
                style={{
                  borderTopWidth: myHeight(0.13),
                  alignSelf: 'flex-end',
                  borderColor: myColors.offColor,
                  width: '85%',
                }}
              />

              <Spacer paddingT={myHeight(2)} />
              {/* Menu && go */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setMenuClose(!menuClose)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* Clock */}
                <View style={{width: myWidth(15), alignItems: 'center'}}>
                  {/* clock */}
                  <Image
                    style={{
                      height: myHeight(2.8),
                      width: myHeight(2.8),
                      resizeMode: 'contain',
                      tintColor: myColors.primaryT,
                    }}
                  />
                </View>

                {/* Menu */}
                <Text
                  numberOfLines={2}
                  style={{
                    flex: 1,
                    fontSize: myFontSize.xBody,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>
                  Menu
                </Text>
                {/*Go */}
                <View>
                  <Image
                    style={{
                      height: myHeight(2.6),
                      width: myHeight(2.6),
                      resizeMode: 'contain',
                      transform: [{rotate: menuClose ? '90deg' : '270deg'}],
                      tintColor: menuClose
                        ? myColors.primaryT
                        : myColors.offColor,
                    }}
                    source={require('../assets/home_main/home/go.png')}
                  />
                </View>
                <Spacer paddingEnd={myWidth(4)} />
              </TouchableOpacity>
              {/* Menu Collapse */}
              <Collapsible
                style={{paddingStart: myWidth(15), paddingEnd: myWidth(4)}}
                collapsed={menuClose}>
                <Spacer paddingT={myHeight(1)} />
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                  }}>
                  {restaurant.menu?.map((image, i) => (
                    <TouchableOpacity
                      activeOpacity={0.97}
                      onPress={() =>
                        navigation.navigate('ImageViewer', {
                          images: restaurant.menu,
                          i,
                        })
                      }
                      key={i}
                      style={{marginHorizontal: myWidth(3)}}>
                      <Image
                        // onLoadEnd={handlePressIn}
                        style={{
                          height: myHeight(15),
                          // width: 'auto',
                          aspectRatio: 1,
                          resizeMode: 'contain',
                        }}
                        source={{uri: image}}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Collapsible>
            </View>
          )}
          {!restaurant.homeDelivery && (
            <View>
              <Spacer paddingT={myHeight(2)} />
              {/* Divider */}
              <View
                style={{
                  borderTopWidth: myHeight(0.13),
                  alignSelf: 'flex-end',
                  borderColor: myColors.offColor,
                  width: '85%',
                }}
              />
              <Spacer paddingT={myHeight(2)} />
              {/* Delivry & charges */}
              <View style={{flexDirection: 'row'}}>
                <View style={{width: myWidth(15), alignItems: 'center'}}>
                  {/* loc */}
                  <Image
                    style={{
                      height: myHeight(3),
                      width: myHeight(3),
                      resizeMode: 'contain',
                      tintColor: myColors.primaryT,
                    }}
                    source={require('../assets/home_main/home/bike.png')}
                  />
                </View>
                {/* Time */}
                <Text
                  numberOfLines={2}
                  style={{
                    flex: 1,
                    fontSize: myFontSize.xBody,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>
                  Delivery in {restaurant.delivery} minutes
                </Text>

                <Spacer paddingEnd={myWidth(1)} />
                {/* Open */}

                <Text
                  style={[
                    styles.textCommon,
                    {
                      fontSize: myFontSize.body3,
                      fontFamily: myFonts.bodyBold,
                      // color: myColors.primaryT
                    },
                  ]}>
                  {' '}
                  {restaurant.deliveryCharges
                    ? `Rs ${restaurant.deliveryCharges}`
                    : 'Free'}
                </Text>
                <Spacer paddingEnd={myWidth(4)} />
              </View>
            </View>
          )}

          <Spacer paddingT={myHeight(2)} />

          {/* Divider */}
          <View
            style={{
              borderTopWidth: myHeight(0.13),
              alignSelf: 'flex-end',
              borderColor: myColors.offColor,
              width: '85%',
            }}
          />
          <Spacer paddingT={myHeight(2)} />
          {/* star & reviews */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => null}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* Clock */}
            <View style={{width: myWidth(15), alignItems: 'center'}}>
              {/* clock */}
              <Image
                style={{
                  height: myHeight(2.7),
                  width: myHeight(2.7),
                  resizeMode: 'contain',
                  tintColor: myColors.primaryT,
                }}
                source={require('../assets/home_main/home/star.png')}
              />
            </View>

            {/* Open at */}
            <Text
              numberOfLines={2}
              style={{
                flex: 1,
                fontSize: myFontSize.xBody,
                fontFamily: myFonts.bodyBold,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>{`${restaurant.rating}   Reviews (${restaurant.noOfRatings})`}</Text>

            {/* Open */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setRatinModal(true)}>
              <Text
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.body3,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.primaryT,
                  },
                ]}>
                Rate Us
              </Text>
            </TouchableOpacity>
            <Spacer paddingEnd={myWidth(4)} />
          </TouchableOpacity>

          <Spacer paddingT={myHeight(2)} />
          {/* Divider */}
          <View
            style={{
              borderTopWidth: myHeight(0.13),
              alignSelf: 'flex-end',
              borderColor: myColors.offColor,
              width: '85%',
            }}
          />

          <Spacer paddingT={myHeight(2)} />
          {/* loc & open */}
          <View style={{flexDirection: 'row'}}>
            <View style={{width: myWidth(15), alignItems: 'center'}}>
              {/* loc */}
              <Image
                style={{
                  height: myHeight(3),
                  width: myHeight(3),
                  resizeMode: 'contain',
                  tintColor: myColors.primaryT,
                }}
                source={require('../assets/home_main/home/loc.png')}
              />
            </View>
            {/* Loc */}
            <Text
              style={{
                flex: 1,
                fontSize: myFontSize.xBody,
                fontFamily: myFonts.bodyBold,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>
              {restaurant.location}
            </Text>

            <Spacer paddingEnd={myWidth(1)} />
            {/* Open */}
            {restaurant.locationLink && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => Linking.openURL(restaurant.locationLink)}>
                <Text
                  style={[
                    styles.textCommon,
                    {
                      fontSize: myFontSize.body3,
                      fontFamily: myFonts.bodyBold,
                      color: myColors.primaryT,
                    },
                  ]}>
                  Open
                </Text>
              </TouchableOpacity>
            )}
            <Spacer paddingEnd={myWidth(4)} />
          </View>

          <Spacer paddingT={myHeight(2.5)} />
          {/* Divider */}
          <View
            style={{
              borderTopWidth: myHeight(0.13),
              borderColor: myColors.offColor,
              width: '100%',
            }}
          />

          <View>
            <Spacer paddingT={myHeight(1)} />
            {/* Reviews */}
            <View style={{paddingHorizontal: myWidth(4)}}>
              <Text
                numberOfLines={2}
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.xxBody,
                    fontFamily: myFonts.bodyBold,
                    paddingEnd: myWidth(3),
                  },
                ]}>
                Reviews
              </Text>
              {/* <Spacer paddingT={myHeight(0.5)} /> */}

              <FlatList
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                data={restaurant.reviews}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      borderTopWidth: myHeight(0.08),
                      borderColor: myColors.offColor,
                      width: '100%',
                    }}
                  />
                )}
                renderItem={(data, i) => {
                  const item = data.item;

                  return (
                    <View key={data.index}>
                      <Spacer paddingT={myHeight(1.5)} />

                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        {/* <Spacer paddingEnd={myWidth(2)} /> */}
                        <Text
                          style={[
                            styles.textCommon,
                            {
                              fontSize: myFontSize.body3,
                              fontFamily: myFonts.heading,
                              paddingEnd: myWidth(3),
                            },
                          ]}>
                          {item.name}
                        </Text>

                        <Text
                          style={[
                            styles.textCommon,
                            {
                              flex: 1,
                              // textAlign: 'right',
                              fontSize: myFontSize.body2,
                              fontFamily: myFonts.body,
                            },
                          ]}>
                          {item.date}
                        </Text>
                        {item.rating && <Stars num={item.rating} />}
                      </View>
                      <Spacer paddingT={myHeight(0.5)} />
                      <Text
                        style={[
                          styles.textCommon,
                          {
                            fontSize: myFontSize.body,
                            fontFamily: myFonts.body,
                            paddingEnd: myWidth(3),
                          },
                        ]}>
                        {item.review}
                      </Text>

                      <Spacer paddingT={myHeight(1.8)} />
                    </View>
                  );
                }}
              />
            </View>
          </View>

          <Spacer paddingT={myHeight(4)} />
        </ScrollView>
      </View>

      {/* Rating modal */}

      {RatingModal && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => null}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            backgroundColor: '#00000050',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Animated.View
            entering={ZoomIn.duration(200)}
            exiting={ZoomOut.duration(50)}
            style={{
              paddingHorizontal: myWidth(8),
              width: myWidth(85),
              backgroundColor: myColors.background,
              borderRadius: myWidth(6),
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
                backgroundColor: myColors.background,
              }}>
              <ImageUri
                width={'100%'}
                height={'100%'}
                resizeMode="cover"
                uri={restaurant.icon}
              />
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
              {restaurant.name}
            </Text>
            <Spacer paddingT={myHeight(3)} />

            {/* All Stars */}
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{paddingHorizontal: myWidth(2.5)}}
                onPress={() => setStarI(0)}>
                <Image
                  source={require('../assets/home_main/home/star.png')}
                  style={[
                    styles.star,
                    {
                      tintColor: starI >= 0 ? myColors.star : myColors.offColor,
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{paddingHorizontal: myWidth(2.5)}}
                onPress={() => setStarI(1)}>
                <Image
                  source={require('../assets/home_main/home/star.png')}
                  style={[
                    styles.star,
                    {
                      tintColor: starI >= 1 ? myColors.star : myColors.offColor,
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{paddingHorizontal: myWidth(2.5)}}
                onPress={() => setStarI(2)}>
                <Image
                  source={require('../assets/home_main/home/star.png')}
                  style={[
                    styles.star,
                    {
                      tintColor: starI >= 2 ? myColors.star : myColors.offColor,
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{paddingHorizontal: myWidth(2.5)}}
                onPress={() => setStarI(3)}>
                <Image
                  source={require('../assets/home_main/home/star.png')}
                  style={[
                    styles.star,
                    {
                      tintColor: starI >= 3 ? myColors.star : myColors.offColor,
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{paddingHorizontal: myWidth(2.5)}}
                onPress={() => setStarI(4)}>
                <Image
                  source={require('../assets/home_main/home/star.png')}
                  style={[
                    styles.star,
                    {
                      tintColor: starI >= 4 ? myColors.star : myColors.offColor,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>

            <Spacer paddingT={myHeight(3)} />
            {/* Review Input */}
            <TextInput
              placeholder="Write your review"
              multiline={true}
              autoCorrect={false}
              numberOfLines={2}
              placeholderTextColor={myColors.textL4}
              selectionColor={myColors.primary}
              cursorColor={myColors.primaryT}
              value={review}
              onChangeText={setReview}
              style={{
                height: myHeight(11),
                textAlignVertical: 'top',
                borderRadius: myWidth(2),
                width: '100%',
                alignSelf: 'center',
                paddingBottom: ios
                  ? myHeight(1.2)
                  : myHeight(100) > 600
                  ? myHeight(0.8)
                  : myHeight(0.1),
                paddingTop: ios
                  ? myHeight(1.2)
                  : myHeight(100) > 600
                  ? myHeight(1.2)
                  : myHeight(0.1),
                fontSize: myFontSize.body,
                color: myColors.text,
                includeFontPadding: false,
                fontFamily: myFonts.body,
                paddingHorizontal: myWidth(3),
                backgroundColor: '#00000010',
              }}
            />

            <Spacer paddingT={myHeight(2.5)} />

            {/* Cancle & Done Buttons */}
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity activeOpacity={0.8} onPress={hideModal}>
                <Text
                  style={[
                    styles.textCommon,
                    {
                      fontSize: myFontSize.body4,
                      fontFamily: myFonts.heading,
                      color: myColors.primaryT,
                      paddingEnd: myWidth(5),
                    },
                  ]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8} onPress={onDone}>
                <Text
                  style={[
                    styles.textCommon,
                    {
                      fontSize: myFontSize.body4,
                      fontFamily: myFonts.heading,
                      color: myColors.primaryT,
                    },
                  ]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
            <Spacer paddingT={myHeight(4)} />
          </Animated.View>
        </TouchableOpacity>
      )}
      {isLoading && <Loader />}
      {errorMsg && <MyError message={errorMsg} />}
    </>
  );
};

const styles = StyleSheet.create({
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
  },
});
