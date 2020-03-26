import React, {useState} from 'react';
import { StyleSheet, Text, View, Modal, Alert, KeyboardAvoidingView } from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const CreateEmployee = ({navigation, route})=>{
  const getDetails = (type)=>{
    if(route.params){
      switch(type){
        case "name":
          return route.params.name
        case "email":
          return route.params.email
        case "phone":
          return route.params.phone  
        case "salary":
          return route.params.salary
        case "position":
          return route.params.position
        case "picture":
          return route.params.picture
      }
    }
    return ""
  }
  

  const [name, setName] = useState(getDetails("name"))
  const [email, setEmail] = useState(getDetails("email"))
  const [phone, setPhone] = useState(getDetails("phone"))
  const [salary, setSalary] = useState(getDetails("salary"))
  const [position, setPosition] = useState(getDetails("position"))
  const [picture, setPicture] = useState(getDetails("picture"))
  const [modal, setModal] = useState(false)
  const [enableShift, setEnableShift] = useState(false)

  const submitData = ()=>{
        fetch("http://e0ffd7af.ngrok.io/send-data",{
          method:"post",
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({
            name,
            email,
            phone,
            salary,
            position,
            picture

          })
        })
        .then(res=>res.json())
        .then(data=>{
          Alert.alert(`The employee ${data.name} was saved successfully`)
          navigation.navigate("Home")
        }).catch(err=>{
          Alert.alert("Something went wrong")
        })
  }

  const updateDetails = ()=>{
    fetch("http://e0ffd7af.ngrok.io/update",{
      method:"post",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        id:route.params._id,
        name,
        email,
        phone,
        salary,
        position,
        picture

      })
    })
    .then(res=>res.json())
    .then(data=>{
      Alert.alert(`The employee ${data.name} was updated successfully`)
      navigation.navigate("Home")
    }).catch(err=>{
      Alert.alert("Something went wrong")
    })
}
  

  const pickFromGallery = async ()=>{
    const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if(granted){
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:ImagePicker.MediaTypeOptions.Images,
        allowsEditing:true,
        aspect:[1,1],
        quality:0.5
      })
      if(!data.cancelled){
        let newfile = { 
          uri:data.uri,
          type:`test/${data.uri.split(".")[1]}`,
          name:`test/${data.uri.split(".")[1]}` }
        handleUpload(newfile)
      }
    }else{
      Alert.alert("You need to give up permission to work")
    }
  
  }

  const pickFromCamera = async ()=>{
    const {granted} = await Permissions.askAsync(Permissions.CAMERA)
    if(granted){
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes:ImagePicker.MediaTypeOptions.Images,
        allowsEditing:true,
        aspect:[1,1],
        quality:0.5
      })
      if(!data.cancelled){
        let newfile = { 
          uri:data.uri,
          type:`test/${data.uri.split(".")[1]}`,
          name:`test/${data.uri.split(".")[1]}` }
        handleUpload(newfile)
      }
    }else{
      Alert.alert("You need to give up permission to work")
    }
  }

  const handleUpload = (image)=>{
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', 'employeeApp')
    data.append('cloud_name', 'employees-app-vmc')

    fetch("https://api.cloudinary.com/v1_1/employees-app-vmc/image/upload",{
      method:"post",
      body:data
    }).then(res=>res.json()).
    then(data=>{
      setPicture(data.url)
      setModal(false)
    }).catch(err=>{
      Alert.alert("Error when uploading the image")
    })
  }

  return(
    <KeyboardAvoidingView behavior="position" style={styles.root} enabled={enableShift}>
    <View>
        <TextInput
            label="Name"
            style={styles.inputStyle}
            value={name}
            theme={theme}
            //onFocus={()=>setEnableShift(false)}
            autoCapitalize="words"
            mode="outlined"
            onChangeText={text => setName(text)}
        />    
        <TextInput
            label="Email"
            style={styles.inputStyle}
            value={email}
            theme={theme}
            //onFocus={()=>setEnableShift(false)}
            autoCapitalize = 'none'
            keyboardType="email-address"
            mode="outlined"
            onChangeText={text => setEmail(text)}
        />  
        <TextInput
            label="Phone"
            style={styles.inputStyle}
            value={phone}
            theme={theme}
            //onFocus={()=>setEnableShift(false)}
            keyboardType="phone-pad"
            mode="outlined"
            onChangeText={text => setPhone(text)}
        />      
        <TextInput
            label="Salary"
            style={styles.inputStyle}
            value={salary}
            theme={theme}
           // onFocus={()=>setEnableShift(true)}
            keyboardType="number-pad"
            mode="outlined"
            onChangeText={text => setSalary(text)}
        />  
        <TextInput
            label="Position"
            style={styles.inputStyle}
            value={position}
            theme={theme}
            //onFocus={()=>setEnableShift(true)}
            autoCapitalize="words"
            mode="outlined"
            onChangeText={text => setPosition(text)}
        />   
        <Button 
        style={styles.inputStyle} 
        theme={theme} 
        icon={picture==""?"upload":"check"} 
        mode="contained" 
        onPress={() => setModal(true)}>
          Upload Image
        </Button>
        {route.params?
        <Button
        style={styles.inputStyle} 
        theme={theme} 
        icon="content-save" 
        mode="contained" 
        onPress={() => updateDetails()}>
          Update
        </Button>
        :
        <Button
        style={styles.inputStyle} 
        theme={theme} 
        icon="content-save" 
        mode="contained" 
        onPress={() => submitData()}>
          Save
        </Button>
        }
         
         <Modal
         animationType="slide"
         transparent={true}
         visible={modal}
         onRequestClose={()=>{
           setModal(false)
         }}
         >
         <View style={styles.modalView}>
            <View style={styles.modalButtonView}>
              <Button 
              theme={theme}
              icon="camera" 
              mode="contained" 
              onPress={() => pickFromCamera()}>
                Camera
              </Button>
              <Button
              theme={theme}
              icon="image-area" 
              mode="contained" 
              onPress={() => pickFromGallery()}>
              Gallery
              </Button>
            </View>
            <Button 
            theme={theme} 
            onPress={() => setModal(false)}>
              Cancel
            </Button>
         </View>

         </Modal>
      
    </View>
</KeyboardAvoidingView>
  )
}
const theme = {
  colors:{
    primary: "#006aff"

  }
}
const styles=StyleSheet.create({
  root:{
    flex:1
  },
  inputStyle:{
    margin:5
  },
  modalView:{
    position:"absolute",
    bottom: 2,
    width:"100%",
    backgroundColor: "#e0e0e0"
  },
  modalButtonView:{
    flexDirection:"row",
    justifyContent: "space-around",
    padding: 10
  }
  
})

export default CreateEmployee;