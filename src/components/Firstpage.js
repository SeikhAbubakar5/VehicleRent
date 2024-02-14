import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
}));

const Firstpage = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [value, setValue] = useState('Two');
  const [vehicleType, setVehicleType] = useState('');
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [modelOptions, setModelOptions] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    // Fetch from data base
    const options = {
      Two: ['Cruiser', 'Sport'],
      Four: ['SUV', 'Sedan', 'Hatchback'],
    };
    setModelOptions(options[value]);
  }, [value]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleChangetype = (event) => {
    setVehicleType(event.target.value);
  };

  const handleDateChange = (newDates) => {
    setSelectedDates(newDates);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  function getSteps() {
    return ['What is your Name', 'Number of wheels', 'Type of vehicle', 'Date Range'];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              id="first-name"
              label="First Name"
              variant="outlined"
              placeholder="Enter Your First Name"
              fullWidth
              margin="normal"
              name="firstName"
              value={firstName}
              onChange={handleFirstNameChange}
              required
            />
            <TextField
              id="last-name"
              label="Last Name"
              variant="outlined"
              placeholder="Enter Your Last Name"
              fullWidth
              margin="normal"
              name="lastName"
              value={lastName}
              onChange={handleLastNameChange}
              required
            />
          </>
        );

      case 1:
        return (
          <>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
              >
                <FormControlLabel value="Two" control={<Radio />} label="2 Wheels" />
                <FormControlLabel value="Four" control={<Radio />} label="4 Wheels" />
              </RadioGroup>
            </FormControl>
          </>
        );
      case 2:
        return (
          <>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={vehicleType}
                onChange={handleChangetype}
              >
                {modelOptions.map((model, index) => (
                  <FormControlLabel key={index} value={model} control={<Radio />} label={model} />
                ))}
              </RadioGroup>
            </FormControl>
          </>
        );
  
      case 3:
        return (
          <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                startText="Start Date"
                endText="End Date"
                value={selectedDates}
                onChange={handleDateChange}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField {...startProps} variant="outlined" margin="normal" fullWidth />
                    <TextField {...endProps} variant="outlined" margin="normal" fullWidth />
                  </>
                )}
              />
            </LocalizationProvider>
          </>
        );
      default:
        return 'unknown step';
    }
  }

  const isStepOptional = (step) => {
    return step === 1 || step === 2 || step === 3;
  };

  const isStepSkipped = (step) => {
    return skippedSteps.includes(step);
  };

  const handleNext = () => {
    if (activeStep === 0 && (!firstName || !lastName)) {
      return;
    }
    setActiveStep(activeStep + 1);
    setSkippedSteps(skippedSteps.filter((skipItem) => skipItem !== activeStep));
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSkip = () => {
    if (!isStepSkipped(activeStep)) {
      setSkippedSteps([...skippedSteps, activeStep]);
    }
    setActiveStep(activeStep + 1);
  };

  return (
    <div>
      <Stepper alternativeLabel activeStep={activeStep}>
        {getSteps().map((step, index) => {
          const labelProps = {};
          const stepProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption" align="center" style={{ display: 'block' }}>
                optional
              </Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step {...stepProps} key={index}>
              <StepLabel {...labelProps}>{step}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === getSteps().length ? (
        <Typography variant="h3" align="center">
          Thank You
        </Typography>
      ) : (
        <>
          <form>{getStepContent(activeStep)}</form>
          <Button className={classes.button} disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {isStepOptional(activeStep) && (
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={handleSkip}
            >
              Skip
            </Button>
          )}
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={handleNext}
          >
            {activeStep === getSteps().length - 1 ? 'Finish' : 'Next'}
          </Button>
        </>
      )}
    </div>
  );
};

export default Firstpage;
