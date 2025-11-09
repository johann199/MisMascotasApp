import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ComeBackLogo = ({ size = 'large' }) => {
  const scale = size === 'large' ? 1 : 0.7;

  return (
    <View style={[styles.logoCircle, {
      width: 140 * scale,
      height: 140 * scale,
      borderRadius: 70 * scale
    }]}>
      <View style={styles.logoHouse}>
        <View style={styles.logoRoof} />
        <View style={styles.logoBody}>
          <View style={styles.logoDog}>
            <View style={[styles.dogEye, { left: 8 }]} />
            <View style={[styles.dogEye, { right: 8 }]} />
            <View style={styles.dogNose} />
            <View style={styles.dogMouth} />
          </View>
        </View>
      </View>
      <Text style={[styles.logoText, { fontSize: 16 * scale }]}>COME HOME</Text>
    </View>
  );
};