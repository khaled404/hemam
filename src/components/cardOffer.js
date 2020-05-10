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
  TouchableOpacity,
  Dimensions
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { withNavigation } from "react-navigation";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Constants from "../config/constants";
/**********************************************************************
 *
 *                               Variables
 *
 **********************************************************************/
const { width, height } = Dimensions.get("window");
/**********************************************************************
 *
 *                               Class
 *
 **********************************************************************/
class cardNews extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  randerRating(num) {
    return [...Array(5)].map((el, i) =>
      // check if current star should be half
      i < num && i + 1 > num ? (
        <FontAwesome5
          key={i}
          name="star-half-alt"
          solid
          style={{
            color: "#e5cc25",
            margin: 1,
            transform: [{ rotate: "140deg" }]
          }}
        />
      ) : // not half, so check if current star should be full
      i < num ? (
        <FontAwesome5
          key={i}
          name="star"
          solid
          style={{ color: "#e5cc25", margin: 1 }}
        />
      ) : (
        // else, current star should be empty
        <FontAwesome5
          key={i}
          name="star"
          solid
          style={{ color: "#c4c4c4", margin: 1 }}
        />
      )
    );
  }

  handelType(type) {
    if (type == 1) {
      return (
        <LinearGradient
          colors={["#e497a2", "#e497a2"]}
          start={{ x: 0.0, y: 0.5 }}
          end={{ x: 1.0, y: 0.5 }}
          locations={[0.0, 1.0]}
          style={{
            padding: 5,
            position: "absolute",
            top: 0,
            left: 5,
            zIndex: 1,
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5
          }}
        >
          <FontAwesome5 name="percent" style={{ color: "#ffffff" }} />
        </LinearGradient>
      );
    } else if (type == 0) {
      return (
        <LinearGradient
          colors={["#faf449", "#dbb814"]}
          start={{ x: 0.0, y: 0.5 }}
          end={{ x: 1.0, y: 0.5 }}
          locations={[0.0, 1.0]}
          style={{
            padding: 5,
            position: "absolute",
            top: 0,
            left: 5,
            zIndex: 1,
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5
          }}
        >
          <FontAwesome5 name="star" solid style={{ color: "#ffffff" }} />
        </LinearGradient>
      );
    }
    return null;
  }
  render() {
    const { style, imagStyle } = this.props;
    const { card } = styles;
    const combineStyles = StyleSheet.flatten([card, style]);
    return (
      <TouchableOpacity
        style={combineStyles}
        onPress={() => {
          this.props.navigation.navigate("Offer", {
            offerId: this.props.id
          });
        }}
      >
        {this.handelType(this.props.offerType)}
        <Image source={this.props.image} style={[styles.Image, imagStyle]} />
        <View style={{ padding: 5 }}>
          <Text style={styles.Title}>{this.props.Title}</Text>
          <View style={{ flexDirection: "row" }}>
            {this.props.ratingStars
              ? this.randerRating(this.props.ratingStars)
              : this.randerRating(0)}
            <Text style={styles.ratingCount}>
              ({this.props.ratingCount ? this.props.ratingCount : 0})
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ebebeb",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    marginBottom: 10
  },
  Image: { width: "100%", height: (height * 0.3) / 1.2, resizeMode: "cover" },
  Title: {
    color: "#000",
    fontFamily: Constants.fontFamilyBold,
    fontSize: 12,
    textAlign: "left",
    lineHeight: 17,
    paddingTop: 7,
    paddingBottom: 3,
    minHeight: 55
  },
  ratingCount: {
    textAlign: "left",
    color: "#aeaeae",
    fontSize: 12,
    marginLeft: 8,
    marginBottom: 2
  }
});
export default withNavigation(cardNews);
