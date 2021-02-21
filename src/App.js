import './App.css';
import 'typeface-roboto';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  MenuItem,
} from '@material-ui/core';
import Docxtemplater from "docxtemplater"
import JSzip from "jszip"
import JSzipUtils from "jszip-utils"
import { saveAs } from "file-saver"
import template from './IndependentContractorAgreement2.docx'
import { getDateWithoutDay } from './utils.js';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  paper: {
    marginTop: 24,
    padding: 16,
    width: '70%',
    margin: 'auto', 
  },
  modal: {
    padding: 16
  }
});

const payers = [
  {
    value: 'The Contractor',
    label: 'The Contractor',
  },
  {
    value: 'The Contractee',
    label: 'The Contractee',
  }
]

function App() {
  const [inputs, setInputs] = useState({DATE: getDateWithoutDay()});
  const [dialogOpen, setDialogOpen] = useState(false)

  const classes = useStyles();
 
  const loadFile = (url, callback) => {
    JSzipUtils.getBinaryContent(url, callback);
  }

  const onChangeForField = (event) => {
    const key = event.target.name
    const value = event.target.value
    setInputs(state => ({...state,[key]:value}))
  }

  const checkAllInputs = () => {
    console.log(Object.keys(inputs).length)
    if (Object.keys(inputs).length === 21) {
      generateDocument()
    } else {
      setDialogOpen(true)
    }
  }

  const handleClose = () => {
    setDialogOpen(false)
  }

  const generateDocument = () => {
    loadFile(template, function(
      error,
      content
    ) {
      if (error) {
        throw error;
      }
      var zip = new JSzip(content);
      var doc = new Docxtemplater().loadZip(zip);
      doc.setData(
        // // Values are the camelCase version of these placeholders
        // // contractee details
        // CONTRACTEE_NAME: inputs.CONTRACTEE_NAME,
        // CONTRACTEE_PHONE: inputs.CONTRACTEE_PHONE,
        // CONTRACTEE_EMAIL: inputs.CONTRACTEE_EMAIL,
        // CONTRACTEE_ADDRESS: inputs.CONTRACTEE_ADDRESS,
        // CONTRACTEE_COUNTRY: inputs.CONTRACTEE_COUNTRY,
        // CONTRACTEE_REGISTRATION_NUMBER: inputs.CONTRACTEE_REGISTRATION_NUMBER,
        // CONTRACTEE_CONTACT_NAME: inputs.CONTRACTEE_CONTACT_NAME,
        // CONTRACTEE_SIGNING_PARTY: inputs.CONTRACTEE_SIGNING_PARTY,
        // CONTRACTEE_SIGNING_PARTY_DESIGNATION: inputs.CONTRACTEE_SIGNING_PARTY_DESIGNATION,
        // // contractor details
        // CONTRACTOR_NAME: inputs.CONTRACTOR_NAME,
        // CONTRACTOR_PHONE: inputs.CONTRACTOR_PHONE,
        // CONTRACTOR_EMAIL: inputs.CONTRACTOR_EMAIL,
        // CONTRACTOR_ADDRESS: inputs.CONTRACTOR_ADDRESS,
        // CONTRACTOR_NRIC_NUMBER: inputs.CONTRACTOR_NRIC_NUMBER,
        // CONTRACTOR_CONTACT_NAME: inputs.CONTRACTOR_CONTACT_NAME,
        // CONTRACTOR_SIGNING_PARTY: inputs.CONTRACTOR_SIGNING_PARTY,
        // // other details
        // PROJECT_NAME: inputs.PROJECT_NAME,
        // CONTRACT_PAYER_NAME: inputs.CONTRACT_PAYER_NAME,
        // LOADING_PERIOD: inputs.LOADING_PERIOD,
        // AMOUNT: inputs.AMOUNT,
        // // dynamically obtained without user input, yet allow user to change
        // DATE: inputs.DATE,
        inputs
      );
      try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render();
      } catch (error) {
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
        function replaceErrors(key, value) {
          if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce(function(
              error,
              key
            ) {
              error[key] = value[key];
              return error;
            },
            {});
          }
          return value;
        }
        console.log(JSON.stringify({ error: error }, replaceErrors));

        if (error.properties && error.properties.errors instanceof Array) {
          const errorMessages = error.properties.errors
            .map(function(error) {
              return error.properties.explanation;
            })
            .join("\n");
          console.log("errorMessages", errorMessages);
          // errorMessages is a humanly readable message looking like this :
          // 'The tag beginning with "foobar" is unopened'
        }
        throw error;
      }
      var out = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      }); //Output the document using Data-URI
      saveAs(out, "contract.docx");
    });
  };

  return (
    <div>
      <Dialog onClose={handleClose} open={dialogOpen}>
        <DialogTitle>
          Missing Fields Detected
        </DialogTitle>
        <DialogContent>
          Please fill in all required fields
        </DialogContent>
      </Dialog>
      <Box margin={2}>
        <Typography variant="h3" align="center" gutterBottom color="primary">
          Independent Contractor Agreement
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          Fill in the required fields, we'll take care of the rest!
        </Typography>
      </Box>
      <Paper className={classes.paper} elevation={3}>
        <form noValidate autoComplete="off">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" align="center" gutterBottom>
                Contractor details (You/Your Company)
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="CONTRACTOR_NAME"
                id="CONTRACTOR_NAME"
                label="Name"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="CONTRACTOR_PHONE"
                id="CONTRACTOR_PHONE"
                label="Phone"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="CONTRACTOR_EMAIL"
                id="CONTRACTOR_EMAIL"
                label="Email"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="CONTRACTOR_ADDRESS"
                id="CONTRACTOR_ADDRESS"
                label="Address"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="CONTRACTOR_NRIC_NUMBER"
                id="CONTRACTOR_NRIC_NUMBER"
                label="NRIC Number"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="CONTRACTOR_CONTACT_NAME"
                id="CONTRACTOR_CONTACT_NAME"
                label="POC Name"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="CONTRACTOR_SIGNING_PARTY"
                id="CONTRACTOR_SIGNING_PARTY"
                label="Signing Party"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Paper className={classes.paper} elevation={3}>
        <form noValidate autoComplete="off">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" align="center" gutterBottom>
                Contractee details (The Client)
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="CONTRACTEE_NAME"
                id="CONTRACTEE_NAME"
                label="Name"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="CONTRACTEE_PHONE"
                id="CONTRACTEE_PHONE"
                label="Phone"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="CONTRACTEE_EMAIL"
                id="CONTRACTEE_EMAIL"
                label="Email"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="CONTRACTEE_ADDRESS"
                id="CONTRACTEE_ADDRESS"
                label="Address"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="CONTRACTEE_COUNTRY"
                id="CONTRACTEE_COUNTRY"
                label="Country"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="CONTRACTEE_REGISTRATION_NUMBER"
                id="CONTRACTEE_REGISTRATION_NUMBER"
                label="Registration Number"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="CONTRACTEE_CONTACT_NAME"
                id="CONTRACTEE_CONTACT_NAME"
                label="POC Name"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="CONTRACTEE_SIGNING_PARTY"
                id="CONTRACTEE_SIGNING_PARTY"
                label="Signing Party"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="CONTRACTEE_SIGNING_PARTY_DESIGNATION"
                id="CONTRACTEE_SIGNING_PARTY_DESIGNATION"
                label="Signing Party Designation"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper className={classes.paper} elevation={3}>
        <form noValidate autoComplete="off">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" align="center" gutterBottom>
                Other Contract Details
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="PROJECT_NAME"
                id="PROJECT_NAME"
                label="Project/Contract Name"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={inputs.CONTRACT_PAYER_NAME}
                name="CONTRACT_PAYER_NAME"
                id="CONTRACT_PAYER_NAME"
                select
                label="Party Paying for Contract"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              >
                {payers.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="AMOUNT"
                id="AMOUNT"
                label="Contract AMOUNT"
                fullWidth
                margin="dense"
                InputProps={{
                  startAdornment: <InputAdornment position="start">SGD</InputAdornment>,
                }}
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="LOADING_PERIOD"
                id="LOADING_PERIOD"
                label="Loading Period"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                value={inputs.DATE}
                name="DATE"
                id="DATE"
                label="Creation Date"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Box margin={2} textAlign='center'>
        <Button variant='contained' onClick={checkAllInputs} color="primary">
          Generate Document
        </Button>
      </Box>
    </div>
  );
}

export default App;
