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
  Animated,
  Easing,
  TouchableOpacity
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { withNavigation } from "react-navigation";
import Constants from "../config/constants";

/**********************************************************************
 *
 *                               Class
 *
 **********************************************************************/
class cardCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.animatedValue = new Animated.Value(0);
  }
  componentDidMount() {
    // setTimeout(() => {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.inOut(Easing.quad)
    }).start();
    // }, 500);
  }
  navigate() {
    if (this.props.id == undefined) {
      this.props.navigation.navigate(this.props.navigateRoute);
    } else {
      this.props.navigation.push(this.props.navigateRoute, {
        categoryId: this.props.id
      });
    }
  }
  render() {
    const marginTop = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [120, 0]
    });
    return (
      <Animated.View style={{ marginTop, width: "30%" }}>
        <LinearGradient
          style={styles.LinearGradient}
          colors={[this.props.startColor, this.props.endColor]}
          start={{ x: 0.0, y: 0.5 }}
          end={{ x: 1.0, y: 0.5 }}
          locations={[0.0, 1.0]}
        >
          <TouchableOpacity
            style={{ alignItems: "center", alignItems: "center" }}
            onPress={() => this.navigate()}
          >
            <Image source={this.props.image} style={styles.Image} />
            <Text style={styles.Title}>{this.props.Title}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  LinearGradient: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    marginBottom: 10,
    flex: 1
  },
  Image: { width: 60, height: 76, marginBottom: 10, resizeMode: "contain" },
  Title: {
    color: "#ffffff",
    fontFamily: Constants.fontFamilyBold,
    fontSize: 12,
    textAlign: "center"
  }
});
export default withNavigation(cardCategory);
