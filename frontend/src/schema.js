export const typeDefs = `
scalar GraphQLJSON
type Query { candidates: [Candidate] }
type Candidate  { name: String, email: String , phone: String, address: String, zipcode: String, document: GraphQLJSON, photo: GraphQLJSON}
`;