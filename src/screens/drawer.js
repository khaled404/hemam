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
  ScrollView,
  Platform
} from "react-native";
import { Left, List, ListItem, Container, Header } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import LinearGradient from "react-native-linear-gradient";
import Share from "react-native-share";
import { ifIphoneX } from "react-native-iphone-x-helper";
import { connect } from "react-redux";
import Constants from "../config/constants";
import { showMessage } from "react-native-flash-message";
/**********************************************************************
 *
 *                               Class
 *
 **********************************************************************/
class DrawerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logged: false,
      name: "",
      contactData: []
    };
  }
  // async componentWillReceiveProps(nextProps) {
  // 	if (nextProps.navigation.state.isDrawerOpen) {
  // 		await AsyncStorage.getItem('api_token').then((token) => {
  // 			if (token != null) {
  // 				this.setState({
  // 					logged: true
  // 				});
  // 			}
  // 		}).then(() => {
  // 			AsyncStorage.getItem('name').then((name) => {
  // 				if (name != null) {
  // 					this.setState({
  // 						name: name
  // 					});
  // 				}

  // 			}).then(() => {
  // 				AsyncStorage.getItem('image').then((image) => {
  // 					console.log(image)
  // 					if (image != null) {
  // 						this.setState({
  // 							userImage: image
  // 						});
  // 					}
  // 				})
  // 			});
  // 		});
  // 	}
  // }
  async shareApp() {
    if (Platform.OS === "android") {
      var url = this.state.contactData.play_store;
    } else {
      var url = this.state.contactData.app_store;
    }
    let msg = this.state.contactData.share_msg;
    const shareOptions = {
      title: msg,
      url: url,
      failOnCancel: false
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      console.log("Error =>", error);
    }
  }

  logout = () => {
    AsyncStorage.removeItem("api_token");
    AsyncStorage.removeItem("name");
    AsyncStorage.removeItem("image");
    AsyncStorage.removeItem("email");
    AsyncStorage.removeItem("phone");
    this.props.dispatch({ type: "UPDATE_LOGIN", data: false });
    this.props.dispatch({ type: "UPDATE_NAME", data: "" });
    this.props.dispatch({ type: "UPDATE_EMAIL", data: "" });
    this.props.dispatch({ type: "UPDATE_PHONE", data: "" });
    this.props.dispatch({ type: "UPDATE_IMAGE", data: "" });
    showMessage({
      message: "تنبية",
      description: "تم تسجيل الدخول بنجاح",
      duration: 2000,
      type: "success"
    });
    this.props.navigation.closeDrawer();
  };
  returnIcon(name, solid = null) {
    if (solid) {
      return <FontAwesome5 name={name} style={styles.icon} solid />;
    } else {
      return <FontAwesome5 name={name} style={styles.icon} />;
    }
  }

  async getShareUrl() {
    try {
      const settingsApiCall = await fetch(Constants.siteUrl + "settings", {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: { ...Constants.headers },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer" // no-referrer, *client
      });
      const settings = await settingsApiCall.json();
      if ((settings.status = 200)) {
        this.setState({
          contactData: settings.data,
          loading: false
        });
      } else {
      }
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }
  async componentDidMount() {
    await AsyncStorage.getItem("api_token")
      .then(token => {
        if (token != null) {
          this.setState({
            logged: true
          });
        }
      })
      .then(() => {
        AsyncStorage.getItem("name")
          .then(name => {
            if (name != null) {
              this.setState({
                name: name
              });
            }
          })
          .then(() => {
            AsyncStorage.getItem("image")
              .then(image => {
                if (image != null) {
                  this.setState({
                    userImage: image
                  });
                }
              })
              .then(() => {
                this.getShareUrl();
              });
          });
      });
  }
  goToRoute(RouteName) {
    this.props.navigation.navigate(RouteName);
    this.props.navigation.closeDrawer();
  }
  render() {
    const { navigation } = this.props;
    if (this.props.Login == false) {
      var image = (
        <Image
          source={require("../../assets/images/UserImagePlaceholder.png")}
          style={styles.mainImage}
        />
      );
    } else {
      var base = this.props.Image;
      var image = <Image source={{ uri: base }} style={styles.mainImage} />;
    }
    return (
      <Container>
        <View style={styles.container}>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <View>
              <LinearGradient
                colors={["#7dde9d", "#17b7bd"]}
                start={{ x: 0.0, y: 0.5 }}
                end={{ x: 1.0, y: 0.5 }}
                locations={[0.0, 1.0]}
              >
                {image}
                {this.props.Login == true ? (
                  <TouchableOpacity
                    onPress={() => this.goToRoute("EditAccount")}
                  >
                    <Text
                      style={{
                        color: "#ffffff",
                        fontFamily: Constants.fontFamilyRoman,
                        marginLeft: 20,
                        marginBottom: 20,
                        textAlign: "left"
                      }}
                    >
                      اهلا بك {this.props.Name}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => this.goToRoute("Login")}>
                    <Text
                      style={{
                        color: "#ffffff",
                        fontFamily: Constants.fontFamilyRoman,
                        marginLeft: 20,
                        marginBottom: 20,
                        textAlign: "left"
                      }}
                    >
                      تسجيل الدخول
                    </Text>
                  </TouchableOpacity>
                )}
              </LinearGradient>
              <List
                style={{
                  paddingHorizontal: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: "#e5e5e5",
                  paddingBottom: 20,
                  marginBottom: 20
                }}
              >
                <ListItem
                  icon
                  style={{ justifyContent: "flex-start" }}
                  onPress={() => this.goToRoute("Home")}
                >
                  <Left>
                    <FontAwesome5 name="home" style={styles.icon} solid />
                  </Left>
                  <Text style={styles.text}>الرئيسية</Text>
                </ListItem>
                {this.props.Login == true ? (
                  <ListItem
                    icon
                    style={{ justifyContent: "flex-start" }}
                    onPress={() => this.goToRoute("MyOrders")}
                  >
                    <Left>
                      <FontAwesome5 name="comment" style={styles.icon} solid />
                    </Left>
                    <Text style={styles.text}>طلباتي</Text>
                  </ListItem>
                ) : null}
                <ListItem
                  icon
                  style={{ justifyContent: "flex-start" }}
                  onPress={() => this.goToRoute("Categories")}
                >
                  <Left>
                    <FontAwesome5 name="th" style={styles.icon} solid />
                  </Left>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                      justifyContent: "space-between"
                    }}
                  >
                    <Text style={[styles.text, { textAlign: "left" }]}>
                      أقسام الإعلانات
                    </Text>
                    <FontAwesome5
                      name="chevron-left"
                      style={{ marginRight: 20 }}
                    />
                  </View>
                </ListItem>
                <ListItem
                  icon
                  style={{ justifyContent: "flex-start" }}
                  onPress={() => this.goToRoute("Offers")}
                >
                  <Left>
                    <FontAwesome5 name="percent" style={styles.icon} solid />
                  </Left>
                  <Text style={styles.text}>عروضنا</Text>
                </ListItem>
                <ListItem
                  icon
                  style={{ justifyContent: "flex-start" }}
                  onPress={() => this.goToRoute("ExclusiveOffers")}
                >
                  <Left>
                    <FontAwesome5 name="star" style={styles.icon} solid />
                  </Left>
                  <Text style={styles.text} solid>
                    عروضنا الحصرية
                  </Text>
                </ListItem>
                <ListItem
                  icon
                  style={{ justifyContent: "flex-start" }}
                  onPress={() => this.goToRoute("News")}
                >
                  <Left>
                    <FontAwesome5 name="newspaper" style={styles.icon} />
                  </Left>
                  <Text style={styles.text}>أخبارنا</Text>
                </ListItem>
                {this.props.Login == true ? (
                  <ListItem
                    icon
                    style={{ justifyContent: "flex-start" }}
                    onPress={() => this.goToRoute("ConcessionOrders")}
                  >
                    <Left>
                      <FontAwesome5 name="bookmark" style={styles.icon} solid />
                    </Left>
                    <Text style={styles.text}>التنازلات</Text>
                  </ListItem>
                ) : null}
                {this.props.Login == true ? (
                  <ListItem
                    icon
                    style={{ justifyContent: "flex-start" }}
                    onPress={() => this.goToRoute("SpecialOrders")}
                  >
                    <Left>
                      <FontAwesome5 name="file-alt" style={styles.icon} solid />
                    </Left>
                    <Text style={styles.text}>الطلبات الخاصة</Text>
                  </ListItem>
                ) : null}

                {this.props.Login == true ? (
                  <ListItem
                    icon
                    style={{ justifyContent: "flex-start" }}
                    onPress={() => this.goToRoute("EditAccount")}
                  >
                    <Left>
                      <FontAwesome5 name="user" style={styles.icon} solid />
                    </Left>
                    <Text style={styles.text}>تعديل حسابي</Text>
                  </ListItem>
                ) : null}
                {this.props.Login == true ? (
                  <ListItem
                    icon
                    style={{ justifyContent: "flex-start" }}
                    onPress={() => this.logout()}
                  >
                    <Left>
                      <FontAwesome5
                        name="sign-out-alt"
                        style={styles.icon}
                        solid
                      />
                    </Left>
                    <Text style={styles.text}>تسجيل الخروج</Text>
                  </ListItem>
                ) : null}
              </List>
              <List style={{ paddingHorizontal: 0 }}>
                {/* <ListItem icon style={{ justifyContent: 'flex-start' }} onPress={() =>this.goToRoute('Home')}>
								<Left>
									<FontAwesome5 name="cog" style={styles.icon} solid />
								</Left>
								<Text style={styles.text}>الإعدادات</Text>
							</ListItem> */}

                <ListItem
                  icon
                  style={{ justifyContent: "flex-start" }}
                  onPress={() => this.shareApp()}
                >
                  <Left>
                    <FontAwesome5 name="share-alt" style={styles.icon} />
                  </Left>
                  <Text style={styles.text}>مشاركة التطبيق</Text>
                </ListItem>
                <ListItem
                  icon
                  style={{ justifyContent: "flex-start" }}
                  onPress={() => this.goToRoute("Contact")}
                >
                  <Left>
                    <FontAwesome5 name="envelope" style={styles.icon} solid />
                  </Left>
                  <Text style={styles.text}>تواصل معنا</Text>
                </ListItem>
              </List>
            </View>
          </ScrollView>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  mainImage: {
    marginLeft: 20,
    marginBottom: 10,
    height: 116,
    width: 116,
    borderRadius: 116 / 2,
    ...ifIphoneX(
      {
        marginTop: 50
      },
      {
        marginTop: 20
      }
    )
  },
  icon: { fontSize: 20, color: "#b3b3b3" },
  text: { color: "#514e5e", fontFamily: Constants.fontFamilyRoman }
});
function mapStateToProps(state) {
  console.log(state);
  return {
    Login: state.Login,
    Name: state.Name,
    Image: state.Image
  };
}
export default connect(mapStateToProps)(DrawerContainer);
