"use strict";
/**********************************************************************
 *
 *                               Import Libraries
 *
 **********************************************************************/
import React, { Component } from "react";

import { I18nManager, BackHandler, View } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { createAppContainer, NavigationActions } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import getSlideFromRightTransition from "react-navigation-slide-from-right-transition";
import SplashScreen from "react-native-splash-screen";
import firebase from "react-native-firebase";
import FlashMessage from "react-native-flash-message";
import { createStore } from "redux";
import { Provider } from "react-redux";
import Constants from "./src/config/constants";
/**********************************************************************
 *
 *                               Variales
 *
 **********************************************************************/
/**
 * Store - holds our state - THERE IS ONLY ONE STATE
 * Action - State can be modified using actions - SIMPLE OBJECTS
 * Dispatcher - Action needs to be sent by someone - known as dispatching an action
 * Reducer - receives the action and modifies the state to give us a new state
 *  - pure functions
 *  - only mandatory argument is the 'type'
 * Subscriber - listens for state change to update the ui
 */
const initialState = {
  Login: false,
  Name: "",
  Phone: "",
  Email: "",
  Image: ""
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_LOGIN":
      return { ...state, Login: action.data };
    case "UPDATE_NAME":
      return { ...state, Name: action.data };
    case "UPDATE_EMAIL":
      return { ...state, Email: action.data };
    case "UPDATE_PHONE":
      return { ...state, Phone: action.data };
    case "UPDATE_IMAGE":
      return { ...state, Image: action.data };
  }
  return state;
};

const store = createStore(reducer);
/**********************************************************************
 *
 *                               Screens
 *
 **********************************************************************/
import DrawerContainer from "./src/screens/drawer";
import SelectCity from "./src/screens/selectCity";
import Home from "./src/screens/home";
import Login from "./src/screens/login";
import Register from "./src/screens/register";
import Forgot from "./src/screens/forgot";
import Forgot_1 from "./src/screens/forgot_1";
import EditAccount from "./src/screens/editAccount";
import MyOrders from "./src/screens/myOrders";
import News from "./src/screens/news";
import Artical from "./src/screens/artical";
import Categories from "./src/screens/categories";
import Category from "./src/screens/category";
import Offers from "./src/screens/offers";
import Offer from "./src/screens/offer";
import ExclusiveOffers from "./src/screens/exclusiveOffers";
import SpecialOrders from "./src/screens/specialOrders";
import ConcessionOrders from "./src/screens/concessionOrders";
import Trainers from "./src/screens/trainers";
import Trainer from "./src/screens/trainer";
import Contact from "./src/screens/contact";
import Search from "./src/screens/search";
import Terms from "./src/screens/terms";
import concessionForm from "./src/screens/concessionForm";
import trainerForm from "./src/screens/trainerForm";
const Navigator = createStackNavigator(
  {
    SelectCity: {
      screen: SelectCity
    },
    Terms: {
      screen: Terms
    },
    Home: {
      screen: Home
    },
    Search: {
      screen: Search
    },
    Login: {
      screen: Login
    },
    Register: {
      screen: Register
    },
    Forgot: {
      screen: Forgot
    },
    Forgot_1: {
      screen: Forgot_1
    },
    EditAccount: {
      screen: EditAccount
    },
    MyOrders: {
      screen: MyOrders
    },
    News: {
      screen: News
    },
    Artical: {
      screen: Artical
    },
    Categories: {
      screen: Categories
    },
    Category: {
      screen: Category
    },
    Offers: {
      screen: Offers
    },
    Offer: {
      screen: Offer
    },
    ExclusiveOffers: {
      screen: ExclusiveOffers
    },
    SpecialOrders: {
      screen: SpecialOrders
    },
    ConcessionOrders: {
      screen: ConcessionOrders
    },
    Trainers: {
      screen: Trainers
    },
    Trainer: {
      screen: Trainer
    },
    Contact: {
      screen: Contact
    },
    ConcessionForm: {
      screen: concessionForm
    },
    TrainerForm: {
      screen: trainerForm
    }
  },
  {
    initialRouteName: "Home",
    headerMode: "none",
    transitionConfig: getSlideFromRightTransition
  }
);

const RootStack = createDrawerNavigator(
  {
    Stack: { screen: Navigator }
    // Stack: { screen: trainerForm }
  },
  {
    drawerPosition: I18nManager.isRTL ? "right" : "left",
    contentComponent: DrawerContainer,
    drawerType: "front",
    navigationOptions: {
      drawerLockMode: "locked-closed"
    }
  }
);

const AppContainer = createAppContainer(RootStack);

const listenFcm = () => {
  firebase
    .messaging()
    .getToken()
    .then(c => {
      AsyncStorage.setItem("fcmToken", c);
      firebase.messaging().subscribeToTopic("global");
      firebase.notifications().onNotification(VarNotification => {
        const { title, body } = VarNotification;
        const notification = new firebase.notifications.Notification()
          .setNotificationId("localNotify")
          .setTitle(title)
          .setSound("default")
          .android.setSmallIcon("ic_launcher")
          .android.setChannelId("hemamchannel")
          .setBody(body);
        firebase.notifications().displayNotification(notification);
      });
    });
};

firebase
  .messaging()
  .hasPermission()
  .then(enabled => {
    if (enabled) {
      listenFcm();
    } else {
      firebase
        .messaging()
        .requestPermission()
        .then(() => {
          listenFcm();
        })
        .catch(error => {
          console.log(error);
          //  SimpleToast.show("لم يتم إعطائ الإذن  لاستلام الإشعارات", SimpleToast.LONG)
        });
    }
  });
/**********************************************************************
 *
 *                              Main App
 *
 **********************************************************************/
export default class App extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      currentScreen: ""
    };
    //disable Yellow Box
    console.disableYellowBox = true;
  }
  async getContact() {
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
        store.dispatch({ type: "UPDATE_Contact", data: settings.data });
      } else {
      }
    } catch (err) {
      console.log("Error fetching data-----------", err);
    }
  }
  async componentDidMount() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);

    // this.navigator.dispatch({
    //    type: NavigationActions.NAVIGATE,
    //    routeName: 'SplashScreen',
    // });
    await AsyncStorage.getItem("api_token")
      .then(Intro => {
        if (Intro != null) {
          store.dispatch({ type: "UPDATE_LOGIN", data: true });
        }
      })
      .then(() => {
        AsyncStorage.getItem("name")
          .then(name => {
            if (name != null) {
              store.dispatch({ type: "UPDATE_NAME", data: name });
            }
          })
          .then(() => {
            AsyncStorage.getItem("image").then(image => {
              if (image != null) {
                store.dispatch({ type: "UPDATE_IMAGE", data: image });
              }
            });
          })
          .then(() => {
            AsyncStorage.getItem("email").then(email => {
              if (email != null) {
                store.dispatch({ type: "UPDATE_EMAIL", data: email });
              }
            });
          })
          .then(() => {
            AsyncStorage.getItem("phone").then(phone => {
              if (phone != null) {
                store.dispatch({ type: "UPDATE_PHONE", data: phone });
              }
            });
          });
      });
    await AsyncStorage.getItem("@cityId").then(Intro => {
      if (Intro != null) {
        this.navigator.dispatch({
          type: NavigationActions.NAVIGATE,
          routeName: "Home"
        });
      } else {
        AsyncStorage.getItem("@skiped").then(Intro => {
          if (Intro != null) {
            this.navigator.dispatch({
              type: NavigationActions.NAVIGATE,
              routeName: "Home"
            });
          } else {
            this.navigator.dispatch({
              type: NavigationActions.NAVIGATE,
              routeName: "SelectCity"
            });
          }
        });
      }
    });
    await AsyncStorage.getItem("@cityId").then(Intro => {
      if (Intro != null) {
        this.navigator.dispatch({
          type: NavigationActions.NAVIGATE,
          routeName: "Home"
        });
      } else {
        AsyncStorage.getItem("@skiped").then(Intro => {
          if (Intro != null) {
            this.navigator.dispatch({
              type: NavigationActions.NAVIGATE,
              routeName: "Home"
            });
          } else {
            this.navigator.dispatch({
              type: NavigationActions.NAVIGATE,
              routeName: "SelectCity"
            });
          }
        });
      }
    });
  }
  getActiveRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getActiveRouteName(route);
    }
    return route.routeName;
  }
  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <AppContainer
            ref={nav => (this.navigator = nav)}
            onNavigationStateChange={(prevState, currentState) => {
              const currentScreen = this.getActiveRouteName(currentState);
              const prevScreen = this.getActiveRouteName(prevState);
              this.state.currentScreen = currentScreen;
              {
                /*if (prevScreen !== currentScreen) {
                        // the line below uses the Google Analytics tracker
                        // change the tracker here to use other Mobile analytics SDK.
                        tracker.trackScreenView(currentScreen);
                     }*/
              }
            }}
          />
          <FlashMessage
            position="top"
            titleStyle={{ fontFamily: Constants.fontFamilyRoman }}
            textStyle={{ fontFamily: Constants.fontFamilyLight }}
          />
        </View>
      </Provider>
    );
  }
}
