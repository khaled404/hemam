'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import React, { Component } from 'react';
import { View, Text ,StyleSheet,Image,TouchableOpacity,Dimensions} from 'react-native';
import { withNavigation } from 'react-navigation';
import Constants from '../config/constants';
/**********************************************************************
*
*                               Variables
*
**********************************************************************/
const { width, height } = Dimensions.get('window');
/**********************************************************************
*
*                               Class
*
**********************************************************************/
class cardNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { style } = this.props;
        const { card } = styles;
        const combineStyles = StyleSheet.flatten([card, style]);  
    return (
        <TouchableOpacity style={combineStyles} onPress={()=>{
            this.props.navigation.navigate('Artical', {
                articalId: this.props.id,
              });
        }}>
            <Image source={this.props.image} style={styles.Image} />
            <View style={{padding:5}}>
                <Text style={styles.Title}>{this.props.Title}</Text>
                <Text style={styles.Date}>{this.props.Date}</Text>
            </View>
        </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
    card:{borderWidth:1,borderColor:'#ebebeb',borderTopRightRadius:5,borderTopLeftRadius:5,marginBottom:10,flex:1,flexDirection:'row'},
    Image:{width:150,height:height*0.3/2,resizeMode:'cover',},
    Title:{color:'#000',fontFamily: Constants.fontFamilyBold,fontSize:14,textAlign:'left',lineHeight:15,paddingVertical:5},
    Date:{textAlign:'left',color:'#aeaeae'}
})
export default withNavigation(cardNews);