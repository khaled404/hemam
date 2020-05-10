'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import React, { Component } from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Dimensions,Animated, Easing, } from 'react-native'
import { Container, Content, Header, Body, Left, Right, List, ListItem } from 'native-base'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from "react-native-linear-gradient";
import Constants from '../config/constants';
import Preloader from '../components/preloader';
import Footer from '../components/Footer';
import CardNews from '../components/cardNews';

/**********************************************************************
*
*                               Class
*
**********************************************************************/
export default class News extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			news: []
		};
		this.animatedValue = new Animated.Value(0);
	}

	renderNews() {
		
		const opacity = this.animatedValue
		  const marginLeft= this.animatedValue
		  let newsArray = [];
		this.state.news.map((item, index) => {
			// if (index % 2 === 0) {
				// newsArray.push(<Animated.View key={item.id} style={{opacity}}><CardNews id={item.id} Title={item.title} image={{uri:item.image}} Date={item.created_at} /></Animated.View>)
			// }else{
				newsArray.push(<Animated.View key={item.id} style={{opacity}}><CardNews id={item.id}  Title={item.title} image={{uri:item.image}} Date={item.created_at} /></Animated.View>)
			// }
		})
		return newsArray

	}
	async getNews() {
		try {
			const newsApiCall = await fetch(Constants.siteUrl+'news', {
				method: "GET", // *GET, POST, PUT, DELETE, etc.
				mode: "cors", // no-cors, cors, *same-origin
				cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
				credentials: "same-origin", // include, *same-origin, omit
				headers: Constants.headers,
				redirect: "follow", // manual, *follow, error
				referrer: "no-referrer", // no-referrer, *client
			});
			const news = await newsApiCall.json();
			console.log(news);
			
			if (news.status == 200) {
				this.setState({
					news: news.data,
					loading: false
				});
			} 
		} catch (err) {
			console.log("Error fetching data-----------", err);
		}
	}
	componentDidMount() {
		this.getNews();
		this.animatedValue.setValue(0)
		setTimeout(() => {
			Animated.timing(
				this.animatedValue,
				{
					toValue: 1,
					duration: 2000,
					easing: Easing.inOut(Easing.quad)
				}
			).start()
		}, 500);
	}
	render() {
		let mWidth = Dimensions.get('window').width;
		const { navigation } = this.props;

		return (

			<Container>
				<LinearGradient colors={['#7dde9d', '#17b7bd']} start={{ x: 0.0, y: 0.5 }} end={{ x: 1.0, y: 0.5 }} locations={[0.0, 1.0]} >
					<Header style={{ backgroundColor: "transparent", display: 'flex'  ,elevation:0}}>
						<Left style={{ flex: 1 }}>
							<TouchableOpacity style={{ marginLeft: 10 }} onPress={() => { this.props.navigation.openDrawer(); }}>
								<FontAwesome5 name="bars" style={{ fontSize: 20, color: 'white' }} />
							</TouchableOpacity>
						</Left>
						<Body style={{ flex: 7, display: 'flex', alignItems: 'flex-start' }}>
							<Text style={{ fontFamily: Constants.fontFamilyBold, color: '#ffffff', fontSize: 16, textAlign: 'left', writingDirection: 'ltr', }}>أخبارنا</Text>
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
					<View style={{ flexDirection: 'column', flexWrap: 'wrap', padding: 10, justifyContent: 'space-evenly', flex: 1 }}>
						{this.renderNews()}
					</View>
				</Content>
				<Footer />
			</Container>
		)
	}
}

const styles = StyleSheet.create({
	HeaderRightIcon: { fontSize: 20, color: '#fff', marginRight: 10 },
})