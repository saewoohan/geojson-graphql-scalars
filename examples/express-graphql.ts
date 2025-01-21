import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './schema';

const app = express();

app.use(
  '/graphql',
  createHandler({
    schema,
  })
);

app.listen(4000, () => {
  console.log(`GraphQL server is running at http://localhost:4000/graphql`);
});
