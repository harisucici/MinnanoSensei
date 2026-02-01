const FileDB = require('./db/fileDb');

async function testLogin() {
  const fileDB = new FileDB('./data/users.json');
  
  console.log('Testing login with existing user...');
  const existingUser = await fileDB.findUserByEmail('test@example.com');
  console.log('Existing user found:', !!existingUser);
  
  if (existingUser) {
    console.log('Password matches:', existingUser.password === 'password123');
  }
  
  console.log('\nTesting login with non-existing user...');
  const nonexistentUser = await fileDB.findUserByEmail('nonexistent@example.com');
  console.log('Non-existent user found:', !!nonexistentUser);
  
  console.log('\nTest completed.');
}

testLogin().catch(console.error);