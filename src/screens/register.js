'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Platform ,TextInput} from 'react-native';
import { Container, Content, Text, Form, Input } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage'; 
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from "react-native-linear-gradient";
import Constants from '../config/constants';
import RNRestart from 'react-native-restart';

import { showMessage } from "react-native-flash-message";
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
class login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			name: '',
			email: '',
			tel: '',
			password: '',
			password_confirmation: '',
			errors:{
				email: "",
				name: "",
				password: "",
				password_confirmation: "",
				phone: "",
			},
			input1: '#ebebeb',
			input1Icon: '#a3a3a3',
			input2: '#ebebeb',
			input2Icon: '#a3a3a3',
			input3: '#ebebeb',
			input3Icon: '#a3a3a3',
			input4: '#ebebeb',
			input4Icon: '#a3a3a3',
			input5: '#ebebeb',
			input5Icon: '#a3a3a3',
		};
	}
	componentDidMount() {

	}
	validate = (text) => {
		console.log(text);
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (reg.test(text) === false) {
			console.log("Email is Not Correct");
			this.setState({ email: text })
			return false;
		}
		else {
			this.setState({ email: text })
			console.log("Email is Correct");
		}
	}
	async doLogin() {
		let fcmToken = await AsyncStorage.getItem('fcmToken');
		let errors = {...this.state.errors}
		this.setState({ input1: '#ebebeb', input1Icon: '#a3a3a3', input2: '#ebebeb', input2Icon: '#a3a3a3', input3: '#ebebeb', input3Icon: '#a3a3a3', input4: '#ebebeb', input4Icon: '#a3a3a3', input5: '#ebebeb', input5Icon: '#a3a3a3', })
		errors.name ="";
		errors.email = ""
		errors.phone = ""
		errors.password = ""
		errors.password_confirmation = ""
		this.setState({errors})

		fetch(Constants.siteUrl + 'register', {
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
				phone: this.state.tel,
				password: this.state.password,
				password_confirmation: this.state.password_confirmation,
				dev_type: Platform.OS === 'ios' ? 'ios' : 'android',
				dev_token: fcmToken
			}), // body data type must match "Content-Type" header
		})
		.then(response => response.json())
		.then((res) => {
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
				if (res.errors.hasOwnProperty('password')) {
					this.setState({ input4: '#ff0000', input4Icon: '#ff0000' })
					errors.password = res.errors.password
				}
				if (res.errors.hasOwnProperty('password_confirmation')) {
					this.setState({ input5: '#ff0000', input5Icon: '#ff0000' })
					errors.password_confirmation = res.errors.password_confirmation
				}
				this.setState({errors})
			} else {
				AsyncStorage.setItem('api_token',res.data.api_token);
				AsyncStorage.setItem('name',res.data.name);
				AsyncStorage.setItem('email',res.data.email);
				AsyncStorage.setItem('phone',res.data.phone);
				AsyncStorage.setItem('image',res.data.image);
				showMessage({
					message: "تنبية",
					description: 'تم تسجيل الحساب بنجاح',
					duration:2000,
					type: "success",
				  });
				RNRestart.Restart();
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
						<Text style={styles.PageTitle}>تسجيل حساب جديد</Text>
						<Form style={styles.Form}>
							<View style={[styles.InputHolder, { borderColor: this.state.input1 }]}>
								<FontAwesome5 name='user' style={[styles.InputIcon, { color: this.state.input1Icon }]} solid />
								<TextInput
									placeholder='الاسم بالكامل'
									keyboardType="default"
									returnKeyType="next"
									onFocus={() => { this.setState({ input1: '#45c9ae', input1Icon: '#45c9ae' }) }}
									onBlur={() => { this.setState({ input1: '#ebebeb', input1Icon: '#a3a3a3' }) }}
									style={[styles.textInput, { color: "#000" }]}
									placeholderTextColor={"#000"}
									onChangeText={(text) => this.setState({ name: text })}
									value={this.state.name}
									onSubmitEditing={(event) => {
										this._input2.focus(); 
									}}
								/>
							</View>
							{this.state.errors.name !=''?<Text style={styles.error}>{this.state.errors.name}</Text>:null}
							
							<View style={[styles.InputHolder, { borderColor: this.state.input2 }]}>
								<FontAwesome5 name='envelope' style={[styles.InputIcon, { color: this.state.input2Icon }]} solid />
								<TextInput
									ref={(c) => this._input2 = c}
									placeholder='البريد الالكتروني'
									keyboardType="email-address"
									returnKeyType="next"
									onFocus={() => { this.setState({ input2: '#45c9ae', input2Icon: '#45c9ae' }) }}
									onBlur={() => { this.setState({ input2: '#ebebeb', input2Icon: '#a3a3a3' }) }}
									style={[styles.textInput, { color: "#000"}]}
									placeholderTextColor={"#000"}
									onChangeText={(text) => this.setState({ email: text })}
									value={this.state.email}
									onSubmitEditing={(event) => {
										this._input3.focus(); 
									}}
								/>
							</View>
							{this.state.errors.email !=''?<Text style={styles.error}>{this.state.errors.email}</Text>:null}
							<View style={[styles.InputHolder, { borderColor: this.state.input3 }]}>
								<FontAwesome5 name='phone' style={[styles.InputIcon, { color: this.state.input3Icon }]} solid />
								<TextInput
									ref={(c) => this._input3 = c}
									placeholder='رقم الجوال'
									keyboardType="phone-pad"
									returnKeyType="next"
									onFocus={() => { this.setState({ input3: '#45c9ae', input3Icon: '#45c9ae' }) }}
									onBlur={() => { this.setState({ input3: '#ebebeb', input3Icon: '#a3a3a3' }) }}
									style={[styles.textInput, { color: "#000" }]}
									placeholderTextColor={"#000"}
									onChangeText={(text) => this.setState({ tel: text })}
									value={this.state.tel}
									onSubmitEditing={(event) => {
										this._input4.focus(); 
									}}
								/>
							</View>
							{this.state.errors.phone !=''?<Text style={styles.error}>{this.state.errors.phone}</Text>:null}
							<View style={[styles.InputHolder, { borderColor: this.state.input4 }]}>
								<FontAwesome5 name='lock' style={[styles.InputIcon, { color: this.state.input4Icon, }]} solid />
								<TextInput
									ref={(c) => this._input4 = c}
									placeholder='كلمة المرور'
									keyboardType="default"
									secureTextEntry={true}
									onFocus={() => { this.setState({ input4: '#45c9ae', input4Icon: '#45c9ae' }) }}
									onBlur={() => { this.setState({ input4: '#ebebeb', input4Icon: '#a3a3a3' }) }}
									style={[styles.textInput, { color: "#000", textAlign: 'right' }]}
									placeholderTextColor={"#000"}
									onChangeText={(text) => this.setState({ password: text })}
									value={this.state.password}
									onSubmitEditing={(event) => {
										this._input5.focus(); 
									}}
								/>
							</View>
							{this.state.errors.password !=''?<Text style={styles.error}>{this.state.errors.password}</Text>:null}
							<View style={[styles.InputHolder, { borderColor: this.state.input5 }]}>
								<FontAwesome5 name='lock' style={[styles.InputIcon, { color: this.state.input5Icon, }]} solid />
								<TextInput
									ref={(c) => this._input5 = c}
									placeholder='إعادة كلمة المرور'
									keyboardType="default"
									secureTextEntry={true}
									onFocus={() => { this.setState({ input5: '#45c9ae', input5Icon: '#45c9ae' }) }}
									onBlur={() => { this.setState({ input5: '#ebebeb', input5Icon: '#a3a3a3' }) }}
									style={[styles.textInput, { color: "#000", textAlign: 'right' }]}
									placeholderTextColor={"#000"}
									onChangeText={(text) => this.setState({ password_confirmation: text })}
									value={this.state.password_confirmation}
									onSubmitEditing={(event) => {
										this.doLogin(); 
									}}
								/>
							</View>
							{this.state.errors.password_confirmation !=''?<Text style={styles.error}>{this.state.errors.password_confirmation}</Text>:null}
						</Form>
						<TouchableOpacity style={styles.LoginButton} onPress={() => this.doLogin()}>
							<LinearGradient style={styles.Gradient} colors={['#7dde9d', '#17b7bd']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
								<Text style={styles.ButtonText}>تسجيل</Text>
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
	LogoWraper: { flex: 1, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column', },
	LogoImage: { marginTop: 20, marginBottom: 20, height: 190, width: 190, resizeMode: 'contain', zIndex: 2 },
	PageTitle: { textAlign: 'center', fontSize: 20, fontFamily: Constants.fontFamilyBlack, marginBottom: 20, color: '#514e5e' },
	InputHolder: { borderWidth: 1, flexDirection: 'row', alignItems: 'center',  paddingHorizontal: 10, marginBottom: 10, borderRadius: 3 },
	Form: { paddingHorizontal: 20 },
	InputIcon: { fontSize: 20, marginRight: 10 },
	textInput: { fontFamily: Constants.fontFamilyRoman, fontSize: 14, textAlign: 'right',flex:1},
	Gradient: { padding: 10 },
	LoginButton: { marginVertical: 10, marginHorizontal: 20, },
	ButtonText: { textAlign: 'center', color: 'white', fontFamily: Constants.fontFamilyBold },
	error:{ color: '#ff0000', textAlign: 'center', fontSize: 14, fontFamily: Constants.fontFamilyLight, marginBottom: 10 }
});


export default login;