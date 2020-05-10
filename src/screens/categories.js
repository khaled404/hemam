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
  Dimensions
} from "react-native";
import { Container, Content, Header, Body, Left, Right } from "native-base";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import LinearGradient from "react-native-linear-gradient";
import Constants from "../config/constants";
import CardCategory from "../components/cardCategory";
import Footer from "../components/Footer";
import Preloader from "../components/preloader";
/**********************************************************************
 *
 *                               Class
 *
 **********************************************************************/
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      loading: true
    };
  }

  renderCategories() {
    let catsArray = [];
    let begin, last;
    console.log(this.state.categories);
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
        // } else if (index == 9) {
        // 	begin = "#fca46e";
        // 	last = "#ee6176"
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
      if (index == 8) {
        catsArray.push(
          <CardCategory
            key={item.id}
            navigateRoute="ConcessionOrders"
            Title="التنازلات"
            startColor={"#f4a3aa"}
            endColor={"#f45e79"}
            image={require("../../assets/images/cat_7.png")}
          />
        );
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
      } else {
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
      }
    });
    return catsArray;
  }
  async getCategories() {
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
      if ((categories.status = 200)) {
        this.setState({
          categories: categories.data,
          loading: false
        });
      } else {
      }
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }
  componentDidMount() {
    this.getCategories();
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
                الأقسام
              </Text>
            </Body>
            <Right>
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
        </Content>
        <Footer />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  HeaderRightIcon: { fontSize: 20, color: "#fff", marginRight: 10 }
});
