import React, { useEffect, useRef, useState } from 'react';
import { View, Image } from 'react-native';

import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { myColors } from '../../ultils/myColors';
import FastImage from 'react-native-fast-image';


export const ImageUri = ({
    width = 0,
    height = 0,
    resizeMode = 'contain',
    uri = null,
    borderRadius = 0,
    defaultUri = null,
    useFastImage = true,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [myImage, setMyImage] = useState(uri);

    const mode =
        resizeMode == 'contain'
            ? FastImage.resizeMode.contain
            : FastImage.resizeMode.cover;

    useEffect(() => {
        if (isStart && !isEnd) {
            setIsLoading(true);
        }
    }, [isStart]);
    return (
        <View style={{
            // backgroundColor: myColors.offColor5,
            width, height, borderRadius, overflow: 'hidden'
        }}>
            {
                useFastImage ?
                    <FastImage
                        onLoadStart={() => {
                            setTimeout(() => {
                                setIsStart(true);
                            }, 50);
                        }}
                        onError={err => {
                            console.log('error on image load');
                            if (defaultUri) {
                                setMyImage(defaultUri);
                            }
                            setIsLoading(false);
                            setIsEnd(true);
                        }}
                        onLoadEnd={() => {
                            setIsLoading(false);
                            setIsEnd(true);
                        }}
                        style={{ width, height, resizeMode }}
                        source={{
                            uri: myImage,
                            priority: FastImage.priority.normal,
                            cache: FastImage.cacheControl.immutable,
                        }}
                        resizeMode={mode}
                    />
                    :
                    <Image
                        onLoadStart={() => {
                            setTimeout(() => {

                                setIsStart(true)

                            }, 50)
                        }}
                        onError={err => {
                            console.log('error on image load');
                            if (defaultUri) {
                                setMyImage(defaultUri);
                            }
                            setIsLoading(false);
                            setIsEnd(true);
                        }}
                        onLoadEnd={() => {
                            setIsLoading(false)
                            setIsEnd(true)
                        }}
                        style={{ width, height, resizeMode }} source={{ uri: uri }} />


            }

            {isLoading && (
                <View style={{ position: 'absolute', width, height, top: 0 }}>
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item
                            width={width}
                            height={height}
                            borderRadius={0}
                        />
                    </SkeletonPlaceholder>
                </View>
            )}
        </View>
    );
};