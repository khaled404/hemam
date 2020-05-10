"use strict";
/**********************************************************************
 *
 *                               Import Libraries
 *
 **********************************************************************/
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { showMessage, hideMessage } from "react-native-flash-message";
import Animated, { Easing } from "react-native-reanimated";
import {
  TapGestureHandler,
  State,
  TextInput
} from "react-native-gesture-handler";
import LinearGradient from "react-native-linear-gradient";
import RNRestart from "react-native-restart";

import SectionedMultiSelect from "../components/react-native-sectioned-multi-select";
import Constants from "../config/constants";
const { width, height } = Dimensions.get("window");
import AsyncStorage from "@react-native-community/async-storage";
/**********************************************************************
 *
 *                               Variables
 *
 **********************************************************************/

const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
  concat
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position
  ]);
}

/**********************************************************************
 *
 *                               Class
 *
 **********************************************************************/
class selectCity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      selectedItemsText: "اختار المدينة",
      cities: []
    };
    this.buttonOpacity = new Value(1);
    this.logoTop = new Animated.Value(0);

    this.onStateChange = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
            )
          ])
      }
    ]);
    this.onCloseState = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
            )
          ])
      }
    ]);

    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 2.5, 0],
      extrapolate: Extrapolate.CLAMP
    });

    this.textInputZindex = interpolate(this.buttonOpacity, {
      inputRange: [0, 55],
      outputRange: [55, -1],
      extrapolate: Extrapolate.CLAMP
    });
    this.textInputY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [0, 100],
      extrapolate: Extrapolate.CLAMP
    });
    this.textInputOpacity = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP
    });
    this.rotateCross = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [180, 36],
      extrapolate: Extrapolate.CLAMP
    });
    this.scale = interpolate(this.buttonOpacity, {
      inputRange: [0, 0.5, 1],
      outputRange: [1, 2, 1]
    });
  }

  componentDidMount() {
    this.initCities();
  }
  onSelectedItemsChange = async selectedItems => {
    let self = this;
    let cityname = "";
    let cc = this.state.cities.filter(city => {
      if (city.id == selectedItems[0]) {
        AsyncStorage.setItem("@cityId", JSON.stringify(city.id)).then(() => {
          self.setState({ selectedItemsText: city.name });
        });
      } else {
        city.zones.filter(citys => {
          if (citys.id == selectedItems[0]) {
            AsyncStorage.setItem("@cityId", JSON.stringify(citys.id)).then(
              () => {
                self.setState({ selectedItemsText: citys.name });
              }
            );
          }
        });
      }
    });
    // setTimeout(() => {
    // 	self.setState({ selectedItemsText: cc });
    // }, 200);

    this.setState({ selectedItems });
    this.SectionedMultiSelect._toggleSelector();
  };
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
  Procced() {
    AsyncStorage.getItem("@cityId").then(city => {
      if (city != null) {
        RNRestart.Restart();
        this.props.navigation.navigate("Home");
      } else {
        showMessage({
          message: "تنبية",
          description: "لم تقم باختيار المدينة",
          duration: 2000,
          type: "error"
        });
      }
    });
  }
  skiped() {
    AsyncStorage.setItem("@skiped", "skiped").then(city => {
      this.props.navigation.navigate("Home");
    });
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "flex-end"
        }}
      >
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            transform: [{ translateY: this.bgY }]
          }}
        >
          <Image
            source={require("../../assets/images/selectCity.png")}
            style={{ flex: 1, height: null, width: null }}
          />
        </Animated.View>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            justifyContent: "center",
            alignItems: "center",
            height: 200,
            marginTop: 100
            // transform:[{scale:this.scale}],
          }}
        >
          <Image
            source={require("../../assets/images/pick-city-logo.png")}
            style={{
              height: 200,
              width: 200,
              position: "absolute",
              // top: this.logoTop,
              resizeMode: "contain"
            }}
          />
        </Animated.View>
        <View style={{ height: height / 2.5, justifyContent: "center" }}>
          <TapGestureHandler onHandlerStateChange={this.onStateChange}>
            <Animated.View
              style={{
                opacity: this.buttonOpacity,
                transform: [{ translateY: this.buttonY }]
              }}
            >
              <LinearGradient
                style={{ ...styles.Gradient, marginHorizontal: 20 }}
                colors={["#fca46e", "#ee6176"]}
                start={{ x: 0.0, y: 0.5 }}
                end={{ x: 1.0, y: 0.5 }}
                locations={[0.0, 1.0]}
              >
                <Text style={styles.ButtonText}>اختيار المدينة</Text>
              </LinearGradient>
            </Animated.View>
          </TapGestureHandler>

          <Animated.View
            style={{
              height: height / 2.5,
              ...StyleSheet.absoluteFill,
              top: null,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
              zIndex: this.textInputZindex,
              opacity: this.textInputOpacity,
              transform: [{ translateY: this.textInputY }]
            }}
          >
            {/* <TapGestureHandler onHandlerStateChange={this.onCloseState}>
              <Animated.View style={styles.closeButton}>
                <Animated.Text style={{ fontSize: 15, transform: [{ rotate: concat(this.rotateCross, 'deg') }] }}>X</Animated.Text>
              </Animated.View>
            </TapGestureHandler> */}

            <Text
              style={{
                textAlign: "center",
                marginBottom: 10,
                color: "white",
                fontFamily: Constants.fontFamilyBold,
                fontSize: 20,
                position: "absolute",
                top: -70
              }}
            >
              تحديد المدينة
            </Text>
            <TouchableOpacity
              style={{
                justifyContent: "space-between",
                flexDirection: "row",
                backgroundColor: "white",
                width: "100%",
                paddingHorizontal: 10,
                paddingVertical: 10,
                shadowOffset: { width: 2, height: 2 },
                shadowColor: "black",
                shadowOpacity: 0.2,
                marginBottom: 10,
                position: "absolute",
                top: -10,
                elevation: 1
              }}
              onPress={() => this.SectionedMultiSelect._toggleSelector()}
            >
              <Text
                style={{
                  color: "#a9a9a9",
                  fontFamily: Constants.fontFamilyRoman
                }}
              >
                {this.state.selectedItemsText}
              </Text>
              <FontAwesome5 name="sort-down" style={{ color: "#a9a9a9" }} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.LoginButton}
              onPress={() => this.Procced()}
            >
              <LinearGradient
                style={styles.Gradient}
                colors={["#fca46e", "#ee6176"]}
                start={{ x: 0.0, y: 0.5 }}
                end={{ x: 1.0, y: 0.5 }}
                locations={[0.0, 1.0]}
              >
                <Text style={styles.ButtonText}>متابعة</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingHorizontal: 20, paddingVertical: 5 }}
              onPress={() => this.props.navigation.navigate("Terms")}
            >
              <Text
                style={{
                  color: "#000",
                  fontFamily: Constants.fontFamilyBold,
                  textAlign: "center",
                  fontSize: 13,
                  lineHeight: 30,
                  textDecorationLine: "underline"
                }}
              >
                شروط الخدمة
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#a3a3a3",
                borderRadius: 5,
                paddingHorizontal: 20,
                paddingVertical: 5,
                width: 100,
                marginBottom: 10
              }}
              onPress={() => this.skiped()}
            >
              <Text
                style={{
                  color: "#a3a3a3",
                  fontFamily: Constants.fontFamilyBold,
                  textAlign: "center",
                  fontSize: 18,
                  lineHeight: 30
                }}
              >
                تخطى
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: Constants.fontFamilyLight,
                textAlign: "center",
                position: "absolute",
                bottom: 30
              }}
            >
              جميع الحقوق محفوظة © همم 2019
            </Text>
            {/* <Animated.View
              style={styles.button}
            >
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>SIGN IN</Text>
            </Animated.View> */}
          </Animated.View>
        </View>
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
      </View>
    );
  }
}
export default selectCity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    backgroundColor: "white",
    height: 70,
    marginHorizontal: 20,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5
  },
  closeButton: {
    height: 40,
    width: 40,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    // position: 'absolute',
    // top: -70,
    // left: width / 2 - 20,
    marginTop: -240,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2
  },
  Gradient: { paddingVertical: 10, borderRadius: 5 },
  LoginButton: {
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 20,
    width: "100%"
  },
  ButtonText: {
    textAlign: "center",
    color: "white",
    fontFamily: Constants.fontFamilyBold,
    fontSize: 18
  }
});
