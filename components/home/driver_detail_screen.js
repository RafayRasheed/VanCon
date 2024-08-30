import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  StatusBar,
  Linking,
  Platform,
  ImageBackground,
  BackHandler,
  TextInput,
} from 'react-native';
import {
  Loader,
  MyError,
  Spacer,
  StatusBarHide,
  StatusbarH,
  errorTime,
  ios,
  myHeight,
  myWidth,
} from '../common';
import {myColors} from '../../ultils/myColors';
import {myFontSize, myFonts, myLetSpacing} from '../../ultils/myFonts';
import {ItemInfo} from './home.component/item_info';
import {useDispatch, useSelector} from 'react-redux';
import {
  addFavoriteRest,
  removeFavoriteRest,
  setFavoriteDrivers,
} from '../../redux/favorite_reducer';
import {useFocusEffect} from '@react-navigation/native';
import {ImageUri} from '../common/image_uri';
import {
  dataFullData,
  deccodeInfo,
  getAllRestuarant,
} from '../functions/functions';
import Collapsible from 'react-native-collapsible';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {FlashList} from '@shopify/flash-list';
import {Stars} from './home.component/star';
import firestore from '@react-native-firebase/firestore';
import {all} from 'axios';
import {setErrorAlert} from '../../redux/error_reducer';
import {
  addUpdateFavorites,
  getFavorites,
  getVehicleDetails,
  rateDriver,
} from '../common/api';
import {DetailSkeleton} from './home.component/home_skeleton';

export const DriverDetail = ({navigation, route}) => {
  const backScreen = route.params.backScreen;
  const driverId = route.params.driver.id;
  const [driver, setDriver] = useState(null);
  const [inside, setInside] = useState(false);
  const [RatingModal, setRatinModal] = useState(false);
  const [starI, setStarI] = useState(undefined);
  const [review, setReview] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [startLoader, setStartLoader] = useState(true);
  const [reviews, setReviews] = useState();
  const [myReview, setMyRewiew] = useState();

  const {favoriteDrivers} = useSelector(state => state.favorite);

  const [isFav, setIsFav] = useState(false);
  const dispatch = useDispatch();
  //Back Functions

  const {profile} = useSelector(state => state.profile);
  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        setIsLoading(false);
        setErrorMsg(null);
      }, errorTime);
    }
  }, [errorMsg]);
  function getDetails() {
    fetch(getVehicleDetails + `?vid=${driverId}`)
      .then(response => response.json())
      .then(data => {
        // Work with the JSON data
        const {code, body, message} = data;

        if (code == 1) {
          const {vehicle = null} = body;
          if (vehicle) {
            setDriver(vehicle);
          } else {
            storeRedux.dispatch(
              setErrorAlert({Title: 'Something Wrong', Status: 0}),
            );
            navigation.goBack();
          }
          // storeRedux.dispatch(setAreasLocation(locations));
        } else {
          storeRedux.dispatch(setErrorAlert({Title: message, Status: 0}));
        }
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch

        console.error('Fetch error:', error);
      });
  }
  useEffect(() => {
    if (driver) {
      const checkFav = favoriteDrivers.find(redID => redID == driver.id);
      setIsFav(checkFav);
    }
  }, [driver, favoriteDrivers]);
  useEffect(() => {
    if (driver) {
      let myRew = null;
      let allReviews = [];
      driver.reviews?.map(it => {
        if (it.uid == profile.uid) {
          myRew = it;
        } else {
          allReviews.push(it);
        }
      });
      if (myRew) {
        setMyRewiew(myRew);
        setReview(myRew.review);
        setStarI(myRew.rating - 1);
        setReviews([myRew, ...allReviews]);
      } else {
        setReviews(allReviews);
      }
    } else {
      getDetails();
    }
  }, [driver]);

  // useEffect(() => {
  //   setIsFav(checkFav != null);
  // }, [checkFav]);
  function hideModal() {
    setRatinModal(false);
  }
  function onDone() {
    if ((starI || starI == 0) && review) {
      setIsLoading(true);
      const {uid, token, name} = profile;
      const postData = {
        uid,
        token,
        name,
        ratingId: myReview ? myReview.id : 0,
        review,
        vehicleId: driver.id,
        rating: starI + 1,
      };
      console.log('rateDriver', JSON.stringify(postData));
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
        },
        body: JSON.stringify(postData), // Convert the data to JSON string
      };
      fetch(rateDriver, options)
        .then(response => response.json())
        .then(data => {
          // Work with the JSON data
          const {code, body, message} = data;
          setIsLoading(false);

          if (code == 1) {
            const {vehicle} = body;
            console.log('result', vehicle);
            hideModal();
            dispatch(
              setErrorAlert({
                Title: message,
                Status: 2,
              }),
            );
            setDriver(vehicle);
          } else {
            setErrorMsg(message);
          }
        })
        .catch(error => {
          // Handle any errors that occurred during the fetch
          setIsLoading(false);

          console.error('Fetch error:', error);
        });
      return;
      firestore()
        .collection('drivers')
        .doc(driver.uid)
        .get()
        .then(data => {
          const res = data.data();
          const noOfRatings = res.noOfRatings ? res.noOfRatings : 0;
          const ratingTotal = res.ratingTotal ? res.ratingTotal : 0;
          const reviews = res.reviews ? res.reviews : [];

          let newRatingTotal = ratingTotal;
          if (myReview) {
            newRatingTotal += starI + 1 - myReview.rating;
          } else {
            newRatingTotal += starI + 1;
          }

          const newnoOfRatings = myReview ? noOfRatings : noOfRatings + 1;
          const newrating = newRatingTotal / newnoOfRatings;

          const date = dataFullData();
          let reviewNew = {};

          if (myReview) {
            reviewNew = {
              ...myReview,
              rating: starI + 1,
              review: review,
              edited: true,
            };
          } else {
            reviewNew = {
              dateInt: date.dateInt,
              id: profile.uid,
              name: profile.name,
              rating: starI + 1,
              date: date.date,
              review: review,
            };
          }

          const OtherReview = reviews.filter(it => it.id != profile.uid);
          const newReview = [reviewNew, ...OtherReview];

          const roundedRating = Math.round(newrating * 10) / 10;

          const update = {
            noOfRatings: newnoOfRatings,
            ratingTotal: newRatingTotal,
            reviews: newReview,
            rating: roundedRating,
          };

          firestore()
            .collection('drivers')
            .doc(driver.uid)
            .update(update)
            .then(data => {
              setIsLoading(false);
              hideModal();
              dispatch(
                setErrorAlert({
                  Title: myReview
                    ? 'Review Updated Successfully'
                    : 'Review Added Successfully',
                  Status: 2,
                }),
              );
              setDriver({...driver, ...update});
              getAllRestuarant(profile);
            })
            .catch(er => {
              console.log('Error on Get Users for fav', er);
              setErrorMsg('Something Wrong');
              setIsLoading(false);
            });
        })
        .catch(er => {
          console.log('Error on Get Users for fav', er);
          setErrorMsg('Something Wrong');
          setIsLoading(false);
        });
    } else setErrorMsg('PLease Add Review and rate');
    // hideModal()
  }
  const onBackPress = () => {
    if (backScreen) {
      // navigation.navigate(backScreen, route.params.params)
      navigation.goBack();
      return true;
    }

    return false;
  };
  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [backScreen]),
  );

  function back() {
    if (backScreen) {
      navigation.navigate(backScreen, route.params.params);
      return;
    }
    navigation.goBack();
  }

  function changeFav() {
    const {uid, token} = profile;

    const postData = {
      uid,
      token,
      vid: driver.id,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body: JSON.stringify(postData), // Convert the data to JSON string
    };
    fetch(addUpdateFavorites, options)
      .then(response => response.json())
      .then(data => {
        // Work with the JSON data
        const {code, body, message} = data;

        if (code == 1) {
          const {favorites = []} = body;
          console.log(favorites);
          dispatch(setFavoriteDrivers(favorites));
        } else {
          dispatch(setErrorAlert({Title: message, Status: 0}));
        }
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch

        console.error('Fetch error:', error);
      });
    setIsFav(!isFav);
  }

  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  0;
  const DaysShow = ({list = [], keya = 0}) => {
    return (
      <View
        key={keya}
        style={{
          width: '100%',
          flexWrap: 'wrap',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {allDays.map((it, i) => {
          const is = list.findIndex(li => li == it) != -1;

          return (
            <>
              <View
                key={`${i.toString()}${keya.toString()}`}
                style={[
                  styles.backItem,
                  {
                    backgroundColor: is ? myColors.primaryT : myColors.divider,
                    width: myWidth(11.82),
                    paddingVertical: myHeight(0.6),
                    paddingHorizontal: myWidth(0),
                    justifyContent: 'center',
                  },
                ]}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: myFontSize.small3,
                    fontFamily: myFonts.bodyBold,
                    color: is ? myColors.background : myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>
                  {it}
                </Text>
              </View>
              {i != 6 && <Spacer key={i} paddingEnd={myWidth(1.5)} />}
            </>
          );
        })}
      </View>
    );
  };
  if (!driver) {
    return <DetailSkeleton />;
  }

  return (
    <View style={{flex: 1, backgroundColor: myColors.background}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            width: '100%',
            overflow: 'hidden',
            backgroundColor: myColors.text,
            borderBottomStartRadius: myHeight(50),
            borderBottomEndRadius: myHeight(50),
            alignItems: 'center',
          }}>
          <Spacer paddingT={myHeight(2)} />
          <StatusbarH />

          <View
            style={{
              width: '100%',
              paddingHorizontal: myWidth(5),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              style={{
                backgroundColor: myColors.primaryT,
                height: myHeight(4.2),
                width: myHeight(4.2),
                borderRadius: myHeight(3),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{
                  height: myHeight(2),
                  width: myHeight(2),
                  resizeMode: 'contain',
                }}
                source={require('../assets/startup/goL.png')}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{
                backgroundColor: myColors.primaryL5,
                padding: myHeight(1.2),
                borderRadius: myHeight(5),

              }}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('DriverDetailEdit',

              )}>
              <Image style={{
                height: myHeight(2.3),
                width: myHeight(2.3),
                resizeMode: 'contain',
                tintColor: myColors.textL0,

              }}
                source={require('../assets/home_main/home/edit.png')} />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={{
                backgroundColor: myColors.text,
                padding: myHeight(0.5),
                borderRadius: myHeight(5),
              }}
              activeOpacity={0.8}
              onPress={changeFav}>
              <Image
                style={{
                  height: myHeight(3.3),
                  width: myHeight(3.3),
                  resizeMode: 'contain',
                  tintColor: myColors.primaryL,
                }}
                source={
                  isFav
                    ? require('../assets/home_main/home/heart.png')
                    : require('../assets/home_main/home/heart_o.png')
                }
              />
            </TouchableOpacity>
            {/* <Spacer paddingEnd={myWidth(4)} /> */}
          </View>

          {/* image */}
          <View
            style={{
              borderRadius: myWidth(100),
              overflow: 'hidden',
              width: myHeight(13),
              height: myHeight(13),
              // backgroundColor: myColors.primaryL5, padding: myHeight(1.3),
              // borderWidth: myWidth(0.1), borderColor: myColors.textL4,
            }}>
            {driver.image ? (
              <ImageUri
                width={'100%'}
                height={'100%'}
                resizeMode="cover"
                uri={driver.image}
              />
            ) : (
              <Image
                source={require('../assets/profile/profile.png')}
                style={{
                  width: myHeight(13),
                  height: myHeight(13),
                  resizeMode: 'contain',
                  // tintColor: myColors.primaryT
                }}
              />
            )}
          </View>
          <Spacer paddingT={myHeight(1)} />

          <Text
            style={{
              color: myColors.background,
              fontSize: myFontSize.medium2,
              fontFamily: myFonts.heading,
              paddingHorizontal: myWidth(16),
            }}>
            {driver.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* Star */}
            <Image
              style={{
                width: myHeight(2.3),
                height: myHeight(2.3),
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
                  fontSize: myFontSize.body4,
                  fontFamily: myFonts.heading,
                  color: myColors.background,
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
                    color: myColors.dot,
                  },
                ]}>
                {`(${driver.noOfRatings})`}
              </Text>
            </TouchableOpacity>

            {myReview ? null : (
              <TouchableOpacity
                style={{paddingHorizontal: myWidth(2)}}
                activeOpacity={0.8}
                onPress={() => setRatinModal(true)}>
                <Text
                  numberOfLines={2}
                  style={[
                    styles.textCommon,
                    {
                      fontSize: myFontSize.xBody,
                      fontFamily: myFonts.heading,
                      color: myColors.primaryL5,
                    },
                  ]}>
                  {' '}
                  {'Rate'}{' '}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <Spacer paddingT={myHeight(8)} />
        </View>
        <Spacer paddingT={myHeight(1)} />

        {/* Details */}
        <View style={{paddingHorizontal: myWidth(4)}}>
          {/* Van Info */}
          <View style={{}}>
            <Text style={styles.heading}>Van Info</Text>

            <Spacer paddingT={myHeight(0.8)} />
            <View
              style={{
                width: '100%',
                flexWrap: 'wrap',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={styles.backItem}>
                <Text
                  style={{
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>
                  {driver.vehicleName}
                </Text>
              </View>
              <Spacer paddingEnd={myWidth(2.8)} />

              <View style={styles.backItem}>
                <Text
                  style={{
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>
                  {driver.vehicleModal}
                </Text>
              </View>
            </View>
          </View>
          <Spacer paddingT={myHeight(3)} />

          {/* Description */}
          <View>
            <Text style={styles.heading}>Description</Text>

            <Text
              style={{
                fontSize: myFontSize.body,
                fontFamily: myFonts.body,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>
              {driver.description}
            </Text>
          </View>
          <Spacer paddingT={myHeight(2)} />

          {/* Photos */}
          <View>
            <Text style={styles.heading}>Photos</Text>
            <Spacer paddingT={myHeight(0.5)} />

            <View
              style={{
                width: '100%',
                height: myHeight(28),

                borderRadius: myWidth(4),
                overflow: 'hidden',
              }}>
              <ImageUri
                width={'100%'}
                height={'100%'}
                resizeMode="cover"
                uri={driver.vehicleImage}
              />
            </View>
          </View>

          <Spacer paddingT={myHeight(3.5)} />

          {/* Aminities */}
          <View style={{}}>
            <Text style={styles.heading}>Amenities</Text>

            <Spacer paddingT={myHeight(0.8)} />
            <View
              style={{
                width: '100%',
                flexWrap: 'wrap',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {driver.ac ? (
                <>
                  <View style={styles.backItem}>
                    <Image
                      style={{
                        width: myHeight(2),
                        height: myHeight(2),
                        resizeMode: 'contain',
                        marginTop: myHeight(0),
                        tintColor: myColors.textL4,
                      }}
                      source={require('../assets/home_main/home/ac2.png')}
                    />
                    <Spacer paddingEnd={myWidth(1.5)} />

                    <Text
                      style={{
                        fontSize: myFontSize.body,
                        fontFamily: myFonts.bodyBold,
                        color: myColors.text,
                        letterSpacing: myLetSpacing.common,
                        includeFontPadding: false,
                        padding: 0,
                      }}>
                      Air Conditioned
                    </Text>
                  </View>
                  <Spacer paddingEnd={myWidth(2.8)} />
                </>
              ) : null}

              {driver.isWifi ? (
                <>
                  <View style={styles.backItem}>
                    <Image
                      style={{
                        width: myHeight(2.3),
                        height: myHeight(2.3),
                        resizeMode: 'contain',
                        marginTop: myHeight(0),
                        tintColor: myColors.textL4,
                      }}
                      source={require('../assets/home_main/home/wifi.png')}
                    />
                    <Spacer paddingEnd={myWidth(1.5)} />
                    <Text
                      style={{
                        fontSize: myFontSize.body,
                        fontFamily: myFonts.bodyBold,
                        color: myColors.text,
                        letterSpacing: myLetSpacing.common,
                        includeFontPadding: false,
                        padding: 0,
                      }}>
                      Wifi
                    </Text>
                  </View>
                  <Spacer paddingEnd={myWidth(2.8)} />
                </>
              ) : null}

              <View style={styles.backItem}>
                <Image
                  style={{
                    width: myHeight(1.75),
                    height: myHeight(1.75),
                    resizeMode: 'contain',
                    marginTop: -myHeight(0.2),
                    tintColor: myColors.textL4,
                  }}
                  source={require('../assets/home_main/home/seatSF.png')}
                />
                <Spacer paddingEnd={myWidth(1.8)} />

                <Text
                  style={{
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>
                  {driver.vehicleSeats}
                </Text>
              </View>
            </View>
          </View>
          <Spacer paddingT={myHeight(3.5)} />

          {/* Paid */}
          <View style={{}}>
            <Text style={styles.heading}>Paid Options</Text>

            <Spacer paddingT={myHeight(0.8)} />
            <View
              style={{
                width: '100%',
                flexWrap: 'wrap',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {driver.packages?.map((it, i) => (
                <>
                  <View
                    key={i}
                    style={[
                      styles.backItem,
                      {
                        paddingHorizontal: 0,
                        width: myWidth(20),
                        justifyContent: 'center',
                      },
                    ]}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: myFontSize.xxSmall,
                        fontFamily: myFonts.bodyBold,
                        color: myColors.text,
                        letterSpacing: myLetSpacing.common,
                        includeFontPadding: false,
                        padding: 0,
                      }}>
                      {it}
                    </Text>
                  </View>
                  <Spacer paddingEnd={myWidth(4)} />
                </>
              ))}
            </View>
          </View>

          <Spacer paddingT={myHeight(3.5)} />
          {/* Daily */}
          <View style={{}}>
            <Text style={styles.heading}>Availability</Text>

            <Spacer paddingT={myHeight(1)} />
            <DaysShow list={driver.dailyDays} keya={1} />
          </View>

          <Spacer paddingT={myHeight(3.5)} />
          {/* Event Book */}
          <View>
            {driver.isOneRide ? (
              <>
                <Text style={styles.heading}>Availability for Events</Text>

                <Spacer paddingT={myHeight(1)} />
                <DaysShow list={driver.oneRideDays} keya={2} />
                <Spacer paddingT={myHeight(2.5)} />
              </>
            ) : null}
          </View>

          {/* Inside Uni */}
          <View>
            {driver.isInsideUni ? (
              <>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setInside(!inside)}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.heading}>
                    Inside Universities Service
                  </Text>

                  <View style={{flex: 1}} />
                  <TouchableOpacity disabled style={{}}>
                    <Image
                      style={{
                        height: myHeight(2.2),
                        width: myHeight(2.2),
                        resizeMode: 'contain',
                        marginTop: myHeight(0.4),
                        tintColor: myColors.offColor,
                        transform: [{rotate: !inside ? '90deg' : '270deg'}],
                      }}
                      source={require('../assets/home_main/home/go.png')}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>

                <Collapsible
                  style={{paddingHorizontal: myWidth(1)}}
                  collapsed={!inside}>
                  <Spacer paddingT={myHeight(0.5)} />

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontSize: myFontSize.body,
                        fontFamily: myFonts.bodyBold,
                        color: myColors.text,
                        letterSpacing: myLetSpacing.common,
                        includeFontPadding: false,
                        padding: 0,
                      }}>{`Estimate Charges: ${driver.departCharges} Rs`}</Text>
                  </View>
                  {driver.insideUniversities.map((it, j) => (
                    <View
                      key={j}
                      style={{
                        flexDirection: 'row',
                        paddingVertical: myHeight(0.65),
                      }}>
                      <Text
                        style={[
                          styles.textCommon,
                          {
                            width: myWidth(0.2) + myFontSize.body * 2,
                            fontFamily: myFonts.bodyBold,
                            fontSize: myFontSize.body,
                          },
                        ]}>
                        {' '}
                        {j + 1}.
                      </Text>
                      <TouchableOpacity
                        disabled
                        activeOpacity={0.75}
                        style={{
                          backgroundColor: myColors.background,
                          flex: 1,
                          paddingEnd: myWidth(2),
                        }}
                        onPress={() => null}>
                        <Text
                          numberOfLines={2}
                          style={[
                            styles.textCommon,
                            {
                              // flex: 1,
                              fontFamily: myFonts.bodyBold,
                              fontSize: myFontSize.body,
                            },
                          ]}>
                          {it}
                        </Text>
                      </TouchableOpacity>
                      <Spacer paddingEnd={myWidth(2)} />
                    </View>
                  ))}
                </Collapsible>

                <Spacer paddingT={myHeight(1.4)} />
              </>
            ) : (
              false
            )}
          </View>

          {/* Reviews */}
          {reviews?.length ? (
            <View style={{}}>
              <Text style={styles.heading}>Reviews</Text>

              <Spacer paddingT={myHeight(1)} />

              <FlashList
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                data={reviews}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{flexGrow: 1}}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      borderTopWidth: myHeight(0.08),
                      borderColor: myColors.background,
                      width: '100%',
                    }}
                  />
                )}
                estimatedItemSize={myHeight(10)}
                renderItem={({item, index}) => {
                  // const item = data

                  return (
                    <View
                      key={index}
                      style={{
                        borderWidth: myHeight(0.1),
                        marginBottom: myHeight(1),
                        backgroundColor: myColors.background,
                        elevation: 1,
                        borderColor: myColors.divider,
                        borderRadius: myWidth(2),
                        paddingHorizontal: myWidth(2),
                      }}>
                      <Spacer paddingT={myHeight(0.8)} />

                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            flex: 1,
                          }}>
                          <Text
                            style={[
                              styles.textCommon,
                              {
                                fontSize: myFontSize.body3,
                                fontFamily: myFonts.heading,
                                paddingEnd: myWidth(1),
                              },
                            ]}>
                            {item.name}
                          </Text>
                          {myReview && myReview.id == item.id ? (
                            <TouchableOpacity
                              style={{paddingHorizontal: myWidth(2)}}
                              activeOpacity={0.8}
                              onPress={() => setRatinModal(true)}>
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.textCommon,
                                  {
                                    fontSize: myFontSize.body2,
                                    fontFamily: myFonts.heading,
                                    color: myColors.primaryT,
                                  },
                                ]}>
                                {' '}
                                {'Edit'}{' '}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>

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
                            color: myColors.textL4,
                          },
                        ]}>
                        {item.review}
                      </Text>

                      <Spacer paddingT={myHeight(1.5)} />

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}>
                        <Text
                          style={[
                            styles.textCommon,
                            {
                              flex: 1,
                              textAlign: 'right',
                              fontSize: myFontSize.xSmall,
                              fontFamily: myFonts.bodyBold,
                              color: myColors.textL4,
                            },
                          ]}>
                          <Text
                            style={{
                              fontSize: myFontSize.small3,
                              color: myColors.textL4,
                              fontFamily: myFonts.body,
                            }}>
                            {item.edited ? 'Edited' : ''}
                          </Text>{' '}
                          {item.date}{' '}
                        </Text>
                      </View>

                      <Spacer paddingT={myHeight(0.7)} />
                    </View>
                  );
                }}
              />
            </View>
          ) : null}

          <Spacer paddingT={myHeight(4)} />
        </View>

        {/* Content */}

        <Spacer paddingT={myHeight(1)} />
      </ScrollView>

      <View>
        <View style={{height: myHeight(0.1), backgroundColor: myColors.dot}} />
        <Spacer paddingT={myHeight(1.5)} />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              Linking.openURL(`tel:${driver.contact}`);
            }}
            style={{
              paddingVertical: myHeight(1.2),
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: myColors.green2,
              width: '38%',
              borderRadius: myWidth(100),
            }}>
            <Text
              style={[
                styles.textCommon,
                {
                  fontSize: myFontSize.body2,
                  fontFamily: myFonts.heading,
                  color: myColors.background,
                },
              ]}>
              CALL
            </Text>
          </TouchableOpacity>
          <Spacer paddingEnd={myWidth(4)} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Chat', {user2: driver})}
            style={{
              paddingVertical: myHeight(1.2),
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: myColors.greenL,
              width: '38%',
              borderRadius: myWidth(100),
            }}>
            <Text
              style={[
                styles.textCommon,
                {
                  fontSize: myFontSize.body2,
                  fontFamily: myFonts.heading,
                  color: myColors.green,
                },
              ]}>
              CHAT
            </Text>
          </TouchableOpacity>
        </View>

        <Spacer paddingT={myHeight(1.5)} />
      </View>
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
              width: myWidth(90),
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
                borderColor: myColors.offColor,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                backgroundColor: myColors.background,
              }}>
              {driver.image ? (
                <ImageUri
                  width={'100%'}
                  height={'100%'}
                  resizeMode="cover"
                  uri={driver.image}
                />
              ) : (
                <Image
                  source={require('../assets/profile/profile.png')}
                  style={{
                    width: myHeight(13),
                    height: myHeight(13),
                    resizeMode: 'contain',
                    // tintColor: myColors.primaryT
                  }}
                />
              )}
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
    </View>
  );
  return (
    <View style={{flex: 1, backgroundColor: myColors.background}}>
      <View
        style={{
          width: '100%',
          height: myHeight(28),

          borderBottomLeftRadius: myWidth(4),
          borderBottomRightRadius: myWidth(4),
          overflow: 'hidden',
        }}>
        <ImageUri
          width={'100%'}
          height={'100%'}
          resizeMode="cover"
          uri={driver.vehicleImage}
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

        <View
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            top: StatusBar.currentHeight + myHeight(0.6),
            right: myWidth(4),
            flexDirection: 'row',
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
      <TouchableOpacity
        disabled
        activeOpacity={0.96}
        onPress={() =>
          navigation.navigate('RestaurantMoreDetails', {driver: driver})
        }
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
            backgroundColor: myColors.background,
          }}>
          <Image
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
              marginTop: myHeight(0.0),
              tintColor: myColors.text,
            }}
            source={require('../assets/home_main/home/driver.png')}
          />
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
            position: 'absolute',
          }}
          activeOpacity={0.8}
          onPress={changeFav}>
          <Image
            style={{
              height: myHeight(3),
              width: myHeight(3),
              resizeMode: 'contain',
              tintColor: myColors.red,
            }}
            source={
              isFav
                ? require('../assets/home_main/home/heart.png')
                : require('../assets/home_main/home/heart_o.png')
            }
          />
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{
              width: myHeight(2.6),
              height: myHeight(2.6),
              marginLeft: -myWidth(0.5),
              marginTop: -myHeight(0.2),
              resizeMode: 'contain',
              tintColor: myColors.primaryT,
            }}
            source={require('../assets/home_main/home/navigator/van2.png')}
          />
          <Spacer paddingEnd={myWidth(0.8)} />

          {/* Name */}
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: myFontSize.xBody,
              color: myColors.text,
              fontFamily: myFonts.heading,
            }}>
            {driver.vehicleName}{' '}
            <Text
              style={{
                fontSize: myFontSize.body4,
                color: myColors.text,
                fontFamily: myFonts.body,
              }}>
              ({driver.vehicleModal})
            </Text>
          </Text>

          <Spacer paddingEnd={myWidth(1.5)} />

          <Image
            style={{
              width: myHeight(3.5),
              height: myHeight(3.5),
              resizeMode: 'contain',
              marginTop: myHeight(0.5),
              tintColor: myColors.primaryT,
            }}
            source={require('../assets/home_main/home/ac.png')}
          />
          <Spacer paddingEnd={myWidth(2.5)} />

          <Text
            style={{
              fontSize: myFontSize.xBody,
              fontFamily: myFonts.heading,
              color: myColors.text,
              letterSpacing: myLetSpacing.common,
              includeFontPadding: false,
              padding: 0,
            }}>
            {driver.ac ? 'AC' : 'Non AC'}
          </Text>
          <Spacer paddingEnd={myWidth(2.5)} />

          <Image
            style={{
              width: myHeight(2.8),
              height: myHeight(2.8),
              resizeMode: 'contain',
              marginTop: myHeight(0),
              tintColor: driver.isWifi ? myColors.primaryT : myColors.offColor,
            }}
            source={
              driver.isWifi
                ? require('../assets/home_main/home/wifi.png')
                : require('../assets/home_main/home/wifiO.png')
            }
          />
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

            <TouchableOpacity
              style={{paddingHorizontal: myWidth(2)}}
              activeOpacity={1}
              onPress={() => setRatinModal(true)}>
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
                {' '}
                {myReview ? 'Edit Rating' : 'Rate'}{' '}
              </Text>
            </TouchableOpacity>
          </View>

          {/*more */}
          {/* <TouchableOpacity activeOpacity={0.8} onPress={() => null}> 
            </TouchableOpacity>
            */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              style={{
                width: myHeight(2),
                height: myHeight(2),
                resizeMode: 'contain',
                marginTop: myHeight(0.0),
                tintColor: myColors.primaryT,
              }}
              source={require('../assets/home_main/home/seatSF.png')}
            />
            <Spacer paddingEnd={myWidth(1.5)} />

            <Text
              style={{
                fontSize: myFontSize.body3,
                fontFamily: myFonts.bodyBold,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>
              {driver.vehicleSeats} Seater
            </Text>
            <Spacer paddingEnd={myWidth(1.5)} />
          </View>
        </View>

        <Spacer paddingT={myHeight(1.5)} />
      </TouchableOpacity>

      <Spacer paddingT={myHeight(1)} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Spacer paddingT={myHeight(1)} />

        {/*Phone &  Chat */}
        <View
          style={{
            flexDirection: 'row',
            borderTopWidth: myWidth(0.2),
            borderWidth: myWidth(0.2),
            borderColor: myColors.textL,
            marginHorizontal: myWidth(4),
            borderRadius: myWidth(50),
          }}>
          {/* Phone */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              Linking.openURL(`tel:${driver.contact}`);
            }}
            style={{
              width: '50%',
              flexDirection: 'row',
              paddingVertical: myHeight(1.2),
              alignItems: 'center',
              justifyContent: 'center',
              borderEndWidth: myWidth(0.2),
              borderColor: myColors.textL,
            }}>
            <Image
              source={require('../assets/home_main/home/phone.png')}
              style={{
                width: myHeight(2.28),
                height: myHeight(2.28),
                resizeMode: 'contain',
                tintColor: myColors.primaryT,
              }}
            />
            <Spacer paddingEnd={myWidth(3)} />
            <Text
              style={[
                styles.textCommon,
                {
                  fontSize: myFontSize.body2,
                  fontFamily: myFonts.heading,
                  color: myColors.text,
                },
              ]}>
              CALL
            </Text>
          </TouchableOpacity>

          {/* Chat */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Chat', {user2: driver})}
            style={{
              width: '50%',
              flexDirection: 'row',
              paddingVertical: myHeight(1.2),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../assets/home_main/home/navigator/chat2.png')}
              style={{
                width: myHeight(2.38),
                height: myHeight(2.38),
                resizeMode: 'contain',
                tintColor: myColors.primaryT,
              }}
            />
            <Spacer paddingEnd={myWidth(3)} />
            <Text
              style={[
                styles.textCommon,
                {
                  fontSize: myFontSize.body2,
                  fontFamily: myFonts.heading,
                  color: myColors.text,
                },
              ]}>
              CHAT
            </Text>
          </TouchableOpacity>
        </View>

        <Spacer paddingT={myHeight(1.5)} />

        {/* Details */}
        <View style={{paddingHorizontal: myWidth(4)}}>
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
              }}>
              Description
            </Text>

            <Text
              style={{
                fontSize: myFontSize.body,
                fontFamily: myFonts.body,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>
              {driver.description}
            </Text>
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
              }}>
              Paid Options
            </Text>

            <Spacer paddingT={myHeight(0.4)} />
            <View
              style={{
                width: '100%',
                flexWrap: 'wrap',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {driver.packages.map((it, i) => (
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: myFontSize.body3,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.primaryT,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>{`● ${it}     `}</Text>
              ))}
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
              }}>
              Pick & Drop Days
            </Text>

            <Spacer paddingT={myHeight(0.5)} />
            <View
              style={{
                width: '100%',
                flexWrap: 'wrap',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {driver.oneRideDays.map((it, i) => (
                <Text
                  key={i}
                  style={{
                    fontSize: myFontSize.body3,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.primaryT,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>{`● ${it}    `}</Text>
              ))}
            </View>
          </View>

          <Spacer paddingT={myHeight(1.5)} />
          {/* Event Book */}
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  flex: 1,
                  fontSize: myFontSize.body4,
                  fontFamily: myFonts.bodyBold,
                  color: myColors.text,
                  letterSpacing: myLetSpacing.common,
                  includeFontPadding: false,
                  padding: 0,
                }}>
                {driver.isOneRide
                  ? 'Event Booking Days'
                  : 'Event Booking Service'}
              </Text>
              {!driver.isOneRide ? (
                <Text
                  style={{
                    fontSize: myFontSize.body4,
                    fontFamily: myFonts.body,
                    color: myColors.red,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>
                  Not Availabe
                </Text>
              ) : null}
            </View>

            <Spacer paddingT={myHeight(0.5)} />
            {driver.isOneRide ? (
              <View
                style={{
                  width: '100%',
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {driver.oneRideDays.map((it, i) => (
                  <Text
                    key={i}
                    style={{
                      fontSize: myFontSize.body3,
                      fontFamily: myFonts.bodyBold,
                      color: myColors.primaryT,
                      letterSpacing: myLetSpacing.common,
                      includeFontPadding: false,
                      padding: 0,
                    }}>{`● ${it}    `}</Text>
                ))}
              </View>
            ) : null}
          </View>

          <Spacer paddingT={myHeight(1.2)} />
          {/* Inside Uni */}
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  flex: 1,
                  fontSize: myFontSize.body4,
                  fontFamily: myFonts.bodyBold,
                  color: myColors.text,
                  letterSpacing: myLetSpacing.common,
                  includeFontPadding: false,
                  padding: 0,
                }}>
                {driver.isInsideUni
                  ? 'Inside Universities Service'
                  : 'Inside Universities Service'}
              </Text>

              {!driver.isInsideUni ? (
                <Text
                  style={{
                    fontSize: myFontSize.body4,
                    fontFamily: myFonts.body,
                    color: myColors.red,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>
                  Not Availabe
                </Text>
              ) : (
                <TouchableOpacity
                  style={{}}
                  activeOpacity={0.7}
                  onPress={() => setInside(!inside)}>
                  <Image
                    style={{
                      height: myHeight(2.5),
                      width: myHeight(2.5),
                      resizeMode: 'contain',
                      marginTop: myHeight(0.4),
                      tintColor: myColors.primaryT,
                      transform: [{rotate: !inside ? '90deg' : '270deg'}],
                    }}
                    source={require('../assets/home_main/home/go.png')}
                  />
                </TouchableOpacity>
              )}
            </View>

            <Collapsible
              style={{paddingHorizontal: myWidth(1)}}
              collapsed={!inside}>
              <Spacer paddingT={myHeight(0.5)} />

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: myFontSize.body,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.text,
                    letterSpacing: myLetSpacing.common,
                    includeFontPadding: false,
                    padding: 0,
                  }}>{`Estimate Charges: ${driver.departCharges} Rs`}</Text>
              </View>
              {driver.insideUniversities.map((it, j) => (
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: myHeight(0.65),
                  }}>
                  <Text
                    style={[
                      styles.textCommon,
                      {
                        width: myWidth(0.2) + myFontSize.body * 2,
                        fontFamily: myFonts.bodyBold,
                        fontSize: myFontSize.body,
                      },
                    ]}>
                    {' '}
                    {j + 1}.
                  </Text>
                  <TouchableOpacity
                    disabled
                    activeOpacity={0.75}
                    style={{
                      backgroundColor: myColors.background,
                      flex: 1,
                      paddingEnd: myWidth(2),
                    }}
                    onPress={() => null}>
                    <Text
                      numberOfLines={2}
                      style={[
                        styles.textCommon,
                        {
                          // flex: 1,
                          fontFamily: myFonts.bodyBold,
                          fontSize: myFontSize.body,
                        },
                      ]}>
                      {it}
                    </Text>
                  </TouchableOpacity>
                  <Spacer paddingEnd={myWidth(2)} />
                </View>
              ))}
            </Collapsible>
          </View>
          <Spacer paddingT={myHeight(1.2)} />

          {/* Reviews */}
          <View style={{}}>
            <Text
              numberOfLines={2}
              style={[
                styles.textCommon,
                {
                  width: '100%',
                  fontSize: myFontSize.xxBody,
                  fontFamily: myFonts.bodyBold,
                  paddingEnd: myWidth(3),
                  textAlign: 'center',
                },
              ]}>
              Reviews
            </Text>
            {/* <Spacer paddingT={myHeight(0.5)} /> */}

            <FlashList
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              data={reviews}
              contentContainerStyle={{flexGrow: 1}}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    borderTopWidth: myHeight(0.08),
                    borderColor: myColors.offColor,
                    width: '100%',
                  }}
                />
              )}
              estimatedItemSize={myHeight(10)}
              renderItem={({item, index}) => {
                // const item = data

                return (
                  <View key={index}>
                    <Spacer paddingT={myHeight(1.5)} />

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                            fontSize: myFontSize.body,
                            fontFamily: myFonts.body,
                          },
                        ]}>
                        {item.date}{' '}
                        <Text
                          style={{
                            fontSize: myFontSize.body,
                            color: myColors.textL4,
                          }}>
                          {item.edited ? 'Edited' : ''}
                        </Text>{' '}
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

          <Spacer paddingT={myHeight(4)} />
        </View>
      </ScrollView>

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
              width: myWidth(90),
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
              {/* <ImageUri width={'100%'} height={'100%'} resizeMode='cover' uri={null} /> */}
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                  marginTop: myHeight(0.0),
                  tintColor: myColors.text,
                }}
                source={require('../assets/home_main/home/driver.png')}
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
              {driver.name}
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
  backItem: {
    paddingHorizontal: myWidth(5),
    paddingVertical: myHeight(0.75),
    borderRadius: myWidth(100),
    backgroundColor: myColors.background,
    borderWidth: myHeight(0.1),
    borderColor: myColors.divider,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    fontSize: myFontSize.body4,
    fontFamily: myFonts.bodyBold,
    color: myColors.textL4,
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
