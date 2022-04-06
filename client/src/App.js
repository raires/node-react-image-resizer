import React, { useState } from 'react';
import FormInput from './components/FormInput';
import './app.css';

function App() {
  //set states for the file resizer
  let [fileToUpload, setFileToUpload] = useState('');
  let [img64, setImg64] = useState('');

  //console.log('rendering App');

  // Image Preview Handler
  function handleFileChange(e) {
    //console.log('handleFileChange');
    //set state to the file reference from the input element 
    setFileToUpload(e.target.files[0]);
  }

  async function handleFileUpload() {
    //console.log('handleFileUpload');
    let formData = new FormData();

    //key name of the input element is "myimage"
    formData.append('myimage', fileToUpload);
    //set the remaining optional values (except quality is required)
    formData.append('width', values.width.toString());
    formData.append('height', values.height.toString());
    formData.append('quality', values.quality.toString());

    fetch("http://localhost:5000/imagebase64", {
      method: "POST",
      body: formData
    })
    .then(function (res) {
      if (res.ok) {
        res.text().then(function(base64) {
          setImg64("data:image/png;base64,"+base64);
        });
      } else {
        console.log('error');
        setImg64('');
      }
    })
    .catch(function (err) {
      console.log(err);
      setFileToUpload('');
      setValues({...values, imageFile: ''});
    });
  }

  //frontend logic

  const [values, setValues] = useState({
    quality: 80,
    width: 100,
    height: 100,
    imageFile: '',
  });

  const inputs = [
    {
      id: 1,
      name: "imageFile",
      type: "file",
      placeholder: "Upload an image",
      errorMessage:
        "Username should be 3-16 characters and shouldn't include any special character!",
      label: "Image",
      pattern: "",
      required: true,
    },
    {
      id: 2,
      name: "width",
      type: "number",
      placeholder: "New width",
      errorMessage: "It should be a valid email address!",
      label: "New width",
      pattern: "^[1-9][0-9][0-9]?$|^1000$",
      required: false,
    },
    {
      id: 3,
      name: "height",
      type: "number",
      placeholder: "New Height",
      label: "New Height",
      pattern: "^[1-9][0-9][0-9]?$|^1000$",
      required: false,
    },
    {
      id: 4,
      name: "quality",
      type: "number",
      placeholder: "Quality",
      errorMessage:
        "Quality should be between 20 and 100!",
      label: "Password",
      pattern: `^[2-9][0-9]?$|^100$`,
      required: true,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    handleFileUpload();
  };

  const onChangeHandler = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });

    switch (e.target.name) {
      case "imageFile":
        handleFileChange(e);
        break;

      case "width" || "height":
        handleSizeUpload(e);
        break;

      default:
        break;
    }
  };

  //TODO: fix the function to handle the size upload
  function handleSizeUpload(e) {  
    //console.log('handleSizeUpload');
    if (e.target.value < 10 || e.target.value > 1000) {
      e.target.value = 10;
    }
  }

  return (
    <div className='parent'>
      <div className="bg"></div>

      <div className="app">
        <form onSubmit={handleSubmit}>
          <h1>Image resizer</h1>
          {inputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChangeHandler}
            />
          ))}
          <button>Submit</button>
          {img64 !== '' 
            ? 
              <div className='imgDiv'>
                <div>
                  <img className='imgResult' src={img64} alt="img result of run" />
                </div>
                <div>
                  <label>p.s. Image size is limited to 280 pixels</label>
                </div>
              </div> 
            : 
              null
          }
        </form>
      </div>
    </div>
  );
}

export default App;
