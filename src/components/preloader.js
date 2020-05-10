'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import React, { Component } from 'react';
import { View, Text, Dimensions ,Platform} from 'react-native';
import {RippleLoader} from 'react-native-indicator';
import Constants from '../config/constants';
/**********************************************************************
*
*                               Variables
*
**********************************************************************/
const { width, height } = Dimensions.get('window');
/**********************************************************************
*
*                               Class
*
**********************************************************************/
class Preloader extends Component {
	state = {};

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	render() {
		return (
			<View style={{ position: 'absolute', top: Platform.OS === "ios" ? 64 : 56, right: 0, left: 0, bottom: 0, backgroundColor: 'rgba(125, 222, 157,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 33 }}>
				<RippleLoader color={"#fff"} size={80} strokeWidth={5} />
				<Text style={{fontFamily:Constants.fontFamilyBold,marginTop:20,color:'#fff',fontSize:18}}>جارى التحميل</Text>
			</View>
		)
	}
}
export default Preloader;