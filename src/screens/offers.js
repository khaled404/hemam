"use strict";
/**********************************************************************
 *
 *                               Import Libraries
 *
 **********************************************************************/
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  RefreshControl,
  ScrollView
} from "react-native";
import { Container, Content, Header, Body, Left, Right } from "native-base";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import Preloader from "../components/preloader";
import Constants from "../config/constants";
import Footer from "../components/Footer";
import CardOffer from "../components/cardOffer";

/**********************************************************************
 *
 *                               Class
 *
 **********************************************************************/
export default class Offers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      refreshing: false,
      loadMore: false,
      paginationCurrentPage: 1,
      categoryTitle: "",
      orderBy: "",
      offers: []
    };
    this.animatedValue = new Animated.Value(0);
    this.animatedValueOpacity = new Animated.Value(0);
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getOffers().then(() => {
      this.setState({ refreshing: false });
    });
  };
  async getOffers() {
    try {
      let city_id = await AsyncStorage.getItem("@cityId").then(Intro => {
        if (Intro != null) {
          return Intro;
        } else {
          return 0;
        }
      });
      let postData = {};
      postData["page"] = this.state.paginationCurrentPage;
      if (this.state.orderBy != "") {
        postData["orderby"] = this.state.orderBy;
      }
      const categoryApiCall = await fetch(Constants.siteUrl + "usual_offers", {
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

      if ((category.status = 200)) {
        this.setState({
          paginationCurrentPage: category.paginate.currentPage,
          loading: false
        });
        if (category.data.length > 0) {
          this.setState({
            offers: category.data
          });
        }
      }
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }
  async loadMoreData() {
    try {
      let city_id = await AsyncStorage.getItem("@cityId").then(Intro => {
        if (Intro != null) {
          return Intro;
        } else {
          return 0;
        }
      });
      this.setState({ refreshing: true });
      let postData = {};
      postData["page"] = this.state.paginationCurrentPage + 1;
      if (this.state.orderBy != "") {
        postData["orderby"] = this.state.orderBy;
      }
      const categoryApiCall = await fetch(Constants.siteUrl + "usual_offers", {
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
      if ((category.status = 200)) {
        this.setState({
          paginationCurrentPage: category.paginate.currentPage,
          refreshing: false
        });
        if (category.data.length > 0) {
          this.setState({
            offers: category.data
          });
        }
      }
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }
  _updateSort(type) {
    this.setState({ orderBy: type }, () => {
      this.getOffers();
      this._openSort();
    });
  }
  componentDidMount() {
    this.getOffers();
  }

  componentWillUnmount() {
    this.setState({ isLoaded: false });
  }
  _openSort() {
    this.setState({ isLoaded: !this.state.isLoaded });
    Animated.timing(this.animatedValue, {
      toValue: !this.state.isLoaded ? 90 : 0,
      duration: 200,
      easing: Easing.inOut(Easing.quad)
    }).start();
    Animated.timing(this.animatedValueOpacity, {
      toValue: !this.state.isLoaded ? 1 : 0,
      duration: 1000,
      easing: Easing.inOut(Easing.quad)
    }).start();
  }
  renderOffers() {
    const opacity = this.animatedValue;
    const marginLeft = this.animatedValue;
    let offersArray = [];
    if (this.state.offers.length > 0) {
      this.state.offers.map((item, index) => {
        offersArray.push(
          <CardOffer
            key={item.id}
            id={item.id}
            Title={item.title}
            image={{ uri: item.image }}
            ratingCount={item.myrate.count}
            ratingStars={item.myrate.rate}
            offerType={item.exclusive}
          />
        );
      });
    } else {
      offersArray.push(
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            display: "flex"
          }}
          key={0}
        >
          <FontAwesome5
            name="exclamation-circle"
            style={{
              color: "red",
              fontSize: 120,
              marginBottom: 20,
              marginTop: 80
            }}
          />
          <Text style={{ fontFamily: Constants.fontFamilyBold, fontSize: 16 }}>
            لايوجد عروض تناسب مدينتك
          </Text>
        </View>
      );
    }

    return offersArray;
  }
  render() {
    const height = this.animatedValue;
    return (
      <Container>
        <LinearGradient
          colors={["#7dde9d", "#17b7bd"]}
          start={{ x: 0.0, y: 0.5 }}
          end={{ x: 1.0, y: 0.5 }}
          locations={[0.0, 1.0]}
        >
          <Header
            style={{
              backgroundColor: "transparent",
              display: "flex",
              elevation: 0
            }}
          >
            <Left style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ marginLeft: 10 }}
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <FontAwesome5
                  name="bars"
                  style={{ fontSize: 20, color: "white" }}
                />
              </TouchableOpacity>
            </Left>
            <Body
              style={{ flex: 7, display: "flex", alignItems: "flex-start" }}
            >
              <Text
                style={{
                  fontFamily: Constants.fontFamilyBold,
                  color: "#ffffff",
                  fontSize: 16,
                  textAlign: "left",
                  writingDirection: "ltr"
                }}
              >
                عروضنا
              </Text>
            </Body>
            <Right>
              <TouchableOpacity
                style={styles.HeaderRight}
                onPress={() => {
                  this._openSort();
                }}
              >
                <FontAwesome5
                  name="sort-amount-up"
                  style={styles.HeaderRightIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.HeaderRight}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
              >
                <FontAwesome5
                  name="chevron-left"
                  style={styles.HeaderRightIcon}
                />
              </TouchableOpacity>
            </Right>
          </Header>
        </LinearGradient>
        {this.state.loading == true ? <Preloader /> : null}
        <Content>
          <Animated.View
            style={[
              styles.sort,
              { height },
              this.state.isLoaded && { padding: 20 }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.sortTouchale,
                this.state.isLoaded && { display: "flex" }
              ]}
              onPress={() => {
                this._updateSort("latest");
              }}
            >
              <Text style={styles.sortText}>العروض الاحدث</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sortTouchale,
                this.state.isLoaded && { display: "flex" }
              ]}
              onPress={() => {
                this._updateSort("oldest");
              }}
            >
              <Text style={styles.sortText}>العروض الاقدم</Text>
            </TouchableOpacity>
          </Animated.View>
          <ScrollView
            style={{ marginTop: 35, flex: 1 }}
            refreshControl={
              <RefreshControl
                onRefresh={() => this._onRefresh()}
                refreshing={this.state.refreshing}
              />
            }
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
              {
                listener: event => {
                  if (this.isCloseToBottom(event.nativeEvent)) {
                    this.loadMoreData();
                  }
                }
              }
            )}
            onMomentumScrollEnd={({ nativeEvent }) => {
              if (this.isCloseToBottom(nativeEvent)) {
                this.loadMoreData();
              }
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                padding: 10,
                justifyContent: "space-evenly",
                flex: 1
              }}
            >
              {this.renderOffers()}
            </View>
          </ScrollView>
        </Content>
        <Footer />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  HeaderRightIcon: { fontSize: 20, color: "#fff", marginRight: 10 },
  sort: {
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 5,
    borderBottomColor: "#ebebeb",
    borderBottomWidth: 1
  },
  sortTouchale: { marginBottom: 5, display: "none" },
  sortText: { textAlign: "left", fontFamily: Constants.fontFamilyLight }
});
