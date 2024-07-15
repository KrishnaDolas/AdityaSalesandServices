import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";
import RadioButtonGroup from "react-native-radio-buttons-group";

interface FormData {
  name: string;
  nationality: string;
  religion: string;
  cast: string;
  email: string;
  instagramLink: string;
  facebookLink: string;
  twitterLink: string;
  linkedinLink: string;
  address: string;
  bloodGroup: string;
  birthDate: string;
  type: string;
  vidhansabhaKshetra: string;
  taluka: string;
  district: string;
  pin: string;
  phoneNumber: string;
  referenceNumber: string;
  designation: string;
  profession: string;
  comments: string;
}

const KaryakartaForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    nationality: "",
    religion: "",
    cast: "",
    email: "",
    instagramLink: "",
    facebookLink: "",
    twitterLink: "",
    linkedinLink: "",
    address: "",
    bloodGroup: "",
    birthDate: "",
    type: "",
    vidhansabhaKshetra: "",
    taluka: "",
    district: "",
    pin: "",
    phoneNumber: "",
    referenceNumber: "",
    designation: "",
    profession: "",
    comments: "",
  });

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleRadioButtonChange = (name: keyof FormData, selectedId: string) => {
    handleInputChange(name, selectedId);
  };

  const handleSubmit = () => {
    console.log(formData);
    // Add logic to handle form submission
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Karyakarta Form</Text>

      <Text style={styles.question}>Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("name", text)}
        value={formData.name}
      />

      <Text style={styles.question}>Nationality</Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            { id: "Indian", label: "Indian", value: "Indian" },
            { id: "NRI", label: "NRI", value: "NRI" },
          ]}
          onPress={(selectedId) => handleRadioButtonChange("nationality", selectedId)}
          selectedId={formData.nationality}
          labelStyle={styles.radioLabel}
        />
      </View>

      <Text style={styles.question}>Religion</Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            { id: "हिंदू", label: "हिंदू", value: "हिंदू" },
            { id: "मुस्लिम", label: "मुस्लिम", value: "मुस्लिम" },
            { id: "बौद्ध", label: "बौद्ध", value: "बौद्ध" },
            { id: "ख्रिश्चन", label: "ख्रिश्चन", value: "ख्रिश्चन" },
            { id: "जैन", label: "जैन", value: "जैन" },
            { id: "अन्य", label: "अन्य", value: "अन्य" },
          ]}
          onPress={(selectedId) => handleRadioButtonChange("religion", selectedId)}
          selectedId={formData.religion}
          labelStyle={styles.radioLabel}
        />
      </View>

      <Text style={styles.question}>Cast</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("cast", text)}
        value={formData.cast}
      />

      <Text style={styles.question}>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("email", text)}
        value={formData.email}
      />

      <Text style={styles.question}>Instagram link</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("instagramLink", text)}
        value={formData.instagramLink}
      />

      <Text style={styles.question}>Facebook link</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("facebookLink", text)}
        value={formData.facebookLink}
      />

      <Text style={styles.question}>Twitter link</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("twitterLink", text)}
        value={formData.twitterLink}
      />

      <Text style={styles.question}>LinkedIn link</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("linkedinLink", text)}
        value={formData.linkedinLink}
      />

      <Text style={styles.question}>Address</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("address", text)}
        value={formData.address}
      />

      <Text style={styles.question}>Blood Group</Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            { id: "A+", label: "A+", value: "A+" },
            { id: "A-", label: "A-", value: "A-" },
            { id: "B+", label: "B+", value: "B+" },
            { id: "B-", label: "B-", value: "B-" },
            { id: "AB+", label: "AB+", value: "AB+" },
            { id: "AB-", label: "AB-", value: "AB-" },
            { id: "O+", label: "O+", value: "O+" },
            { id: "O-", label: "O-", value: "O-" },
          ]}
          onPress={(selectedId) => handleRadioButtonChange("bloodGroup", selectedId)}
          selectedId={formData.bloodGroup}
          labelStyle={styles.radioLabel}
        />
      </View>

      <Text style={styles.question}>Birth Date (dd-mm-yyyy)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("birthDate", text)}
        value={formData.birthDate}
      />

      <Text style={styles.question}>Type</Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            { id: "Volunteer", label: "Volunteer", value: "Volunteer" },
            { id: "Campaigner", label: "Campaigner", value: "Campaigner" },
            { id: "Surveyor", label: "Surveyor", value: "Surveyor" },
          ]}
          onPress={(selectedId) => handleRadioButtonChange("type", selectedId)}
          selectedId={formData.type}
          labelStyle={styles.radioLabel}
        />
      </View>

      <Text style={styles.question}>Vidhansabha Kshetra</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("vidhansabhaKshetra", text)}
        value={formData.vidhansabhaKshetra}
      />

      <Text style={styles.question}>Taluka</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("taluka", text)}
        value={formData.taluka}
      />

      <Text style={styles.question}>District</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("district", text)}
        value={formData.district}
      />

      <Text style={styles.question}>PIN</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("pin", text)}
        value={formData.pin}
      />

      <Text style={styles.question}>Phone Number (WhatsApp)</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("phoneNumber", text)}
        value={formData.phoneNumber}
      />

      <Text style={styles.question}>Reference Number</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("referenceNumber", text)}
        value={formData.referenceNumber}
      />

      <Text style={styles.question}>Designation</Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            { id: "Level 1", label: "Level 1", value: "Level 1" },
            { id: "Level 2", label: "Level 2", value: "Level 2" },
            { id: "Level 3", label: "Level 3", value: "Level 3" },
            { id: "Level 4", label: "Level 4", value: "Level 4" },
            { id: "Level 5", label: "Level 5", value: "Level 5" },
            { id: "Level 6", label: "Level 6", value: "Level 6" },
            { id: "Level 7", label: "Level 7", value: "Level 7" },
            { id: "Level 8", label: "Level 8", value: "Level 8" },
            { id: "Level 9", label: "Level 9", value: "Level 9" },
            { id: "Level 10", label: "Level 10", value: "Level 10" },
            { id: "Level 11", label: "Level 11", value: "Level 11" },
          ]}
          onPress={(selectedId) => handleRadioButtonChange("designation", selectedId)}
          selectedId={formData.designation}
          labelStyle={styles.radioLabel}
        />
      </View>

      <Text style={styles.question}>Profession</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("profession", text)}
        value={formData.profession}
      />

      <Text style={styles.question}>Comments</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("comments", text)}
        value={formData.comments}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginVertical: 10,
    color: "#000", // Text color set to black
  },
  radioContainer: {
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  radioLabel: {
    color: "#000", // Text color set to black for radio button labels
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    color: "#000", // Text color set to black for input fields
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 20,
    marginBottom : 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default KaryakartaForm;
