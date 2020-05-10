'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Animated, Keyboard } from 'react-native'
import { Container, Content, Header, Body, Left, Right, Form, Input } from 'native-base'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from "react-native-linear-gradient";
import { showMessage } from "react-native-flash-message";
import Constants from '../config/constants';
import Footer from '../components/Footer';
import Preloader from '../components/preloader';
import Share from 'react-native-share';
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
            loading: true,
            logged: false,
            Title: '',
            Image: '',
            Content: '',
            created_at: '',
            comment: '',
            input1: '#ebebeb',
            input1Icon: '#a3a3a3',
            comments: [],
            errors: {
                comment: "",
            },
            fadeAnim: new Animated.Value(0),
            addOfferAnimate: new Animated.Value(5000),
        };
        this.zAnimate2 = this.state.fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-1, 22222]
        })
    }
    async shareApp() {
        const shareOptions = {
            title: 'مشاركة التطبيق',
            url: 'https://google.com',
            failOnCancel: false,
        };

        try {
            const ShareResponse = await Share.open(shareOptions);
            console.log(JSON.stringify(ShareResponse, null, 2));
        } catch (error) {
            console.log('Error =>', error);
        }
    };
    async getArtical() {
        const { navigation } = this.props;
        const articalId = navigation.getParam('articalId')
        try {
            await fetch(Constants.siteUrl + 'news/' + articalId, {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: Constants.headers,
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
            }).then(response => response.json())
                .then((res) => {
                    console.log(res  )
                    if (res.status = 200) {
                        this.setState({
                            Title: res.data.title,
                            Image: res.data.image,
                            Content: res.data.content,
                            created_at: res.data.created_at,
                            loading: false
                        });
                    }
                }).then(() => {
                    fetch(Constants.siteUrl + 'news/' + articalId + '/comments', {
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
                                    comments: res.data,
                                    loading: false
                                });
                            }
                        })
                })
        } catch (err) {
            console.log("Error fetching data-----------", err);
        }
    }
    renderComments() {
        const opacity = this.animatedValue
        let newsArray = [];
        if (this.state.comments.length > 0) {
            newsArray.push(<Text style={styles.PageTitle}>التعليقات</Text>);
            this.state.comments.map((item, index) => {
                newsArray.push(<View>
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text style={{ textAlign: 'left', fontFamily: Constants.fontFamilyBold, color: '#000' }}>{item.user.name}</Text>
                        <Text style={{ textAlign: 'left', fontFamily: Constants.fontFamilyRoman, color: '#000' }}>{item.created_at}</Text>
                    </View>
                    <Text style={{ textAlign: 'left', fontFamily: Constants.fontFamilyLight, fontSize: 16 }}>{item.comment}</Text>
                    <View style={{ height: 1, backgroundColor: '#ccc', marginVertical: 20 }}></View>
                </View>)
            })
        }

        return newsArray

    }
    _openModal(type) {
        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: 1,
                duration: 1000,
            }
        ).start();
        Animated.spring(
            this.state.addOfferAnimate,
            {
                toValue: 0,
                velocity: 3,
                tension: 2,
                friction: 8,
            }
        ).start();
    }
    _hideModal(type) {
        Keyboard.dismiss()
        Animated.timing(
            this.state.fadeAnim,
            {
                toValue: -1,
                duration: 1000,
            }
        ).start();
        Animated.spring(
            this.state.addOfferAnimate,
            {
                toValue: 5000,
                velocity: 3,
                tension: 2,
                friction: 8,
            }
        ).start();

    }
    async addComment() {
        try {
            let errors = { ...this.state.errors }
            const { navigation } = this.props;
            const articalId = navigation.getParam('articalId')
            let api_token = await AsyncStorage.getItem('api_token');
            var sendArray = {};
            if (this.state.comment != '') {
                sendArray['comment'] = this.state.comment;
            }
            const commentApiCall = await fetch(Constants.siteUrl + 'news/' + articalId + '/comments', {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: { ...Constants.headers, 'Api-Token': api_token },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: JSON.stringify(sendArray),

            });
            const comment = await commentApiCall.json();
            if (Object.entries(comment.errors).length > 0) {

                if (comment.errors.hasOwnProperty('comment')) {
                    this.setState({ input1: '#ff0000', input1Icon: '#ff0000' })
                    errors.comment = comment.errors.comment;
                }
                this.setState({ errors })
            } else {
                this.setState({
                    comment: '',
                });
                this._hideModal()
                showMessage({
                    message: "تنبية",
                    description: ' تم اضافة التعليق بنجاح وفي انتظار موافقة الادارة',
                    duration: 2000,
                    type: "success",
                });
            }
        } catch (err) {
            console.log("Error fetching data-----------", err);
        }
    }
    async componentDidMount() {
        await AsyncStorage.getItem('api_token').then((token) => {
            if (token != null) {
                this.setState({
                    logged: true
                });
            }
        })
        this.getArtical()
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
                            <Text style={{ fontFamily: Constants.fontFamilyBold, color: '#ffffff', fontSize: 16, textAlign: 'left', writingDirection: 'ltr', }} numberOfLines={1} ellipsizeMode='clip'>أخبارنا</Text>
                        </Body>
                        <Right>
                            {/* <TouchableOpacity style={styles.HeaderRight} onPress={() => { this.shareApp(); }}>
                                <FontAwesome5 name="share-alt" style={styles.HeaderRightIcon} />
                            </TouchableOpacity> */}
                            <TouchableOpacity style={styles.HeaderRight} onPress={() => { this.props.navigation.goBack(); }}>
                                <FontAwesome5 name="chevron-left" style={styles.HeaderRightIcon} />
                            </TouchableOpacity>


                        </Right>
                    </Header>
                </LinearGradient>
                {this.state.loading == true ? <Preloader /> : null}
                <Content>

                    <View>
                        <Image source={{ uri: this.state.Image }} style={{ width: width, height: height * 0.3, resizeMode: 'cover', marginBottom: 20 }} />
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ textAlign: 'left', color: '#514e5e', fontFamily: Constants.fontFamilyBold, marginBottom: 10, fontSize: 17 }}>
                                {this.state.Title}
                            </Text>
                            <Text style={{ textAlign: 'left', color: '#aeaeae', marginBottom: 10 }}>{this.state.created_at}</Text>
                            <Text style={{ textAlign: 'justify', fontFamily: Constants.fontFamilyLight, lineHeight: 20, color: '#5d5a69', fontSize: 16 }}>
                                {this.state.Content}
                            </Text>
                        </View>
                        <View style={{ paddingHorizontal: 30 }}>

                            {this.renderComments()}
                        </View>
                        {this.state.logged == true ?
                            <TouchableOpacity style={styles.LoginButton} onPress={() => { this._openModal('addOffer') }}>
                                <LinearGradient style={styles.Gradient} colors={['#fca46e', '#ee6176']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
                                    <Text style={styles.ButtonText}>أضف تعليق</Text>
                                </LinearGradient>
                            </TouchableOpacity> : null}
                    </View>

                </Content>


                <Footer />
                <Animated.View style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: this.zAnimate2, opacity: this.state.fadeAnim, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <Animated.View
                        style={[styles.addOfferModal,
                        { transform: [{ translateY: this.state.addOfferAnimate }] }]}
                    >
                        <TouchableOpacity onPress={() => { this._hideModal('addOffer'); }}>
                            <FontAwesome5 name="times-circle" style={{ color: '#e0e0e0', fontSize: 20, }} solid />
                        </TouchableOpacity>
                        {/* <ScrollView contentContainerStyle={{paddingBottom: 50,}}> */}
                        <Text style={{ textAlign: 'center', color: '#514e5e', fontFamily: Constants.fontFamilyBlack, fontSize: 20, marginBottom: 20 }}>كتابة التعليق</Text>
                        <Form style={styles.Form}>
                            <View style={[styles.InputHolder, { borderColor: this.state.input1, alignItems: 'flex-start', justifyContent: 'flex-start', padding: 10 }]}>
                                <FontAwesome5 name='comment' style={[styles.InputIcon, { color: this.state.input1Icon, marginTop: 10 }]} solid />
                                <Input
                                    placeholder='اكتب تعليقك هنا'
                                    keyboardType="default"
                                    multiline={true}
                                    numberOfLines={4}
                                    onFocus={() => { this.setState({ input1: '#45c9ae', input1Icon: '#45c9ae' }) }}
                                    onBlur={() => { this.setState({ input1: '#ebebeb', input1Icon: '#a3a3a3' }) }}
                                    style={[styles.textInput, { color: this.state.input1, textAlign: 'right', minHeight: 150, textAlignVertical: 'top' }]}
                                    placeholderTextColor={this.state.input1Icon}
                                    onChangeText={(text) => this.setState({ comment: text })}
                                    value={this.state.comment}
                                    returnKeyLabel='Done' returnKeyType='done' onSubmitEditing={Keyboard.dismiss}
                                />
                            </View>
                            {this.state.errors.comment != '' ? <Text style={styles.error}>{this.state.errors.comment}</Text> : null}
                        </Form>
                        <TouchableOpacity style={styles.LoginButton} onPress={() => { this.addComment(); }}>
                            <LinearGradient style={styles.Gradient} colors={['#fca46e', '#ee6176']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
                                <Text style={styles.ButtonText}>إرسال</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        {/* </ScrollView> */}



                    </Animated.View>
                </Animated.View>
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
    error: { color: '#ff0000', textAlign: 'center', fontSize: 14, fontFamily: Constants.fontFamilyLight, marginBottom: 10 }
})
