import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  StatusBar,
  TextInput,
  Linking,
  Platform,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {MyError, Spacer, StatusbarH, ios, myHeight, myWidth} from '../common';
import {myColors} from '../../ultils/myColors';
import {myFontSize, myFonts, myLetSpacing} from '../../ultils/myFonts';
import {Restaurants} from './home_data';
import {DriverInfoFull} from './home.component/driver_info_full';
import Lottie from 'lottie-react-native';
import {Filter} from './home.component/filter';
import {useDispatch, useSelector} from 'react-redux';
import {ItemInfo} from './home.component/item_info';
import {FlashList} from '@shopify/flash-list';
import database from '@react-native-firebase/database';
import {sendPushNotification} from '../functions/firebase';
import {setErrorAlert} from '../../redux/error_reducer';
import storeRedux from '../../redux/store_redux';
import {containString} from '../functions/functions';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator} from 'react-native';
import {searchVehicles} from '../common/api';
import {RestaurantInfoSkeleton} from '../common/skeletons';

const CommonFaci = ({name, fac, setFAc}) => {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: myWidth(5),
        paddingVertical: myHeight(0.55),
        borderRadius: myWidth(200),
        backgroundColor: fac ? myColors.primaryT : myColors.background,
        borderWidth: myHeight(0.1),
        borderColor: myColors.primaryL2,
        flexDirection: 'row',
        alignItems: 'center',
        marginEnd: myWidth(3),
      }}
      activeOpacity={0.75}
      onPress={() => {
        setFAc(!fac);
      }}>
      <Text
        style={[
          styles.textCommon,
          {
            fontFamily: myFonts.bodyBold,
            fontSize: myFontSize.body2,
            color: fac ? myColors.background : myColors.textL0,
          },
        ]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
  return (
    <TouchableOpacity
      style={{flexDirection: 'row', alignItems: 'center'}}
      activeOpacity={0.75}
      onPress={() => {
        setFAc(!fac);
      }}>
      <View
        style={{
          height: myHeight(3.5),
          width: myHeight(3.5),
          paddingTop: myHeight(0.75),
        }}>
        <View
          style={{
            width: myHeight(2.1),
            height: myHeight(2.1),
            borderWidth: 1.5,
            borderColor: myColors.textL4,
          }}
        />
        {fac && (
          <Image
            style={{
              height: myHeight(3.3),
              width: myHeight(3.3),
              resizeMode: 'contain',
              tintColor: myColors.primaryT,
              marginTop: -myHeight(3.1),
            }}
            source={require('../assets/home_main/home/check2.png')}
          />
        )}
      </View>
      <Spacer paddingEnd={myWidth(0)} />
      <Text
        style={[
          styles.textCommon,
          {
            fontFamily: myFonts.bodyBold,
            fontSize: myFontSize.body4,
          },
        ]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export const Search = ({navigation, route}) => {
  //   const {
  //     AllDrivers,
  //     insideUniDrivers,
  //     onlineDrivers,
  //     recommendedDrivers,
  //     eventDrivers,
  //   } = useSelector(state => state.data);
  const {allRequest} = useSelector(State => State.orders);

  const [request, setRequest] = useState(null);

  const [search, setSearch] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const [filterModal, setFilterModal] = useState(null);
  const [topRated, setTopRated] = useState(false);
  const [ac, setAc] = useState(false);
  const [wifi, setWifi] = useState(false);

  const [allItems, setAllItems] = useState([]);
  const [filterItems, setFilterItems] = useState([]);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isFirst, setIsFirst] = useState(true);

  const dispatch = useDispatch();
  const requestId = route.params.requestId;
  const name = route.params.name;
  const code = route.params.code;
  const searchTimer = useRef(null);
  const scrollRef = useRef(null);

  async function fetchMoreVehicles() {
    console.log('aayya', isFirst);
    if (loading || !hasMore || isFirst) return;

    setLoading(true);
    const newVehicles = await fetchVehicles(page, false);

    if (newVehicles.length > 0) {
      setFilterItems([...filterItems, ...newVehicles]);
      setPage(prevPage => prevPage + 1);
    } else {
      setHasMore(false);
    }
  }
  function scrollToTop() {
    scrollRef?.current?.scrollToOffset({animated: false, offset: 0});
  }
  function scrollToEnd() {
    scrollRef?.current?.scrollToEnd({animated: false});
  }
  const Loader = () => (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <>
        <RestaurantInfoSkeleton isFull={true} />
        <RestaurantInfoSkeleton isFull={true} />
        <RestaurantInfoSkeleton isFull={true} />
      </>
    </View>
  );
  const handleSearch = () => {
    if (!isFirst) {
      clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => {
        fetchNow();
      }, 500);
    }
  };

  useEffect(() => {
    if (!isFirst) {
      handleSearch();
    }
  }, [search]);
  useEffect(() => {
    if (!isFirst) {
      fetchNow();
    }
  }, [topRated, wifi, ac]);

  useEffect(() => {
    setTimeout(() => {
      setIsFirst(false);
    }, 1000);
    fetchNow();
    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, []);
  //   useEffect(() => {
  //     console.log('66666');

  //     if (allRequest.length && requestId) {
  //       setRequest(allRequest.find(it => it.id == requestId));
  //     }
  //   }, [allRequest]);

  //   useEffect(() => {
  //     if (request) {
  //       const simple = [];
  //       const jugaar = [];

  //       AllDrivers.map((driver, i) => {
  //         let includeDays = true;
  //         let includePackage = true;
  //         const alreadySend = request.sendDrivers
  //           ? request.sendDrivers.findIndex(it => it.did == driver.uid) != -1
  //           : false;
  //         request.selectedDays.map(it2 => {
  //           if (
  //             includeDays &&
  //             driver.dailyDays.findIndex(it => it == it2) == -1
  //           ) {
  //             includeDays = false;
  //           }
  //         });
  //         includePackage =
  //           driver.packages.findIndex(it => it == request.packages) != -1;
  //         console.log('sage', !alreadySend, includeDays, includePackage);

  //         if (!alreadySend && includeDays && includePackage) {
  //           if (
  //             driver.allRoutes.findIndex(it => it.id == request.pickup.id) !=
  //               -1 &&
  //             driver.allRoutes.findIndex(it => it.id == request.dropoff.id) != -1
  //           ) {
  //             simple.push(driver);
  //           } else {
  //             jugaar.push(driver);
  //           }
  //         }

  //         setAllItems([...simple, ...jugaar]);
  //       });
  //     }
  //   }, [request]);

  const onSend = driver => {
    // return
    const driverDetail = {
      status: 1,
      did: driver.uid,
      name: driver.name,
      vehicleName: driver.vehicleName,
      contact: driver.contact,
      unread: true,
    };
    const sendDrivers = request.sendDrivers
      ? [...request.sendDrivers, {did: driver.uid}]
      : [{did: driver.uid}];
    const status = request.status == 1 ? 2 : request.status;
    const newUpdate = {status, sendDrivers};
    newUpdate[driver.uid] = driverDetail;
    // return
    database()
      .ref(`/requests/${request.uid}/${request.id}`)
      .update(newUpdate)
      .then(() => {
        storeRedux.dispatch(
          setErrorAlert({
            Title: `Request Sent to ${driver.name} Successfully`,
            Status: 2,
          }),
        );
        firestore()
          .collection('drivers')
          .doc(driver.uid)
          .get()
          .then(data => {
            const captain = data.data();
            const token = captain.deviceToken;
            console.log('Successfully');
            const navigate = {screen: 'RIDES', params: {index: 1}};

            sendPushNotification(
              'New Request',
              `You have a ride request from ${request.name}`,
              2,
              [token],
              navigate,
            );
          })
          .catch(err => {
            console.log(err);
          });
        // database()
        //     .ref(`/requests/${driver.uid}/${request.id}`)
        //     .update({ ...request, ...newUpdate, unread: true }).then(() => {

        //     }).catch((err) => {

        //         console.log('error on send request', err)
        //     })
      })
      .catch(err => {
        console.log('error on send request', err);
      });
  };
  function onGoToItem(item) {
    // const req= AllRest.filter(res => res.uid == item.resId)[0]
    // console.log(restaurant)
    // navigation.navigate('ItemDetails', { item, restaurant })
  }

  async function fetchNow() {
    setPage(1);
    scrollToTop();
    setHasMore(true);
    // setListLoading(true);
    const newVehicles = await fetchVehicles(1, true);

    setFilterItems(newVehicles);
  }

  useEffect(() => {
    return;
    if (allItems.length) {
      const newR = allItems?.filter(
        item =>
          (ac ? item.ac : true) &&
          (wifi ? item.isWifi : true) &&
          (search ? containString(item.vehicleName, search) : true),
      );

      if (topRated) {
        setFilterItems(
          newR.sort(function (a, b) {
            return b.rating - a.rating;
          }),
        );
      } else {
        setFilterItems(newR);
      }
    } else {
      setFilterItems([]);
    }
  }, [topRated, wifi, ac]);

  const fetchVehicles = async (page, isList) => {
    const url = `${searchVehicles}?page=${page}&categoryId=${code}&isWifi=${
      wifi ? wifi : null
    }&topRated=${topRated ? topRated : null}&ac=${ac ? ac : null}&search=${
      search && search != '' ? search : null
    }`;
    // if (url == lastFetch) {
    //   console.log('saveeeee');
    //   return filterItems;
    // }
    // console.log(lastFetch, url);
    // if (isList) {
    //   setListLoading(true);
    // } else {
    //   setLoading(true);
    // }

    // setLastFetch(url);
    return new Promise(function (resolve, reject) {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          // Work with the JSON data
          const {code, body, message} = data;
          setLoading(false);
          setListLoading(false);
          if (code == 1) {
            const {vehicles} = body;
            resolve(vehicles);
            // storeRedux.dispatch(setAreasLocation(locations));
          } else {
            resolve([]);

            dispatch(setErrorAlert({Title: message, Status: 0}));
          }
        })
        .catch(error => {
          // Handle any errors that occurred during the fetch
          resolve([]);
          setLoading(false);
          setListLoading(false);

          console.error('Fetch error:', error);
        });
    });
  };
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: myColors.background,
        }}>
        <StatusbarH />
        <Spacer paddingT={myHeight(1)} />

        {/* Top */}
        {/* Search */}
        <View
          style={{
            paddingHorizontal: myWidth(4),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={{
              backgroundColor: myColors.primaryT,
              height: myHeight(3.3),
              width: myHeight(3.3),
              borderRadius: myHeight(3),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                height: myHeight(1.6),
                width: myHeight(1.6),
                resizeMode: 'contain',
              }}
              source={require('../assets/startup/goL.png')}
            />
          </TouchableOpacity>
          <Spacer paddingEnd={myWidth(3)} />

          <Text
            style={[
              styles.textCommon,
              {
                fontFamily: myFonts.bodyBold,
                fontSize: myFontSize.xBody2,
              },
            ]}>
            {name}
          </Text>
        </View>
        <Spacer paddingT={myHeight(1.2)} />

        <View
          style={{
            paddingHorizontal: myWidth(4),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {/* Search */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: myWidth(4),
              borderRadius: myWidth(20.5),
              backgroundColor: myColors.offColor7,
              // marginHorizontal: myWidth(4)
            }}>
            {/* Arrow */}
            {/* <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={{}}>
                            <Image style={{
                                height: myHeight(2.3),
                                width: myHeight(2.3),
                                resizeMode: 'contain',
                                tintColor: myColors.textL0
                            }} source={require('../assets/home_main/home/back.png')} />
                        </TouchableOpacity>
                        <Spacer paddingEnd={myWidth(2.5)} /> */}
            <TextInput
              placeholder=" Search"
              placeholderTextColor={myColors.textL5}
              autoCorrect={false}
              selectionColor={myColors.primaryT}
              style={{
                flex: 1,
                textAlignVertical: 'center',
                paddingVertical: ios
                  ? myHeight(0.6)
                  : myHeight(100) > 600
                  ? myHeight(0.5)
                  : myHeight(0.1),
                fontSize: myFontSize.xxSmall,
                color: myColors.text,
                includeFontPadding: false,
                fontFamily: myFonts.bodyBold,
              }}
              cursorColor={myColors.primaryT}
              value={search}
              onChangeText={setSearch}
              // value={search} onChangeText={(val) => null}
            />
          </View>
          {/* <Spacer paddingEnd={myWidth(3)} />
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setFilterModal(true)} style={{}}>
                        <Image style={{
                            height: myHeight(4.2),
                            width: myHeight(4.2),
                            resizeMode: 'contain',
                            tintColor: myColors.textL0
                        }} source={require('../assets/home_main/home/filter.png')} />
                    </TouchableOpacity> */}
        </View>
        <Spacer paddingT={myHeight(1.5)} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{}}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: myWidth(4),
            marginVertical: myHeight(0.3),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CommonFaci
              name={'Top Rated'}
              fac={topRated}
              setFAc={setTopRated}
            />
            <CommonFaci name={'With AC'} fac={ac} setFAc={setAc} />
            <CommonFaci name={'With Wifi'} fac={wifi} setFAc={setWifi} />
          </View>
        </ScrollView>

        <Spacer paddingT={myHeight(1.2)} />

        {/* Icon Empty Or Content */}
        <View
          style={{
            height: myHeight(0.3),
            marginHorizontal: myWidth(4),
            backgroundColor: myColors.divider,
          }}
        />
        {/* <Loader/> */}
        <View style={{flex: 4000}}>
          {listLoading ? (
            <Loader />
          ) : (
            <>
              {console.log(filterItems.length)}
              {filterItems.length ? (
                <FlashList
                  ref={scrollRef}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={true}
                  data={filterItems}
                  extraData={[request]}
                  // extraData={[ac, wifi, topRated, search]}
                  // contentContainerStyle={{ flexGrow: 1 }}
                  // ItemSeparatorComponent={() =>
                  //     <View style={{ borderTopWidth: myHeight(0.08), borderColor: myColors.offColor, width: "100%" }} />
                  // }
                  keyExtractor={(item, index) => item.id + index}
                  estimatedItemSize={myHeight(10)}
                  onEndReached={fetchMoreVehicles}
                  onEndReachedThreshold={0.1}
                  ListFooterComponent={
                    <View style={{height: myHeight(6.5)}}>
                      {loading && <ActivityIndicator size="large" />}
                    </View>
                  }
                  //   renderFooter={renderFooter}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.85}
                        onPress={() =>
                          navigation.navigate('DriverDetail', {
                            driver: item,
                            request,
                          })
                        }>
                        <DriverInfoFull
                          onSend={onSend}
                          driver={item}
                          request={request}
                          code={code}
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : (
                <View
                  style={{
                    flex: 0.8,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      styles.textCommon,
                      {
                        fontFamily: myFonts.bodyBold,
                        fontSize: myFontSize.body4,
                      },
                    ]}>
                    No Vehicles Available
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </SafeAreaView>

      {filterModal && <Filter setModal={setFilterModal} />}
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
});
