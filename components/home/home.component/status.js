import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  FlatList,
  Modal,
  UIManager,
  LayoutAnimation,
  Platform,
  NativeModules
} from 'react-native';
import { MyError, Spacer, ios, myHeight, myWidth } from '../../common';
// import Animated from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
// import { myColors } from '../../ultils/myColors';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { myFontSize, myFonts, myLetSpacing } from '../../../ultils/myFonts';
import { myColors } from '../../../ultils/myColors';
import Collapsible from 'react-native-collapsible';

const { StatusBarManager } = NativeModules;

if (!ios && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const Status = ({ notifications = [], }) => {
  const navigation = useNavigation();
  const [notiLen, setNotiLen] = useState(notifications.length.toString());
  const [notificationVisible, setNotificationVisible] = useState(
    notifications.length != 0 ? [notifications[0]] : null,
  );

  const iosHeight = useSafeAreaInsets().top

  const [notificationExpand, setNotificationExpand] = useState(false);
  const [notificationsFocusID, setNotificationsFocusID] = useState(null);


  // function onNotificationsFocus(RideId) {
  //   if (RideId == notificationsFocusID) {
  //     setNotificationExpand(false);
  //     return;
  //   }
  //   setNotificationsFocusID(RideId);
  // }
  // function settingNotification() {
  //   if (notifications[0] != null) {

  //     if (notifications.length) {
  //       setNotificationVisible([notifications[0]]);
  //     } else {
  //       setNotificationVisible([]);
  //     }
  //   }
  // }
  // useEffect(() => {
  //   if (notificationExpand) {
  //     setNotificationVisible(notifications);
  //   } else {
  //     settingNotification();
  //   }
  // }, [notificationExpand]);

  // useEffect(() => {
  //   settingNotification();
  //   setNotificationExpand(false);
  // }, [notificationsFocusID]);

  // useEffect(() => {
  //   settingNotification();
  //   const l = notifications.length;
  //   if (l) {
  //     setNotiLen(l.toString());
  //   }
  // }, [notifications]);

  // StatusBarManager.getHeight(({ height }) => {
  //   console.log(height)
  // });
  if (notifications.length == 0) {
    return null
  }

  const ItemItem = ({ item, i }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}

        onPress={() => navigation.navigate(item.isOnline ? "OrderDetails2" : 'OrderDetails', { item, code: 1 })}

        style={[
          styles.containerNotiItem,
          notificationExpand &&
          i != 0 && { borderTopWidth: myHeight(0.085) },
        ]}
      >
        <View style={{ flex: 1 }}>

          {
            item.isOnline ?

              <View style={{
                paddingVertical: myHeight(0.1), paddingHorizontal: myWidth(2.5),
                marginEnd: myWidth(1), marginStart: -myWidth(2.5),
                marginBottom: myHeight(0.8),
                backgroundColor: myColors.background, alignSelf: 'flex-start',
                borderRadius: myWidth(100), flexDirection: 'row', alignItems: 'center'
              }}>
                <Text
                  style={[
                    styles.textCommon,
                    {

                      fontSize: myFontSize.xxSmall,
                      fontFamily: myFonts.heading,
                      color: myColors.text
                    },
                  ]}
                >Vanpool</Text>
              </View>
              :
              null
          }
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={[
                styles.textNotiItem,
                { fontFamily: myFonts.heading },
              ]}
            >
              Ride ID:{' '}
            </Text>
            <Text
              style={[styles.textNotiItem, { flex: 1 }]}
              numberOfLines={1}
            >
              {item.id}
            </Text>
          </View>

          {
            item.driverName ?
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.textNotiItem,
                    { fontFamily: myFonts.heading },
                  ]}
                >
                  Driver:{' '}
                </Text>
                <Text
                  style={[styles.textNotiItem, { flex: 1 }]}
                  numberOfLines={1}
                >
                  {item.driverName}
                </Text>
              </View>
              :
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.textNotiItem,
                    { fontFamily: myFonts.heading },
                  ]}
                >
                  Status:{' '}
                </Text>
                <Text
                  style={[styles.textNotiItem, { flex: 1 }]}
                  numberOfLines={2}
                >{item.onlineStatus}</Text>
              </View>
          }


          {
            item.isOnline ?

              null
              :

              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.textNotiItem,
                    { fontFamily: myFonts.heading },
                  ]}
                >
                  Status:{' '}
                </Text>
                <Text
                  style={[styles.textNotiItem, { flex: 1 }]}
                  numberOfLines={1}
                >Active</Text>
              </View>
          }



        </View>

        <TouchableOpacity disabled activeOpacity={0.6} onPress={() => null}>
          <Spacer paddingT={myHeight(2.15)} />
          <Image
            style={[styles.imageGo]}
            source={require('../../assets/home_main/home/go.png')}
          />
          <Spacer paddingT={myHeight(2.15)} />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }
  return (

    <GestureHandlerRootView style={[styles.containerNotification,

    ]}>
      {notifications.length > 1 ? (
        <PanGestureHandler
          onGestureEvent={event => {
            const s = event.nativeEvent.translationY;
            if (s < -25) {
              if (!notificationExpand) {
                console.log('ok');
                setNotificationExpand(true);
                // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)

                // LayoutAnimation.configureNext({
                //   create: { property: 'opacity', type: 'linear' },
                //   delete: { property: 'opacity', type: 'linear' },
                //   duration: 300,
                //   update: { type: 'linear' },
                // });
              }
            } else if (s > 25) {
              if (notificationExpand) {
                setNotificationExpand(false);
                // LayoutAnimation.configureNext({
                //   create: { property: 'opacity', type: 'linear' },
                //   delete: { property: 'opacity', type: 'linear' },
                //   duration: 300,
                //   update: { type: 'linear' },
                // });
              }
            }
          }}
        >
          <View
            style={{
              alignItems: 'center',
              marginBottom: myHeight(1),
              width: '100%',
            }}
          >
            <View
            // onPress={() => {
            //     // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
            //     setNotificationExpand(!notificationExpand)
            //     const duration = notificationExpand ? 150 : 300
            //     LayoutAnimation.configureNext({
            //         "create": { "property": "opacity", "type": "linear" },
            //         "delete": { "property": "opacity", "type": "linear" },
            //         "duration": duration,
            //         "update": { "type": "linear" }
            //     });
            // }}
            >
              <Spacer paddingT={myHeight(0.5)} />
              <Image
                style={[
                  styles.imageUp,
                  notificationExpand && { transform: [{ rotate: '180deg' }] },
                ]}
                source={require('../../assets/home_main/home/up.png')}
              />
              <Spacer paddingT={myHeight(0.5)} />
            </View>
            <Text style={styles.textNotiSwipe}>
              {notificationExpand
                ? 'Swipe down to see less requests'
                : `Swipe up to see ${notifications.length - 1} more requests`}
            </Text>
            {/* <View style={[styles.containerNotiCount, { right: RFValue(35) }]}>
              <Text style={styles.textNotiCount}>
                {notifications.length}
              </Text>
            </View> */}
          </View>
        </PanGestureHandler>
      ) : null}
      <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }}>

        <ItemItem item={notifications[0]} i={0} />

        <Collapsible collapsed={!notificationExpand}>
          {notifications.length
            ? notifications.map((item, i) => {
              if (i == 0) {
                return null
              }
              return (
                <>
                  <ItemItem item={item} i={i} key={i} />

                </>
              )

            })
            : null}

        </Collapsible>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  containerNotification: {
    backgroundColor: myColors.background,
    width: myWidth(100),
    maxHeight: myHeight(80),
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    bottom: RFValue(0),
    borderTopStartRadius: myWidth(6),
    borderTopEndRadius: myWidth(6),
  },
  containerNotiCount: {
    paddingHorizontal: myHeight(1),
    paddingVertical: myHeight(0.4),
    position: 'absolute',
    backgroundColor: myColors.primaryT,
    bottom: 0,
    borderRadius: myWidth(10),
  },
  containerNotiItem: {
    flexDirection: 'row',
    width: myWidth(100),
    borderBottomColor: 'black',
    borderBottomWidth: 0.8,
    backgroundColor: myColors.primaryT,
    paddingVertical: myHeight(1.3),
    paddingHorizontal: myWidth(4.6),
  },
  textCommon: {
    color: myColors.text,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
  //Text
  textNotiSwipe: {
    fontSize: myFontSize.body,
    fontFamily: myFonts.heading,
    color: myColors.primaryT,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
    alignSelf: 'center',
  },
  textNotiCount: {
    fontSize: myFontSize.xSmall,
    fontFamily: myFonts.heading,
    color: myColors.background,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
  textNotiItem: {
    fontSize: myFontSize.xSmall,
    fontFamily: myFonts.body,
    color: myColors.background,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },

  //Image
  imageUp: {
    height: myHeight(3.8),
    width: myHeight(3.8),
    resizeMode: 'contain',
    tintColor: myColors.primaryT,

  },
  imageGo: {
    height: myHeight(1.72),
    paddingHorizontal: myWidth(1.86),
    resizeMode: 'contain',
    tintColor: myColors.background,
  },
});
