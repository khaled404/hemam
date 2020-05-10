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
  Platform,
  Animated
} from "react-native";
import { Container, Content, Header, Body, Left, Right } from "native-base";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import LinearGradient from "react-native-linear-gradient";
import Swiper from "react-native-swiper";
import Constants from "../config/constants";
import SectionedMultiSelect from "../components/react-native-sectioned-multi-select";
import OfflineNotice from "../components/OfflineNotice";
import MarqueeVertical from "../components/MarqueeVertical.js";
import CardCategory from "../components/cardCategory";
import Preloader from "../components/preloader";
import Footer from "../components/Footer";
import TextScrolling from "../components/textScrolling";
import AsyncStorage from "@react-native-community/async-storage";
import RNRestart from "react-native-restart";
import NSlider from "../components/NSlider";
const { width, height } = Dimensions.get("window");
/**********************************************************************
 *
 *                               Class
 *
 **********************************************************************/
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      cities: [],
      categories: [],
      bannersTop: [],
      bannersBottom: [],
      news: [],
      loading: true
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem("@cityId").then(Intro => {
      if (Intro != null) {
        this.initHome(Intro).then(() => {
          this.initCities();
        });
      } else {
        this.initHome(0).then(() => {
          this.initCities();
        });
      }
    });
  }
  onSelectedItemsChange = selectedItems => {
    let self = this;
    let cc = this.state.cities.filter(city => {
      if (city.id == selectedItems[0]) {
        AsyncStorage.setItem("@cityId", JSON.stringify(city.id)).then(() => {
          self.setState({ selectedItemsText: city.name });
          this.initHome(city.id);
        });
      } else {
        city.zones.filter(citys => {
          if (citys.id == selectedItems[0]) {
            AsyncStorage.setItem("@cityId", JSON.stringify(citys.id)).then(
              () => {
                self.setState({ selectedItemsText: citys.name });
                this.initHome(citys.id);
              }
            );
          }
        });
      }
    });
    this.setState({ selectedItems });
    this.SectionedMultiSelect._toggleSelector();
  };
  async initCategories() {
    await fetch(Constants.siteUrl + "categories", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: Constants.headers,
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer" // no-referrer, *client
    })
      .then(response => response.json())
      .then(res => {
        this.setState({ categories: res.data });
      });
  }
  async initCities() {
    await fetch(Constants.siteUrl + "cities", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: Constants.headers,
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer" // no-referrer, *client
    })
      .then(response => response.json())
      .then(res => {
        this.setState({ cities: res.data });
      });
  }
  async initBanners() {
    await fetch(Constants.siteUrl + "banners", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: Constants.headers,
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify({
        // "!city_id":"1",
        position: "top"
      })
    })
      .then(response => response.json())
      .then(res => {
        this.setState({ bannersTop: res.data });
      })
      .then(() => {
        fetch(Constants.siteUrl + "banners", {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: Constants.headers,
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer", // no-referrer, *client
          body: JSON.stringify({
            // "!city_id":"1",
            position: "bottom"
          })
        })
          .then(response => response.json())
          .then(res => {
            this.setState({ bannersBottom: res.data });
          });
      });
  }
  async initNews() {
    try {
      const newsApiCall = await fetch(Constants.siteUrl + "news", {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: Constants.headers,
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer" // no-referrer, *client
      });
      const news = await newsApiCall.json();

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
  async initHome(city_id) {
    this.setState({
      news: [],
      bannersTop: [],
      bannersBottom: [],
      categories: [],
      loading: true
    });
    try {
      const homeApiCall = await fetch(Constants.siteUrl + "home", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: { ...Constants.headers, City: city_id },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify({})
      });
      const home = await homeApiCall.json();

      if (home.status == 200) {
        this.setState({
          news: home.data.sliders,
          bannersTop: home.data.top_banners,
          bannersBottom: home.data.bottom_banners,
          categories: home.data.categories,
          loading: false
        });
      }
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }
  renderSlides(location) {
    let bannersArray = [];
    if (location == "top") {
      this.state.bannersTop.map((item, index) => {
        bannersArray.push(
          <View key={item.id} style={styles.slide}>
            <Image
              source={{ uri: item.image }}
              style={{
                width: width,
                height: height * 0.3,
                resizeMode: "cover"
              }}
            />
          </View>
        );
      });
    }
    if (location == "bottom") {
      this.state.bannersBottom.map((item, index) => {
        bannersArray.push(
          <View key={item.id} style={styles.slide}>
            <Image
              source={{ uri: item.image }}
              style={{
                width: width,
                height: height * 0.3,
                resizeMode: "cover"
              }}
            />
          </View>
        );
      });
    }
    return bannersArray;
  }
  renderCategories() {
    let catsArray = [];
    let begin, last;
    this.state.categories.map((item, index) => {
      if (index == 0 || index == 5 || index == 10) {
        begin = "#813ee4";
        last = "#b181f4";
      } else if (index == 1 || index == 8) {
        begin = "#fca46e";
        last = "#ee6176";
      } else if (index == 2) {
        begin = "#7dde9d";
        last = "#17b7bd";
      } else if (index == 3) {
        begin = "#f9f247";
        last = "#dbb914";
      } else if (index == 4 || index == 9) {
        begin = "#37a6cb";
        last = "#2351a2";
      } else if (index == 7) {
        begin = "#f9f247";
        last = "#dbb914";
      } else if (index == 6) {
        begin = "#7dde9d";
        last = "#17b7bd";
      } else if (index == 11) {
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
      } else {
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

  render() {
    let mWidth = Dimensions.get("window").width;
    const { navigation } = this.props;

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
                الرئيسية
              </Text>
            </Body>
            <Right>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => {
                  this.props.navigation.navigate("Search");
                }}
              >
                <FontAwesome5
                  name="search"
                  style={{ fontSize: 20, color: "white" }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => this.SectionedMultiSelect._toggleSelector()}
              >
                <FontAwesome5
                  name="map-marker-alt"
                  style={{ fontSize: 20, color: "white" }}
                />
              </TouchableOpacity>
            </Right>
          </Header>
        </LinearGradient>
        {this.state.loading == true ? <Preloader /> : null}
        <Content>
          <OfflineNotice />
          {this.state.bannersTop.length > 0 ? (
            <Swiper
              style={styles.sliderWrapper}
              showsButtons={false}
              activeDotColor="#ffffff"
              paginationStyle={{ flexDirection: "row-reverse" }}
            >
              {this.renderSlides("top")}
            </Swiper>
          ) : null}
          {this.state.news.length > 0 && <NSlider items={this.state.news} />}
          <View
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "center",
              paddingHorizontal: 5,
              paddingTop: 20,
              paddingBottom: 10
            }}
          >
            {this.renderCategories()}
          </View>
          <View style={{ paddingVertical: 10 }}>
            {this.state.bannersBottom.length > 0 ? (
              <Swiper
                style={styles.sliderWrapper}
                showsButtons={false}
                activeDotColor="#ffffff"
                paginationStyle={{ flexDirection: "row-reverse" }}
              >
                {this.renderSlides("bottom")}
              </Swiper>
            ) : null}
          </View>
        </Content>
        <View>
          <SectionedMultiSelect
            ref={SectionedMultiSelect =>
              (this.SectionedMultiSelect = SectionedMultiSelect)
            }
            hideSelect={true}
            showCancelButton={true}
            hideConfirm={true}
            single={true}
            modalWithTouchable={false}
            showChips={false}
            styles={{
              listContainer: {
                display: "flex",
                flexDirection: "flex-start"
              },
              container: {
                marginTop: Platform.OS === "ios" ? 50 : 0
              },
              selectedItemText: {
                color: "blue"
              },

              selectedSubItemText: {
                color: "blue"
              }
            }}
            items={this.state.cities}
            uniqueKey="id"
            subKey="zones"
            searchPlaceholderText="ابحث عن المدينة"
            noResultsComponent={
              <View
                style={{
                  fontFamily: Constants.fontFamilyBold,
                  marginTop: 20,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text>عفوا, لم نتمكن ايجاد المدينة اللى تبحث عنها</Text>
              </View>
            }
            selectText="اختر المدينة"
            confirmText="تأكيد"
            showDropDowns={false}
            readOnlyHeadings={false}
            onSelectedItemsChange={this.onSelectedItemsChange}
            selectedItems={this.state.selectedItems}
            itemFontFamily={{ fontFamily: Constants.fontFamilyBold }}
            subItemFontFamily={{ fontFamily: Constants.fontFamilyBold }}
            searchTextFontFamily={{ fontFamily: Constants.fontFamilyBold }}
            confirmFontFamily={{ fontFamily: Constants.fontFamilyBold }}
            colors={{ cancel: "#f16f74" }}
          />
        </View>
        <Footer />
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071c6d",
    paddingTop: 40
    // paddingHorizontal: 20
  },
  sliderWrapper: { height: height * 0.3 },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB"
  }
});
