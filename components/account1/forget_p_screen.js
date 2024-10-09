import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  errorTime,
  ios,
  Loader,
  MyError,
  myHeight,
  myWidth,
  Spacer,
  StatusbarH,
} from '../common';
import {myFontSize, myFonts} from '../../ultils/myFonts';
import {myColors} from '../../ultils/myColors';
import {sendVerficationEmail} from '../functions/email';
import {verificationCode} from '../functions/functions';
import {FirebaseUser} from '../functions/firebase';
import {sendEmailAPI} from '../common/api';

export const ForgetPassword = ({navigation}) => {
  const [email, setEmail] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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

  function verifyEmail() {
    if (email) {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(email)) {
        return true;
      }
      showError('Please Enter a Valid Email');
      return false;
    }
    showError('Please Enter a Email');
  }

  function goToVerifiy(profile) {
    const code = verificationCode();
    sendVerficationEmail(profile, code)
      .then(success => {
        setIsLoading(false);
        goToVerification(profile, code);
      })
      .catch(err => {
        showError('Something wrong');
        console.log('Internal error while sending an Email', err);
      });
  }
  function goToVerification(profile, code, token) {
    console.log(profile);
    navigation.replace('Verification', {code, profile, token, reset: true});
  }

  function onSubmit() {
    if (verifyEmail()) {
      setIsLoading(true);

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
        },
        body: JSON.stringify({email}), // Convert the data to JSON string
      };

      fetch(sendEmailAPI, options)
        .then(response => response.json())
        .then(data => {
          // Work with the JSON data
          const {code, body, message} = data;
          setIsLoading(false);

          if (code == 1) {
            const {code, token} = body;
            goToVerification(body.user, code, token);
          } else {
            showError(message);
          }
        })
        .catch(error => {
          // Handle any errors that occurred during the fetch
          setIsLoading(false);

          console.error('Fetch error:', error);
        });
      // FirebaseUser.where('email', '==', email).get()
      //     .then(result => {
      //         if (result.empty) {
      //             showError('User not exists with this email')
      //             console.log('User not exists with this email')
      //         }
      //         else {
      //             result.forEach(documentSnapshot => {
      //                 goToVerifiy(documentSnapshot.data())

      //             });

      //         }
      //     })
      //     .catch(err => {
      //         showError('Something wrong')
      //         console.log(err)
      //     })
    }
  }

  return (
    <>
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1}}
        style={styles.container}>
        <StatusbarH />
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View style={{paddingHorizontal: myWidth(6.4)}}>
            <Spacer paddingT={myHeight(5)} />

            {/* T ForgetPass */}
            <Text style={styles.textForget}>Forget Password</Text>
            <Text style={[styles.textLight, {fontSize: myFontSize.body3}]}>
              Enter your registered email below
            </Text>

            <Spacer paddingT={myHeight(6.9)} />
            {/* Email Portion */}
            <View>
              <Text style={[styles.heading]}>Email address</Text>
              <View style={styles.containerInput}>
                <TextInput
                  placeholder="Eg email@foodapp.com"
                  placeholderTextColor={myColors.offColor}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  cursorColor={myColors.primary}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <Spacer paddingT={myHeight(1.9)} />
            {/* T Remember Pass */}
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.textLight2}>Remember the password?</Text>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                activeOpacity={0.6}>
                <Text style={styles.textSign}> Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            {/* Button Submit */}
            <TouchableOpacity
              onPress={onSubmit}
              activeOpacity={0.8}
              style={styles.button}>
              <Text style={styles.textReg}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
      {isLoading && <Loader />}
      {errorMessage && <MyError message={errorMessage} />}
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    paddingStart: myWidth(0.5),
    paddingVertical: myHeight(0.8),
    fontFamily: myFonts.bodyBold,
    fontSize: myFontSize.body,
    color: myColors.text,
  },
  container: {
    flex: 1,
    backgroundColor: myColors.background,
    paddingVertical: myHeight(8.6),
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: myWidth(2.5),
    paddingHorizontal: myWidth(2),
    borderWidth: myHeight(0.12),
    borderColor: myColors.textL4,
    backgroundColor: myColors.background,
  },

  input: {
    flex: 1,
    textAlignVertical: 'center',
    paddingVertical: ios
      ? myHeight(1)
      : myHeight(100) > 600
      ? myHeight(0.8)
      : myHeight(0.2),
    fontSize: myFontSize.body,
    color: myColors.text,
    includeFontPadding: false,
    fontFamily: myFonts.bodyBold,
  },
  textForget: {
    fontFamily: myFonts.heading,
    fontSize: myFontSize.large,
    color: myColors.text,
    paddingVertical: myHeight(0.6),
  },
  textLight: {
    fontFamily: myFonts.bodyBold,
    color: myColors.offColor,
    fontSize: myFontSize.body,
  },
  textLight2: {
    fontFamily: myFonts.bodyBold,
    color: myColors.offColor,
    fontSize: myFontSize.body,
    paddingStart: myWidth(0.8),
  },
  textSign: {
    fontFamily: myFonts.heading,
    color: myColors.primary,
    fontSize: myFontSize.body,
  },
  textReg: {
    color: myColors.background,
    fontFamily: myFonts.headingBold,
    fontSize: myFontSize.body,
  },
  button: {
    height: myHeight(6.1),
    width: myWidth(86),
    borderRadius: myHeight(1.47),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: myColors.primary,
  },
});

const styles2 = verifyPass =>
  StyleSheet.create({
    textReg: {
      color: verifyPass ? myColors.background : myColors.offColor,
      fontFamily: myFonts.headingBold,
      fontSize: myFontSize.body,
    },
    button: {
      height: myHeight(6.1),
      width: myWidth(86),
      borderRadius: myHeight(1.47),
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      backgroundColor: verifyPass ? myColors.primary : myColors.offColor3,
    },
  });
