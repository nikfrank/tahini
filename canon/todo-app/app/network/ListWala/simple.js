import { simpleHTTP } from 'tahini';

export default simpleHTTP.get('http://jsonplaceholder.typicode.com/posts');

export const mock = simpleHTTP.mock([
  { title: 'blah' },
  { title: 'blahh' },
  { title: 'blahhh' },
  { title: 'blahhhh' },
  { title: 'blahhhhh' },
  { title: 'blahhhhhh' },
]);
