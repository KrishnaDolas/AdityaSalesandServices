import { Dimensions, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import Carousel from 'react-native-reanimated-carousel'

export default function Slider() {
    const [pagingEnabled, setPagingEnabled] = useState(true)
    const width = Dimensions.get('window').width
    
    const list = [
        {
            id: 1,
            title: 'First Item',
            image: require('../assets/images/slider1.png')
        },
        {
            id: 2,
            title: 'Second Item',
            image: require('../assets/images/slider2.png')
        },
        {
            id: 3,
            title: 'Third Item',
            image: require('../assets/images/slider3.png')
        },
    ]
  return (
    <View style={{ flex: 1}}>
        <Carousel
            width = {width}
            height = {width / 2}
            data = { list }
            autoPlay={true}
            pagingEnabled={pagingEnabled}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
                <View style={styles.CarouselItem}>
                    <Image style={styles.img} source={item.image} />
                </View>
            )}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    CarouselItem: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    img: {
        width: '100%',
        height: '100%'
    }
})