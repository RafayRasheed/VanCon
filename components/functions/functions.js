import { Base64 } from 'js-base64';
import storeRedux from '../../redux/store_redux';
import { setCurrentLocation, setNearestLocation } from '../../redux/location_reducer';
import Geolocation from '@react-native-community/geolocation';
import { setErrorAlert } from '../../redux/error_reducer';
import { getDistance } from 'geolib';
import { FirebaseLocation, FirebaseUser } from './firebase';
import firestore from '@react-native-firebase/firestore';

import { setAreasLocation } from '../../redux/areas_reducer';
import { setAllDriver, setEventDrivers, setInsideUniDrivers, setRecommendedDrivers } from '../../redux/data_reducer';
import { setProfile } from '../../redux/profile_reducer';
export function verificationCode() {
  return Math.floor(Math.random() * 899999 + 100000);
}


export function encodeInfo(info) {
  return Base64.encode(info);
}

export function deccodeInfo(encode) {
  return Base64.decode(encode);
}

function adjustSting(string, size) {
  const len = string.length
  let myStr = ''
  for (let i = 0; i < size - len; i++) {
    myStr += '0'
  }
  return (myStr + string)

}


export function dataFullData() {
  const date = new Date()

  const year = adjustSting(date.getUTCFullYear().toString(), 2)
  const month = adjustSting((date.getUTCMonth() + 1).toString(), 2)
  const day = adjustSting(date.getUTCDate().toString(), 2)
  const hours = adjustSting(date.getUTCHours().toString(), 2)
  const minutes = adjustSting(date.getUTCMinutes().toString(), 2)
  const seconds = adjustSting(date.getUTCSeconds().toString(), 2)
  const mili = adjustSting(date.getUTCMilliseconds().toString(), 3)
  const extra = verificationCode().toString().slice(0, 1)
  const code = year + month + day + hours + minutes + seconds + mili + extra
  const smallCode = hours + minutes + seconds + mili + verificationCode().toString().slice(0, 2)

  const hoursN = adjustSting(date.getHours().toString(), 2)
  const minutesN = adjustSting(date.getMinutes().toString(), 2)
  const dateData = {
    date: day + '-' + month + '-' + year,
    time: hoursN + ":" + minutesN,
    dateInt: parseInt(code),
    actualDate: date,
    smallCode,
  }
  return (dateData)


}

export function statusDate(YDate, time) {
  const today = new Date()
  const todayDate = today.toLocaleDateString()
  const yesterday = new Date(today - 86400000);
  var yesterdayDate = yesterday.toLocaleDateString()
  if (todayDate == YDate) {
    return (time ? time : 'Today')

  } else if (yesterdayDate == YDate) {
    return ('Yesterday')

  } else {

    return (YDate)
  }
}
export function getDistanceFromRes(from, to, extra) {
  try {
    let dis = getDistance(from, to, 1)
    if (extra) {
      dis = dis * 1.44
    }
    let d = dis
    // alert(d)
    // alert(typeof d == 'NaN')
    if (d >= 1000) {
      d = Math.round(d / 1000) + ' KM'

    }
    else if (d < 1000) {
      d = Math.round(d) + ' M'
    }
    else {
      d = 0 + ' KM'
    }
    // alert(d)
    return ({ distance: dis, string: d })
  }
  catch (error) {
  }
}
export function updateAndNewLocation(coords) {
  // coords = { latitude: 24.7691021, longitude: 67.072842 }

  const { areas } = storeRedux.getState().areas
  const { profile } = storeRedux.getState().profile

  let minArea = null
  areas.map((it, i) => {
    const { latitude, longitude } = it
    const from = coords
    const to = { latitude, longitude }
    const { distance } = getDistanceFromRes(from, to)

    if (minArea == null || distance < minArea.distance) {
      minArea = { ...it, distance }
    }
  })
  console.log('minDistance: ', minArea)
  if (minArea && minArea.distance < 3000) {

    storeRedux.dispatch(setNearestLocation(minArea))
  }

  return
  if (profile.city && minArea && minArea.distance > 1300) {
    // if (true) {


    const { latitude, longitude } = coords
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    fetch(apiUrl, {
      headers: {
        'Accept-Language': 'en',
      },
    })
      .then(response => response.json())
      .then(data => {

        // Handle the response data
        const { display_name } = data
        const myArray = display_name.split(',')
        const modifiedArray = myArray.slice(0, myArray.length - 3);
        const name = modifiedArray.join(',');

        if (!display_name.includes(profile.city)) {

          return
        }
        const { dateInt } = dataFullData()
        const id = dateInt.toString() + verificationCode().toString()
        const detail = {}
        detail[id] = ({ id, name, latitude, longitude });

        storeRedux.dispatch(setAreasLocation({ id, name, latitude, longitude }))
        firestore().collection('locations').doc(profile.city).update(detail)
          .then(() => {
            getAreasLocations()
            console.log('New Location Update', detail)
          }).catch(err => { console.log('update location error', err) })
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

}
export function getCurrentLocations() {
  Geolocation.getCurrentPosition(info => {
    if (info) {
      const { coords } = info
      const { latitude, longitude } = coords
      const detail = { latitude, longitude };
      storeRedux.dispatch(setCurrentLocation(detail))
      updateAndNewLocation(detail)

    } else {
      console.log('info', 2)

    }
  }, (err) => { console.log(err) });
}
export const SetErrorAlertToFunction = ({ Title, Body, Status }) => {
  storeRedux.dispatch(setErrorAlert({ Title, Body, Status }))

}
export const getAreasLocations = () => {
  const { profile } = storeRedux.getState().profile

  firestore().collection('locations').doc(profile.city).get().then((result) => {
    if (result.exists) {

      const areas = result.data()
      let AllAreas = []
      for (const [key, value] of Object.entries(areas)) {
        AllAreas.push(value)
      }

      storeRedux.dispatch(setAreasLocation(AllAreas.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      })))
      getCurrentLocations()

    }

  }).catch((ERR) => {
    console.log('ERROR ON getAreasLocations', ERR)
  })


}

export function getProfileFromFirebase() {
  const { profile } = storeRedux.getState().profile

  FirebaseUser.doc(profile.uid).get().then((documentSnapshot) => {
    const prf = documentSnapshot.data()
    storeRedux.dispatch(setProfile(prf))
    console.log('Profile Update')


  }).catch(err => {
    console.log('Internal error while  getProfileFrom', err)
  });
}
export function containString(contain, thiss) {
  return (contain.toLowerCase().includes(thiss.toLowerCase()))
}

export function updateProfileToFirebase(object) {
  const { profile } = storeRedux.getState().profile

  FirebaseUser.doc(profile.uid).update(object).then((documentSnapshot) => {

    getProfileFromFirebase()
    storeRedux.dispatch(setProfile({ ...profile, ...object }))

    console.log('Profile Updated', object)


  }).catch(err => {
    storeRedux.dispatch(setProfile({ ...profile }))

    console.log('Internal error while  updateProfileToFirebase', err)
  });
}
export function getAllRestuarant(profile) {

  firestore().collection('drivers')
    .where('ready', '==', true)
    .where('city', '==', profile.city)
    .get().then((result) => {
      if (!result.empty) {
        let drivers = []
        let eventDrivers = []
        let insideUniDrivers = []
        let recomended = []

        result.forEach((res, i) => {
          const driver = res.data()
          drivers.push(driver)

          if (driver.isOneRide) {
            eventDrivers.push(driver)
          }
          if (driver.isInsideUni) {
            insideUniDrivers.push(driver)

          }
          if (driver.rating >= 4.5) {
            recomended.push(driver)
          }

        })
        console.log('drivers', drivers.length)

        const sortByWeightedRating = (a, b) => {
          // Calculate weighted rating (rating * numRatings)
          const weightedRatingA = a.rating * a.noOfRatings;
          const weightedRatingB = b.rating * b.noOfRatings;

          // Sort by weighted rating
          return weightedRatingB - weightedRatingA; // Sort by descending weighted rating
        };
        const randomSort = () => Math.random() - 0.5;

        // Randomly sort the array
        // storeRedux.dispatch(setRecommendedDrivers(recomended.sort(function (a, b) { return b.rating - a.rating })))
        storeRedux.dispatch(setRecommendedDrivers(recomended.sort(sortByWeightedRating)))
        storeRedux.dispatch(setEventDrivers(eventDrivers.sort(randomSort)))
        storeRedux.dispatch(setInsideUniDrivers(insideUniDrivers.sort(randomSort)))

        storeRedux.dispatch(setAllDriver(drivers))

      }
      else {

        console.log('empty')


        // setCategories(catArray)
      }
    }).catch((er) => {
      // Alert.alert(er.toString())

      console.log('Error on Get all Restaurant', er)
    })
}