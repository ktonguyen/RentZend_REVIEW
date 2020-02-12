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
import {
  graphql,
  ApolloProvider,
  Mutation
} from 'react-apollo';
import {ApolloClient} from "apollo-client"
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag';
import './App.css';
import { createUploadLink } from 'apollo-upload-client';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Tran Nguyen © '}
      {new Date().getFullYear()}
    </Typography>
  );
}
const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/', // Apollo Server is served from port 4000
  headers: {
    "keep-alive": "true"
  }
})
const apolloCache = new InMemoryCache()
const client = new ApolloClient({
  link: uploadLink,
  cache: apolloCache
})


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
  table: {
    minWidth: 650,
  },
  root: {
    flexGrow: 1,
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
  photo: Yup.string()
    .required('Required'),
  document: Yup.string()
    .required('Required'),
});




const channelsListQuery = gql`
   query ChannelsListQuery {
    candidates {
      name
      email
      phone
      address
      zipcode
      document
      photo
     }
   }
 `;

const ChannelsList = ({ data: {loading, error, candidates }}) => {
  const classes = useStyles();
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Phone</TableCell>
            <TableCell align="right">Address</TableCell>
            <TableCell align="right">Zipcode</TableCell>
            <TableCell align="right">Document</TableCell>
            <TableCell align="right">Photo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
         {candidates.map( ch => (
            <TableRow key={ch.name}>
              <TableCell>{ch.name}</TableCell>
              <TableCell align="right">{ch.email}</TableCell>
              <TableCell align="right">{ch.phone}</TableCell>
              <TableCell align="right">{ch.address}</TableCell>
              <TableCell align="right">{ch.zipcode}</TableCell>
              <TableCell align="right">{ch.document.filename}</TableCell>
              <TableCell align="right">{ch.photo.filename}</TableCell> 
            </TableRow>
         ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
const ChannelsListWithData = graphql(channelsListQuery,{
  options: { pollInterval: 1000 },
})(ChannelsList);


const addCandidateMutation = gql`
  mutation addCandidate($name: String!, $email: String! , $phone: String!, $address: String!, $zipcode: String!, $document: Upload!, $photo: Upload!) {
    addCandidate(name: $name, email: $email , phone: $phone, address: $address, zipcode: $zipcode, document: $document, photo: $photo) {
      name
      email
      phone
      address
      zipcode
      document
      photo
    }
  }
`;

const AddCandidate = ({ mutate }) => {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Join Us - RentZend
          </Typography>
          <Mutation mutation={addCandidateMutation}>
          {(addCandidate, { data }) => (
          <Formik
            initialValues={{
              name: '',
              email: '',
              phone: '',
              address: '',
              zipcode: '',
              document: '',
              photo: '',
              documentFilename: '',
              photoFilename: ''
            }}
            validationSchema={FormSchema}
            onSubmit={values => {
              addCandidate({ variables: 
                  { 
                    name:values.name,
                    email: values.email,
                    phone: values.phone,
                    address: values.address,
                    zipcode: values.zipcode,
                    document: values.document,
                    photo: values.photo
                  }
               }).then(res => {
                alert("Add Successfull")
              });
              
            }}
            render={({ errors, values, handleChange, setFieldValue }) => (
            <Form className={classes.form} encType={'multipart/form-data'}>
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
                id="photo"
                required
                type="file"
                name="photo"
                onChange={e => {
                  handleChange(e)
                  setFieldValue('photo', e.target.files[0])
                  setFieldValue('photoFilename', e.target.files[0].name)
                }}
              /> 
               
              <label htmlFor="photo">
                <Button  component="span" className={classes.button}>
                Photos Upload
                </Button>
                
              </label> 
              <label>
                {values.photoFilename}
              </label>
                {errors.photo &&
                <label>
                  {errors.photo}
                </label>}
              <hr/>
              <Input
                accept="*/*"
                className={classes.input}
                style={{ display: 'none' }}
                id="document"
                required
                type="file"
                name="document"
                onChange={e => {
                  handleChange(e)
                  setFieldValue('document', e.target.files[0])
                  console.log("e.target.files[0]  ",e.target.files[0])
                  setFieldValue('documentFilename', e.target.files[0].name)
                }}
              /> 
              
              <label htmlFor="document">
                <Button  component="span" className={classes.button}>
                License or Document Upload
                </Button>
                
              </label> 
              {errors.document &&
                <label>
                  {errors.document}
                </label>}
              <label>
                {values.documentFilename}
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
          />)}
          </Mutation>
        </div>
      </Container>
  );
}

function App() {
  const classes = useStyles();
  return (
    <ApolloProvider client={client}>
      <AddCandidate />
      <div className={classes.root}>
      <Grid container spacing={3} justify="center">
        <Grid item xs={9}>
          <Typography component="h1" variant="h5">
            List Candidate
          </Typography>
          <ChannelsListWithData />
        </Grid>
      </Grid>
      </div>
      
  </ApolloProvider>
  );
}

export default App;
