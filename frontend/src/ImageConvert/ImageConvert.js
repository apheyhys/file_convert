import axios from 'axios'
import React, {useState} from 'react'
import {useDropzone} from 'react-dropzone'
import styled from 'styled-components';

const HOST_URL = `http://apheyhys.pythonanywhere.com`


const getColor = (props) => {
  if (props.isDragAccept) {
      return '#00e676';
  }
  if (props.isDragReject) {
      return '#ff1744';
  }
  if (props.isDragActive) {
      return '#2196f3';
  }
  return '#eeeeee';
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
  width: 100%;
`;

const Button = styled.button`
  border: none;
  margin: 20px 0;
  padding: 10px 20px;
  border-radius: 5px;
  font-weight: bold;
`;


const Section = styled.section`
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;  
`;

const Img = styled.img`  
  width: 100%;  
`;


export default function ImageConvert(props) {
  const [rawImage, setRawImage] = useState('')
  const [convertImage, setConvertImage] = useState('')
  
  const {
    getRootProps,
    getInputProps,
    acceptedFiles, 
  } = useDropzone({
    maxFiles:1,
    maxSize: 2097152,
    accept: 'image/jpeg, image/png'
  });
  
  const files = acceptedFiles.map(file => (    
      <div key={file.path}>
        <div><b>Имя файла:</b> {file.path}</div>
        <div><b>Размер:</b> {((file.size/1024)/1024).toFixed(1)}MB</div>       
    </div>
  ));



  function getImage() {
    let formData = new FormData();
    
    acceptedFiles.forEach(file => formData.append("image_raw", file));

    const requestOptions = {
      method: 'POST',
      data: formData,
      headers: {
          'Content-Type': 'multipart/form-data'          
      }
  }
 
    axios('http://apheyhys.pythonanywhere.com/image-convert/', requestOptions)
    .then(function (response) {     
      setRawImage(response.data["image_raw"])
      setConvertImage(response.data["image_converted"])      
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <Section className="container">
      <Container {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Перетащите файл или нажмите для выбора</p>
        <em>(поддерживаемые форматы изображений - JPG, PNG, максимальный размер файла - 2MB)</em>
      </Container>
      <aside>
        <h4>{acceptedFiles[0] ? "Загружены файлы" : null}</h4>
        {files}
        {acceptedFiles[0] ? <Button onClick={getImage}>Обработать</Button> : null}
      </aside>
      
      {convertImage != ''    
      ? (<div>
        <div>
          <h3>Оригинальное изображение</h3>
           <Img src={HOST_URL + rawImage} /> 
        </div>
        <div>
          <h3>Обработанное изображение - размеры 300х300, черно-белое, повернутое на 10 градусов </h3>
          <img src={HOST_URL + convertImage} />  
        </div>        
      </div>      
      )
      : null        
      }  

    </Section>
  );
}

<ImageConvert />