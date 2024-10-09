import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  StatusBar,
  TextInput,
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
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';
import {useSelector, useDispatch} from 'react-redux';
import {addCart, removeItemCart} from '../../redux/cart_reducer';
import {
  addFavoriteItem,
  removeFavoriteItem,
} from '../../redux/favorite_reducer';
import {ImageUri} from '../common/image_uri';

export const ItemDetails = ({navigation, route}) => {
  const {item} = route.params;
  const {restaurant} = route.params;
  const dispatch = useDispatch();
  const [RatingModal, setRatinModal] = useState(false);
  const [starI, setStarI] = useState(undefined);
  const [review, setReview] = useState(null);
  const [selectItems, setSelectItems] = useState({});
  const {options} = item;
  const price = parseInt(item.price);
  const [count, setCount] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //Favourite
  const {favoriteItem} = useSelector(state => state.favorite);
  const checkFav = favoriteItem.find(data => data.itemId == item.id);
  const [isFav, setIsFav] = useState(checkFav != null);

  function changeFav() {
    if (!isFav) {
      dispatch(addFavoriteItem({resId: item.resId, itemId: item.id}));
    } else {
      dispatch(removeFavoriteItem({resId: item.resId, itemId: item.id}));
    }
    setIsFav(!isFav);
  }
  useEffect(() => {
    setIsFav(checkFav != null);
  }, [checkFav]);

  function showError(message) {
    // setIsLoading(false)
    setErrorMessage(message);
  }

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setIsLoading(false);
        setErrorMessage(null);
      }, errorTime);
    }
  }, [errorMessage]);

  // function shortRestForCart() {
  //     const s = {
  //         id: restaurant.id,
  //         image: restaurant.images[0],
  //         name: restaurant.name
  //     }
  //     return s
  // }

  function hideModal() {
    setRatinModal(false);
  }

  function checkRequired() {
    let s = true;
    let itemArray = [];
    let id = null;
    options?.map((option, i) => {
      const hasSeleted = selectItems[option.name];
      if (option.required && !hasSeleted) {
        setErrorMessage(`Please select ${option.name}`);
        restaurant;
        s = null;
      }
      if (hasSeleted) {
        itemArray.push({name: option.name, value: hasSeleted});
        id = id + option.name + hasSeleted;
        console.log;
      }
    });
    if (s) {
      const data = {
        selectOptions: itemArray,
        optionsId: id,
      };
      return data;
    }
    return s;
  }
  function onAddToCart() {
    const checkReq = checkRequired();
    if (checkReq != null) {
      const {selectOptions} = checkReq;
      const {optionsId} = checkReq;
      const cusItem = {
        ...item,
        selectOptions,
        optionsId,
      };
      // console.log(cusItem)

      dispatch(
        addCart({
          restaurant,
          item: cusItem,
          quantity: count,
          totalPrice: count * price,
        }),
      );
      navigation.goBack();
    }
  }

  function onDone() {
    if (starI) {
      setIsLoading(true);

      //     firestore().collection('restaurants').doc(restaurant.uid).get()
      //         .then((data) => {
      //             const res = data.data()
      //             let catIndex = 0
      //             let itemIndex = 0
      //             let item2 = {}
      //             res.foodCategory.map((cat, i) => {
      //                 if (item.subCatName == cat.name) {
      //                     catIndex = i
      //                     cat.items.map((it, itI) => {
      //                         if (item.id == it.id) {
      //                             itemIndex = itI
      //                             item2 = it

      //                         }

      //                     })
      //                 }
      //             })

      //             if (item2) {

      //                 const noOfRatings = item2.noOfRatings ? item2.noOfRatings : 0
      //                 const ratingTotal = item2.ratingTotal ? item2.ratingTotal : 0

      //                 const newRatingTotal = ratingTotal + starI + 1
      //                 const newnoOfRatings = noOfRatings + 1
      //                 const newrating = newRatingTotal / newnoOfRatings
      //                 const newItem = {
      //                     ...item2,
      //                     noOfRatings: newnoOfRatings,
      //                     ratingTotal: newRatingTotal,
      //                     rating: newrating
      //                 }
      //                 let newCat = res.foodCategory[catIndex]
      //                 newCat.items[itemIndex] = newItem

      //                 const newFoodCartegpry = res.foodCategory
      //                 newFoodCartegpry[catIndex] = newCat

      //                 const update = {
      //                     foodCategory: newFoodCartegpry
      //                 }

      //                 firestore().collection('restaurants').doc(restaurant.uid).update(update)
      //                     .then((data) => {
      //                         setIsLoading(false)
      //                         hideModal()
      //                     }).catch((er) => {
      //                         console.log('Error on Get Users for fav', er)
      //                         setErrorMessage('Something Wrong')
      //                     })
      //             }

      //         }).catch((er) => {
      //             console.log('Error on Get Users for fav', er)
      //             setErrorMessage('Something Wrong')

      //         })
    } else setErrorMessage('PLease  rate');
    // hideModal()
  }

  return (
    <>
      <View style={{flex: 1, backgroundColor: myColors.primaryL2}}>
        {/* Top */}
        <View
          style={{
            paddingHorizontal: myWidth(4),
            position: 'absolute',
            width: '100%',
            marginTop: StatusBar.currentHeight + myHeight(0.6),
            zIndex: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {/* Back */}
          <TouchableOpacity
            style={{
              backgroundColor: myColors.background,
              padding: myHeight(1),
              borderRadius: myHeight(5),
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

          {/* Heart */}
          <TouchableOpacity
            style={{
              backgroundColor: myColors.background,
              padding: myHeight(1),
              borderRadius: myHeight(5),
            }}
            activeOpacity={0.8}
            onPress={changeFav}>
            <Image
              style={{
                height: myHeight(2.6),
                width: myHeight(2.6),
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
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          {/* Name & Image */}
          <View style={{}}>
            {/* Image */}
            <View
              style={{
                alignSelf: 'center',
                marginBottom: myHeight(3),
                overflow: 'hidden',
                backgroundColor: myColors.background,
                elevation: 15,
                borderRadius: myHeight(60),
                marginTop: StatusBar.currentHeight + myHeight(1.5),
              }}>
              <ImageUri
                width={myHeight(22)}
                height={myHeight(22)}
                resizeMode="cover"
                borderRadius={5000}
                uri={item.image}
              />
            </View>

            {/* Name */}
            <Text
              style={[
                styles.textCommon,
                {
                  fontSize: myFontSize.medium,
                  fontFamily: myFonts.headingBold,
                  color: myColors.text,
                  textAlign: 'center',
                  marginTop: -myHeight(1),
                },
              ]}>
              {item.name}
            </Text>

            <Spacer paddingT={myHeight(7.5)} />
          </View>

          {/* Content */}
          <View
            style={{
              paddingHorizontal: myWidth(4),
              backgroundColor: myColors.background,
              borderTopStartRadius: myWidth(7.5),
              borderTopEndRadius: myWidth(7.5),
              marginTop: -myHeight(4.5),
              flex: 1,
            }}>
            {/* DIVIDER */}
            {/* <View style={{ borderTopWidth: myHeight(0.18), borderColor: myColors.divider, }} /> */}
            <Spacer paddingT={myHeight(1.8)} />

            {/* Price & Rating & Rate Us */}
            <View style={{flexDirection: 'row', paddingHorizontal: myWidth(1)}}>
              {/* Price */}
              <Text
                style={[
                  styles.textCommon,
                  {
                    flex: 1,
                    fontSize: myFontSize.medium0,
                    fontFamily: myFonts.heading,
                    color: myColors.primaryT,
                  },
                ]}>
                Rs{' '}
                <Text
                  style={{
                    fontSize: myFontSize.medium3,
                  }}>
                  {price}
                </Text>
              </Text>

              {/* Rating */}
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
                  }}
                  source={require('../assets/home_main/home/star.png')}
                />
                <Spacer paddingEnd={myWidth(1.5)} />
                {/* Rating */}
                <Text
                  style={[
                    styles.textCommon,
                    {
                      fontSize: myFontSize.xBody,
                      fontFamily: myFonts.heading,
                      color: myColors.text,
                    },
                  ]}>
                  {`${item.rating} `}
                </Text>

                <Text
                  style={[
                    styles.textCommon,
                    {
                      fontSize: myFontSize.body3,
                      fontFamily: myFonts.heading,
                      color: myColors.textL4,
                    },
                  ]}>
                  {`( ${item.noOfRatings} )`}
                </Text>

                <Spacer paddingEnd={myWidth(5)} />
                {/* Rate us */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setRatinModal(true)}>
                  <Text
                    numberOfLines={2}
                    style={[
                      styles.textCommon,
                      {
                        fontSize: myFontSize.body4,
                        fontFamily: myFonts.bodyBold,
                        color: myColors.primaryT,
                      },
                    ]}>
                    Rate Us!
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {item.description && (
              <View>
                <Spacer paddingT={myHeight(1.3)} />
                <Text
                  style={[
                    styles.textCommon,
                    {
                      fontSize: myFontSize.body3,
                      fontFamily: myFonts.heading,
                      color: myColors.text,
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
                      fontSize: myFontSize.body2,
                      fontFamily: myFonts.bodyBold,
                      color: myColors.textL4,
                    },
                  ]}>
                  {item.description}
                </Text>
              </View>
            )}

            <Spacer paddingT={myHeight(2.5)} />

            {/* Divider */}
            {/* <View style={{ borderTopWidth: myHeight(0.2), borderColor: myColors.dot, }} />

                        <Spacer paddingT={myHeight(1)} /> */}
            {/* Restaurant Info */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: myColors.background,
                elevation: 3,
                borderRadius: myWidth(2.5),
                paddingHorizontal: myWidth(2),
                paddingTop: myHeight(1.3),
                paddingBottom: myHeight(1),
                borderWidth: myHeight(0.09),
                borderColor: myColors.divider,
              }}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('RestaurantDetail', {item: restaurant})
              }>
              {/* Image */}
              <View
                style={{
                  backgroundColor: myColors.background,
                  borderRadius: myHeight(60),
                  overflow: 'hidden',
                  borderWidth: myHeight(0.15),
                  borderColor: myColors.offColor,
                }}>
                <ImageUri
                  width={myHeight(6)}
                  height={myHeight(6)}
                  resizeMode="cover"
                  uri={restaurant.icon}
                  borderRadius={5000}
                />
              </View>

              {/* Details */}
              <View style={{paddingHorizontal: myWidth(2), flex: 1}}>
                {/* Name & Rating */}
                <View style={{flexDirection: 'row'}}>
                  {/* Name */}
                  <Spacer paddingEnd={myWidth(0.6)} />
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.textCommon,
                      {
                        flex: 1,
                        fontSize: myFontSize.xBody,
                        fontFamily: myFonts.heading,
                      },
                    ]}>
                    {restaurant.name}
                  </Text>

                  <Spacer paddingEnd={myWidth(1)} />

                  {/* Rating */}
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{
                        height: myHeight(2),
                        width: myHeight(2),
                        tintColor: myColors.star,
                        resizeMode: 'contain',
                      }}
                      source={require('../assets/home_main/home/star.png')}
                    />

                    <Spacer paddingEnd={myWidth(1.4)} />
                    <Text
                      style={[
                        styles.textCommon,
                        {
                          fontSize: myFontSize.body3,
                          fontFamily: myFonts.heading,
                          color: myColors.text,
                        },
                      ]}>
                      {restaurant.rating}
                    </Text>
                  </View>
                </View>

                <Spacer paddingT={myHeight(0.2)} />
                {/* Location */}
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={{
                      width: myHeight(1.8),
                      height: myHeight(1.8),
                      resizeMode: 'contain',
                      marginTop: myHeight(0.2),
                    }}
                    source={require('../assets/home_main/home/loc.png')}
                  />
                  <Spacer paddingEnd={myWidth(0.8)} />
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.textCommon,
                      {
                        flex: 1,
                        fontSize: myFontSize.xSmall,
                        fontFamily: myFonts.bodyBold,
                        color: myColors.text,
                      },
                    ]}>
                    {restaurant.location}
                  </Text>
                </View>

                {/* restaurants */}
                {/* <Text numberOfLines={1} style={styles.textrestaurants}>{restaurants}</Text> */}
                <Spacer paddingT={myHeight(1)} />
              </View>
            </TouchableOpacity>

            <Spacer paddingT={myHeight(3.5)} />
            {/* Divider Mota */}
            <View
              style={{
                marginStart: -myWidth(4),
                width: myWidth(100),
                height: myHeight(1),
                backgroundColor: myColors.dot,
              }}
            />
            <Spacer paddingT={myHeight(1)} />

            {/* Options */}
            {options.map((option, i) => {
              return (
                <View key={i}>
                  <Spacer paddingT={myHeight(1)} />
                  {/* Name & Required */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={[
                        styles.textCommon,
                        {
                          fontSize: myFontSize.xBody,
                          fontFamily: myFonts.heading,
                        },
                      ]}>
                      {option.name}
                    </Text>

                    {option.required && (
                      <View
                        style={{
                          paddingHorizontal: myWidth(4),
                          paddingVertical: myHeight(0.4),
                          backgroundColor: myColors.dot,
                          borderRadius: myHeight(5),
                        }}>
                        <Text
                          style={[
                            styles.textCommon,
                            {
                              fontSize: myFontSize.body2,
                              fontFamily: myFonts.body,
                            },
                          ]}>
                          {'Required'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Spacer paddingT={myHeight(0.6)} />

                  {option.list?.map((item, i) => (
                    <View key={i}>
                      {/* Divider */}
                      {i != 0 && (
                        <View
                          style={{
                            width: '100%',
                            borderTopWidth: myHeight(0.12),
                            borderColor: myColors.dot,
                          }}
                        />
                      )}
                      <Spacer paddingT={myHeight(1)} />

                      {/* List name & circle */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                        onPress={() => {
                          if (selectItems[option.name]) {
                            setSelectItems({
                              ...selectItems,
                              [option.name]: item,
                            });
                            return;
                          }
                          const tem = {
                            ...selectItems,
                            [option.name]: item,
                          };
                          setSelectItems(tem);
                        }}>
                        {/* list name */}
                        <Text
                          style={[
                            styles.textCommon,
                            {
                              flex: 1,
                              fontSize: myFontSize.xBody,
                              fontFamily: myFonts.body,
                            },
                          ]}>
                          {item}
                        </Text>

                        {/* Circle */}
                        <View
                          style={{
                            width: myHeight(2.8),
                            height: myHeight(2.8),
                            borderColor: myColors.primaryT,
                            borderRadius: myHeight(3),
                            borderWidth:
                              selectItems[option.name] == item
                                ? myHeight(0.9)
                                : myHeight(0.2),
                          }}
                        />
                      </TouchableOpacity>
                      <Spacer paddingT={myHeight(1)} />
                    </View>
                  ))}
                  <Spacer paddingT={myHeight(1)} />
                </View>
              );
            })}
            <Spacer paddingT={myHeight(1)} />
          </View>
        </ScrollView>

        {/* Cart */}
        <View style={{backgroundColor: myColors.background}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: myColors.background,
              paddingVertical: myHeight(1),
              paddingHorizontal: myWidth(3),
              borderWidth: myHeight(0.1),
              borderColor: myColors.text3,
              justifyContent: 'space-between',
              borderTopRightRadius: myWidth(4),
              borderTopLeftRadius: myWidth(4),
            }}>
            {/* Price */}
            <View>
              <Text
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.xxSmall,
                    fontFamily: myFonts.bodyBold,
                    color: myColors.textL4,
                  },
                ]}>
                Total Price
              </Text>
              <Text
                style={[
                  styles.textCommon,
                  {
                    fontSize: myFontSize.xBody,
                    fontFamily: myFonts.heading,
                    color: myColors.text,
                  },
                ]}>
                Rs{' '}
                <Text
                  style={{
                    fontSize: myFontSize.medium2,
                  }}>
                  {price * count}
                </Text>
              </Text>
            </View>

            {/* Plus Minus & Add To Cart */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {/* Plus Minus */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {/* minus */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => {
                    if (count > 1) {
                      setCount(count - 1);
                    }
                  }}>
                  <Image
                    style={{
                      height: myHeight(4.1),
                      width: myHeight(4.1),
                      resizeMode: 'contain',
                      marginTop: myHeight(0.7),
                    }}
                    source={require('../assets/home_main/home/minusBtn.png')}
                  />
                </TouchableOpacity>

                <View style={{minWidth: myWidth(11), alignItems: 'center'}}>
                  {/* count */}
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.textCommon,
                      {
                        fontSize: myFontSize.medium,
                        fontFamily: myFonts.bodyBold,
                      },
                    ]}>
                    {count}
                  </Text>
                </View>

                {/* plus */}
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setCount(count + 1)}>
                  <Image
                    style={{
                      height: myHeight(4.25),
                      width: myHeight(4.25),
                      marginTop: myHeight(0.7),
                      resizeMode: 'contain',
                    }}
                    source={require('../assets/home_main/home/plusBtn.png')}
                  />
                </TouchableOpacity>
              </View>

              <Spacer paddingEnd={myWidth(5)} />
              {/* Add To Cart */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onAddToCart}
                style={{
                  paddingHorizontal: myWidth(4),
                  paddingVertical: myHeight(1.2),
                  backgroundColor: myColors.black,
                  borderRadius: myWidth(100),
                }}>
                <Text
                  style={[
                    styles.textCommon,
                    {
                      fontSize: myFontSize.body,
                      fontFamily: myFonts.heading,
                      color: myColors.background,
                    },
                  ]}>
                  Add To Cart
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
              width: myWidth(85),
              backgroundColor: myColors.background,
              borderRadius: myWidth(6),
            }}>
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
                uri={item.image.toString()}
              />
            </View>
            <Spacer paddingT={myHeight(1)} />
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
              {item.name}
            </Text>
            <Spacer paddingT={myHeight(2.5)} />

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

            <Spacer paddingT={myHeight(3.5)} />
            {/* Review Input */}
            {/* <TextInput placeholder="Write your review"
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
                        /> */}

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
            <Spacer paddingT={myHeight(3)} />
          </Animated.View>
        </TouchableOpacity>
      )}
      {errorMessage && <MyError message={errorMessage} />}
      {isLoading && <Loader />}
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
