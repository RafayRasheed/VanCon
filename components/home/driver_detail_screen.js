import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView, StyleSheet, TouchableOpacity, Image,
  View, Text, StatusBar,
  Linking, Platform, ImageBackground, BackHandler,
} from 'react-native';
import { MyError, Spacer, StatusBarHide, ios, myHeight, myWidth } from '../common';
import { myColors } from '../../ultils/myColors';
import { myFontSize, myFonts, myLetSpacing } from '../../ultils/myFonts';
import { ItemInfo } from './home.component/item_info';
import { useDispatch, useSelector } from 'react-redux';
import { addFavoriteRest, removeFavoriteRest } from '../../redux/favorite_reducer';
import { useFocusEffect } from '@react-navigation/native';
import { ImageUri } from '../common/image_uri';
import { deccodeInfo } from '../functions/functions';

export const DriverDetail = ({ navigation, route }) => {
  const driver = route.params.driver;
  const backScreen = route.params.backScreen
  const catRef = useRef(null)
  const { foodCategory } = driver;
  const [selectCat, setSelectCat] = useState(null);
  const [currentItem, setCurrentItems] = useState([]);
  const [allItems, setAllItems] = useState([])
  //Back Functions



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
      <View style={{}}>
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
            <Spacer paddingEnd={myWidth(1.5)} />


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
                {`${driver.rating}  `}
              </Text>
              {/* Rate us */}
              <TouchableOpacity activeOpacity={1} onPress={() => null}>
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
                  {`Reviews (${driver.noOfRatings})`}
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


          <Spacer paddingT={myHeight(2)} />
        </TouchableOpacity>


        <Spacer paddingT={myHeight(2)} />
        {/*Phone &  Chat */}
        <View style={{
          flexDirection: 'row',
          borderTopWidth: myWidth(0.2), borderWidth: myWidth(0.2),
          borderColor: myColors.primaryT, marginHorizontal: myWidth(4),
          borderRadius: myWidth(50)
        }}>
          {/* Phone */}
          <TouchableOpacity activeOpacity={0.7} onPress={() => { Linking.openURL(`tel:${driver.contact}`); }}
            style={{
              width: '50%', flexDirection: 'row', paddingVertical: myHeight(1.2),
              alignItems: 'center', justifyContent: 'center', borderEndWidth: myWidth(0.2),
              borderColor: myColors.primaryT,
            }}>
            <Image source={require('../assets/home_main/home/phone.png')}
              style={{
                width: myHeight(2.28),
                height: myHeight(2.28),
                resizeMode: 'contain',
                tintColor: myColors.textL4
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
                tintColor: myColors.textL4
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

        <View style={{ paddingHorizontal: myWidth(4) }}>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text

              style={{
                fontSize: myFontSize.body4,
                fontFamily: myFonts.heading,
                color: myColors.text,
                letterSpacing: myLetSpacing.common,
                includeFontPadding: false,
                padding: 0,
              }}>Paid: </Text>

            <Spacer paddingEnd={myWidth(1.5)} />
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
            <Spacer paddingEnd={myWidth(1.5)} />
          </View>
        </View>
      </View>







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
});
