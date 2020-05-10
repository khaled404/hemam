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
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl,
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
  Form,
  Item,
  Picker,
  Icon
} from "native-base";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import LinearGradient from "react-native-linear-gradient";
import { Dropdown } from "react-native-material-dropdown";
import AsyncStorage from "@react-native-community/async-storage";
import { showMessage } from "react-native-flash-message";
import Preloader from "../components/preloader";
import Constants from "../config/constants";
import Footer from "../components/Footer";
import CardOffer from "../components/cardOffer";
const { width, height } = Dimensions.get("window");
/**********************************************************************
 *
 *                               Class
 *
 **********************************************************************/

export default class concessionOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      input0: "#ebebeb",
      input0Icon: "#a3a3a3",
      input1: "#ebebeb",
      input1Icon: "#a3a3a3",
      input2: "#ebebeb",
      input2Icon: "#a3a3a3",
      input3: "#ebebeb",
      input3Icon: "#a3a3a3",
      input4: "#ebebeb",
      input4Icon: "#a3a3a3",
      input5: "#ebebeb",
      input5Icon: "#a3a3a3",
      input6: "#ebebeb",
      input6Icon: "#a3a3a3",
      input7: "#ebebeb",
      input7Icon: "#a3a3a3",
      input8: "#ebebeb",
      input8Icon: "#a3a3a3",
      input9: "#ebebeb",
      input9Icon: "#a3a3a3",
      offers: [],
      paginationCurrentPage: 1,
      fields: [],
      errors: {},
      selected2: undefined,
      contactData: []
    };
    this.animatedValue = new Animated.Value(0);
    this.animatedValueOpacity = new Animated.Value(0);
  }
  onValueChange2(value) {
    this.setState({
      selected2: value
    });
  }
  async getForm() {
    try {
      let self = this;
      const categoryApiCall = await fetch(
        Constants.siteUrl + "reassignments/form",
        {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: { ...Constants.headers },
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer" // no-referrer, *client
        }
      );
      const category = await categoryApiCall.json();
      if (category.status == 200) {
        this.setState({
          fields: category.data[0],
          loading: false
        });
      }
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }
  async getDescription() {
    try {
      const settingsApiCall = await fetch(
        Constants.siteUrl + "reassignment_offers",
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
          headers: { ...Constants.headers },
          redirect: "follow", // manual, *follow, error
          referrer: "no-referrer" // no-referrer, *client
        }
      );
      const settings = await settingsApiCall.json();
      if (settings.status == 200) {
        this.setState({
          offers: settings.data,
          paginationCurrentPage: settings.data,
          paginationCurrentPage: settings.paginate.currentPage,
          loading: false
        });
      } else {
      }
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }
  async loadMoreData() {
    try {
      const { navigation } = this.props;
      let postData = [];
      postData["page"] = this.state.paginationCurrentPage + 1;

      const categoryApiCall = await fetch(
        Constants.siteUrl + "reassignment_offers",
        {
          method: "POST", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, cors, *same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          credentials: "same-origin", // include, *same-origin, omit
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
            style={
              {
                // paddingHorizontal: 5
                // marginRight: 5
                // marginBottom: 0,
                // width: 150
              }
            }
            // imagStyle={{ height: (height * 0.3) / 2 }}
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
          <Text style={{ fontFamily: Constants.fontFamilyBold, fontSize: 16 }}>
            لايوجد عروض تنازل تناسب مدينتك
          </Text>
        </View>
      );
    }

    return offersArray;
  }
  renderFields() {
    const array = [];
    let self = this;
    this.state.fields.map((item, index) => {
      if (item.type == "text") {
        array.push(
          <View key={index}>
            <View
              style={[
                styles.InputHolder,
                { borderColor: this.state["input" + index] }
              ]}
            >
              <FontAwesome5
                name="user"
                style={[
                  styles.InputIcon,
                  { color: this.state["input" + index + "Icon"] }
                ]}
                solid
              />
              <Input
                placeholder={item.lable}
                keyboardType="default"
                returnKeyType="next"
                onFocus={() => {
                  this.setState({
                    ["input" + index]: "#45c9ae",
                    ["input" + index + "Icon"]: "#45c9ae"
                  });
                }}
                onBlur={() => {
                  this.setState({
                    ["input" + index]: "#ebebeb",
                    ["input" + index + "Icon"]: "#a3a3a3"
                  });
                }}
                style={[styles.textInput, { color: "#000" }]}
                placeholderTextColor={"#000"}
                onChangeText={text => this.setState({ [item.name]: text })}
                value={this.state[item.name]}
              />
            </View>
            {this.state.errors[item.name] !== undefined &&
            this.state.errors[item.name] != "" ? (
              <Text style={styles.error}>{this.state.errors[item.name]}</Text>
            ) : null}
          </View>
        );
      } else if (item.type == "email") {
        array.push(
          <View key={index}>
            <View
              style={[
                styles.InputHolder,
                { borderColor: this.state["input" + index] }
              ]}
            >
              <FontAwesome5
                name="envelope"
                style={[
                  styles.InputIcon,
                  { color: this.state["input" + index + "Icon"] }
                ]}
                solid
              />
              <Input
                placeholder={item.lable}
                keyboardType="email-address"
                returnKeyType="next"
                onFocus={() => {
                  this.setState({
                    ["input" + index]: "#45c9ae",
                    ["input" + index + "Icon"]: "#45c9ae"
                  });
                }}
                onBlur={() => {
                  this.setState({
                    ["input" + index]: "#ebebeb",
                    ["input" + index + "Icon"]: "#a3a3a3"
                  });
                }}
                style={[styles.textInput, { color: "#000" }]}
                placeholderTextColor={"#000"}
                onChangeText={text => this.setState({ [item.name]: text })}
                value={this.state[item.name]}
              />
            </View>
            {this.state.errors[item.name] !== undefined &&
            this.state.errors[item.name] != "" ? (
              <Text style={styles.error}>{this.state.errors[item.name]}</Text>
            ) : null}
          </View>
        );
      } else if (item.type == "number") {
        let icon;
        if (item.name == "phone") {
          icon = "phone";
        } else if (item.name == "age") {
          icon = "child";
        } else {
          icon = "user";
        }
        array.push(
          <View key={index}>
            <View
              style={[
                styles.InputHolder,
                { borderColor: this.state["input" + index] }
              ]}
            >
              <FontAwesome5
                name={icon}
                style={[
                  styles.InputIcon,
                  { color: this.state["input" + index + "Icon"] }
                ]}
                solid
              />
              <Input
                placeholder={item.lable}
                keyboardType="phone-pad"
                returnKeyType="next"
                onFocus={() => {
                  this.setState({
                    ["input" + index]: "#45c9ae",
                    ["input" + index + "Icon"]: "#45c9ae"
                  });
                }}
                onBlur={() => {
                  this.setState({
                    ["input" + index]: "#ebebeb",
                    ["input" + index + "Icon"]: "#a3a3a3"
                  });
                }}
                style={[styles.textInput, { color: "#000" }]}
                placeholderTextColor={"#000"}
                onChangeText={text => this.setState({ [item.name]: text })}
                value={this.state[item.name]}
              />
            </View>
            {this.state.errors[item.name] !== undefined &&
            this.state.errors[item.name] != "" ? (
              <Text style={styles.error}>{this.state.errors[item.name]}</Text>
            ) : null}
          </View>
        );
      } else if (item.type == "select") {
        array.push(
          <View key={index}>
            <Dropdown
              labelFontSize={0}
              rippleOpacity={0}
              dropdownOffset={{ top: 15 }}
              label={item.lable}
              data={item.select}
              inputContainerStyle={{ borderBottomColor: "transparent" }}
              renderBase={props => (
                <View
                  style={[
                    styles.InputHolder,
                    { borderColor: this.state["input" + index] }
                  ]}
                >
                  <FontAwesome5
                    name={"user"}
                    style={[
                      styles.InputIcon,
                      { color: this.state["input" + index + "Icon"] }
                    ]}
                    solid
                  />
                  <Input placeholder="اختار النوع" {...props} />
                  <FontAwesome5
                    name={"caret-down"}
                    style={[
                      styles.InputIcon,
                      { color: this.state["input" + index + "Icon"] }
                    ]}
                    solid
                  />
                </View>
              )}
              value={this.state[item.name]}
              labelExtractor={({ lable, icon }) => {
                return (
                  <Text style={{ textAlign: "center" }}>
                    <Text> {lable}</Text>
                  </Text>
                );
              }}
              valueExtractor={(value, index) => {
                return value.lable;
              }}
              onChangeText={(text, index, data) => {
                this.setState({ [item.name]: data[index].value });
                console.log(this.state[item.name]);
              }}
            />
            {this.state.errors[item.name] !== undefined &&
            this.state.errors[item.name] != "" ? (
              <Text style={styles.error}>{this.state.errors[item.name]}</Text>
            ) : null}
          </View>
        );
      } else if (item.type == "textarea") {
        array.push(
          <View key={index}>
            <View
              style={[
                styles.InputHolder,
                {
                  borderColor: this.state["input" + index],
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  padding: 10
                }
              ]}
            >
              <FontAwesome5
                name="comment"
                style={[
                  styles.InputIcon,
                  { color: this.state["input" + index + "Icon"], marginTop: 10 }
                ]}
                solid
              />
              <Input
                placeholder={item.lable}
                keyboardType="default"
                multiline={true}
                numberOfLines={4}
                onFocus={() => {
                  this.setState({
                    ["input" + index]: "#45c9ae",
                    ["input" + index + "Icon"]: "#45c9ae"
                  });
                }}
                onBlur={() => {
                  this.setState({
                    ["input" + index]: "#ebebeb",
                    ["input" + index + "Icon"]: "#a3a3a3"
                  });
                }}
                style={[
                  styles.textInput,
                  {
                    color: "#000",
                    textAlign: "right",
                    minHeight: 150,
                    textAlignVertical: "top"
                  }
                ]}
                onChangeText={text => this.setState({ [item.name]: text })}
                value={this.state[item.name]}
              />
            </View>
            {this.state.errors[item.name] !== undefined &&
            this.state.errors[item.name] != "" ? (
              <Text style={styles.error}>{this.state.errors[item.name]}</Text>
            ) : null}
          </View>
        );
      }
    });

    return array;
  }
  // async _submit() {
  //   try {
  //     let self = this;
  //     let sendArray = {};
  //     let api_token = await AsyncStorage.getItem("api_token");
  //     let errors = { ...this.state.errors };
  //     this.state.fields.map((item, index) => {
  //       if (
  //         this.state[item.name] !== undefined &&
  //         this.state[item.name] != ""
  //       ) {
  //         sendArray[item.name] = this.state[item.name];
  //       }
  //     });
  //     const categoryApiCall = await fetch(Constants.siteUrl + "reassignments", {
  //       method: "POST", // *GET, POST, PUT, DELETE, etc.
  //       mode: "cors", // no-cors, cors, *same-origin
  //       cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  //       credentials: "same-origin", // include, *same-origin, omit
  //       headers: { ...Constants.headers, "Api-Token": api_token },
  //       redirect: "follow", // manual, *follow, error
  //       referrer: "no-referrer", // no-referrer, *client
  //       body: JSON.stringify(sendArray)
  //     });
  //     const category = await categoryApiCall.json();
  //     if (Object.entries(category.errors).length > 0) {
  //       const keys = Object.entries(category.errors);
  //       for (const key of keys) {
  //         errors[key[0]] = key[1];
  //       }
  //       this.setState({ errors });
  //     } else {
  //       showMessage({
  //         message: "تنبية",
  //         description: "تم أضافة طلب التنازل بنجاح",
  //         duration: 2000,
  //         type: "success"
  //       });
  //       this.props.navigation.navigate("Home");
  //     }
  //   } catch (err) {
  //     console.log("Error fetching data-----------", err);
  //   }
  // }
  async componentDidMount() {
    try {
      let username = await AsyncStorage.getItem("name");

      let phone = await AsyncStorage.getItem("phone");
      let email = await AsyncStorage.getItem("email");

      this.setState({
        name: username,
        email: email,
        phone: phone
      });
      this.getForm().then(() => {
        this.getDescription();
      });
    } catch (error) {
      console.log("Error retrieving data" + error);
    }
  }
  render() {
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
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                التنازلات
              </Text>
            </Body>
            <Right style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={[
                  styles.HeaderRight,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    width: 100
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
          {/* <Image
            source={require("../../assets/images/concessionBanner.png")}
            style={styles.banner}
          /> */}
          {/* <ScrollView
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            // style={{ marginTop: 20, flex: 1 }}
            refreshControl={
              <RefreshControl
                onRefresh={() => this._onRefresh()}
                refreshing={this.state.refreshing}
              />
            }
            scrollEventThrottle={16}
          > */}
          <View
            style={{
              // flexDirection: "column"
              // flexWrap: "wrap",
              paddingHorizontal: 7,
              paddingVertical: 10
              // justifyContent: "space-evenly",
              // flex: 1
            }}
          >
            {this.renderOffers()}
          </View>
          {/* </ScrollView> */}
          {/* <View style={{ padding: 10 }}>
            <Text
              style={{
                color: "#514e5e",
                fontFamily: Constants.fontFamilyBold,
                marginBottom: 20,
                fontSize: 18,
                textAlign: "center"
              }}
            >
              فضلا املئ الطلب لتقديم طلب تنازل
            </Text>
            <Form style={styles.Form}>{this.renderFields()}</Form>
            <TouchableOpacity
              style={styles.LoginButton}
              onPress={() => this._submit()}
            >
              <LinearGradient
                style={styles.Gradient}
                colors={["#7dde9d", "#17b7bd"]}
                start={{ x: 0.0, y: 0.5 }}
                end={{ x: 1.0, y: 0.5 }}
                locations={[0.0, 1.0]}
              >
                <Text style={styles.ButtonText}>إرسال</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View> */}
        </Content>
        <Footer />
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  HeaderRightIcon: { fontSize: 20, color: "#fff", marginRight: 10 },
  banner: { width: width, height: height * 0.3 },
  description: {
    fontFamily: Constants.fontFamilyLight,
    textAlign: "center",
    lineHeight: 20,
    fontSize: 16
  },
  InputHolder: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 3
  },
  Form: { paddingHorizontal: 20 },
  InputIcon: { fontSize: 20, marginRight: 10 },
  textInput: {
    fontFamily: Constants.fontFamilyRoman,
    fontSize: 14,
    textAlign: "right"
  },
  Gradient: { padding: 10 },
  LoginButton: { marginVertical: 10, marginHorizontal: 20 },
  ButtonText: {
    textAlign: "center",
    color: "white",
    fontFamily: Constants.fontFamilyBold
  },
  error: {
    color: "#ff0000",
    textAlign: "center",
    fontSize: 14,
    fontFamily: Constants.fontFamilyLight,
    marginBottom: 10
  }
});
