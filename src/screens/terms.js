'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import { Container, Content, Header, Body, Left, Right, Form, Input } from 'native-base'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from "react-native-linear-gradient";
import Constants from '../config/constants';
import Footer from '../components/Footer';
import Preloader from '../components/preloader';
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

export default class artical extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            logged: false,
            Title: '',
            Content: '',
            
        };
       
    }
    
    async getPage() {
        
        try {
            await fetch(Constants.siteUrl + 'page/getTerms/' , {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: Constants.headers,
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
            }).then(response => response.json())
            .then((res) => {
                if (res.status = 200) {
                    this.setState({
                        Title: res.data.title,
                        Image: res.data.image,
                        Content: res.data.content,
                        created_at: res.data.created_at,
                        loading: false
                    });
                }
            })
        } catch (err) {
            console.log("Error fetching data-----------", err);
        }
    }

    async componentDidMount() {
        
        this.getPage()
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
                            <Text style={{ fontFamily: Constants.fontFamilyBold, color: '#ffffff', fontSize: 16, textAlign: 'left', writingDirection: 'ltr', }} numberOfLines={1} ellipsizeMode='clip'>شروط الخدمة</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity style={styles.HeaderRight} onPress={() => { this.props.navigation.goBack(); }}>
                                <FontAwesome5 name="chevron-left" style={styles.HeaderRightIcon} />
                            </TouchableOpacity>


                        </Right>
                    </Header>
                </LinearGradient>
                {this.state.loading == true ? <Preloader /> : null}
                <Content>
                    <View style={{ padding: 20 }}>
                        
                        <Text style={{ textAlign: 'justify', fontFamily: Constants.fontFamilyLight, lineHeight: 20, color: '#5d5a69', fontSize: 15 }}>
                            {this.state.Content}
                        </Text>
                    </View>
                    
                </Content>
                
                
                <Footer />
                
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    HeaderRightIcon: { fontSize: 20, color: '#fff', marginRight: 10 },
    PageTitle: { textAlign: 'left', fontSize: 16, fontFamily: Constants.fontFamilyBold, marginBottom: 20, color: '#514e5e' },
    Gradient: { paddingVertical: 10, borderRadius: 5 },
    LoginButton: { marginTop: 5, marginBottom: 30, marginHorizontal: 20, },
    ButtonText: { textAlign: 'center', color: 'white', fontFamily: Constants.fontFamilyBold, fontSize: 16 },
    InputHolder: { borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, marginBottom: 10, borderRadius: 3 },
    addOfferModal: { top: 100, width: width - 40, position: 'absolute', backgroundColor: '#fff', zIndex: 5, borderRadius: 5, padding: 10 },
    Form: { paddingHorizontal: 20 },
    InputIcon: { fontSize: 20, marginRight: 10 },
    textInput: { fontFamily: Constants.fontFamilyRoman, fontSize: 14, textAlign: 'right' },
    error:{ color: '#ff0000', textAlign: 'center', fontSize: 14, fontFamily: Constants.fontFamilyLight, marginBottom: 10 }
})
