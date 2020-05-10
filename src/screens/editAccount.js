'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import React, { Component } from 'react';
import { Platform, StyleSheet, View, Dimensions, Image, TouchableOpacity ,Animated,Keyboard} from 'react-native';
import { Container, Content, Header, Left, Body, Right, Text, Form, Input } from 'native-base';
import LinearGradient from "react-native-linear-gradient";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from "react-native-image-picker";
import ImgToBase64 from 'react-native-image-base64';
import { showMessage } from "react-native-flash-message";
import Constants from '../config/constants';
import { connect } from 'react-redux'

// import Preloader from '../Components/preloader'

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
class editAccount extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: false,
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
			name: '',
			email: '',
			phone: '',
			address: '',
			password:'',
			password_confirmation:'',
			settingsImage: [],
			errors: {
				email: "",
				name: "",
				password: "",
				password_confirmation: "",
				phone: "",
			},
			addOfferAnimate: new Animated.Value(5000),
			fadeAnim2: new Animated.Value(0),
		};
		this.zAnimate2 = this.state.fadeAnim2.interpolate({
			inputRange: [0, 1],
			outputRange: [-1, 99]
		})
	}
	async getAccount() {
		try {
			let api_token = await AsyncStorage.getItem('api_token');
			const settingsApiCall = await fetch(Constants.siteUrl + 'profile', {
				method: "GET", // *GET, POST, PUT, DELETE, etc.
				mode: "cors", // no-cors, cors, *same-origin
				cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
				credentials: "same-origin", // include, *same-origin, omit
				headers: { ...Constants.headers, 'Api-Token': api_token },
				redirect: "follow", // manual, *follow, error
				referrer: "no-referrer", // no-referrer, *client
			});
			const settings = await settingsApiCall.json();
			if (settings.status = 200) {
				if (settings.image != '') {
					this.setState({
						settingsImage: {
							type: 'link',
							uri: settings.data.image
						}
					});
				}
				this.setState({
					name: settings.data.name,
					email: settings.data.email,
					phone: settings.data.phone,
					loading: false
				});
			} else {
			}
		} catch (err) {
			console.log("Error fetching data-----------", err);
		}
	}

	pickImageHandler = () => {
		ImagePicker.showImagePicker({ title: "Pick an Image", maxWidth: 800, maxHeight: 600 }, res => {
			if (res.didCancel) {
				console.log("User cancelled!");
			} else if (res.error) {
				console.log("Error", res.error);
			} else {
				ImgToBase64.getBase64String(res.uri)
					.then((base64String) => {
						this.setState({
							settingsImage: { type: 'base64', uri: 'data:image/png;base64,' + base64String }
						});
					})
					.catch(err => console.log(err));
			}
		});
	}
	async postAccount() {
		try {
			Keyboard.dismiss()
			let api_token = await AsyncStorage.getItem('api_token');
			let fcmToken = AsyncStorage.getItem('fcmToken');
			let errors = {...this.state.errors}
			var sendArray = {};
			sendArray['api_token'] = api_token;


			if (this.state.settingsImage.length != 0 && this.state.settingsImage.type == 'base64') {
				sendArray['image'] = this.state.settingsImage.uri;
			}
			if (this.state.name != '') {
				sendArray['name'] = this.state.name;
			}
			if (this.state.phone != '') {
				sendArray['phone'] = this.state.phone;
			}
			if (this.state.email != '') {
				sendArray['email'] = this.state.email;
			}
			sendArray['dev_type'] = Platform.OS === 'ios' ? 'ios' : 'android'
			sendArray['dev_token'] = fcmToken
			const accountApiCall = await fetch(Constants.siteUrl + 'profile', {
				method: "PUT", // *GET, POST, PUT, DELETE, etc.
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

				if (account.errors.hasOwnProperty('name')) {
					this.setState({ input1: '#ff0000', input1Icon: '#ff0000' })
					errors.name = account.errors.name;
				}
				if (account.errors.hasOwnProperty('email')) {
					this.setState({ input2: '#ff0000', input2Icon: '#ff0000' })
					errors.email = account.errors.email
				}
				if (account.errors.hasOwnProperty('phone')) {
					this.setState({ input3: '#ff0000', input3Icon: '#ff0000' })
					errors.phone = account.errors.phone
				}
				
				this.setState({ errors })
			} else {
				this.props.dispatch({ type: 'UPDATE_NAME', data:account.data.name })
				this.props.dispatch({ type: 'UPDATE_EMAIL', data:account.data.email })
				this.props.dispatch({ type: 'UPDATE_PHONE', data:account.data.phone })
				this.props.dispatch({ type: 'UPDATE_IMAGE', data:account.data.image })
				AsyncStorage.setItem('api_token', account.data.api_token);
				AsyncStorage.setItem('name', account.data.name);
				AsyncStorage.setItem('email', account.data.email);
				AsyncStorage.setItem('phone', account.data.phone);
				AsyncStorage.setItem('image', account.data.image);
				showMessage({
					message: "تنبية",
					description: 'تم تعديل الحساب بنجاح',
					duration: 2000,
					type: "success",
				});
				this.props.navigation.navigate('Home')
			}
		} catch (err) {
			console.log("Error fetching data-----------", err);
		}
	}
	async changePassword(){
		try {
			Keyboard.dismiss()
			let api_token = await AsyncStorage.getItem('api_token');
			let fcmToken = AsyncStorage.getItem('fcmToken');
			let errors = {...this.state.errors}
			var sendArray = {};
			sendArray['api_token'] = api_token;			
			if (this.state.password != '') {
				sendArray['password'] = this.state.password;
			}
			if (this.state.password_confirmation != '') {
				sendArray['password_confirmation'] = this.state.password_confirmation;
			}
			sendArray['dev_type'] = Platform.OS === 'ios' ? 'ios' : 'android'
			sendArray['dev_token'] = fcmToken
			const accountApiCall = await fetch(Constants.siteUrl + 'profile', {
				method: "PUT", // *GET, POST, PUT, DELETE, etc.
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

				if (account.errors.hasOwnProperty('password')) {
					this.setState({ input4: '#ff0000', input4Icon: '#ff0000' })
					errors.password = account.errors.password
				}
				if (account.errors.hasOwnProperty('password_confirmation')) {
					this.setState({ input5: '#ff0000', input5Icon: '#ff0000' })
					errors.password_confirmation = account.errors.password_confirmation
				}
				this.setState({ errors })
			} else {
				AsyncStorage.setItem('api_token', account.data.api_token);
				AsyncStorage.setItem('name', account.data.name);
				showMessage({
					message: "تنبية",
					description: 'تم تعديل الحساب بنجاح',
					duration: 2000,
					type: "success",
				});
				this.props.navigation.navigate('Home')
			}
		} catch (err) {
			console.log("Error fetching data-----------", err);
		}
	}
	_openModal() {
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
	}
	_hideModal() {
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
	}
	async componentDidMount() {
		await this.getAccount()
	}

	render() {
		if (this.state.settingsImage.length == 0) {
			var image = <Image source={require('../../assets/images/editAccountImage.png')} style={styles.mainImage} />
		} else {
			var base = this.state.settingsImage.uri;
			var image = <Image source={{ uri: base }} style={styles.mainImage} />
		}
		if (!this.state.loading) {
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
								<Text style={{ fontFamily: Constants.fontFamilyBold, color: '#ffffff', fontSize: 16, textAlign: 'left', writingDirection: 'ltr', }} numberOfLines={1} ellipsizeMode='clip'>تعديل حسابي</Text>
							</Body>
							<Right>
								<TouchableOpacity style={styles.HeaderRight} onPress={() => { this.props.navigation.goBack(); }}>
									<FontAwesome5 name="chevron-left" style={styles.HeaderRightIcon} />
								</TouchableOpacity>


							</Right>
						</Header>
					</LinearGradient>
					<Content>
						<View style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 10 }}>
							<View style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
								{image}
							</View>
							<TouchableOpacity style={styles.selectImage} onPress={() => { this.pickImageHandler(); }} >
								<FontAwesome5 name="image" style={{ color: '#a3a2a7', fontSize: 16, marginRight: 10 }} />
								<Text style={{ fontFamily: Constants.fontFamilyBold, color: '#a3a2a7' }}>تعديل الصورة</Text>
							</TouchableOpacity>
							<Form>
								<Text style={styles.PageTitle}>تعديل البيانات الأساسية</Text>
								<View style={[styles.InputHolder, { borderColor: this.state.input1 }]}>
									<FontAwesome5 name='user' style={[styles.InputIcon, { color: this.state.input1Icon }]} solid />
									<Input
										placeholder='الاسم بالكامل'
										keyboardType="default"
										returnKeyType="next"
										onFocus={() => { this.setState({ input1: '#45c9ae', input1Icon: '#45c9ae' }) }}
										onBlur={() => { this.setState({ input1: '#ebebeb', input1Icon: '#a3a3a3' }) }}
										style={[styles.textInput, { color: "#000" }]}
										placeholderTextColor="#000"
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
										placeholderTextColor="#000"
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
										placeholderTextColor="#000"
										onChangeText={(text) => this.setState({ phone: text })}
										value={this.state.phone}
									/>
								</View>
								{this.state.errors.phone != '' ? <Text style={styles.error}>{this.state.errors.phone}</Text> : null}
								<TouchableOpacity onPress={()=>this._openModal()}>
								<Text style={[styles.PageTitle,{color:'#ee6276',textDecorationLine: 'underline',fontFamily:Constants.fontFamilyRoman}]}>تعديل كلمة المرور</Text>
								</TouchableOpacity>
								
								
							</Form>
							<TouchableOpacity style={styles.LoginButton} onPress={() => this.postAccount()}>
								<LinearGradient style={styles.Gradient} colors={['#7dde9d', '#17b7bd']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
									<Text style={styles.ButtonText}>حفظ التغييرات</Text>
								</LinearGradient>
							</TouchableOpacity>
						</View>
					</Content>
					<Animated.View style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: this.zAnimate2, opacity: this.state.fadeAnim2, justifyContent: 'center', alignItems: 'center', display: 'flex', height, width }}>
						<Animated.View
							style={[styles.addOfferModal,
							{ transform: [{ translateY: this.state.addOfferAnimate }] }]}
						>
							<TouchableOpacity onPress={() => { this._hideModal('addOffer'); }}>
								<FontAwesome5 name="times-circle" style={{ color: '#e0e0e0', fontSize: 20, }} solid />
							</TouchableOpacity>
							{/* <ScrollView contentContainerStyle={{paddingBottom: 50,}}> */}
							<Text style={{ textAlign: 'center', color: '#514e5e', fontFamily: Constants.fontFamilyBlack, fontSize: 20, marginBottom: 20 }}>تغيير كلمة المرور</Text>
							<Form style={styles.Form}>
							<View style={[styles.InputHolder, { borderColor: this.state.input4 }]}>
									<FontAwesome5 name='lock' style={[styles.InputIcon, { color: this.state.input4Icon, }]} solid />
									<Input
										placeholder='كلمة المرور'
										keyboardType="default"
										secureTextEntry={true}
										onFocus={() => { this.setState({ input4: '#45c9ae', input4Icon: '#45c9ae' }) }}
										onBlur={() => { this.setState({ input4: '#ebebeb', input4Icon: '#a3a3a3' }) }}
										style={[styles.textInput, { color: this.state.input4, textAlign: 'right' }]}
										placeholderTextColor={this.state.input4Icon}
										onChangeText={(text) => this.setState({ password: text })}
										value={this.state.password}
									/>
								</View>
								{this.state.errors.password != '' ? <Text style={styles.error}>{this.state.errors.password}</Text> : null}
								<View style={[styles.InputHolder, { borderColor: this.state.input5 }]}>
									<FontAwesome5 name='lock' style={[styles.InputIcon, { color: this.state.input5Icon, }]} solid />
									<Input
										placeholder='تأكيد كلمة المرور'
										keyboardType="default"
										secureTextEntry={true}
										onFocus={() => { this.setState({ input5: '#45c9ae', input5Icon: '#45c9ae' }) }}
										onBlur={() => { this.setState({ input5: '#ebebeb', input5Icon: '#a3a3a3' }) }}
										style={[styles.textInput, { color: this.state.input5, textAlign: 'right' }]}
										placeholderTextColor={this.state.input5Icon}
										onChangeText={(text) => this.setState({ password_confirmation: text })}
										value={this.state.password_confirmation}
									/>
								</View>
								{this.state.errors.password_confirmation != '' ? <Text style={styles.error}>{this.state.errors.password_confirmation}</Text> : null}
							</Form>
							<TouchableOpacity style={styles.LoginButton} onPress={()=>this.changePassword()} >
								<LinearGradient style={styles.Gradient} colors={['#7dde9d', '#17b7bd']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
									<Text style={styles.ButtonText}>إرسال</Text>
								</LinearGradient>
							</TouchableOpacity>
							{/* </ScrollView> */}



						</Animated.View>
					</Animated.View>
				</Container>
			);
		}
		else {
			// return(<Preloader />)
		}
	}
}

const styles = StyleSheet.create({
	HeaderRightIcon: { fontSize: 20, color: '#fff', marginRight: 10 },
	mainImage: {
		marginTop: 20,
		marginBottom: 20,
		height: 169,
		width: 169,
		borderRadius: 169 / 2
	},
	selectImage: {
		marginBottom: 10,
		marginRight: 20,
		marginLeft: 20,
		borderRadius: 25,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	PageTitle: { textAlign: 'left', fontSize: 16, fontFamily: Constants.fontFamilyBlack, marginBottom: 20, marginLeft: 20, color: '#514e5e' },
	InputHolder: { borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, marginBottom: 10, borderRadius: 3, marginHorizontal: 20 },
	Form: { paddingHorizontal: 20 },
	InputIcon: { fontSize: 20, marginRight: 10 },
	textInput: { fontFamily: Constants.fontFamilyRoman, fontSize: 14, textAlign: 'right' },
	Gradient: { padding: 10 },
	LoginButton: { marginVertical: 10, marginHorizontal: 20, },
	ButtonText: { textAlign: 'center', color: 'white', fontFamily: Constants.fontFamilyBold },
	addOfferModal: { top: 100, width: width - 40, position: 'absolute', backgroundColor: '#fff', zIndex: 5, borderRadius: 5, padding: 10 },
	error: { color: '#ff0000', textAlign: 'center', fontSize: 14, fontFamily: Constants.fontFamilyLight, marginBottom: 10 }
});
function mapStateToProps(state) {
	return {
		Login: state.Login,
		Name: state.Name,
		Image: state.Image,
	}
}
export default connect(mapStateToProps)(editAccount)