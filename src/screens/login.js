'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Platform,Keyboard } from 'react-native';
import { Container, Content, Text, Form, Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from "react-native-linear-gradient";
import Constants from '../config/constants';
import { connect } from 'react-redux'
import { showMessage } from "react-native-flash-message";

/**********************************************************************
*
*                               Class
*
**********************************************************************/
class login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			email: '',
			password: '',
			errors: {
				email: "",
				password: "",
				notFount:""
			},
			input1: '#ebebeb',
			input1Icon: '#a3a3a3',
			input2: '#ebebeb',
			input2Icon: '#a3a3a3',
		};
	}
	async doLogin() {
		Keyboard.dismiss()
		let fcmToken = await AsyncStorage.getItem('fcmToken');
		let errors = { ...this.state.errors }
		this.setState({ input1: '#ebebeb', input1Icon: '#a3a3a3', input2: '#ebebeb', input2Icon: '#a3a3a3' })
		errors.email = ""
		errors.password = ""
		errors.notFount = ""
		this.setState({errors})
		fetch(Constants.siteUrl + 'login', {
			method: "POST", // *GET, POST, PUT, DELETE, etc.
			mode: "cors", // no-cors, cors, *same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "same-origin", // include, *same-origin, omit
			headers: Constants.headers,
			redirect: "follow", // manual, *follow, error
			referrer: "no-referrer", // no-referrer, *client
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password,
				dev_type: Platform.OS === 'ios' ? 'ios' : 'android',
				dev_token: fcmToken
			}),
		})
		.then(response => response.json())
		.then((res) => {
			if (res.status == 400) {
				errors.notFount = 'بيانات خاطئة برجاء التاكد من البريد الالكتروني وكلمة المرور'
				this.setState({errors})
			}else{
				if (Object.entries(res.errors).length > 0) {
					if (res.errors.hasOwnProperty('email')) {
						this.setState({ input1: '#ff0000', input1Icon: '#ff0000' })
						errors.email = res.errors.email
					}
					if (res.errors.hasOwnProperty('password')) {
						this.setState({ input2: '#ff0000', input2Icon: '#ff0000' })
						errors.password = res.errors.password
					}
					this.setState({errors})
				} else {
					this.props.dispatch({ type: 'UPDATE_LOGIN', data:true })
					this.props.dispatch({ type: 'UPDATE_NAME', data:res.data.name })
					this.props.dispatch({ type: 'UPDATE_EMAIL', data:res.data.email })
					this.props.dispatch({ type: 'UPDATE_PHONE', data:res.data.phone })
					this.props.dispatch({ type: 'UPDATE_IMAGE', data:res.data.image })
					AsyncStorage.setItem('api_token',res.data.api_token);
					AsyncStorage.setItem('name',res.data.name);
					AsyncStorage.setItem('email',res.data.email);
					AsyncStorage.setItem('phone',res.data.phone);
					AsyncStorage.setItem('image',res.data.image);
					showMessage({
						message: "تنبية",
						description: 'تم تسجيل الدخول بنجاح',
						duration: 2000,
						type: "success",
					});
					this.props.navigation.navigate('Home')
				}
			}	
		})
	}
	render() {
		return (
			<Container>
				<Content>
					<View style={{ alignItems: 'flex-end', paddingRight: 15, paddingTop: 10 }}>
						<TouchableOpacity style={styles.HeaderRight} onPress={() => { this.props.navigation.goBack(); }}>
							<Text style={styles.HeaderRightText}>الرجوع</Text>
							<FontAwesome5 name="chevron-left" style={styles.HeaderRightIcon} />
						</TouchableOpacity>
					</View>
					<View style={styles.ViewWraper}>
						<View style={styles.LogoWraper}>
							<Image style={styles.LogoImage} source={require('../../assets/images/sign-logo.png')} />
						</View>
						<Text style={styles.PageTitle}>تسجيـل الدخـول</Text>
						{this.state.errors.notFount !=''?<Text style={styles.error}>{this.state.errors.notFount}</Text>:null}
						<Form style={styles.Form}>
							<View style={[styles.InputHolder, { borderColor: this.state.input1 }]}>
								<FontAwesome5 name='envelope' style={[styles.InputIcon, { color: this.state.input1Icon }]} solid />
								<Input
									placeholder='البريد الالكتروني'
									keyboardType="email-address"
									returnKeyType="next"
									onFocus={() => { this.setState({ input1: '#45c9ae', input1Icon: '#45c9ae' }) }}
									onBlur={() => { this.setState({ input1: '#ebebeb', input1Icon: '#a3a3a3' }) }}
									style={[styles.textInput, { color: "#000" }]}
									placeholderTextColor={"#000"}
									onChangeText={(text) => this.setState({ email: text })}
									value={this.state.email}
								/>
							</View>
							{this.state.errors.email !=''?<Text style={styles.error}>{this.state.errors.email}</Text>:null}
							<View style={[styles.InputHolder, { borderColor: this.state.input2 }]}>
								<FontAwesome5 name='lock' style={[styles.InputIcon, { color: this.state.input2Icon, }]} solid />
								<Input
									placeholder='كلمة المرور'
									keyboardType="default"
									secureTextEntry={true}
									onFocus={() => { this.setState({ input2: '#45c9ae', input2Icon: '#45c9ae' }) }}
									onBlur={() => { this.setState({ input2: '#ebebeb', input2Icon: '#a3a3a3' }) }}
									style={[styles.textInput, { color: "#000", textAlign: 'right' }]}
									placeholderTextColor={"#000"}
									onChangeText={(text) => this.setState({ password: text })}
									value={this.state.password}
								/>
							</View>
							{this.state.errors.password !=''?<Text style={styles.error}>{this.state.errors.password}</Text>:null}
						</Form>
						<TouchableOpacity style={styles.LoginButton} onPress={() => this.doLogin()}>
							<LinearGradient style={styles.Gradient} colors={['#7dde9d', '#17b7bd']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
								<Text style={styles.ButtonText}>تسجيل الدخول</Text>
							</LinearGradient>
						</TouchableOpacity>
						<TouchableOpacity style={styles.LoginButton} onPress={() => this.props.navigation.navigate('Forgot')}>
							<Text style={styles.ForgetText}>هل فقدت كلمة المرور؟</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.LoginButton} onPress={() => this.props.navigation.navigate('Register')}>
							<LinearGradient style={styles.Gradient} colors={['#fca46e', '#ee6176']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
								<Text style={styles.ButtonText}>تسجيل حساب جديد</Text>
							</LinearGradient>
						</TouchableOpacity>

					</View>
				</Content>
			</Container>
		);

	}
}
const styles = StyleSheet.create({
	HeaderRight: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
	HeaderRightText: { color: '#a6a6a6', fontFamily: Constants.fontFamilyBold, fontSize: 18, marginHorizontal: 5 },
	HeaderRightIcon: { fontSize: 20, color: '#a6a6a6' },
	ViewWraper: { width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 10 },
	LogoWraper: { flex: 1, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' },
	LogoImage: { marginTop: 20, marginBottom: 20, height: 190, width: 190, resizeMode: 'contain' },
	PageTitle: { textAlign: 'center', fontSize: 20, fontFamily: Constants.fontFamilyBlack, marginBottom: 20, color: '#514e5e' },
	InputHolder: { borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, marginBottom: 10, borderRadius: 3 },
	Form: { paddingHorizontal: 20 },
	InputIcon: { fontSize: 20, marginRight: 10 },
	textInput: { fontFamily: Constants.fontFamilyRoman, fontSize: 14, textAlign: 'right' },
	Gradient: { padding: 10 },
	LoginButton: { marginVertical: 10, marginHorizontal: 20, },
	ButtonText: { textAlign: 'center', color: 'white', fontFamily: Constants.fontFamilyBold },
	ForgetText: { textAlign: 'center', color: '#514e5e', fontFamily: Constants.fontFamilyLight },
	error:{ color: '#ff0000', textAlign: 'center', fontSize: 14, fontFamily: Constants.fontFamilyLight, marginBottom: 10 }
});

// redux state add to props
function mapStateToProps(state) {
	return {
	   Translate: state.Translate,
	   fontFamily: state.fontFamily,
	}
 }
 
 export default connect(mapStateToProps)(login)