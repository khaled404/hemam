import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated
} from "react-native";
import constants from "../config/constants";
import { withNavigation } from "react-navigation";

const { width } = Dimensions.get("window");

const NSlider = props => {
  const [slideAnimation] = useState(new Animated.Value(-width));
  const [num, setNum] = useState(-width / 2);
  const [counter, setCounter] = useState(1);
  const [length] = useState(props.items.length);
  const [falg, setFlag] = useState(true);
  useEffect(() => {
    let a = falg ? 0.1 : 5.7;
    let b = falg ? length * length * 1 : length * length * 20;
    if (length > 5 && counter >= length * length * a) {
      slideAnimation.setValue(-width);
      setNum(-width / 2);
      setCounter(1);
      setFlag(false);
    } else if (length < 5 && counter >= b) {
      slideAnimation.setValue(-width / 2);
      setNum(100);
      setCounter(1);
      setFlag(false);
    }

    if (counter >= 2) {
      setNum(a => a + width / length / 1.6);
    }
    // let count = counter > 70 ? 3500 : 2000;
    Animated.timing(slideAnimation, {
      toValue: num,
      duration: falg ? 20 : 2500
    }).start(() => {
      setCounter(a => a + 1);
    });
  }, [counter]);
  const toLeft = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500]
  });

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.content}>
        {props.items.map(item => (
          <View
            key={item.id}
            style={[
              {
                width: "auto",
                paddingHorizontal: 20,
                transform: [{ translateX: toLeft._parent._value }]
              }
            ]}
          >
            <TouchableOpacity
              onPress={() => {
                if (item.type_name == "News") {
                  props.navigation.navigate("Artical", {
                    articalId: item.type_id
                  });
                } else if (item.type_name == "Offer") {
                  props.navigation.navigate("Offer", {
                    offerId: item.type_id
                  });
                }
              }}
            >
              <Text style={styles.title}>{!falg && item.title}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  sliderContainer: {
    width: "100%",
    height: 45,
    backgroundColor: "#f2f2f2",
    padding: 5,
    overflow: "hidden"
  },
  content: {
    flexDirection: "row",
    direction: "rtl",
    alignItems: "center",
    height: "100%",
    overflow: "hidden",
    marginHorizontal: 5
  },
  title: {
    fontSize: 15,
    color: "#777480",
    fontFamily: constants.fontFamilyRoman,
    textAlign: "left"
  }
});
export default withNavigation(NSlider);
