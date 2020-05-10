'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import React, { Component } from 'react';
import { Text,TouchableOpacity,StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {  Footer } from "native-base";
import { withNavigation } from 'react-navigation';
import Constants from '../config/constants';
/**********************************************************************
*
*                               Class
*
**********************************************************************/
class FooterClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  
  renderColor(routeName){
      if(this.props.navigation.state.routeName  == routeName){
          return "#42c7b0"
      }else{
          return "#514e5e"
      }
  }
  render() {
    return (
        <Footer style={styles.footerContainer}>
            <TouchableOpacity style={styles.FooterLink} onPress={() => this.props.navigation.navigate('Home')} >
                <FontAwesome5 name="home" style={[styles.icon,{color:this.renderColor('Home')}]} solid/>
                <Text style={[styles.text,{color:this.renderColor('Home')}]}>الرئيسية</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.FooterLink} onPress={() => this.props.navigation.navigate('News')}>
                <FontAwesome5 name="newspaper" style={[styles.icon,{color:this.renderColor('News')}]} solid />
                <Text style={[styles.text,{color:this.renderColor('News')}]}>أخبارنا</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.FooterLink} onPress={() => this.props.navigation.navigate('ExclusiveOffers')}>
                <FontAwesome5 name="star" style={[styles.icon,{color:this.renderColor('ExclusiveOffers')}]} solid />
                <Text style={[styles.text,{color:this.renderColor('ExclusiveOffers')}]}>حصري</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.FooterLink} onPress={() => this.props.navigation.navigate('Offers')}>
                <FontAwesome5 name="percent" style={[styles.icon,{color:this.renderColor('Offers')}]} solid />
                <Text style={[styles.text,{color:this.renderColor('Offers')}]}>عروضنا</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.FooterLink} onPress={() => this.props.navigation.navigate('Contact')}>
                <FontAwesome5 name="envelope" style={[styles.icon,{color:this.renderColor('Contact')}]} solid />
                <Text style={[styles.text,{color:this.renderColor('Contact')}]}>تواصل معنا</Text>
            </TouchableOpacity>
        </Footer>
    );
  }
}
const styles = StyleSheet.create({
    footerContainer:{backgroundColor: 'white',shadowOffset: { width: 3, height: 3 },shadowColor: '#000000',shadowRadius: 5,shadowOpacity: 0.5,display: 'flex',flexDirection: 'row',justifyContent: 'space-evenly',elevation: 1},
    FooterLink:{ display: 'flex', alignItems: 'center', justifyContent: 'center' },
    icon:{fontSize: 17, },
    text:{ fontSize: 13, fontFamily:  Constants.fontFamilyBold }
})
export default withNavigation(FooterClass);