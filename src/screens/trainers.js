'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, Easing, RefreshControl, ScrollView, Dimensions} from 'react-native'
import { Container, Content, Header, Body, Left, Right } from 'native-base'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from '@react-native-community/async-storage';
import Preloader from '../components/preloader';
import Constants from '../config/constants';
import Footer from '../components/Footer';
import CardOffer from '../components/cardOffer';
import CardCategory from '../components/cardCategory';
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
export default class trainers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            refreshing: false,
            loadMore: false,
            paginationCurrentPage: 1,
            categoryTitle: '',
            orderBy: '',
            sortBy: '',
            filters:[],
            offers: [],
            childs: [],
        };
        this.animatedValue = new Animated.Value(0);
        this.animatedValueOpacity = new Animated.Value(0);
    }
    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.getCategory().then(() => {
            this.setState({ refreshing: false });
        });
    }
    
    async getCategory() {
        try {
            const { navigation } = this.props;
            const categoryApiCall = await fetch(Constants.siteUrl + 'trainers', {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: { ...Constants.headers },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
            });
            const category = await categoryApiCall.json();
            console.log(category);
            
            if (category.status == 200) {
                this.setState({
                    offers: category.data,
                    paginationCurrentPage: category.paginate.currentPage,
                    loading: false,
                });
            }
        } catch (err) {
            console.log("Error fetching data-----------", err);
        }
    }
    async loadMoreData() {
        try {
            let city_id = await AsyncStorage.getItem('@cityId').then((Intro) => {
                if (Intro != null) {
                    return Intro
                } else {
                    return 0;
                }
            })
            const { navigation } = this.props;
            const categoryId = navigation.getParam('categoryId')
            let postData = [];
            postData['page'] = this.state.paginationCurrentPage + 1;
            if (this.state.orderBy != '') {
                postData['orderby'] = this.state.orderBy
            }
            if (this.state.sortBy != '') {
                postData['sort'] = this.state.sortBy
            }
            const categoryApiCall = await fetch(Constants.siteUrl + 'category/' + categoryId + '/offers', {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: { ...Constants.headers, City: city_id },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: JSON.stringify(postData)
            });
            const category = await categoryApiCall.json();
            if (category.status = 200) {
                if (category.data.offers.length > 0) {
                    this.setState({
                        offers: category.data.offers,
                    });
                }
                this.setState({
                    categoryTitle: category.data.category,
                    paginationCurrentPage: category.paginate.currentPage,
                    refreshing: false,
                    loading: false,
                });
            }
        } catch (err) {
            console.log("Error fetching data-----------", err);
        }
    }
   
    renderOffers() {
        const opacity = this.animatedValue
        const marginLeft = this.animatedValue
        let offersArray = [];

        if (this.state.offers.length > 0 ) {
            this.state.offers.map((item, index) => {
                console.log(item);
                
                offersArray.push(
                    <TouchableOpacity style={styles.card} onPress={() => {
                        this.props.navigation.navigate('Trainer', {
                            trainerId: item.id,
                        });
                      }}>
                        <Image source={{uri:item.image}} style={styles.Image} />
                        <View style={{ padding: 5 }}>
                          <Text style={styles.Title}>{item.name}</Text>
                          <Text style={[{fontSize:14,color:'#514e5e'},styles.Title]}>{item.city_name}</Text>
                        </View>
                      </TouchableOpacity>
                    )
            })
        } else {
            offersArray.push(
                <View key={0} style={{ justifyContent: 'center', alignItems: 'center', flex: 1, display: 'flex' }}>
                    <FontAwesome5 name="exclamation-circle" style={{ color: 'red', fontSize: 120, marginBottom: 20, marginTop: 80 }} />
                    <Text style={{ fontFamily: Constants.fontFamilyBold, fontSize: 16 }}>لايوجد مدربين داخل مدينتك</Text>
                </View>
            )
        }
        return offersArray

    }
   
    componentDidMount() {
        this.getCategory()
    }
    componentWillUnmount() {
        this.setState({ isLoaded: false });
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
                            <Text style={{ fontFamily: Constants.fontFamilyBold, color: '#ffffff', fontSize: 16, textAlign: 'left', writingDirection: 'ltr', }}>المدربين</Text>
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
                    <ScrollView
                        style={{ marginTop: 35, flex: 1 }}
                        refreshControl={
                            <RefreshControl
                                onRefresh={() => this._onRefresh()}
                                refreshing={this.state.refreshing}
                            />
                        }
                        scrollEventThrottle={16}
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                            {
                                listener: event => {
                                    if (this.isCloseToBottom(event.nativeEvent)) {
                                        this.loadMoreData()
                                    }
                                }
                            }
                        )}
                        onMomentumScrollEnd={({ nativeEvent }) => {
                            if (this.isCloseToBottom(nativeEvent)) {
                                this.loadMoreData()
                            }
                        }}
                    >
                        
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10, justifyContent: 'space-evenly', flex: 1 }}>
                            {this.renderOffers()}
                        </View>
                    </ScrollView>


                </Content>
                <Footer />
            </Container>
        )

    }
}

const styles = StyleSheet.create({
    HeaderRightIcon: { fontSize: 20, color: '#fff', marginRight: 10 },
    card: { width: 150, borderWidth: 1, borderColor: '#ebebeb', borderTopRightRadius: 5, borderTopLeftRadius: 5, marginBottom: 10 },
  Image: { width: 150, height: height * 0.3 / 2, resizeMode: 'contain', },
  Title: { color: '#000', fontFamily: Constants.fontFamilyBold, fontSize: 12, textAlign: 'left', lineHeight: 15, paddingVertical: 5 },
})