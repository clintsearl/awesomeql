const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

//could go in a schema file
const typeDefs = `
  type User {
    id: ID!
    name: String
    gear: [Gear]!
  }
  type Gear {
    id: ID!  
    name: String!
    description: String
    catagory: String
  }
  type Query {
    users: [User!]!
    gear: [Gear]!
  }
  type Mutation {
    createUser(name: String): User
  }
`

const resolvers = {
  Query: {
    users: (root, args, ctx, info) => ctx.prisma.query.users({}, info),
    gear: (root, args, ctx, info) => ctx.prisma.query.gear({}, info),
  },
  Mutation: {
    createUser: (root, args, ctx, info) =>
      ctx.prisma.mutation.createUser({ data: { name: args.name } }, info),
  },
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      typeDefs: './prisma.graphql',
      endpoint: '',
      debug: true,
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))