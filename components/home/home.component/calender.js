import { Image, Button, TouchableOpacity, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Spacer, ios, myHeight, myWidth } from "../../common"
import { myFontSize, myFonts, myLetSpacing } from "../../../ultils/myFonts"
import { myColors } from "../../../ultils/myColors"
// import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";
export const CalenderDate = ({ showVal, show, value, content = null, time = true, currDate = null, }) => {

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    const hideDatePicker = () => {
        show(false);
    };

    const handleConfirm = (date) => {
        // console.log(new Date().getHours())
        hideDatePicker();
        value(formatAMPM(date), date, content, showVal)
    };



    return (
        <TouchableOpacity onPress={() => show(false)} style={styles.container}>


            <DateTimePickerModal
                minimumDate={time ? null : new Date()}
                accentColor={myColors.primaryT}
                date={content?.current ? new Date(content.current) : new Date()}
                buttonTextColorIOS={myColors.primaryT}
                isVisible={true}
                modalStyleIOS={{ backgroundColor: '#00000030', margin: 0, marginBottom: ios ? myHeight(1) : 0, }}
                mode={time ? 'time' : 'date'}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}

            />
            {/* <RNDateTimePicker /> */}
            {/* <DateTimePickerModal
                isVisible={true}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            /> */}

            {/* <Calendar

                style={{
                    // borderWidth: 1,
                    // borderColor: 'gray',
                    // height: 350
                }}
                onPress={() => console.log('m')}
                current={selected}
                key={selected}
                // date='false'
                theme={{
                    arrowColor: myColors.textL3,
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: myColors.primaryT,
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: myColors.primary,
                    textDayStyle: {
                        includeFontPadding: false,
                        padding: 0
                    },
                    textDayFontSize: myFontSize.xxSmall,
                    textDayFontFamily: myFonts.body,
                    dayTextColor: '#2d4150',
                }}


                // Specify the current date
                // current={'2012-03-01'}
                // Callback that gets called when the user selects a day
                //  date={(day) => {
                //     console.log(day)
                // }}
                onDayPress={(day) => {
                    setSelected(day.dateString);
                }}

                markedDates={{
                    [selected]: { selected: true, disableTouchEvent: true, },
                    '2023-03-02': { marked: false },
                }}

            // Mark specific dates as marked

            /> */}
        </TouchableOpacity>
    );


}
const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: "100%",
        position: 'absolute',
        zIndex: 1,
        backgroundColor: '#00000030',
        alignItems: 'center',
        justifyContent: 'center',
    }
})
