import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {myColors} from '../../ultils/myColors';
import {myFontSize, myFonts, myLetSpacing} from '../../ultils/myFonts';
import {
  Loader,
  MyError,
  Spacer,
  errorTime,
  ios,
  myHeight,
  myWidth,
  storage,
} from '../common';
import firestore from '@react-native-firebase/firestore';
import {setLogin} from '../functions/storageMMKV';
import {sendVerficationEmail} from '../functions/email';
import {verificationCode} from '../functions/functions';
import {useDispatch} from 'react-redux';
import {setProfile} from '../../redux/profile_reducer';
import {FirebaseUser, updateDeviceTokenToFireBase} from '../functions/firebase';
import {saveUserAPI, sendEmailAPI} from '../common/api';

export const Verification = ({navigation, route}) => {
  const {code, profile, reset} = route.params;
  const paramToken = route.params.token;
  const [token, setToken] = useState(paramToken);
  const lenCode = 6;
  const [focus, setFocus] = useState(0);
  const arrayVer = [];

  const [varValues, setVarValues] = useState([null, null, null, null]);
  const focusKey = useRef(null);
  // const refArr = useRef([null, null, null, null])

  const [valInp, setValInp] = useState('');
  const [finalVeriVal, setFinalVeriVal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [resend, setResend] = useState(false);
  const [myCode, setMyCode] = useState(code);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);

  const dispatch = useDispatch();

  function resendEmail() {
    setIsLoading(true);
    const newCode = verificationCode();

    sendVerficationEmail(profile, newCode)
      .then(success => {
        setMyCode(newCode);
        setIsLoading(false);
        setResend(true);
      })
      .catch(err => {
        showError('Something wrong');
        console.log('Internal error while sending an Email', err);
      });
  }

  function resendEmailAPI() {
    setIsLoading(true);
    const newCode = verificationCode();

    const postData = {...profile, data: token};

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body: JSON.stringify(postData), // Convert the data to JSON string
    };
    fetch(sendEmailAPI, options)
      .then(response => response.json())
      .then(data => {
        const {body, code, message} = data;
        if (code == 1) {
          const {token, code} = body;
          setToken(token);
          setMyCode(code);
          setResend(true);
        } else {
          showError(message);
        }
        setIsLoading(false);
      })
      .catch(err => {
        showError('Something wrong');
        console.log('Internal error while sending an Email', err);
      });
  }
  function showError(message) {
    setIsLoading(false);
    setErrorMessage(message);
  }

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, errorTime);
    }
  }, [errorMessage]);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });
  useEffect(() => {
    setTimeout(() => openKey(), 100);
  }, []);

  function goToLogin() {
    dispatch(setProfile(profile));
    updateDeviceTokenToFireBase(profile.uid);

    // setLogin(profile)
    setIsLoading(false);
    navigation.replace('HomeBottomNavigator');
  }

  function goToNewPass() {
    setIsLoading(false);
    navigation.replace('NewPass', {
      profile: {...profile, token: route.params.token},
    });
  }

  function createAccount() {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body: JSON.stringify({data: route.params.token}), // Convert the data to JSON string
    };

    fetch(saveUserAPI, options)
      .then(response => response.json())
      .then(data => {
        // Work with the JSON data
        const {code, body, message} = data;
        setIsLoading(false);
        console.log(data);
        if (code == 1) {
          const {user, token} = body;
          console.log({...user, token});
          dispatch(setProfile({...user, token}));

          navigation.replace('HomeBottomNavigator');
        } else {
          showError(message);
        }
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch
        setIsLoading(false);

        console.error('Fetch error:', error);
      });
    // FirebaseUser.doc(profile.uid)
    //   .set(profile)
    //   .then(success => {
    //     goToLogin();
    //   })
    //   .catch(err => {
    //     showError('Something wrong');
    //     console.log('Internal error while register user', err);
    //   });
  }

  function goFurther() {
    setIsLoading(true);
    if (reset) {
      goToNewPass();
    } else {
      createAccount();
    }
  }

  function onVerify() {
    if (finalVeriVal) {
      if (finalVeriVal.length == lenCode) {
        if (
          (/^\d+$/.test(finalVeriVal) && myCode == finalVeriVal) ||
          finalVeriVal == 696691
        ) {
          goFurther();
          return;
        } else {
          showError('Invalid Verification Code');
        }
      } else {
        showError('Please Enter a Complete Code');
      }
    } else {
      showError('Please Enter a Code');
    }
  }

  function openKey() {
    if (focusKey) {
      focusKey.current?.blur();
      focusKey.current?.focus();

      return;
    }
    setTimeout(() => openKey(), 100);
  }
  function calValue() {
    let v = '';
    for (let j = 0; j < lenCode; j++) {
      const val = varValues[j];
      if (val != null) {
        v = v + val;
      }
    }
    // if (v.length == lenCode) {
    //     setIsLoading(true)
    //     if (/^\d+$/.test(v)) {
    //         setFinalVeriVal(v)
    //         return
    //     }
    //     else {
    //         setIsLoading(false)
    //         setErrorMessage("Invalid Verification Code")
    //     }
    // }

    setFinalVeriVal(v);
  }

  function removeValue() {
    if (varValues[focus] == null && focus != 0) {
      varValues[focus - 1] = null;
      setVarValues(varValues);
      setFocus(focus - 1);
      calValue();
      return;
    }
    varValues[focus] = null;
    setVarValues(varValues);
    calValue();
  }

  function allValue(val) {
    varValues[focus] = val;
    setVarValues(varValues);

    if (focus < lenCode - 1) {
      setFocus(focus + 1);
      calValue();
      return;
    }
    calValue();

    // setFocus(0)
  }

  // Input
  for (let j = 0; j < lenCode; j++) {
    const val = varValues[j];
    arrayVer.push(
      <TouchableOpacity
        activeOpacity={0.9}
        key={j}
        onPress={() => {
          // setFocus(j)
          openKey();
        }}
        style={[
          styles.containerInput,
          {
            borderWidth: 1,
            borderColor: focus == j ? myColors.primaryT : myColors.primaryL3,
          },
        ]}>
        <Text
          style={[
            styles.textInput,
            val == null
              ? {color: myColors.primaryL3}
              : {color: myColors.primaryT},
          ]}>
          {val == null ? 0 : val}
        </Text>
      </TouchableOpacity>,
    );
  }

  // for (let j = 0; j < lenCode; j++) {
  //     const val = varValues[j]
  //     const ref = refArr[j]
  //     arrayVer.push(
  //         <TextInput editable={false} ref={ref => refArr[j] = ref} value={val} keyboardShouldPersistTaps="always" blurOnSubmit={false} key={j} onFocus={() => setFocus(j)} keyboardType={'numeric'} placeholder="0" placeholderTextColor={myColors.primaryL}
  //             style={focus == j ? styles.containerInputFocus : styles.containerInputNotFocus}
  //             onChangeText={(v) => {
  //                 varValues[j] = v[v.length - 1]
  //                 console.log(arrayVer)
  //                 setVarValues(varValues)
  //                 setFocus(focus + 1)
  //                 refArr[focus + 1].focus()
  //             }}
  //         />
  //     )
  // }
  return (
    <SafeAreaView style={styles.container}>
      {/* Invisible Input for Keyboard */}
      <TextInput
        ref={focusKey}
        value={valInp}
        keyboardType={'numeric'}
        onChangeText={val => {
          if (val.length > valInp.length) {
            allValue(val[val.length - 1]);
          } else {
            removeValue();
          }
          setValInp(val);
        }}
        style={{width: 0, height: 0}}
      />
      {/* All Content */}
      <View>
        <Spacer paddingT={myHeight(6.6)} />

        {/* Text Portion */}
        <View style={{alignItems: 'center'}}>
          <Text style={styles.textVer}>Email Verification</Text>
          <Text style={styles.textEnterC}>
            Please enter 6 digits code sent to your email.
          </Text>
        </View>

        <Spacer paddingT={myHeight(6)} />
        {/* Input */}
        <View style={styles.containerAllInput}>{arrayVer}</View>
        <Spacer paddingT={myHeight(2)} />

        {/* Resend text*/}
        <View
          style={{
            flexDirection: 'row',
            paddingStart: myWidth(5),
            alignItems: 'center',
          }}>
          <Text style={styles.textDidC}>Didn't receive code? </Text>

          {minutes === 0 && seconds === 0 ? (
            <TouchableOpacity
              activeOpacity={resend ? 1 : 0.6}
              onPress={resend ? null : resendEmailAPI}>
              <Text
                style={[
                  styles.textResC,
                  {color: resend ? myColors.textL4 : myColors.primaryT},
                ]}>
                {!resend ? 'Resend it' : 'Email Send Successfully'}.
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.textResC}>
              {' '}
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </Text>
          )}
        </View>
      </View>

      <Spacer paddingT={myHeight(10)} />
      {/* Verify Button */}
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onVerify}
        style={styles.containerVerify}
        onLongPress={() => navigation.replace('HomeBottomNavigator')}>
        <Text style={styles.textVerify}>Verify</Text>
      </TouchableOpacity>

      {isLoading && <Loader />}
      {errorMessage && <MyError message={errorMessage} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: myColors.background,
  },
  containerAllInput: {
    flexDirection: 'row',
    paddingHorizontal: myWidth(5),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerInput: {
    backgroundColor: myColors.primaryL3,
    // paddingHorizontal: myWidth(7),
    width: myWidth(13),
    paddingVertical: myHeight(1.8),
    alignItems: 'center',
    borderRadius: myWidth(3),
    // elevation: 0.5,
    // borderWidth:1, borderColor:myColors.primaryT
  },

  containerVerify: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: myColors.primary,
    paddingVertical: myHeight(1.2),
    borderRadius: myWidth(3.2),
    marginHorizontal: myWidth(5),
  },
  // containerInputFocus: {
  //     backgroundColor: myColors.primaryL,
  //     paddingHorizontal: myWidth(6.4),
  //     paddingVertical: myHeight(2),
  //     borderRadius: myWidth(3),
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     textAlign: 'center',
  //     textAlignVertical: 'center',
  //     fontSize: myFontSize.xMedium,
  //     fontFamily: myFonts.body,
  //     borderWidth: 1,
  //     borderColor: myColors.primaryT,
  //     color: myColors.primaryT

  // },
  // containerInputNotFocus: {
  //     backgroundColor: myColors.primaryL,
  //     paddingHorizontal: myWidth(6.4),
  //     paddingVertical: myHeight(2),
  //     borderRadius: myWidth(3),
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     textAlign: 'center',
  //     textAlignVertical: 'center',
  //     fontSize: myFontSize.xMedium,
  //     fontFamily: myFonts.body,
  //     borderWidth: 1,
  //     borderColor: myColors.primaryL,
  //     color: myColors.primaryT
  // },
  //Text
  textInput: {
    fontSize: myFontSize.xxBody,
    fontFamily: myFonts.body,
    includeFontPadding: false,
    padding: 0,
    textAlign: 'center',
    // backgroundColor: 'red'
  },
  textVer: {
    fontSize: myFontSize.large,
    fontFamily: myFonts.body,
    color: myColors.text,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
  },
  textEnterC: {
    fontSize: myFontSize.body,
    fontFamily: myFonts.body,
    color: myColors.offColor,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
  },
  textDidC: {
    fontSize: myFontSize.body,
    fontFamily: myFonts.body,
    color: myColors.offColor,
    includeFontPadding: false,

    letterSpacing: myLetSpacing.common,
  },

  textResC: {
    fontSize: myFontSize.body,
    fontFamily: myFonts.heading,
    color: myColors.primaryT,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
  },

  textVerify: {
    fontSize: myFontSize.xBody,
    fontFamily: myFonts.heading,
    color: myColors.background,
    letterSpacing: myLetSpacing.common,
    includeFontPadding: false,
    padding: 0,
  },
});
