'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Linking, Dimensions, Animated, Easing, ScrollView, Keyboard } from 'react-native'
import { Container, Content, Header, Body, Left, Right, Input, Form } from 'native-base'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from "react-native-linear-gradient";
import Constants from '../config/constants';
import Share from 'react-native-share';
import { showMessage } from "react-native-flash-message";
import Preloader from '../components/preloader';
import { connect } from 'react-redux'
const { height, width } = Dimensions.get("window");
/**********************************************************************
*
*                               Class
*
**********************************************************************/

class trainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            Title: '',
            Image: '',
            Content: '',
            created_at: '',
            ratingCount: 0,
            ratingStars: 0,
            ratingOpinion: '',
            selectedRating: 0,
            rates: [],
            options: [],

            fadeAnim3: new Animated.Value(0),
            fadeAnim2: new Animated.Value(0),
            fadeAnim: new Animated.Value(0),
            zIndex: new Animated.Value(-1),
            viewRatingAnimate: new Animated.Value(5000),
            addRatingAnimate: new Animated.Value(5000),
            addOfferAnimate: new Animated.Value(5000),
            reportOfferAnimate: new Animated.Value(5000),
            logged: false,
            username: '',
            email: '',
            phone: '',
            extraNotes: '',
            reason: '',
            errors: {
                ratingOpinion: '',
                rate: '',
            }
        };
        this.zAnimate = this.state.fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-1, 2]
        })
        this.zAnimate2 = this.state.fadeAnim2.interpolate({
            inputRange: [0, 1],
            outputRange: [-1, 33]
        })
        this.zAnimate3 = this.state.fadeAnim3.interpolate({
            inputRange: [0, 1],
            outputRange: [-1, 99]
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
    randerRating(num, size) {
        return [...Array(5)].map((el, i) =>
            // check if current star should be half
            i < num && i + 1 > num ?
                <FontAwesome5 key={i} name="star-half-alt" solid style={{ color: '#e5cc25', margin: 1, fontSize: size, transform: [{ rotate: '140deg' }] }} />
                // not half, so check if current star should be full
                : i < num ? <FontAwesome5 key={i} name="star" solid style={{ color: '#e5cc25', margin: 1, fontSize: size }} />
                    // else, current star should be empty
                    : <FontAwesome5 key={i} name="star" solid style={{ color: '#c4c4c4', margin: 1, fontSize: size }} />
        );
    }
    randerSelectingRating() {
        let React_Native_Rating_Bar = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= this.state.selectedRating) {
                React_Native_Rating_Bar.push(<TouchableOpacity key={i} onPress={() => { this.setState({ selectedRating: i }) }}><FontAwesome5 key={i} name="star" solid style={{ color: '#e5cc25', margin: 1, fontSize: 24 }} /></TouchableOpacity>)
            } else {
                React_Native_Rating_Bar.push(<TouchableOpacity key={i} onPress={() => { this.setState({ selectedRating: i }) }}><FontAwesome5 key={i} name="star" solid style={{ color: '#c4c4c4', margin: 1, fontSize: 24 }} /></TouchableOpacity>)
            }
        }
        return React_Native_Rating_Bar
    }
    _openModal(type) {
        if (type == 'viewRatings') {
            Animated.spring(
                this.state.viewRatingAnimate,
                {
                    toValue: 0,
                    velocity: 3,
                    tension: 2,
                    friction: 8,
                }
            ).start();
        } else if (type == 'addRating') {
            Animated.timing(
                this.state.fadeAnim,
                {
                    toValue: 1,
                    duration: 1000,
                }
            ).start();
            Animated.spring(
                this.state.addRatingAnimate,
                {
                    toValue: 0,
                    velocity: 3,
                    tension: 2,
                    friction: 8,
                }
            ).start();

        } else if (type == 'addOffer') {
            Animated.timing(
                this.state.fadeAnim2,
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
        } else if (type == 'reportOffer') {
            Animated.timing(
                this.state.fadeAnim3,
                {
                    toValue: 1,
                    duration: 1000,
                }
            ).start();
            Animated.spring(
                this.state.reportOfferAnimate,
                {
                    toValue: 0,
                    velocity: 3,
                    tension: 2,
                    friction: 8,
                }
            ).start();
        }



    }
    _hideModal(type) {
        if (type == 'viewRatings') {
            Animated.spring(
                this.state.viewRatingAnimate,
                {
                    toValue: height,
                    velocity: 3,
                    tension: 2,
                    friction: 8,
                }
            ).start();
        } else if (type == 'addRating') {
            Keyboard.dismiss()
            Animated.timing(
                this.state.fadeAnim,
                {
                    toValue: -1,
                    duration: 1000,
                }
            ).start();
            Animated.spring(
                this.state.addRatingAnimate,
                {
                    toValue: 5000,
                    velocity: 3,
                    tension: 2,
                    friction: 8,
                }
            ).start();
        } else if (type == 'addOffer') {
            Keyboard.dismiss()
            Animated.timing(
                this.state.fadeAnim2,
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
        } else if (type == 'reportOffer') {
            Keyboard.dismiss()
            Animated.timing(
                this.state.fadeAnim3,
                {
                    toValue: -1,
                    duration: 1000,
                }
            ).start();
            Animated.spring(
                this.state.reportOfferAnimate,
                {
                    toValue: 5000,
                    velocity: 3,
                    tension: 2,
                    friction: 8,
                }
            ).start();
        }

    }
    async getTrainer() {
        const { navigation } = this.props;
        const trainerId = navigation.getParam('trainerId')
        try {
            await fetch(Constants.siteUrl + 'trainers/' + trainerId, {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: Constants.headers,
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
            }).then(response => response.json())
                .then((res) => {
                    if (res.status == 200) {
                        console.log(res);

                        this.setState({
                            Title: res.data.name,
                            Image: res.data.image,
                            ratingCount: res.data.rate.count,
                            ratingStars: res.data.rate.rate,
                            rates: res.data.rates,
                            options: res.data.options,
                            // options: res.data.contacts,
                            loading: false
                        });
                    }
                })
        } catch (err) {
            console.log("Error fetching data-----------", err);
        }
    }


    async addRating() {
        try {
            Keyboard.dismiss()
            let api_token = await AsyncStorage.getItem('api_token');
            let errors = { ...this.state.errors }
            var sendArray = {};

            if (this.state.ratingOpinion != '') {
                sendArray['comment'] = this.state.ratingOpinion;
            }
            sendArray['rate'] = this.state.selectedRating;
            const { navigation } = this.props;
            const trainerId = navigation.getParam('trainerId')
            const accountApiCall = await fetch(Constants.siteUrl + 'trainer/' + trainerId + '/rates', {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: { ...Constants.headers, 'Api-Token': api_token },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: JSON.stringify(sendArray),

            });
            const account = await accountApiCall.json();
            if (Object.entries(account.errors).length > 0) {

                if (account.errors.hasOwnProperty('comment')) {
                    this.setState({ input5: '#ff0000', input5Icon: '#ff0000' })
                    errors.ratingOpinion = account.errors.ratingOpinion
                }
                if (account.errors.hasOwnProperty('rate')) {
                    this.setState({ input5: '#ff0000', input5Icon: '#ff0000' })
                    errors.rate = account.errors.rate
                }

                this.setState({ errors })
            } else if (account.message == 'You rate before') {
                showMessage({
                    message: "تنبية",
                    description: 'تم قمت بتقييم الاعلان مسبقا',
                    duration: 2000,
                    type: "error",
                });
                this._hideModal('addRating');
                this._hideModal('viewRatings');
            } else {
                showMessage({
                    message: "تنبية",
                    description: 'تم اضافة التقييم بنجاح',
                    duration: 2000,
                    type: "success",
                });
                this._hideModal('addRating');
            }
        } catch (err) {
            console.log("Error fetching data-----------", err);
        }
    }
    async reportOffer() {
        Keyboard.dismiss();
        const { navigation } = this.props;
        const trainerId = navigation.getParam('trainerId')
        try {
            let api_token = await AsyncStorage.getItem('api_token');
            let errors = { ...this.state.errors }
            var sendArray = {};
            sendArray['id'] = trainerId;
            sendArray['type'] = 'offer';
            if (this.state.reason != '') {
                sendArray['reason'] = this.state.reason;
            }

            await fetch(Constants.siteUrl + 'offer/' + trainerId + '/report', {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: { ...Constants.headers, 'Api-Token': api_token },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: JSON.stringify(sendArray)
            }).then(response => response.json())
                .then((res) => {
                    console.log(res)
                    if (Object.entries(res.errors).length > 0) {
                        if (res.errors.hasOwnProperty('reason')) {
                            this.setState({ input3: '#ff0000', input3Icon: '#ff0000' })
                            errors.reason = res.errors.reason
                        }
                        this.setState({ errors })
                    } else {
                        showMessage({
                            message: "تنبية",
                            description: 'تم ارسال الإبلاغ بنجاح',
                            duration: 2000,
                            type: "success",
                        });
                        this._hideModal('reportOffer')
                    }
                })
        } catch (err) {
            console.log("Error fetching data-----------", err);
        }
    }
    async componentDidMount() {
        try {
            if (this.props.Name != '') {
                this.setState({
                    username: this.props.Name,
                });
            }
            if (this.props.Email != '') {
                this.setState({
                    email: this.props.Email,
                });
            }
            if (this.props.Phone != '') {
                this.setState({
                    phone: this.props.Phone,
                });
            }
            this.getTrainer()
        } catch (error) {
            console.log("Error retrieving data" + error);
        }
    }
    renderOptions() {
        let React_Native_Rating_Bar = [];
        if (this.state.loading == false) {
            Object.values(this.state.options).map((item, index) => {
                React_Native_Rating_Bar.push(<View style={{width:'100%'}}><Text  style={styles.itemTitle}>{item.title}</Text></View>)
                Object.values(item.fields).map((item2, index) => {
                    var value = item2.value
                    if(this.validateEmail(value)){
                        React_Native_Rating_Bar.push(<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} onPress={() => {
                            Linking.openURL(`mailto:${value}`)
                        }} >
                            <Image source={{ uri: item2.icon }} style={{ height: 22, width: 22, resizeMode: 'contain', marginHorizontal: 20 }} />
                                <View>
                                    <Text style={styles.itemTitle}>{item2.title}</Text>
                                    <Text style={styles.itemSubTitle}>{item2.value}</Text>
                                </View>
                        </TouchableOpacity>)
                    }else if (this.validatePhone(value)){
                        React_Native_Rating_Bar.push(<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} onPress={() => {
                            Linking.openURL(`tel:${value}`)
                        }} >
                            <Image source={{ uri: item2.icon }} style={{ height: 22, width: 22, resizeMode: 'contain', marginHorizontal: 20 }} />
                                <View>
                                    <Text style={styles.itemTitle}>{item2.title}</Text>
                                    <Text style={styles.itemSubTitle}>{item2.value}</Text>
                                </View>
                        </TouchableOpacity>)
                        
                    }else{
                        React_Native_Rating_Bar.push(
                            <View key={item.id} style={styles.itemHolder}>
                                <Image source={{ uri: item2.icon }} style={{ height: 22, width: 22, resizeMode: 'contain', marginHorizontal: 20 }} />
                                <View>
                                    <Text style={styles.itemTitle}>{item2.title}</Text>
                                    <Text style={styles.itemSubTitle}>{item2.value}</Text>
                                </View>
                            </View>
                        )
                    }
                })


                if (item[0] == 'website') {
                    // React_Native_Rating_Bar.push(
                    //     <View key={item.id} style={styles.itemHolder}>
                    //         <Image source={{uri:item.icon}} style={{height:22,width:22,resizeMode: 'contain',marginHorizontal:20}} />
                    //         <View>
                    //             <Text style={styles.itemTitle}>الموقع الالكتروني</Text>
                    //             <TouchableOpacity onPress={() => { Linking.openURL(item[1]) }} >
                    //                 <Text style={styles.itemSubTitle}>{item[1]}</Text>
                    //             </TouchableOpacity>
                    //         </View>
                    //     </View>
                    // )
                    //     } else {
                    //         React_Native_Rating_Bar.push(
                    //             <View key={item.id} style={styles.itemHolder}>
                    //                 <Image source={{uri:item.icon}} style={{height:22,width:22,resizeMode: 'contain',marginHorizontal:20}} />
                    //                 <View>
                    //                     <Text style={styles.itemTitle}>{item.title}</Text>
                    //                     <Text style={styles.itemSubTitle}>{item.value}</Text>
                    //                 </View>
                    //             </View>
                    //         )
                }

            })
        }

        return React_Native_Rating_Bar
    }
    renderRatings() {
        let React_Native_Rating_Bar = [];
        this.state.rates.map((item, index) => {
            
            React_Native_Rating_Bar.push(<View key={item.id}>
                <View style={styles.viewRatingsModalTopRatingBoxHeading}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text style={styles.viewRatingsModalTopRatingBoxBy}>بواسطة: {item.user.name} </Text>
                            <Text style={styles.viewRatingsModalTopRatingBoxDate}>{item.created_at}</Text>
                        </View>

                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        {this.randerRating(item.rate, 11)}
                    </View>
                </View>
                <Text style={styles.viewRatingsModalTopRatingBoxComment}>
                    {item.comment}
                </Text>
                <View style={styles.sperator2}></View>
            </View>)
        })
        return React_Native_Rating_Bar
    }
     validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
     validatePhone(email) {
        var re = /^(009665|9665|\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$/;
        return re.test(String(email).toLowerCase());
    }
    render() {

        return (
            <Container>
                <LinearGradient colors={['#7dde9d', '#17b7bd']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
                    <Header style={{ backgroundColor: "transparent", display: 'flex', elevation: 0 }}>
                        <Left style={{ flex: 1 }}>
                            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { this.props.navigation.openDrawer(); }}>
                                <FontAwesome5 name="bars" style={{ fontSize: 20, color: 'white' }} />
                            </TouchableOpacity>
                        </Left>
                        <Body style={{ flex: 7, display: 'flex', alignItems: 'flex-start' }}>
                            <Text style={{ fontFamily: Constants.fontFamilyBold, color: '#ffffff', fontSize: 16, textAlign: 'left', writingDirection: 'ltr', }} numberOfLines={1} ellipsizeMode='clip'>المدرب</Text>
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
                    <Image source={{ uri: this.state.Image }} style={styles.Image} />
                    <View style={styles.contentHolder}>
                        <Text style={styles.Title}>
                            {this.state.Title}
                        </Text>
                        <View style={styles.ratingHolder}>
                            {this.state.ratingStars ? this.randerRating(this.state.ratingStars, 14) : this.randerRating(0, 14)}
                            <Text style={styles.ratingCount}>({this.state.ratingCount ? this.state.ratingCount : 0} تعليق)</Text>
                            <TouchableOpacity onPress={() => { this._openModal('viewRatings') }}>
                                <Text style={styles.viewRatings}>انقر لعرض التقييمات</Text>
                            </TouchableOpacity>
                        </View>
                        <View >
                            {this.renderOptions()}
                        </View>

                    </View>
                </Content>
                <Animated.View
                    style={[styles.viewRatingsModal,
                    { transform: [{ translateY: this.state.viewRatingAnimate }] }]}
                >
                    <LinearGradient colors={['#7dde9d', '#17b7bd']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
                        <Header style={{ backgroundColor: "transparent", display: 'flex' }}>

                            <Body style={{ flex: 7, display: 'flex', alignItems: 'flex-start' }}>
                                <Text style={{ fontFamily: Constants.fontFamilyBold, color: '#ffffff', fontSize: 16, textAlign: 'left', writingDirection: 'ltr', }} numberOfLines={1} ellipsizeMode='clip'>تقييم الإعلان</Text>
                            </Body>
                            <Right>
                                <TouchableOpacity style={styles.HeaderRight} onPress={() => { this._hideModal('viewRatings'); }}>
                                    <FontAwesome5 name="chevron-left" style={styles.HeaderRightIcon} />
                                </TouchableOpacity>
                            </Right>
                        </Header>
                    </LinearGradient>

                    <View style={styles.viewRatingsModalTop}>
                        <View style={styles.viewRatingsModalTopRating}>
                            {this.state.ratingStars ? this.randerRating(this.state.ratingStars, 20) : this.randerRating(0, 20)}
                        </View>
                        <Text style={styles.viewRatingsModalTopRatingCount}>({this.state.ratingCount ? this.state.ratingCount : 0} تعليق)</Text>
                    </View>
                    <View style={styles.sperator2}></View>
                    <ScrollView contentContainerStyle={styles.viewRatingsModalScrollView}>
                        {this.renderRatings()}
                        {this.props.Login == true ?
                            <LinearGradient style={[styles.Gradient, { width: width - 40, }]} colors={['#7dde9d', '#17b7bd']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
                                <TouchableOpacity onPress={() => { this._openModal('addRating') }}>
                                    <Text style={styles.ButtonText}>اضف تقييم</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                            : null}
                    </ScrollView>
                </Animated.View>

                <Animated.View style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: this.zAnimate, opacity: this.state.fadeAnim, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <Animated.View
                        style={[styles.addRatingModal,
                        { transform: [{ translateY: this.state.addRatingAnimate }] }]}
                    >
                        <TouchableOpacity onPress={() => { this._hideModal('addRating'); }}>
                            <FontAwesome5 name="times-circle" style={{ color: '#e0e0e0', fontSize: 20, }} solid />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            {this.randerSelectingRating()}
                        </View>
                        {this.state.errors.rate != '' ? <Text style={styles.error}>{this.state.errors.rate}</Text> : null}
                        <Text style={{ textAlign: 'center', color: '#514e5e', fontFamily: Constants.fontFamilyRoman, marginVertical: 20 }}>انقر علي النجوم للتقييم</Text>
                        <View style={[styles.InputHolder, { borderColor: this.state.input5 }]}>
                            <Input
                                placeholder='اكتب رأيك في هذا الإعلان'
                                keyboardType="default"
                                multiline={true}
                                numberOfLines={4}
                                onFocus={() => { this.setState({ input5: '#45c9ae', input5Icon: '#45c9ae' }) }}
                                onBlur={() => { this.setState({ input5: '#ebebeb', input5Icon: '#a3a3a3' }) }}
                                style={styles.textInput}
                                placeholderTextColor={"#000"}
                                onChangeText={(text) => this.setState({ ratingOpinion: text })}
                                value={this.state.ratingOpinion}
                            />
                        </View>
                        {this.state.errors.ratingOpinion != '' ? <Text style={styles.error}>{this.state.errors.ratingOpinion}</Text> : null}
                        <TouchableOpacity style={styles.LoginButton} onPress={() => { this.addRating() }}>
                            <LinearGradient style={styles.Gradient} colors={['#7dde9d', '#17b7bd']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
                                <Text style={styles.ButtonText}>إضافة تقييم</Text>
                            </LinearGradient>
                        </TouchableOpacity>


                    </Animated.View>
                </Animated.View>
                <Animated.View style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: this.zAnimate2, opacity: this.state.fadeAnim2, justifyContent: 'center', alignItems: 'center', display: 'flex', height, width }}>
                    <Animated.View
                        style={[styles.addOfferModal,
                        { transform: [{ translateY: this.state.addOfferAnimate }] }]}
                    >
                        <TouchableOpacity onPress={() => { this._hideModal('addOffer'); }}>
                            <FontAwesome5 name="times-circle" style={{ color: '#e0e0e0', fontSize: 20, }} solid />
                        </TouchableOpacity>
                        <ScrollView contentContainerStyle={{ paddingBottom: 50, }}>
                            <Text style={{ textAlign: 'center', color: '#514e5e', fontFamily: Constants.fontFamilyBlack, fontSize: 20, marginBottom: 20 }}>طلب العرض</Text>
                            <Form style={styles.Form}>
                                <View style={[styles.InputHolder, { borderColor: this.state.input1 }]}>
                                    <FontAwesome5 name='user' style={[styles.InputIcon, { color: this.state.input1Icon }]} solid />
                                    <Input
                                        placeholder='الاسم بالكامل'
                                        keyboardType="default"
                                        returnKeyType="next"
                                        onFocus={() => { this.setState({ input1: '#45c9ae', input1Icon: '#45c9ae' }) }}
                                        onBlur={() => { this.setState({ input1: '#ebebeb', input1Icon: '#a3a3a3' }) }}
                                        style={[styles.textInput, { color: '#000' }]}
                                        placeholderTextColor={"#000"}
                                        onChangeText={(text) => this.setState({ username: text })}
                                        value={this.state.username}
                                    />
                                </View>
                                {this.state.errors.username != undefined && this.state.errors.username != '' ? <Text style={styles.error}>{this.state.errors.username}</Text> : null}
                                <View style={[styles.InputHolder, { borderColor: this.state.input2 }]}>
                                    <FontAwesome5 name='envelope' style={[styles.InputIcon, { color: this.state.input2Icon }]} solid />
                                    <Input
                                        placeholder='البريد الالكتروني'
                                        keyboardType="email-address"
                                        returnKeyType="next"
                                        onFocus={() => { this.setState({ input2: '#45c9ae', input2Icon: '#45c9ae' }) }}
                                        onBlur={() => { this.setState({ input2: '#ebebeb', input2Icon: '#a3a3a3' }) }}
                                        style={[styles.textInput, { color: '#000' }]}
                                        placeholderTextColor={"#000"}
                                        onChangeText={(text) => this.setState({ email: text })}
                                        value={this.state.email}
                                    />
                                </View>
                                {this.state.errors.email != undefined && this.state.errors.email != '' ? <Text style={styles.error}>{this.state.errors.name}</Text> : null}
                                <View style={[styles.InputHolder, { borderColor: this.state.input3 }]}>
                                    <FontAwesome5 name='phone' style={[styles.InputIcon, { color: this.state.input3Icon }]} solid />
                                    <Input
                                        placeholder='رقم الجوال'
                                        keyboardType="phone-pad"
                                        returnKeyType="next"
                                        onFocus={() => { this.setState({ input3: '#45c9ae', input3Icon: '#45c9ae' }) }}
                                        onBlur={() => { this.setState({ input3: '#ebebeb', input3Icon: '#a3a3a3' }) }}
                                        style={[styles.textInput, { color: '#000' }]}
                                        placeholderTextColor={"#000"}
                                        onChangeText={(text) => this.setState({ phone: text })}
                                        value={this.state.phone}
                                    />
                                </View>
                                {this.state.errors.phone != undefined && this.state.errors.phone != '' ? <Text style={styles.error}>{this.state.errors.phone}</Text> : null}
                                <View style={[styles.InputHolder, { borderColor: this.state.input4, alignItems: 'flex-start', justifyContent: 'flex-start', padding: 10 }]}>
                                    <FontAwesome5 name='comment' style={[styles.InputIcon, { color: this.state.input4Icon, marginTop: 10 }]} solid />
                                    <Input
                                        placeholder='ملاحظات أضافية'
                                        keyboardType="default"
                                        multiline={true}
                                        numberOfLines={4}
                                        onFocus={() => { this.setState({ input4: '#45c9ae', input4Icon: '#45c9ae' }) }}
                                        onBlur={() => { this.setState({ input4: '#ebebeb', input4Icon: '#a3a3a3' }) }}
                                        style={[styles.textInput, { color: '#000', textAlign: 'right', minHeight: 150, textAlignVertical: 'top' }]}
                                        placeholderTextColor={"#000"}
                                        onChangeText={(text) => this.setState({ extraNotes: text })}
                                        value={this.state.extraNotes}
                                        onSubmitEditing={(event) => {
                                            this.addOrder();
                                        }}
                                    />
                                </View>
                                {this.state.errors.content != undefined && this.state.errors.content != '' ? <Text style={styles.error}>{this.state.errors.content}</Text> : null}
                            </Form>
                            <TouchableOpacity style={styles.LoginButton} onPress={() => { this.addOrder() }}>
                                <LinearGradient style={styles.Gradient} colors={['#fca46e', '#ee6176']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
                                    <Text style={styles.ButtonText}>إرسال</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </ScrollView>



                    </Animated.View>
                </Animated.View>
                <Animated.View style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: this.zAnimate3, opacity: this.state.fadeAnim3, justifyContent: 'center', alignItems: 'center', display: 'flex', height, width }}>
                    <Animated.View
                        style={[styles.addOfferModal,
                        { transform: [{ translateY: this.state.reportOfferAnimate }] }]}
                    >
                        <TouchableOpacity onPress={() => { this._hideModal('reportOffer'); }}>
                            <FontAwesome5 name="times-circle" style={{ color: '#e0e0e0', fontSize: 20, }} solid />
                        </TouchableOpacity>
                        {/* <ScrollView contentContainerStyle={{paddingBottom: 50,}}> */}
                        <Text style={{ textAlign: 'center', color: '#514e5e', fontFamily: Constants.fontFamilyBlack, fontSize: 20, marginBottom: 20 }}>الإبلاغ عن الإعلان</Text>
                        <Form style={styles.Form}>

                            <View style={[styles.InputHolder, { borderColor: this.state.input4, alignItems: 'flex-start', justifyContent: 'flex-start', padding: 10 }]}>
                                <FontAwesome5 name='comment' style={[styles.InputIcon, { color: this.state.input4Icon, marginTop: 10 }]} solid />
                                <Input
                                    placeholder='سبب الإبلاغ'
                                    keyboardType="default"
                                    multiline={true}
                                    numberOfLines={4}
                                    onFocus={() => { this.setState({ input4: '#45c9ae', input4Icon: '#45c9ae' }) }}
                                    onBlur={() => { this.setState({ input4: '#ebebeb', input4Icon: '#a3a3a3' }) }}
                                    style={[styles.textInput, { color: '#000', textAlign: 'right', minHeight: 150, textAlignVertical: 'top' }]}
                                    placeholderTextColor={"#000"}
                                    onChangeText={(text) => this.setState({ reason: text })}
                                    value={this.state.reason}
                                    onSubmitEditing={(event) => {
                                        this.reportOffer();
                                    }}
                                />
                            </View>
                            {this.state.errors.reason != '' ? <Text style={styles.error}>{this.state.errors.reason}</Text> : null}
                        </Form>
                        <TouchableOpacity style={styles.LoginButton} onPress={() => { this.reportOffer() }}>
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
    Image: { width: width, height: height * 0.3, resizeMode: 'cover', marginBottom: 20 },
    Title: { textAlign: 'left', color: '#514e5e', fontFamily: Constants.fontFamilyBold, marginBottom: 10, marginLeft: 20, fontSize: 16 },
    contentHolder: { paddingHorizontal: 10 },
    ratingHolder: { flexDirection: 'row', marginBottom: 20, marginLeft: 20, alignItems: 'center' },
    ratingCount: { textAlign: 'left', color: '#aeaeae', fontSize: 12, marginHorizontal: 5, fontFamily: Constants.fontFamilyRoman },
    viewRatings: { textDecorationLine: 'underline', fontFamily: Constants.fontFamilyRoman, fontSize: 12, marginLeft: 5 },
    description: { textAlign: 'left', fontFamily: Constants.fontFamilyLight, lineHeight: 20, color: '#5d5a69', fontSize: 12, paddingHorizontal: 20, fontSize: 14 },
    sperator: { height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 20, marginVertical: 20, zIndex: 2 },
    sperator2: { height: 1, backgroundColor: '#e5e5e5', marginHorizontal: 20, marginVertical: 30, zIndex: 2 },
    itemHolder: { flexDirection: 'row', marginBottom: 20, alignItems: 'center' },
    itemIcon: { fontSize: 20, color: '#fba16e', marginHorizontal: 20 },
    itemTitle: { fontFamily: Constants.fontFamilyBold, fontSize: 16, textAlign: 'left', writingDirection: 'ltr', },
    Gradient: { paddingVertical: 10, borderRadius: 5 },
    itemSubTitle: { fontFamily: Constants.fontFamilyLight, fontSize: 13, textAlign: 'left', writingDirection: 'ltr', },
    LoginButton: { marginTop: 5, marginBottom: 30, marginHorizontal: 20, },
    ButtonText: { textAlign: 'center', color: 'white', fontFamily: Constants.fontFamilyBold, fontSize: 18 },
    viewRatingsModal: { position: "absolute", bottom: 0, left: 0, right: 0, top: 0, backgroundColor: "#ffffff", height: height, zIndex: 1, },
    viewRatingsModalTop: { paddingHorizontal: 20, paddingTop: 20 },
    viewRatingsModalTopRating: { flexDirection: 'row', justifyContent: 'center' },
    viewRatingsModalTopRatingCount: { textAlign: 'center', color: '#aeaeae', fontSize: 16, marginTop: 10, fontFamily: Constants.fontFamilyRoman },
    viewRatingsModalScrollView: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 70 },
    viewRatingsModalTopRatingBoxHeading: { flexDirection: 'row', justifyContent: 'space-between', width: width, paddingHorizontal: 20, marginBottom: 20, alignItems: 'center' },
    viewRatingsModalTopRatingBoxBy: { textAlign: 'left', fontSize: 12, color: '#a8a8a8', fontFamily: Constants.fontFamilyRoman },
    viewRatingsModalTopRatingBoxDate: { textAlign: 'right', fontSize: 12, color: '#a8a8a8', fontFamily: Constants.fontFamilyRoman, marginLeft: 20 },
    viewRatingsModalTopRatingBoxComment: { textAlign: 'left', color: '#514e5e', fontFamily: Constants.fontFamilyBold, paddingHorizontal: 20 },

    addRatingModal: { top: 100, width: width - 40, height: 330, position: 'absolute', backgroundColor: '#fff', zIndex: 5, borderRadius: 5, padding: 10 },
    textInput: { fontFamily: Constants.fontFamilyRoman, fontSize: 14, textAlign: 'right', borderWidth: 1, borderRadius: 5, borderColor: '#ebebeb', margin: 20, textAlign: 'right', minHeight: 70, textAlignVertical: 'top' },
    addOfferModal: { top: 100, width: width - 40, position: 'absolute', backgroundColor: '#fff', zIndex: 5, borderRadius: 5, padding: 10 },
    InputHolder: { borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, marginBottom: 10, borderRadius: 3 },
    Form: { paddingHorizontal: 20 },
    InputIcon: { fontSize: 20, marginRight: 10 },
    textInput: { fontFamily: Constants.fontFamilyRoman, fontSize: 14, textAlign: 'right' },
    error: { color: '#ff0000', textAlign: 'center', fontSize: 14, fontFamily: Constants.fontFamilyLight, marginBottom: 10 }
})
function mapStateToProps(state) {
    return {
        Login: state.Login,
        Name: state.Name,
        Phone: state.Phone,
        Email: state.Email,
    }
}
export default connect(mapStateToProps)(trainer)