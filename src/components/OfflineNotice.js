'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
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

function MiniOfflineSign() {
   return (
      <View style={styles.offlineContainer}>
         <Text style={styles.offlineText}>لا يوجد اتصال بالانترنت</Text>
      </View>
   );
}

class OfflineNotice extends Component {
   state = {
      isConnected: true
   };
   handleConnectivityChange( isConnected)  {
      if (isConnected) {
         this.setState({ isConnected });
      } else {
         this.setState({ isConnected });
      }
   }
   componentDidMount() {
      NetInfo.addEventListener(state => {
         this.handleConnectivityChange(state.isConnected)
       });
   }

   componentWillUnmount() {
      // NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange());
   }

   

   render() {
      if (!this.state.isConnected) {
         return <MiniOfflineSign />;
      }
      return null;
   }
}

const styles = StyleSheet.create({
   offlineContainer: {
      backgroundColor: '#b52424',
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width,
   
   },
   offlineText: { color: '#fff' ,fontFamily:Constants.fontFamilyBlack}
});

export default OfflineNotice;