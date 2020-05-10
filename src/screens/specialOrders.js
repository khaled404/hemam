'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, Keyboard } from 'react-native'
import { Container, Content, Header, Body, Left, Right, Input, Form } from 'native-base'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import { showMessage } from "react-native-flash-message";
import LinearGradient from "react-native-linear-gradient";
import Constants from '../config/constants';
import Footer from '../components/Footer';

const { width, height } = Dimensions.get('window');
/**********************************************************************
*
*                               Class
*
**********************************************************************/

export default class specialOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input1: '#ebebeb',
            input1Icon: '#a3a3a3',
            input2: '#ebebeb',
            input2Icon: '#a3a3a3',
            input3: '#ebebeb',
            input3Icon: '#a3a3a3',
            input4: '#ebebeb',
            input4Icon: '#a3a3a3',
            name: '',
            email: '',
            phone: '',
            message: '',
            contactData:[],
            errors: {
                email: "",
                name: "",
                message: "",
                phone: "",
            },
        };
    }
    async getDescription() {
		try {
			const settingsApiCall = await fetch(Constants.siteUrl + 'settings', {
				method: "GET", // *GET, POST, PUT, DELETE, etc.
				mode: "cors", // no-cors, cors, *same-origin
				cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
				credentials: "same-origin", // include, *same-origin, omit
				headers: { ...Constants.headers },
				redirect: "follow", // manual, *follow, error
				referrer: "no-referrer", // no-referrer, *client
			});
			const settings = await settingsApiCall.json();
			if (settings.status = 200) {

				this.setState({
					contactData: settings.data,
					loading: false
				});
			} else {
			}
		} catch (err) {
			console.log("Error fetching data-----------", err);
		}
	}
    submitOrder() {
        Keyboard.dismiss();
        let errors = { ...this.state.errors }
        this.setState({ input1: '#ebebeb', input1Icon: '#a3a3a3', input2: '#ebebeb', input2Icon: '#a3a3a3', input3: '#ebebeb', input3Icon: '#a3a3a3', input4: '#ebebeb', input4Icon: '#a3a3a3' })
        errors.name = "";
        errors.email = ""
        errors.phone = ""
        errors.message = ""
        this.setState({ errors })

        fetch(Constants.siteUrl + 'contact', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: Constants.headers,
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify({
                name: this.state.name,
                email: this.state.email,
                phone: this.state.phone,
                message: this.state.message,
                type: "order"
            }), // body data type must match "Content-Type" header
        })
            .then(response => response.json())
            .then((res) => {
                console.log(res)
                if (Object.entries(res.errors).length > 0) {

                    if (res.errors.hasOwnProperty('name')) {
                        this.setState({ input1: '#ff0000', input1Icon: '#ff0000' })
                        errors.name = res.errors.name;
                    }
                    if (res.errors.hasOwnProperty('email')) {
                        this.setState({ input2: '#ff0000', input2Icon: '#ff0000' })
                        errors.email = res.errors.email
                    }
                    if (res.errors.hasOwnProperty('phone')) {
                        this.setState({ input3: '#ff0000', input3Icon: '#ff0000' })
                        errors.phone = res.errors.phone
                    }
                    if (res.errors.hasOwnProperty('message')) {
                        this.setState({ input4: '#ff0000', input4Icon: '#ff0000' })
                        errors.message = res.errors.message
                    }
                    this.setState({ errors })

                } else {
                    showMessage({
                        message: "تنبية",
                        description: 'تم ارسال الطلب بنجاح',
                        duration: 2000,
                        type: "success",
                    });
                    this.props.navigation.navigate('Home');
                }
            })
    }
    async componentDidMount() {
        try {
            let username = await AsyncStorage.getItem('name')

            let phone = await AsyncStorage.getItem('phone')
            let email = await AsyncStorage.getItem('email')
            if (username != null) {
                this.setState({
                    name: username,
                    email: email,
                    phone: phone,
                });
            }
            // this.getDescription();
        } catch (error) {
            console.log("Error retrieving data" + error);
        }

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
                            <Text style={{ fontFamily: Constants.fontFamilyBold, color: '#ffffff', fontSize: 16, textAlign: 'left', writingDirection: 'ltr', }} numberOfLines={1} ellipsizeMode='clip'>الطلبات الخاصة</Text>
                        </Body>
                        <Right>
                            <TouchableOpacity style={styles.HeaderRight} onPress={() => { this.props.navigation.goBack(); }}>
                                <FontAwesome5 name="chevron-left" style={styles.HeaderRightIcon} />
                            </TouchableOpacity>
                        </Right>
                    </Header>
                </LinearGradient>
                <Content>
                    <Image source={require('../../assets/images/specialBanner.png')} style={styles.banner} />
                    <View style={{ padding: 10 }}>
                        {/* <Text style={styles.description}>{this.state.contactData.special_order_txt} </Text> */}

                        <Text style={{ color: '#514e5e', fontFamily: Constants.fontFamilyBold, marginVertical: 20, fontSize: 18, textAlign: 'center' }}>
                            فضلا املئ الطلب
                        </Text>
                        <Form style={styles.Form}>
                            <View style={[styles.InputHolder, { borderColor: this.state.input1 }]}>
                                <FontAwesome5 name='user' style={[styles.InputIcon, { color: this.state.input1Icon }]} solid />
                                <Input
                                    placeholder='الاسم بالكامل'
                                    keyboardType="default"
                                    returnKeyType="next"
                                    onFocus={() => { this.setState({ input1: '#45c9ae', input1Icon: '#45c9ae' }) }}
                                    onBlur={() => { this.setState({ input1: '#ebebeb', input1Icon: '#a3a3a3' }) }}
                                    style={[styles.textInput, { color: "#000" }]}
                                    placeholderTextColor={"#000"}
                                    onChangeText={(text) => this.setState({ name: text })}
                                    value={this.state.name}
                                />
                            </View>
                            {this.state.errors.name != '' ? <Text style={styles.error}>{this.state.errors.name}</Text> : null}
                            <View style={[styles.InputHolder, { borderColor: this.state.input2 }]}>
                                <FontAwesome5 name='envelope' style={[styles.InputIcon, { color: this.state.input2Icon }]} solid />
                                <Input
                                    placeholder='البريد الالكتروني'
                                    keyboardType="email-address"
                                    returnKeyType="next"
                                    onFocus={() => { this.setState({ input2: '#45c9ae', input2Icon: '#45c9ae' }) }}
                                    onBlur={() => { this.setState({ input2: '#ebebeb', input2Icon: '#a3a3a3' }) }}
                                    style={[styles.textInput, { color: "#000" }]}
                                    placeholderTextColor={"#000"}
                                    onChangeText={(text) => this.setState({ email: text })}
                                    value={this.state.email}
                                />
                            </View>
                            {this.state.errors.email != '' ? <Text style={styles.error}>{this.state.errors.email}</Text> : null}
                            <View style={[styles.InputHolder, { borderColor: this.state.input3 }]}>
                                <FontAwesome5 name='phone' style={[styles.InputIcon, { color: this.state.input3Icon }]} solid />
                                <Input
                                    placeholder='رقم الجوال'
                                    keyboardType="phone-pad"
                                    returnKeyType="next"
                                    onFocus={() => { this.setState({ input3: '#45c9ae', input3Icon: '#45c9ae' }) }}
                                    onBlur={() => { this.setState({ input3: '#ebebeb', input3Icon: '#a3a3a3' }) }}
                                    style={[styles.textInput, { color: "#000" }]}
                                    placeholderTextColor={"#000"}
                                    onChangeText={(text) => this.setState({ phone: text })}
                                    value={this.state.phone}
                                />
                            </View>
                            {this.state.errors.phone != '' ? <Text style={styles.error}>{this.state.errors.phone}</Text> : null}
                            <View style={[styles.InputHolder, { borderColor: this.state.input4, alignItems: 'flex-start', justifyContent: 'flex-start', padding: 10 }]}>
                                <FontAwesome5 name='comment' style={[styles.InputIcon, { color: this.state.input4Icon, marginTop: 10 }]} solid />
                                <Input
                                    placeholder='اكتب الطلب هنا'
                                    keyboardType="default"
                                    multiline={true}
                                    numberOfLines={4}
                                    onFocus={() => { this.setState({ input4: '#45c9ae', input4Icon: '#45c9ae' }) }}
                                    onBlur={() => { this.setState({ input4: '#ebebeb', input4Icon: '#a3a3a3' }) }}
                                    style={[styles.textInput, { color: "#000", textAlign: 'right', minHeight: 150, textAlignVertical: 'top' }]}
                                    placeholderTextColor={"#000"}
                                    onChangeText={(text) => this.setState({ message: text })}
                                    value={this.state.message}
                                />
                            </View>
                            {this.state.errors.message != '' ? <Text style={styles.error}>{this.state.errors.message}</Text> : null}
                        </Form>
                        <TouchableOpacity style={styles.LoginButton} onPress={() => this.submitOrder()}>
                            <LinearGradient style={styles.Gradient} colors={['#7dde9d', '#17b7bd']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
                                <Text style={styles.ButtonText}>إرسال</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Content>
                <Footer />
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    HeaderRightIcon: { fontSize: 20, color: '#fff', marginRight: 10 },
    banner: { width: width, height: height * 0.3 },
    description: { fontFamily: Constants.fontFamilyLight, textAlign: 'center', lineHeight: 20, fontSize: 16 },
    InputHolder: { borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, marginBottom: 10, borderRadius: 3 },
    Form: { paddingHorizontal: 20 },
    InputIcon: { fontSize: 20, marginRight: 10 },
    textInput: { fontFamily: Constants.fontFamilyRoman, fontSize: 14, textAlign: 'right' },
    Gradient: { padding: 10 },
    LoginButton: { marginVertical: 10, marginHorizontal: 20, },
    ButtonText: { textAlign: 'center', color: 'white', fontFamily: Constants.fontFamilyBold },
    error: { color: '#ff0000', textAlign: 'center', fontSize: 14, fontFamily: Constants.fontFamilyLight, marginBottom: 10 }
})
