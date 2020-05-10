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
  Dimensions,
  Animated,
  Easing
} from "react-native";
import {
  Container,
  Content,
  Header,
  Body,
  Left,
  Right,
  Input,
  ListItem
} from "native-base";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import Constants from "../config/constants";

import Footer from "../components/Footer";
import CardOffer from "../components/cardOffer";

/**********************************************************************
 *
 *                               Class
 *
 **********************************************************************/
export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      refreshing: false,
      loadMore: false,
      paginationCurrentPage: 1,
      categoryTitle: "",
      sortCategory: "",
      offers: [],
      filters: [],
      keyword: "",
      total: 0,
      input1: "#ebebeb",
      input1Icon: "#a3a3a3"
    };
    this.animatedValue = new Animated.Value(0);
    this.animatedValueOpacity = new Animated.Value(0);
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.search().then(() => {
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

  async search() {
    try {
      if (this.state.keyword != "") {
        let city_id = await AsyncStorage.getItem("@cityId").then(Intro => {
          if (Intro != null) {
            return Intro;
          } else {
            return 0;
          }
        });

        this.setState({ refreshing: true });
        let postData = {};
        postData["keyword"] = this.state.keyword;
        postData["page"] = this.state.paginationCurrentPage;
        if (this.state.sortCategory != "") {
          postData["category"] = this.state.sortCategory;
        }
        const categoryApiCall = await fetch(Constants.siteUrl + "search", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: { ...Constants.headers, City: city_id },
          redirect: "follow",
          referrer: "no-referrer",
          body: JSON.stringify(postData)
        });

        const category = await categoryApiCall.json();
        console.log(category.data.offers);
        if ((category.status = 200)) {
          this.setState({
            paginationCurrentPage: category.paginate.currentPage,
            refreshing: false,
            loading: false
          });
          if (category.data.offers.length > 0) {
            this.setState({
              offers: category.data.offers,
              total: category.data.total
            });
          }
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
      if (this.state.sortCategory != "") {
        postData["category"] = this.state.sortCategory;
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
      console.log(category.data.total);
      if ((category.status = 200)) {
        this.setState({
          paginationCurrentPage: category.paginate.currentPage,
          refreshing: false,
          loading: false
        });
        if (category.data.offers.length > 0) {
          this.setState({
            offers: category.data.offers,
            total: category.data.total
          });
        }
      }
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }
  _updateSort(type) {
    this.setState({ sortCategory: type }, () => {
      this.search();
      this._openSort();
    });
  }
  componentDidMount() {}
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

  componentWillUnmount() {
    this.setState({ isLoaded: false });
  }
  componentDidMount() {
    this.getCategoriesFilters();
  }
  _openSort() {
    this.setState({ isLoaded: !this.state.isLoaded });
    Animated.timing(this.animatedValue, {
      toValue: !this.state.isLoaded ? 190 : 0,
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
    if (this.state.keyword != "") {
      console.log("dd", this.state.offers);
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
            <Text
              style={{ fontFamily: Constants.fontFamilyBold, fontSize: 16 }}
            >
              لايوجد عروض تناسب مدينتك
            </Text>
          </View>
        );
      }
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
            برجاء قم بادخل كلمة البحث للبدء
          </Text>
        </View>
      );
    }

    return offersArray;
  }
  render() {
    let mWidth = Dimensions.get("window").width;
    const { navigation } = this.props;
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
                البحث
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
          <View
            style={[styles.InputHolder, { borderColor: this.state.input1 }]}
          >
            <Input
              placeholder="كلمة البحث"
              keyboardType="default"
              returnKeyType="search"
              onFocus={() => {
                this.setState({ input1: "#45c9ae", input1Icon: "#45c9ae" });
              }}
              onBlur={() => {
                this.setState({ input1: "#ebebeb", input1Icon: "#a3a3a3" });
              }}
              style={[styles.textInput, { color: this.state.input1 }]}
              placeholderTextColor={this.state.input1Icon}
              onChangeText={text => this.setState({ keyword: text })}
              value={this.state.keyword}
              onSubmitEditing={event => {
                this.search();
              }}
            />
            <FontAwesome5
              name="search"
              style={[styles.InputIcon, { color: this.state.input1Icon }]}
              solid
            />
          </View>
          {this.state.offers.length > 0 ? (
            <View>
              <Text
                style={{
                  textAlign: "left",
                  paddingVertical: 10,
                  paddingHorizontal: 20
                }}
              >
                نتائج البحث <Text>({this.state.total} نتائج)</Text>
              </Text>
            </View>
          ) : null}

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
        </Content>
        <Footer />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  HeaderRightIcon: { fontSize: 20, color: "#fff", marginRight: 10 },
  InputHolder: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 3,
    marginTop: 20,
    marginHorizontal: 20
  },
  textInput: {
    fontFamily: Constants.fontFamilyRoman,
    fontSize: 14,
    textAlign: "right"
  },
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
