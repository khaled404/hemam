'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import React, { Component } from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Animated,Easing } from 'react-native'
import { Container, Content, Header, Body, Left, Right, List, ListItem } from 'native-base'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';

import LinearGradient from "react-native-linear-gradient";
import Constants from '../config/constants';
import Footer from '../components/Footer';

/**********************************************************************
*
*                               Class
*
**********************************************************************/

export default class myOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders:[]
        };
        this.animatedValue = new Animated.Value(0);
        
    }
    async getOrders() {
        try {
            
            this.setState({refreshing:true})
            let api_token = await AsyncStorage.getItem('api_token');
            
            const categoryApiCall = await fetch(Constants.siteUrl + 'orders', {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: { ...Constants.headers, 'Api-Token': api_token },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
            });
            const category = await categoryApiCall.json();
            console.log(category)
            if (category.status = 200) {
                this.setState({
                    orders: category.data,
                    paginationCurrentPage: category.paginate.currentPage,
                    refreshing:false,
                    loading: false,
                });
            }
        } catch (err) {
            console.log("Error fetching data-----------", err);
        }
    }
    componentDidMount(){
        this.getOrders()
        Animated.timing(
            this.animatedValue,
            {
              toValue: 1,
              duration: 2000,
              easing:Easing.inOut(Easing.quad)
            }
        ).start()
    }
    loopOrders(){
        const marginTop = this.animatedValue.interpolate({
			inputRange: [0, 1],
			outputRange: [250, 0]
		  })
		  const marginLeft= this.animatedValue.interpolate({
			inputRange: [0, 1],
			outputRange: [250, 0]
		  })
        let arr = []
        this.state.orders.map((item,index)=>{
                arr.push(<Animated.View style={{marginTop}}><View style={styles.orderHolder}>
                    <LinearGradient colors={['#f9a0ac', '#ee6176']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} style={styles.gradient} >
                        <Text style={styles.label}>طلبات </Text>
                    </LinearGradient>
                    <Text style={styles.date}>{item.created_at}</Text>
                    <Text style={styles.orderMessage}>
                    {item.ordered.title}
                    </Text>
                </View></Animated.View>)
        })
        return arr;
    }
    render() {
        return (
            <Container>
                <LinearGradient colors={['#7dde9d', '#17b7bd']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
                    <Header style={{ backgroundColor: "transparent", display: 'flex' ,elevation:0 }}>
                        <Left style={{ flex: 1 }}>
                            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { this.props.navigation.openDrawer(); }}>
                                <FontAwesome5 name="bars" style={{ fontSize: 20, color: 'white' }} />
                            </TouchableOpacity>
                        </Left>
                        <Body style={{ flex: 7, display: 'flex', alignItems: 'flex-start' }}>
                            <Text style={{ fontFamily: Constants.fontFamilyBold, color: '#ffffff', fontSize: 16, textAlign: 'left', writingDirection: 'ltr', }} numberOfLines={1} ellipsizeMode='clip'>طلباتي</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity style={styles.HeaderRight} onPress={() => { this.props.navigation.goBack(); }}>
                                <FontAwesome5 name="chevron-left" style={styles.HeaderRightIcon} />
                            </TouchableOpacity>
                        </Right>
                    </Header>
                </LinearGradient>
                <Content>
                    <View style={{padding:20,paddingTop:40}}>
                        {this.loopOrders()}                        
                    </View>
                    
                </Content>
                <Footer />
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    HeaderRightIcon:{ fontSize: 20, color: '#fff',marginRight:10 },
    orderHolder:{borderWidth:1,borderColor:'#ebebeb',padding:20,paddingTop:25,borderRadius:5,marginBottom:30,position:'relative'},
    gradient:{paddingVertical:5,paddingHorizontal:10,position:'absolute',top:-20,left:5,zIndex: 1,borderRadius:5},  
    label:{color:'white',fontFamily:Constants.fontFamilyRoman},
    date:{textAlign:'left',fontSize: 12, color: '#a8a8a8', fontFamily: Constants.fontFamilyRoman},
    orderMessage:{textAlign:'left',color: '#514e5e', fontFamily: Constants.fontFamilyBold, lineHeight:20},
})
