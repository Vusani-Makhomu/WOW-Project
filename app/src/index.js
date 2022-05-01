import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { jsPDF } from "jspdf";

class Form extends React.Component {
  constructor(props) {
    super(props);

    /*
      The initial state of the form.
    */
    this.state = {
      nameInputValue: "",
      downloadPdf: false,
      userNameValue: "",
      averageBMIValue: 0,
      numOverWeightValue: 0,
      numParticipantsValue: 0,
    };
    this.savePDFDetails = this.savePDFDetails.bind(this);
  }

  /*
    On file select
  */
  onFileChange(event, userName) {

    /*
      Get the selected file.
    */
    const file = event.target.files[0];
    const fileReader = new FileReader();

    /*
      Store the current scope. Will be used to set state inside the onload function of the
      file reader.
    */
    const scope = this

    /*
      The load event is fired when a file has been read successfully.
    */
    fileReader.onload = function (event) {
    const text = event.target.result;

      /*
        Extract the headers and rows from the CSV file.
      */
      const csvHeader = text.slice(0, text.indexOf("\n")).split(",");
      const csvRows = text.slice(text.indexOf("\n") + 1).split("\n");

      /*
        Convert CSV file data to Array
      */
      const array = csvRows.map(i => {
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
     var sumBMI = 0;
     var numOverWeight = 0;
      array.forEach(eachLine => {
          var height = Number(eachLine["Height"]);
          var weight = Number(eachLine["Weight"]);
          
          var bmi = (weight/(height*height))*10000;
          bmi = Math.ceil(bmi);
          /*
            A BMI of 25.0 or more is overweight
          */
          if (bmi > 25) {
            numOverWeight +=1;
          }
        
          sumBMI+=bmi
      });
      sumBMI = Math.round(sumBMI);
      console.log("Here are the number of participants who are overweight: "+numOverWeight);

      /*
        Calculate the average BMI.
      */
      const averageBMI = sumBMI/array.length;

      /*
        Set the state: userNameValue, averageBMIValue, percentageIncreaseValue, numParticipantsValue.
      */
      scope.setState({
        userNameValue: userName,
        downloadPdf: true,
        averageBMIValue: averageBMI,
        numOverWeightValue: numOverWeight,
        numParticipantsValue: array.length,
      });
  };
  fileReader.readAsText(file);

};

/*
  This event lister retrieves the name provided by the user.
*/
saveNameInputValue = event => {
  const enteredValue = event.target.value;
  this.setState({
    nameInputValue: enteredValue,
  });
};

savePDFDetails = () => {

    /*
      Generate PDF
    */ 

    if (this.state.downloadPdf && this.state.nameInputValue) {
      var doc = new jsPDF();
      doc.setFontSize(40);
      doc.setFont("helvetica", "bold");
      doc.text("Our Statistics", 100, 25, null, null, "center");
      doc.setFontSize(20);
      doc.setFont("times", "italic");
      doc.text("Name: "+this.state.userNameValue, 90, 35, null, null, "center");
      doc.text("Average BMI: "+this.state.averageBMIValue, 90, 45, null, null, "center");
      doc.text("Overweight: "+this.state.numOverWeightValue, 85, 55, null, null, "center");
      doc.text("Number of participants: "+this.state.numParticipantsValue, 85, 65, null, null, "center");
      doc.save("WOW-Statistics-Download.pdf");
    } else {
      alert("Please go back and do the following:\n1. Complete your name.\n2. Upload your file.");
    }
  
};

  render() {

     /*
      If the user has not uploaded any file, this form will be displayed.
     */
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
                <input type="file" className="file-upload" accept=".csv" onChange={(event) => {this.onFileChange(event, this.state.nameInputValue)}} required/>
              </form>
              </div>
              <img src="images/workout.jpg" alt="2 people working out" weight="300" height="400"/>
            </div>
            <div>
          </div>
        </div>
        )
      };


      /*
        If the user has uploaded their file, this pop up will be displayed. 
       */
      return (
        <div className="popUpContainer">
          <img src="images/running.png" alt="" weight="80" height="100"/>
          <h1 id="uploadCompleteTxt">Upload Complete</h1>
          <button id="pdfDownloadBtn"><img src="images/download.png" alt="Download button icon" weight="200" height="100" onClick={this.savePDFDetails}/></button>
          <p id="downloadPdfTxt">Download PDF</p>
        </div>
      )
  };
};

class LandingPage extends React.Component {
  constructor(props) {
    super(props);

    /*
      The initial state of the landing page
    */
    this.state = {showPopUp: false};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  /*
    Responsible for toggling between the pop up and the upload data form.
  */
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
          <button id="uploadFileBtn" onClick={this.handleToggleClick}>
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
