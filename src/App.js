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
  InputAdornment
} from '@material-ui/core';
import Docxtemplater from "docxtemplater"
import JSzip from "jszip"
import JSzipUtils from "jszip-utils"
import { saveAs } from "file-saver"
import template from './IndependentContractorAgreement.docx'
import { getDateWithoutDay } from './utils.js';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  paper: {
    marginTop: 24,
    padding: 16,
    width: '60%',
    margin: 'auto', 
  },
  modal: {
    padding: 16
  }
});

function App() {
  const [inputs, setInputs] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false)

  const classes = useStyles();
 
  const loadFile = (url, callback) => {
    JSzipUtils.getBinaryContent(url, callback);
  }

  const onChangeForField = (event) => {
    const key = event.target.name
    const value = event.target.value
    setInputs(state => ({...state,[key]:value}))
    console.log(inputs)
  }

  const checkAllInputs = () => {
    console.log(Object.keys(inputs).length)
    if (Object.keys(inputs).length === 20) {
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
      doc.setData({
        // Values are the camelCase version of these placeholders
        // contractee details
        CONTRACTEE_NAME: inputs.contracteeName,
        CONTRACTEE_PHONE: inputs.contracteePhone,
        CONTRACTEE_EMAIL: inputs.contracteeEmail,
        CONTRACTEE_ADDRESS: inputs.contracteeAddress,
        CONTRACTEE_COUNTRY: inputs.contracteeCountry,
        CONTRACTEE_REGISTRATION_NUMBER: inputs.contracteeRegistrationNumber,
        CONTRACTEE_CONTACT_NAME: inputs.contracteeContactName,
        CONTRACTEE_SIGNING_PARTY: inputs.contracteeSigningParty,
        CONTRACTEE_SIGNING_PARTY_DESIGNATION: inputs.contracteeSigningPartyDesignation,
        // contractor details
        CONTRACTOR_NAME: inputs.contractorName,
        CONTRACTOR_PHONE: inputs.contractorPhone,
        CONTRACTOR_EMAIL: inputs.contractorEmail,
        CONTRACTOR_ADDRESS: inputs.contractorAddress,
        CONTRACTOR_NRIC_NUMBER: inputs.contractorNricNumber,
        CONTRACTOR_CONTACT_NAME: inputs.contractorContactName,
        CONTRACTOR_SIGNING_PARTY: inputs.contractorSigningParty,
        // other details
        PROJECT_NAME: inputs.projectName,
        CONTRACT_PAYER_NAME: inputs.contractPayerName,
        LOADING_PERIOD: inputs.loadingPeriod,
        AMOUNT: inputs.amount,
        // dynamically obtained without user input
        DATE: getDateWithoutDay(),
      });
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
      saveAs(out, "output.docx");
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
      <Typography variant="h3" align="center" gutterBottom color="primary">
        Independent Contractor Agreement
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Fill in the required fields, we'll take care of the rest!
      </Typography>

      <Paper className={classes.paper} elevation={3}>
        <form noValidate autoComplete="off">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" align="center" gutterBottom>
                Your/your company details (In v1 the contractee is a company)
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="contracteeName"
                id="contracteeName"
                label="Name"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="contracteePhone"
                id="contracteePhone"
                label="Phone"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="contracteeEmail"
                id="contracteeEmail"
                label="Email"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="contracteeAddress"
                id="contracteeAddress"
                label="Address"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="contracteeCountry"
                id="contracteeCountry"
                label="Country"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="contracteeRegistrationNumber"
                id="contracteeRegistrationNumber"
                label="Registration Number"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="contracteeContactName"
                id="contracteeContactName"
                label="POC Name"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="contracteeSigningParty"
                id="contracteeSigningParty"
                label="Signing Party"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="contracteeSigningPartyDesignation"
                id="contracteeSigningPartyDesignation"
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
                Contractor details (In v1 the contractor is an individual)
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="contractorName"
                id="contractorName"
                label="Name"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="contractorPhone"
                id="contractorPhone"
                label="Phone"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="contractorEmail"
                id="contractorEmail"
                label="Email"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="contractorAddress"
                id="contractorAddress"
                label="Address"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="contractorNricNumber"
                id="contractorNricNumber"
                label="NRIC Number"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="contractorContactName"
                id="contractorContactName"
                label="POC Name"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="contractorSigningParty"
                id="contractorSigningParty"
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
                Other Contract Details
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="projectName"
                id="projectName"
                label="Project/Contract Name"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="contractPayerName"
                id="contractPayerName"
                label="Contract Payer Name"
                fullWidth
                margin="dense"
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="amount"
                id="amount"
                label="Contract Amount"
                fullWidth
                margin="dense"
                InputProps={{
                  startAdornment: <InputAdornment position="start">SGD</InputAdornment>,
                }}
                onChange={e => onChangeForField(e)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="loadingPeriod"
                id="loadingPeriod"
                label="Loading Period"
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
