import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
  Image,
  NativeModules,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  ViewPropTypes
} from "react-native";

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const s = StyleSheet.create({
  container: {
    alignItems: "center",
    // backgroundColor: "red"
  },
  form: {
    width: "95%",
    // backgroundColor: "orange"
  },
  inputContainer: {
    // marginLeft: 20,
    // backgroundColor: "green",
    // marginTop: 5,
  },
  inputLabel: {
    // height: 25,
    // paddingBottom: 20
    marginLeft: 10,
  },
  input: {
    height: 40,
    marginBottom: 0,
    // backgroundColor: 'grey',
    // margin: 0,
  },
  row: {
    // backgroundColor: "grey",
    display: "flex",
    marginBottom: 20, 
    flexDirection: "row"
    // flex: 1,
  },
  rowItem: {
    flex: 1
  }
});

const CVC_INPUT_WIDTH = 70;
const EXPIRY_INPUT_WIDTH = CVC_INPUT_WIDTH;
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 40;
const CARD_NUMBER_INPUT_WIDTH =
  Dimensions.get("window").width -
  EXPIRY_INPUT_WIDTH -
  CARD_NUMBER_INPUT_WIDTH_OFFSET;
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const PREVIOUS_FIELD_OFFSET = 40;
const POSTAL_CODE_INPUT_WIDTH = 70; // https://github.com/yannickcr/eslint-plugin-react/issues/106

/* eslint react/prop-types: 0 */ export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    inputStyle: Text.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    allowScroll: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(
      PropTypes.shape(TextInput.propTypes)
    )
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "CARDHOLDER'S NAME",
      number: "CARD NUMBER",
      expiry: "EXPIRY",
      cvc: "CVC/CCV",
      postalCode: "POSTAL CODE"
    },
    placeholders: {
      name: "Full Name",
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
      postalCode: "A1A 1A1"
    },
    inputContainerStyle: {
      // borderBottomWidth: 1,
      // borderBottomColor: "black",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    allowScroll: false,
    additionalInputsProps: {}
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focus = field => {
    if (!field) return;

    // const scrollResponder = this.refs.Form.getScrollResponder();
    // const nodeHandle = ReactNative.findNodeHandle(this.refs[field]);
    this.refs[field].focus();
    // NativeModules.UIManager.measureLayoutRelativeToParent(nodeHandle,
    //   e => { throw e; },
    //   x => {
    //     scrollResponder.scrollTo({ x: Math.max(x - PREVIOUS_FIELD_OFFSET, 0), animated: true });
    //     this.refs[field].focus();
    //   });
  };

  _inputProps = field => {
    const {
      inputStyle,
      labelStyle,
      validColor,
      invalidColor,
      placeholderColor,
      placeholders,
      focused,
      labels,
      values,
      status,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,
      additionalInputsProps,
      defaultValues,
    } = this.props;

    if((values[field] == null || values[field] == undefined) && defaultValues[field]){
      values[field] = defaultValues[field]
    }

    return {
      inputStyle: [s.input, inputStyle],
      labelStyle: [s.inputLabel, labelStyle],
      validColor,
      invalidColor,
      placeholderColor,
      ref: field,
      field,

      label: labels[field],
      placeholder: placeholders[field],
      value: values[field],
      status: status[field],
      focused,
      onFocus,
      onChange,
      onBecomeEmpty,
      onBecomeValid,

      additionalInputProps: additionalInputsProps[field]
    };
  };

  render() {
    const {
      cardImageFront,
      cardImageBack,
      inputContainerStyle,
      values: { number, expiry, cvc, name, type },
      focused,
      allowScroll,
      requiresName,
      requiresCVC,
      requiresPostalCode,
      cardScale,
      cardFontFamily,
      cardBrandIcons
    } = this.props;

    return (
      <View style={s.container}>
        {/* <CreditCard focused={focused}
          brand={type}
          scale={cardScale}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : " "}
          number={number}
          expiry={expiry}
          cvc={cvc} /> */}
        <View ref="Form" style={s.form}>
          <View style={s.row}>
            <View style={s.rowItem}>
              <CCInput
                {...this._inputProps("number")}
                keyboardType="numeric"
                brand={type}
                containerStyle={[s.inputContainer, inputContainerStyle]}
              />
            </View>
          </View>
          <View style={s.row}>
            <View style={s.rowItem}>
              <CCInput
                {...this._inputProps("expiry")}
                keyboardType="numeric"
                containerStyle={[s.inputContainer, inputContainerStyle]}
              />
            </View>
            {requiresCVC && (
              <View style={s.rowItem}>
                <CCInput
                  {...this._inputProps("cvc")}
                  keyboardType="numeric"
                  containerStyle={[s.inputContainer, inputContainerStyle]}
                />
              </View>
            )}
          </View>
          <View style={s.row} >
            {requiresPostalCode && (
              <View style={s.rowItem}>
                <CCInput
                  {...this._inputProps("postalCode")}
                  containerStyle={[s.inputContainer, inputContainerStyle]}
                />
              </View>
            )}
            {requiresName && (
              <View style={s.rowItem}>
                <CCInput
                  {...this._inputProps("name")}
                  containerStyle={[s.inputContainer, inputContainerStyle]}
                />
              </View>
            )}
            </View>
        </View>
      </View>
    );
  }
}
