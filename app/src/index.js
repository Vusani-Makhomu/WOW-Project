import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { jsPDF } from "jspdf";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameInputValue: "",
      downloadPdf: false,
      userNameValue: "",
      averageBMIValue: 0,
      percentageIncreaseValue: 0,
      numParticipantsValue: 0,
    };
    this.savePDFDetails = this.savePDFDetails.bind(this);
  }

  // On file select
  onFileChange(event, userName) {
    // Get the selected file.
    const file = event.target.files[0];
    const fileReader = new FileReader();
    var sumBMI = 0;
    var array = [];
    var overWeightPercentageIncrease = 0;
    const scope = this
    fileReader.onload = function (event) {
    const text = event.target.result;

      const csvHeader = text.slice(0, text.indexOf("\n")).split(",");
      const csvRows = text.slice(text.indexOf("\n") + 1).split("\n");

      // Convert CSV file data to Array
      array = csvRows.map(i => {
        const values = i.split(",");
        const obj = csvHeader.reduce((object, header, index) => {
          object[header] = values[index];
          return object;
        }, {});
        return obj;
      });

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
        Calculate the average BMI.
      */
      const averageBMI = sumBMI/array.length;
      console.log("Here is the average BMI: "+averageBMI);


      /*
        A BMI of 25.0 or more is overweight, while the healthy range is 18.5 to 24.9.
        Percentage increase formula:
            ((final value - starting value) / starting value) * 100
      */
      
      if (sumBMI > 25) {
          overWeightPercentageIncrease = ((sumBMI - 25)/25)*100;
      }

      sumBMI = Math.round(sumBMI);
      overWeightPercentageIncrease = Math.round(overWeightPercentageIncrease);

      scope.setState({
        userNameValue: userName,
        averageBMIValue: sumBMI,
        percentageIncreaseValue: overWeightPercentageIncrease,
        numParticipantsValue: array.length,
      });
  };
  fileReader.readAsText(file);

};

saveNameInputValue = event => {
  const enteredValue = event.target.value;
  this.setState({
    nameInputValue: enteredValue,
  });
};

savePDFDetails = () => {
  console.log("Printing from the savePDFDetails function.");
  console.log("Here is the participants name: "+this.state.userNameValue);
  console.log("Here is the average bmi value: "+this.state.averageBMIValue);
  console.log("Here is the percentage increase: "+this.state.percentageIncreaseValue);
  console.log("Here is the number of participants: "+this.state.numParticipantsValue);

  // Generate PDF
  var doc = new jsPDF();
  doc.setFontSize(40);
  doc.setFont("helvetica", "bold");
  doc.text("Our Statistics", 100, 25, null, null, "center");
  doc.setFontSize(20);
  doc.setFont("times", "italic");
  doc.text("Name: "+this.state.userNameValue, 90, 35, null, null, "center");
  doc.text("Average BMI: "+this.state.averageBMIValue, 90, 45, null, null, "center");
  doc.text("% (Percentage) Overweight: "+this.state.percentageIncreaseValue, 85, 55, null, null, "center");
  doc.text("Number of participants: "+this.state.numParticipantsValue, 85, 65, null, null, "center");
  doc.save("WOW-Statistics-Download.pdf");
};

  render() {

      if (!this.props.showPopUp) {
        return (
          <div>
            <div className="formContainer">
              <div>
              <h1>Welcome</h1>
              <p>Please complete your details, and upload<br/> your data to the platform.</p>
              <form id="landingPageForm">
                <label htmlFor="name">What is your name?</label>
                <input type="text" name="name" id="name" value={this.state.nameInputValue} onChange={event => this.saveNameInputValue(event)} required/><br/>
                <label htmlFor="dataUpload">Please upload your data</label><br/>
                <input type="file" accept=".csv" onChange={(event) => {this.onFileChange(event, this.state.nameInputValue)}} required/>
              </form>
              </div>
              <img src="images/workout.jpg" alt="2 people working out" weight="300" height="400"/>
            </div>
            <div>
          </div>
        </div>
        )
      };

      return (
        <div className="popUpContainer">
          <img src="images/running.png" alt="" weight="80" height="100"/>
          <h1 id="uploadCompleteTxt">Upload Complete</h1>
          <button id="pdfDownloadBtn"><img src="images/download.png" alt="" weight="200" height="100" onClick={this.savePDFDetails}/></button>
          <p id="downloadPdfTxt">Download PDF</p>
        </div>
      )
  };
};

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showPopUp: false};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState({
      showPopUp: !this.state.showPopUp,
    });
  }

  render() {
    return (
      <div className="landingPageContainer">
        <div id="uploadDataContainer">
          <p id="uploadDataTxt">Upload data</p>
        </div>
        <div className="pageForm">
          <Form showPopUp={this.state.showPopUp}/>
          <button onClick={this.handleToggleClick}>
          {this.state.showPopUp ? 'Back' : 'Upload File'}
        </button>
        </div>
      </div>
    )
  }
}


//==============================================================================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<LandingPage/>);
