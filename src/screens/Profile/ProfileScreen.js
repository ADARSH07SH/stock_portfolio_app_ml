import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
} from "react-native-heroicons/outline";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

import TopBar from "../../components/TopBar";
import BottomTab from "../../components/BottomTab";
import { UserData, editUserData } from "../../api/UserData";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    panNumber: "",
    about: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  // Load user data and profile photo
  useEffect(() => {
    const loadUserAndData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (!storedUsername) {
          navigation.replace("Login");
          return;
        }
        setUsername(storedUsername);

        const storedUserData = await AsyncStorage.getItem(
          `userData_${storedUsername}`
        );
        if (storedUserData) setUserData(JSON.parse(storedUserData));

        const storedPhoto = await AsyncStorage.getItem(
          `profilePhoto_${storedUsername}`
        );
        if (storedPhoto) setProfilePhoto(storedPhoto);
      } catch (err) {
        console.log("Error loading data:", err);
      }
    };
    loadUserAndData();
  }, []);

  const handleEditPress = (field) => {
    setEditField(field);
    setTempValue(userData[field]);
  };

  const handleCancel = () => {
    setEditField(null);
    setTempValue("");
  };

  const handleSave = async () => {
    try {
      const updatedData = { ...userData, [editField]: tempValue };
      setUserData(updatedData);
      await AsyncStorage.setItem(
        `userData_${username}`,
        JSON.stringify(updatedData)
      );
      setEditField(null);
      Alert.alert("Success", `${editField} updated locally`);
    } catch (err) {
      Alert.alert("Error", "Failed to update field");
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Camera roll permission is required to change profile photo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setProfilePhoto(uri);
      await AsyncStorage.setItem(`profilePhoto_${username}`, uri);
      Alert.alert("Success", "Profile photo updated locally");
    }
  };

  const logout = () => {
    Alert.alert("Logout", "You have been logged out");
    navigation.replace("Login");
  };

  const renderField = (label, fieldKey, secure = false) => (
    <View className="mb-4">
      <Text className="text-gray-600">{label}</Text>
      {editField === fieldKey ? (
        <View className="flex-row items-center">
          <TextInput
            value={tempValue}
            onChangeText={setTempValue}
            className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-gray-800"
            secureTextEntry={secure}
          />
          <TouchableOpacity onPress={handleSave}>
            <CheckIcon size={24} color="green" className="ml-2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancel}>
            <XMarkIcon size={24} color="red" className="ml-2" />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row justify-between items-center">
          <Text className="text-lg text-gray-800">{userData[fieldKey]}</Text>
          <TouchableOpacity onPress={() => handleEditPress(fieldKey)}>
            <PencilSquareIcon size={22} color="#1f2937" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <TopBar />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          paddingBottom: 80,
          paddingHorizontal: 20,
          paddingTop: 16,
        }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <Text className="text-2xl font-bold mb-4">Profile</Text>

        <TouchableOpacity onPress={pickImage} className="mb-4">
          <View className="w-24 h-24 rounded-full bg-gray-300 items-center justify-center">
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <CameraIcon size={28} color="#555" />
            )}
          </View>
        </TouchableOpacity>

        {renderField("Full Name", "fullName")}
        {renderField("Phone Number", "mobile")}
        {renderField("Email", "email")}
        {renderField("PAN Number", "panNumber", true)}

        <View className="mt-6 border-t border-gray-200 pt-4">
          <View className="mb-4">
            <Text className="text-gray-600">Username</Text>
            <Text className="text-lg text-gray-800">{username}</Text>
          </View>
          {renderField("About You", "about")}
        </View>

        <TouchableOpacity
          onPress={logout}
          className="mt-5 bg-gray-500 py-3 px-5 rounded-lg items-center"
        >
          <Text className="text-white font-semibold text-base">Logout</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
      <BottomTab />
    </View>
  );
}
