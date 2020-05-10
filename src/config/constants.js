'use strict';
/**********************************************************************
*
*                               Import Libraries
*
**********************************************************************/
import { Platform } from 'react-native';

export default {
    siteUrl:'http://hemam.tasawk.net/api/v1/',
    mainColor:'#404663',
    secondColor:'#ff9f35',
    colorWhite:'#ffffff',
    colorBlack:'#000000',
    colorGray:'#f3f3f3',
    colorGrayDark:'#b8b8b8',
    backgroundInputColor:'#f5f5f5',
    fontFamilyBlack:Platform.OS === 'ios' ? 'FrutigerLTArabic-75Black' : 'FrutigerLTArabicBlack' ,
    fontFamilyBold:Platform.OS === 'ios' ? 'FrutigerLTArabic-65Bold' : 'FrutigerLTArabicBold' ,
    fontFamilyRoman:Platform.OS === 'ios' ? 'FrutigerLTArabic-55Roman' : 'FrutigerLTArabicRoman',
    fontFamilyLight:Platform.OS === 'ios' ? 'FrutigerLTArabic-45Light':'FrutigerLTArabicLight',
    headers:{ 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}
