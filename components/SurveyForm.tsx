import React, { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import RadioButtonGroup from 'react-native-radio-buttons-group';
import CheckBox from '@react-native-community/checkbox';
import { FormData } from './Rights';

const SurveyForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    votingArea: '',
    executiveNumber: '',
    division: '',
    ageGroup: '',
    gender: '',
    religion: '',
    caste: '',
    majorIssue: [],
    votingIssue: [],
    mpSatisfaction: '',
    pmOpinion: '',
    deputyCmOpinion: '',
    localLeader: '',
    votingParty: '',
    winningParty: '',
    developmentImpact: '',
    schemeBenefit: '',
    welfareSchemes: [],
    infoSource: [],
    mobileNumber: '',
    location: '',
  });

  const handleInputChange = (name: keyof FormData, value: string | string[]) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: keyof FormData, value: string) => {
    setFormData((prevState) => {
      const currentValues = prevState[name] as string[];
      if (Array.isArray(currentValues)) {
        if (currentValues.includes(value)) {
          return {
            ...prevState,
            [name]: currentValues.filter((item) => item !== value),
          };
        } else {
          return {
            ...prevState,
            [name]: [...currentValues, value],
          };
        }
      }
      return prevState;
    });
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log(formData);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Survey Form</Text>

      {/* Question 1 */}
      <Text style={styles.question}>
        आपले मतदान बारामती लोकसभा मतदार संघात आहे का ?
      </Text>
      <RadioButtonGroup
        containerStyle={styles.radioGroup}
        radioButtons={[
          { id: '1', label: 'होय', value: 'होय' },
          { id: '2', label: 'नाही', value: 'नाही' },
        ]}
        onPress={(value) => handleInputChange('votingArea', value)}
        selectedId={formData.votingArea}
        labelStyle={styles.radioLabel}
      />

      {/* Question 2 */}
      <Text style={styles.question}>Executive Number</Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[...Array(22).keys()].map((num) => ({
            id: (num + 1).toString(),
            label: (num + 1).toString(),
            value: (num + 1).toString(),
          }))}
          onPress={(value) => handleInputChange('executiveNumber', value)}
          selectedId={formData.executiveNumber}
          labelStyle={styles.radioLabel}
        />
      </View>

      {/* Question 3 */}
      <Text style={styles.question}>विभाग</Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            'सोनगाव',
            'मेखळी',
            'करंजे',
            'लाटे',
            'सुपा',
            'माऊडी',
            'मुर्टी',
            'चोपडज',
            'वाकी',
            'पळशी',
            'लोणी भापकर',
            'सायंबाची वाडी',
            'जळगाव कप',
            'मुधोळे',
            'कऱ्हावागज',
            'अंजनगाव',
            'आनंदनगर',
            'सोणवडी',
            'उंडवडी',
            'डोर्लेवाडी',
            'झाकारवाडी',
            'नीरा वागज',
            'अधिकचे गाव 6',
            'अधिकचे गाव 7',
            'अधिकचे गाव 8',
            'गुनवडी',
            'घाडगेवाडी',
            'पाहुणेवाडी',
            'माळेगाव',
            'पणदरे',
            'बारामती कसबा - Round 2',
            'बारामती MIDC',
            'खांडज Round 2',
            'सांगवी Round 2',
            'शिरवली Round 2',
            'बारामती कसबा - Round 3',
          ].map((division) => ({
            id: division,
            label: division,
            value: division,
          }))}
          onPress={(value) => handleInputChange('division', value)}
          selectedId={formData.division}
          labelStyle={styles.radioLabel}
        />
      </View>

      {/* Question 4 */}
      <Text style={styles.question}>आपला वयोगट ?</Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={['18-23', '24-35', '36-50', '51-60', '60+'].map(
            (ageGroup) => ({
              id: ageGroup,
              label: ageGroup,
              value: ageGroup,
            })
          )}
          onPress={(value) => handleInputChange('ageGroup', value)}
          selectedId={formData.ageGroup}
          labelStyle={styles.radioLabel}
        />
      </View>

      {/* Question 5 */}
      <Text style={styles.question}>स्त्री / पुरुष</Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={['स्त्री', 'पुरुष', 'तृतीय पंथी'].map((gender) => ({
            id: gender,
            label: gender,
            value: gender,
          }))}
          onPress={(value) => handleInputChange('gender', value)}
          selectedId={formData.gender}
          labelStyle={styles.radioLabel}
        />
      </View>

      {/* Question 6 */}
      <Text style={styles.question}>आपला धर्म</Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            'हिंदू',
            'मुस्लिम',
            'बौद्ध',
            'ख्रिश्चन',
            'जैन',
            'अन्य',
          ].map((religion) => ({
            id: religion,
            label: religion,
            value: religion,
          }))}
          onPress={(value) => handleInputChange('religion', value)}
          selectedId={formData.religion}
          labelStyle={styles.radioLabel}
        />
      </View>

      {/* Question 7 */}
      <Text style={styles.question}>जात</Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={['मराठा', 'माळी', 'धनगर', 'अन्य'].map((caste) => ({
            id: caste,
            label: caste,
            value: caste,
          }))}
          onPress={(value) => handleInputChange('caste', value)}
          selectedId={formData.caste}
          labelStyle={styles.radioLabel}
        />
      </View>

      {/* Question 8 */}
      <Text style={styles.question}>
        येत्या लोकसभा निवडणुकीतील सर्वात मोठा मुद्दा कोणता आहे असे आपल्याला
        वाटते ?
      </Text>
      {[
        'पाणी समस्या',
        'वीज समस्या',
        'रस्त्याचा आभाव / दुरावस्था',
        'शाळा कॉलेज चा आभाव',
        'सार्वजनिक संस्था मूलभूत सुविधा',
        'भ्रष्टाचार',
        'महिला सुरक्षा',
        'कायदा सुव्यवस्था',
        'बेरोजगारी',
        'खाते / बियाणे/ कीटकनाशकांच्या किमती',
        'आरक्षण',
        'शेतमालाची किमान आधारभूत किंमत',
        'पेट्रोल / गॅस ची किंमत',
        'सिंचनाची व्यवस्था',
        'अन्य',
      ].map((issue) => (
        <View key={issue} style={styles.checkboxContainer}>
          <CheckBox
            value={formData.majorIssue.includes(issue)}
            onValueChange={() => handleCheckboxChange('majorIssue', issue)}
          />
          <Text style={styles.checkboxLabel}>{issue}</Text>
        </View>
      ))}

      {/* Question 9 */}
      <Text style={styles.question}>
        तुम्ही कोणत्या मुद्द्यावर मतदान करणार आहात ?
      </Text>
      {[
        'पाणी समस्या',
        'वीज समस्या',
        'रस्त्याचा आभाव / दुरावस्था',
        'शाळा कॉलेज चा आभाव',
        'सार्वजनिक संस्था मूलभूत सुविधा',
        'भ्रष्टाचार',
        'महिला सुरक्षा',
        'कायदा सुव्यवस्था',
        'बेरोजगारी',
        'खाते / बियाणे/ कीटकनाशकांच्या किमती',
        'आरक्षण',
        'शेतमालाची किमान आधारभूत किंमत',
        'पेट्रोल / गॅस ची किंमत',
        'सिंचनाची व्यवस्था',
        'अन्य',
      ].map((issue) => (
        <View key={issue} style={styles.checkboxContainer}>
          <CheckBox
            value={formData.votingIssue.includes(issue)}
            onValueChange={() => handleCheckboxChange('votingIssue', issue)}
          />
          <Text style={styles.checkboxLabel}>{issue}</Text>
        </View>
      ))}

      {/* Question 10 */}
      <Text style={styles.question}>
        मागील 5 वर्षात आपले लोकसभेचे खासदार यांचा कारभार कसा वाटला ?
      </Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            'अतिशय समाधानकारक',
            'समाधानकारक',
            'ठीक ठाक',
            'असमाधानकारक',
          ].map((satisfaction) => ({
            id: satisfaction,
            label: satisfaction,
            value: satisfaction,
          }))}
          onPress={(value) => handleInputChange('mpSatisfaction', value)}
          selectedId={formData.mpSatisfaction}
          labelStyle={styles.radioLabel}
        />
      </View>

      {/* Question 11 */}
      <Text style={styles.question}>
        आपल्याला मोदी सरकारच्या कार्यकुशलतेबद्दल काय वाटते ?
      </Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            'अतिशय समाधानकारक',
            'समाधानकारक',
            'ठीक ठाक',
            'असमाधानकारक',
          ].map((opinion) => ({
            id: opinion,
            label: opinion,
            value: opinion,
          }))}
          onPress={(value) => handleInputChange('pmOpinion', value)}
          selectedId={formData.pmOpinion}
          labelStyle={styles.radioLabel}
        />
      </View>

      {/* Question 12 */}
      <Text style={styles.question}>
        आपल्या विभागातील आमदार यांच्या कार्यकुशलतेबद्दल आपल्याला काय वाटते ?
      </Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            'अतिशय समाधानकारक',
            'समाधानकारक',
            'ठीक ठाक',
            'असमाधानकारक',
          ].map((opinion) => ({
            id: opinion,
            label: opinion,
            value: opinion,
          }))}
          onPress={(value) => handleInputChange('deputyCmOpinion', value)}
          selectedId={formData.deputyCmOpinion}
          labelStyle={styles.radioLabel}
        />
      </View>

      {/* Question 13 */}
      <Text style={styles.question}>
        आपल्या विभागातील स्थानिक नेते यांच्या कार्यकुशलतेबद्दल आपल्याला काय
        वाटते ?
      </Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            'अतिशय समाधानकारक',
            'समाधानकारक',
            'ठीक ठाक',
            'असमाधानकारक',
          ].map((opinion) => ({
            id: opinion,
            label: opinion,
            value: opinion,
          }))}
          onPress={(value) => handleInputChange('localLeader', value)}
          selectedId={formData.localLeader}
          labelStyle={styles.radioLabel}
        />
      </View>

      {/* Question 14 */}
      <Text style={styles.question}>
        येत्या निवडणुकीत तुम्ही कोणत्या पक्षाला मतदान करणार ?
      </Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            'भाजप',
            'काँग्रेस',
            'एनसीपी',
            'शिवसेना',
            'मनसे',
            'अन्य',
          ].map((party) => ({
            id: party,
            label: party,
            value: party,
          }))}
          onPress={(value) => handleInputChange('votingParty', value)}
          selectedId={formData.votingParty}
          labelStyle={styles.radioLabel}
        />
      </View>

      {/* Question 15 */}
      <Text style={styles.question}>
        येत्या निवडणुकीत कोणता पक्ष जिंकणार असे आपल्याला वाटते ?
      </Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            'भाजप',
            'काँग्रेस',
            'एनसीपी',
            'शिवसेना',
            'मनसे',
            'अन्य',
          ].map((party) => ({
            id: party,
            label: party,
            value: party,
          }))}
          onPress={(value) => handleInputChange('winningParty', value)}
          selectedId={formData.winningParty}
          labelStyle={styles.radioLabel}
        />
      </View>

      {/* Question 16 */}
      <Text style={styles.question}>
        गेल्या 5 वर्षात विकास कामाचा आपल्या विभागावर कितपत परिणाम झाला ?
      </Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            'अतिशय समाधानकारक',
            'समाधानकारक',
            'ठीक ठाक',
            'असमाधानकारक',
          ].map((impact) => ({
            id: impact,
            label: impact,
            value: impact,
          }))}
          onPress={(value) => handleInputChange('developmentImpact', value)}
          selectedId={formData.developmentImpact}
          labelStyle={styles.radioLabel}
        />
      </View>

      {/* Question 17 */}
      <Text style={styles.question}>
        मागील 5 वर्षात शासकीय योजनांचा आपल्याला कितपत फायदा झाला ?
      </Text>
      <View style={styles.radioContainer}>
        <RadioButtonGroup
          containerStyle={styles.radioGroup}
          radioButtons={[
            'अतिशय समाधानकारक',
            'समाधानकारक',
            'ठीक ठाक',
            'असमाधानकारक',
          ].map((benefit) => ({
            id: benefit,
            label: benefit,
            value: benefit,
          }))}
          onPress={(value) => handleInputChange('schemeBenefit', value)}
          selectedId={formData.schemeBenefit}
          labelStyle={styles.radioLabel}
        />
      </View>

      {/* Question 18 */}
      <Text style={styles.question}>
        कोणत्या सरकारी योजनांचा फायदा झाला आहे ?
      </Text>
      {[
        'प्रधानमंत्री आवास योजना',
        'उज्ज्वला योजना',
        'जनधन योजना',
        'फसल बीमा योजना',
        'आयुष्मान भारत',
        'पीएम किसान योजना',
        'स्वच्छ भारत मिशन',
        'शौचालय योजना',
        'पीएम कौशल विकास योजना',
        'पीएम मातृत्व वंदना योजना',
        'मनरेगा',
        'जन औषधी योजना',
        'विधवा पेंशन योजना',
        'मुद्रा योजना',
        'सुकन्या समृद्धि योजना',
        'पीएम सुरक्षा विमा योजना',
        'पीएम जीवन ज्योति विमा योजना',
        'किसान सन्मान निधि योजना',
        'अन्य',
      ].map((scheme) => (
        <View key={scheme} style={styles.checkboxContainer}>
          <CheckBox
            value={formData.welfareSchemes.includes(scheme)}
            onValueChange={() => handleCheckboxChange('welfareSchemes', scheme)}
          />
          <Text style={styles.checkboxLabel}>{scheme}</Text>
        </View>
      ))}

      {/* Question 19 */}
      <Text style={styles.question}>
        कोणत्या माध्यमांद्वारे आपण मतदार प्रचाराची माहिती मिळवता ?
      </Text>
      {[
        'दूरदर्शन',
        'केबल टीव्ही',
        'रोजपत्र',
        'सामाजिक मीडिया',
        'मैत्रीमंडळ',
        'भेट',
        'मोबाइल',
        'अन्य',
      ].map((source) => (
        <View key={source} style={styles.checkboxContainer}>
          <CheckBox
            value={formData.infoSource.includes(source)}
            onValueChange={() => handleCheckboxChange('infoSource', source)}
          />
          <Text style={styles.checkboxLabel}>{source}</Text>
        </View>
      ))}

      {/* Question 20 */}
      <Text style={styles.question}>आपला मोबाइल नंबर</Text>
      <TextInput
        style={styles.input}
        value={formData.mobileNumber}
        onChangeText={(text) => handleInputChange('mobileNumber', text)}
      />

      {/* Question 21 */}
      <Text style={styles.question}>ठिकाण</Text>
      <TextInput
        style={styles.input}
        value={formData.location}
        onChangeText={(text) => handleInputChange('location', text)}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color : '#000',
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
    color : '#000',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: 'black', // Text color set to black
  },
  radioGroup: {
    marginBottom: 20,
    alignItems: 'flex-start',
    color : '#000',
  },
  radioContainer: {
    marginBottom: 20,
    color : '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    color : '#000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    color : '#000',
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color : '#000',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 50,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SurveyForm;
