import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import './App.css';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Tran Nguyen © '}
      {new Date().getFullYear()}
    </Typography>
  );
}



const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


const phoneRegExp = /^[(]{1}[0-9]{3}[)]{1}[\s]{1}[0-9]{3}[-]{1}[0-9]{4}$/

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(255, 'Too Long!')
    .required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  phone: Yup.string()
    .min(2, 'Too Short!')
    .max(255, 'Too Long!')
    .required('Required')
    .matches(phoneRegExp, 'Phone number is not valid. Example: (123) 456-7899'),
  address: Yup.string()
    .min(2, 'Too Short!')
    .max(500, 'Too Long!')
    .required('Required'),
  zipcode: Yup.string()
    .min(2, 'Too Short!')
    .max(255, 'Too Long!')
    .required('Required'),
});



function App() {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Join Us - RentZend
        </Typography>
        <Formik
          initialValues={{
            name: '',
            email: '',
            phone: '',
            address: '',
            zipcode: ''
          }}
          validationSchema={FormSchema}
          onSubmit={values => {
          }}
          render={({ errors, touched, handleChange, setFieldValue, isValid, setFieldTouched, handleSubmit,isRequesting }) => (
          <Form className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name" 
              error={Boolean(errors.name)}
              helperText={errors.name}
              onChange={e => {
                handleChange(e)
                setFieldValue('name', e.target.value)
              }}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              error={Boolean(errors.email)}
              helperText={errors.email}
              onChange={e => {
                handleChange(e)
                setFieldValue('email', e.target.value)
              }}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="phone"
              label="Phone Number"
              id="phone"
              autoFocus
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              onChange={e => {
                handleChange(e)
                setFieldValue('phone', e.target.value)
              }}
            />
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="address"
              label="Address"
              id="address"
              autoFocus
              error={Boolean(errors.address)}
              helperText={errors.address}
              onChange={e => {
                handleChange(e)
                setFieldValue('address', e.target.value)
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="zipcode"
              label="Zip Code"
              id="zipcode"
              autoFocus
              error={Boolean(errors.zipcode)}
              helperText={errors.zipcode}
              onChange={e => {
                handleChange(e)
                setFieldValue('zipcode', e.target.value)
              }}
            />
            <Input
              accept="image/*"
              className={classes.input}
              style={{ display: 'none' }}
              id="file"
              multiple
              type="file"
            /> 
            <label htmlFor="file">
              <Button  component="span" className={classes.button}>
              File Upload
              </Button>
            </label> 
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit
            </Button>
          </Form>
          )}
        />
      </div>
    </Container>
  );
}

export default App;
