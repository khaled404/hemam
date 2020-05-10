import React, { Component } from 'react';
import { StyleSheet, ListView, View } from 'react-native'
var moveListTimer = require('react-timer-mixin');

var timerInterval = 10;
var moveListTimerId;
var pos = 0;
var ListArr = [];



export default class MarqueeListClass extends Component {

  constructor(props) {
    super(props);
    this.state = {

      listLength: ListArr.length,
      listmovingdirection: 'right',
    };
  }


  componentDidMount() {
    moveListTimerId = moveListTimer.setInterval(() => {
      this.moveList();
    }, timerInterval);
  }


  componentWillUnmount() {
    moveListTimerId && clearInterval(moveListTimerId);
  }

  moveList() {
    if (this.state.listmovingdirection === 'right') {
      this.moveListToRight();
    }
    else if (this.state.listmovingdirection === 'left') {
      this.moveListToLeft();
    }
  }

  moveListToEnd() {
    this.ListView.scrollToEnd({ animated: true });
  }

  moveListToRight() {
    pos = pos + 0.5;
    this.ListView.scrollTo({ x: pos, y: 0, animated: true })
  }

  moveListToLeft() {
    if (pos > 0) {
      pos = pos - 0.5;
      this.ListView.scrollTo({ x: pos, y: 0, animated: true })
    }
    else {
      this.setState({ listmovingdirection: 'right' });
    }
  }

  onListReachEnd() {
    this.setState({ listmovingdirection: 'left' });
  }

  render() {

    return (
      <View style={styles.main}>
        <ListView
          horizontal={true}
          ref={ref => this.ListView = ref}
          showsHorizontalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          onEndReached={() => this.onListReachEnd()}
          enableEmptySections={true}
          style={styles.list}
          dataSource={this.props.items}
          renderRow={(rowData, sectionID, rowID) => < Row info={rowData} rowID={rowID} />} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
	main: {
		flex: 1,
		backgroundColor: '#071c6d',
		paddingTop: 40,
		// paddingHorizontal: 20
	},
})