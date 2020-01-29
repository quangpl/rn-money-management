import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  ToastAndroid,
  AsyncStorage
} from "react-native";

import { MonoText } from "../components/StyledText";
import { Button, ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
const list = [
  { type: "plus", reason: "mua do", money: 20000, time: "20/10/2019" },
  {
    reason: "mua nuoc rua chen",
    money: 20000,
    time: "20/10/2019",
    type: "minus"
  }
];

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reason: "",
      money: "",
      data: [],
      sum: 0
    };
  }

  async componentDidMount() {
    
    let sum;
    const data = await AsyncStorage.getItem("data");
    const oldSum = await AsyncStorage.getItem("sum");
    if (oldSum) {
      await this.setState({
        data: JSON.parse(data),
        sum: parseInt(oldSum)
      });
    }else {
         await this.setState({
           data: JSON.parse(data),
         });
    }
  }

  onSave = async type => {
    let sum, newData, tempData;
    if (!this.state.money || !this.state.reason) {
      ToastAndroid.show(
        "Mẹ chưa nhập đủ thông tin ! Vui lòng kiểm tra lại !",
        ToastAndroid.LONG
      );
      return false;
    }
    if (type === "plus") {
      sum = parseInt(this.state.sum) + parseInt(this.state.money);
    } else {
      sum = parseInt(this.state.sum) - parseInt(this.state.money);
    }
    console.log(this.state.data);
    if (this.state.data == null) {
      console.log("khoi tao");
      tempData = [];
    } else {
      tempData = [...this.state.data];
    }
    tempData.unshift({
      reason: this.state.reason,
      money: this.state.money,
      type
    });
    newData = [...tempData];
    console.log(newData);
    this.setState({
      data: newData,
      sum
    });
    await AsyncStorage.setItem("data", JSON.stringify(newData));
    await AsyncStorage.setItem("sum", sum.toString());
    this.setState({
      money:"",
      reason:""
    })
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Image
            style={styles.logo}
            source={require("../assets/images/money.png")}
          />
          <Text style={styles.label}>Lý do : </Text>
          <TextInput
            placeholder="Lý do thu/chi"
            style={styles.input}
            value={this.state.reason}
            onChangeText={text => {
              this.setState({
                reason: text
              });
            }}
          ></TextInput>
          <Text style={styles.label}>Số tiền : </Text>
          <TextInput
            onChangeText={text => {
              this.setState({
                money: text
              });
            }}
            value={this.state.money}
            placeholder="Số tiền thay đổi"
            style={styles.input}
            keyboardType="numeric"
          ></TextInput>

          <View style={styles.buttonGroup}>
            <Button
              buttonStyle={styles.button}
              icon={
                <Icon
                  style={{
                    marginRight: 6
                  }}
                  name="minus-circle"
                  size={15}
                  color="white"
                />
              }
              onPress={() => {
                this.onSave("minus");
              }}
              title="Chi"
            />

            <Button
              buttonStyle={styles.button}
              icon={
                <Icon
                  style={{
                    marginRight: 6
                  }}
                  name="plus-circle"
                  size={15}
                  color="#BBBBBB"
                />
              }
              onPress={() => {
                this.onSave("plus");
              }}
              title="Thu"
            />
            {/* <Button
              buttonStyle={styles.button}
             
              onPress={async() => {
              await AsyncStorage.clear();
              }}
              title="Del"
            /> */}
          </View>
        </View>
        <View style={styles.listContainer}>
          <ScrollView>
            {this.state.data !== null ? (
              this.state.data.map((item, i) => (
                <ListItem
                  key={i}
                  rightTitle={item.money}
                  leftAvatar={
                    item.type === "plus"
                      ? { source: require("../assets/images/plus.png") }
                      : { source: require("../assets/images/minus.png") }
                  }
                  title={`${item.reason}`}
                  // subtitle={item.time}
                  bottomDivider
                />
              ))
            ) : (
              <Text
                style={{
                  color: "black",
                  textAlign: "center"
                }}
              >
                Chưa có dữ liệu
              </Text>
            )}
          </ScrollView>
        </View>
        <View style={styles.sumContainer}>
          <Icon
            style={{
              marginRight: 6
            }}
            name="archive"
            size={30}
            color="#DDDDDD"
          />
          <Text style={styles.sumText}>{this.state.sum}</Text>
        </View>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  inputContainer: {
    flex: 0.5,
    justifyContent: "center"
  },
  listContainer: {
    flex: 0.42
  },
  sumContainer: {
    flex: 0.08,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 50,
    height: 50,
    alignSelf: "center"
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#2188DC",
    borderRadius: 4,
    margin: 10,
    padding: 10
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center"
  },
  button: {
    width: 110,
    margin: 20
  },
  label: {
    marginLeft: 10,
    color: "#2188DC",
    fontSize: 15
  },
  sumText: {
    color: "#2188DC",
    fontSize: 27,
    fontWeight: "800"
  }
});
