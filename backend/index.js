const fs = require('fs');
const GraphQLJSON = require('graphql-type-json');
const { ApolloServer, gql } = require('apollo-server');

// Some fake data
const candidates= [
  {
    name: "Tran Nguyen",
    email: 'nguyendevmobile@gmail.com',
    phone: '',
    address: 'Viet Nam',
    zipcode: '970000',
    document: {
      filename: '',
      url: ''
    },
    photo: {
      filename: '',
      url: ''
    }
  }
];

// The GraphQL schema in string form
const typeDefs = `
  scalar GraphQLJSON
  type Query { 
    candidates: [Candidate]
  }
  type Candidate { name: String, email: String , phone: String, address: String, zipcode: String, document: GraphQLJSON, photo: GraphQLJSON}
  type Mutation {
    addCandidate(name: String!, email: String! , phone: String!, address: String!, zipcode: String!, document: Upload!, photo: Upload!): Candidate
  }
`;


const resolvers = {
  Query: { candidates: () => candidates },
  Mutation: {
    addCandidate: (root, args) => {
      var upload_document = new Promise((resolve, reject) => { 
        resolve(args.document.then(file => {
          const {createReadStream, filename, mimetype} = file
  
          const fileStream = createReadStream()
  
          fileStream.pipe(fs.createWriteStream(`./uploadedFiles/${filename}`))
  
          return file;
        }));
     }); 
     
     var upload_photo = new Promise((resolve, reject) => {
      resolve(args.photo.then(file => {
          const {createReadStream, filename, mimetype} = file

          const fileStream = createReadStream()

          fileStream.pipe(fs.createWriteStream(`./uploadedFiles/${filename}`))
          return file
          
        }));
     });
     
      return Promise.all([
      upload_document.catch(error => { return error }),
      upload_photo.catch(error => { return error }),
     ]).then(values => { 
       console.log(values) // "Error: p2_immediate_rejection"
       const newCandidate = { 
        name: args.name, 
        email: args.email,
        phone: args.phone, 
        address: args.address,
        zipcode: args.zipcode, 
        email: args.email,
        document: {
          filename: values[0].filename,
          url: 'uploadedFiles/'+values[0].filename
        },
        photo: {
          filename: values[1].filename,
          url: 'uploadedFiles/'+values[1].filename
        }
      };
      candidates.push(newCandidate);
      
      return newCandidate;
     })
      
      
    }
    
  }
};



const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
