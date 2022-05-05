import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { auth, db } from "../firebase2";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import { collection, addDoc, getDocs } from "firebase/firestore";
import SelectBox from "react-native-multi-selectbox";
import { xorBy } from "lodash";

const SearchScreen = (props) => {
  const [locationSearch, setLocationSearch] = useState("");

  const jobTypes = [
    { item: "Mow lawn", id: "MOW" },
    { item: "Trim headge", id: "TRIM" },
    { item: "Landscaping", id: "SCAPE" },
  ];
  const [selectedJobs, setSelectedJobs] = useState([]);
  const navigation = useNavigation();

  const handleChange = (searchValue) => {
    setLocationSearch(searchValue);
  };

  const handleSearch = () => {
    navigation.navigate("SearchList", { paramKey: locationSearch });
  };

  const onMultiChange = () => {
    // setSelectedJobs((currJobs) => {
    //   return [...currJobs, value];
    // });
    return (value) => setSelectedJobs(xorBy(selectedJobs, [value], "id"));
  };

  // const onDeselect = (value) => {
  //   console.log(value);
  // };

  console.log(selectedJobs, "CURR JOBS");
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Search location"
          onChangeText={(text) => handleChange(text)}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <SelectBox
          label="Select job types"
          options={jobTypes}
          selectedValues={selectedJobs}
          onMultiSelect={onMultiChange()}
          onTapClose={onMultiChange()}
          isMulti
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSearch} style={styles.button}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
    padding: 20,
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  multiselect: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "green",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "green",
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: "green",
    fontWeight: "700",
    fontSize: 16,
  },
});