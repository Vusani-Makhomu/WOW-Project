import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameInputValue: "",
    };
  }

  // On file select
  onFileChange(event, userName) {
    // Get the selected file.
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
    const text = event.target.result;
    
    // console.log("Here is the file text:", text)
    // console.log("Here is your name:", name.text);

      const csvHeader = text.slice(0, text.indexOf("\n")).split(",");
      const csvRows = text.slice(text.indexOf("\n") + 1).split("\n");

      // Convert CSV file data to Array
      const array = csvRows.map(i => {
        const values = i.split(",");
        const obj = csvHeader.reduce((object, header, index) => {
          object[header] = values[index];
          return object;
        }, {});
        return obj;
      });

      var sumBMI = 0;

      /*
        Calculate the sum bmi of the given data.
      */
      array.forEach(eachLine => {
          var height = Number(eachLine["Height"]);
          var weight = Number(eachLine["Weight"]);
          var bmi = weight/height;
          sumBMI+=bmi
      });


      /*
        A BMI of 25.0 or more is overweight, while the healthy range is 18.5 to 24.9.
        Percentage increase formula:
            ((final value - starting value) / starting value) * 100
      */
      var overWeightPercentageIncrease = 0;
      if (sumBMI > 25) {
          overWeightPercentageIncrease = ((sumBMI - 25)/25)*100;
      }

      sumBMI = Math.round(sumBMI);
      overWeightPercentageIncrease = Math.round(overWeightPercentageIncrease);
      // console.log("Sum BMI:", sumBMI);
      // console.log("Percentage increase:", overWeightPercentageIncrease);
      // console.log("Here is the user name:", userName);
  };
  fileReader.readAsText(file);
};

saveNameInputValue = event => {
  const enteredValue = event.target.value;
  this.setState({
    nameInputValue: enteredValue,
  });
};

  render() {
    return (
      <div class="formContainer">
        <div>
          <h1>Welcome</h1>
          <p>Please complete your details, and upload<br/> your data to the platform.</p>
          <form>
            <label for="name">What is your name?</label>
            <input type="text" name="name" id="name" value={this.state.nameInputValue} onChange={event => this.saveNameInputValue(event)} required/><br/>
            <label for="dataUpload">Please upload your data</label><br/>
            <input type="file" accept=".csv" onChange={(event) => {this.onFileChange(event, this.state.nameInputValue)}} required/>
          </form>
        </div>
        <div>
        <img src="images/workout.jpg" alt="" weight="400" height="500"/>
      </div>
    </div>
    )
  };
};

class LandingPage extends React.Component {
  render() {
    return (
      <div class="landingPageContainer">
        <div id="headerContainer">
          <h3 id="uploadDataHeader">Upload data</h3>
        </div>
        <div class="pageForm">
          <Form />
        </div>
      </div>
    )
  }
}

class PopUp extends React.Component {
  render() {
    return (
      <div class="popUpContainer">
        <img src="images/running.png" alt="" weight="80" height="100"/>
        <h1 id="uploadCompleteTxt">Upload Complete</h1>
        <button id="pdfDownloadBtn"><img src="images/download.png" alt="" weight="200" height="100"/></button>
        <p id="downloadPdfTxt">Download PDF</p>
      </div>
    )
  }
}


//==============================================================================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<LandingPage/>);
