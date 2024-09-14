import { google } from 'googleapis';

const key = require('/home/guicaldana/Downloads/hydrosensepushnotif-firebase-adminsdk-bk1jh-61ee900f02.json');

async function getAccessToken() {
  const client = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key,
    ['https://www.googleapis.com/auth/firebase.messaging']
  );
  const token = await client.authorize();
  console.log(token.access_token);
  return token.access_token;
}

console.log(getAccessToken());