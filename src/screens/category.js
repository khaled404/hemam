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
import CardCategory from "../components/cardCategory";

/**********************************************************************
 *
 *                               Class
 *
 **********************************************************************/
export default class Category extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      refreshing: false,
      loadMore: false,
      paginationCurrentPage: 1,
      categoryTitle: "",
      orderBy: "",
      sortBy: "",
      filters: [],
      offers: [],
      childs: []
    };
    this.animatedValue = new Animated.Value(0);
    this.animatedValueOpacity = new Animated.Value(0);
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getCategory().then(() => {
      this.setState({ refreshing: false });
    });
  };
  async getCategoriesFilters() {
    try {
      const categoriesApiCall = await fetch(Constants.siteUrl + "categories", {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: { ...Constants.headers },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer" // no-referrer, *client
      });
      const categories = await categoriesApiCall.json();
      if (categories.status == 200) {
        this.setState({
          filters: categories.data
        });
      } else {
      }
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }
  async getCategory() {
    try {
      let city_id = await AsyncStorage.getItem("@cityId").then(Intro => {
        if (Intro != null) {
          return Intro;
        } else {
          return 0;
        }
      });

      const { navigation } = this.props;
      const categoryId = navigation.getParam("categoryId");
      let postData = {};
      postData["page"] = this.state.paginationCurrentPage;

      const categoryApiCall = await fetch(
        Constants.siteUrl + "category/" + categoryId + "/offers",
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: { ...Constants.headers },
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer", // no-referrer, *client
          body: JSON.stringify(postData)
        }
      );
      const category = await categoryApiCall.json();
      if ((category.status = 200)) {
        this.setState({
          offers: category.data.offers,
          categoryTitle: category.data.category,
          paginationCurrentPage: category.paginate.currentPage,
          childs: category.data.childs,
          loading: false
        });
      }
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }
  async getCategoriesOffers() {
    try {
      const { navigation } = this.props;
      const categoryId = navigation.getParam("categoryId");
      let postData = [];
      postData["categories"] = [];
      postData["categories"].push(categoryId);
      if (this.state.orderBy != "") {
        postData["categories"].push(this.state.orderBy);
      }
      console.log(postData);

      const categoryApiCall = await fetch(
        Constants.siteUrl + "categories_offers",
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: { ...Constants.headers },
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer", // no-referrer, *client
          body: JSON.stringify(postData)
        }
      );
      const category = await categoryApiCall.json();
      console.log(category);
      if ((category.status = 200)) {
        this.setState({
          offers: category.data.offers,
          paginationCurrentPage: category.paginate.currentPage,
          childs: category.data.childs,
          loading: false
        });
      }
      // let city_id = await AsyncStorage.getItem('@cityId').then((Intro) => {
      //     if (Intro != null) {
      //         return Intro
      //     } else {
      //         return 0;
      //     }
      // })

      // const { navigation } = this.props;
      // const categoryId = navigation.getParam('categoryId')
      // let postData = [];
      // postData.push(categoryId)
      // if (this.state.orderBy != '') {
      //     postData.push(this.state.orderBy)
      // }
      // console.log(Constants.siteUrl + 'categories_offers/');

      // const categoryOffersApiCall = await fetch(Constants.siteUrl + 'categories_offers/', {
      //     method: "POST", // *GET, POST, PUT, DELETE, etc.
      //     mode: "cors", // no-cors, cors, *same-origin
      //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      //     credentials: "same-origin", // include, *same-origin, omit
      //     headers: { ...Constants.headers },
      //     redirect: "follow", // manual, *follow, error
      //     referrer: "no-referrer", // no-referrer, *client
      //     body: JSON.stringify(postData)
      // });
      // const categoryReturn = await categoryOffersApiCall.json();
      // console.log('category fitlltltl');
      // console.log(categoryReturn);

      // if (category.status = 200) {
      //     this.setState({
      //         offers: category.data.offers,
      //         categoryTitle: category.data.category,
      //         paginationCurrentPage: category.paginate.currentPage,
      //         childs:category.data.childs,
      //         loading: false,
      //     });
      // }
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
      const { navigation } = this.props;
      const categoryId = navigation.getParam("categoryId");
      let postData = [];
      postData["page"] = this.state.paginationCurrentPage + 1;
      if (this.state.orderBy != "") {
        postData["orderby"] = this.state.orderBy;
      }
      if (this.state.sortBy != "") {
        postData["sort"] = this.state.sortBy;
      }
      const categoryApiCall = await fetch(
        Constants.siteUrl + "category/" + categoryId + "/offers",
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: { ...Constants.headers, City: city_id },
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer", // no-referrer, *client
          body: JSON.stringify(postData)
        }
      );
      const category = await categoryApiCall.json();
      if ((category.status = 200)) {
        if (category.data.offers.length > 0) {
          this.setState({
            offers: category.data.offers
          });
        }
        this.setState({
          categoryTitle: category.data.category,
          paginationCurrentPage: category.paginate.currentPage,
          refreshing: false,
          loading: false
        });
      }
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }
  _updateSort(type) {
    this.setState({ loading: true });
    this.setState({ orderBy: type }, () => {
      this.getCategoriesOffers();
      this._openSort();
    });
  }
  renderFilters() {
    let filtersArray = [];

    if (this.state.filters.length > 0) {
      this.state.filters.map((item, index) => {
        filtersArray.push(
          <TouchableOpacity
            style={[
              styles.sortTouchale,
              this.state.isLoaded && { display: "flex" }
            ]}
            onPress={() => {
              this._updateSort(item.id);
            }}
          >
            <Text style={styles.sortText}>{item.title}</Text>
          </TouchableOpacity>
        );
      });
    }
    return filtersArray;
  }
  renderOffers() {
    const opacity = this.animatedValue;
    const marginLeft = this.animatedValue;
    let offersArray = [];
    if (this.state.childs == 0) {
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
            key={0}
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              display: "flex"
            }}
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
            <Text
              style={{ fontFamily: Constants.fontFamilyBold, fontSize: 16 }}
            >
              لايوجد عروض تناسب مدينتك
            </Text>
          </View>
        );
      }
    }

    return offersArray;
  }
  renderCategories() {
    let catsArray = [];
    let begin, last;
    this.state.childs.map((item, index) => {
      if (index == 0 || index == 5 || index == 10) {
        begin = "#813ee4";
        last = "#b181f4";
      } else if (index == 1 || index == 8) {
        begin = "#fca46e";
        last = "#ee6176";
      } else if (index == 2 || index == 7) {
        begin = "#7dde9d";
        last = "#17b7bd";
      } else if (index == 3 || index == 9) {
        begin = "#f9f247";
        last = "#dbb914";
      } else if (index == 4) {
        begin = "#37a6cb";
        last = "#2351a2";
      } else if (index == 6) {
        begin = "#f9a0ac";
        last = "#ee6176";
      } else if (index % 1 === 0) {
        begin = "#fca46e";
        last = "#ee6176";
      } else if (index % 2 === 0) {
        begin = "#7dde9d";
        last = "#17b7bd";
      } else if (index % 2 === 0) {
        begin = "#f9f247";
        last = "#dbb914";
      }
      catsArray.push(
        <CardCategory
          key={item.id}
          navigateRoute="Category"
          id={item.id}
          Title={item.title}
          startColor={begin}
          endColor={last}
          image={{ uri: item.icon }}
        />
      );
    });
    return catsArray;
  }
  componentDidMount() {
    this.getCategory().then(() => {
      this.getCategoriesFilters();
    });
  }
  componentWillUnmount() {
    this.setState({ isLoaded: false });
  }
  _openSort() {
    this.setState({ isLoaded: !this.state.isLoaded });
    Animated.timing(this.animatedValue, {
      toValue: !this.state.isLoaded ? 350 : 0,
      duration: 200,
      easing: Easing.inOut(Easing.quad)
    }).start();
    Animated.timing(this.animatedValueOpacity, {
      toValue: !this.state.isLoaded ? 1 : 0,
      duration: 1000,
      easing: Easing.inOut(Easing.quad)
    }).start();
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
                {this.state.categoryTitle}
              </Text>
            </Body>
            <Right style={{ alignItems: "center" }}>
              {this.state.categoryTitle === "التنازلات" ? (
                <TouchableOpacity
                  style={[
                    styles.HeaderRight,
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      width: 95
                    }
                  ]}
                  onPress={() => {
                    this.props.navigation.navigate("ConcessionForm");
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      color: "#fff",
                      fontFamily: Constants.fontFamilyRoman
                    }}
                  >
                    رفع طلب
                  </Text>
                  <FontAwesome5
                    name="plus"
                    style={[
                      styles.HeaderRightIcon,
                      { fontSize: 15, marginHorizontal: 6 }
                    ]}
                  />
                </TouchableOpacity>
              ) : null}
              {this.state.categoryTitle === "معالج ومدرب شخصي" ? (
                <TouchableOpacity
                  style={[
                    styles.HeaderRight,
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      width: 95
                    }
                  ]}
                  onPress={() => {
                    this.props.navigation.navigate("TrainerForm");
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      color: "#fff",
                      fontFamily: Constants.fontFamilyRoman
                    }}
                  >
                    رفع طلب
                  </Text>
                  <FontAwesome5
                    name="plus"
                    style={[
                      styles.HeaderRightIcon,
                      { fontSize: 15, marginHorizontal: 6 }
                    ]}
                  />
                </TouchableOpacity>
              ) : null}
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
            {this.renderFilters()}
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
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "center",
                paddingHorizontal: 5,
                paddingTop: 10,
                paddingBottom: 10
              }}
            >
              {this.renderCategories()}
            </View>
            <View
              style={{
                flexDirection: "column",
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
  sortTouchale: { marginBottom: 10, display: "none" },
  sortText: { textAlign: "left", fontFamily: Constants.fontFamilyLight }
});
