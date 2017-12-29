/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View
} from 'react-native';

const questions = require( "./questions.json" );

import { Container, Header, Content, ListItem, Text, Radio, Right } from 'native-base';

export default class App extends Component<{}> {
  render() {
    return (
      <Container>
        <Header />
        <Content>
          <ListItem>
            <Text>Daily Stand Up</Text>
            <Right>
              <Radio selected={false} />
            </Right>
          </ListItem>
          <ListItem>
            <Text>Discussion with Client</Text>
            <Right>
              <Radio selected={true} />
            </Right>
          </ListItem>
        </Content>
      </Container>
    );
 }
}
