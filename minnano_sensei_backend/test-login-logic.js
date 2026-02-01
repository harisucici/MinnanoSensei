const FileDB = require('./db/fileDb');

// Simulate the login logic
async function testLoginLogic(identifier, password) {
  console.log(`Testing login for: ${identifier}`);
  
  const fileDB = new FileDB('./data/users.json');
  
  // Step 1: Check if user exists
  const fileUser = await fileDB.findUserByEmail(identifier);
  
  if (!fileUser) {
    console.log('Result: Invalid credentials (user does not exist)');
    return { success: false, message: 'Invalid credentials' };
  }
  
  console.log('User found in database');
  
  // Step 2: Check password
  if (fileUser.password !== password) {
    console.log('Result: Invalid credentials (incorrect password)');
    return { success: false, message: 'Invalid credentials' };
  }
  
  console.log('Result: Login successful');
  return {
    success: true,
    message: 'Login successful using file database',
    data: {
      id: fileUser.id,
      name: fileUser.name,
      email: fileUser.email,
      nativeLanguage: fileUser.nativeLanguage,
      learningGoal: fileUser.learningGoal
    }
  };
}

// Test cases
async function runTests() {
  console.log('=== Testing existing user ===');
  await testLoginLogic('test@example.com', 'password123');
  
  console.log('\n=== Testing non-existing user ===');
  await testLoginLogic('nonexistent@example.com', 'any_password');
  
  console.log('\n=== Testing existing user with wrong password ===');
  await testLoginLogic('test@example.com', 'wrongpassword');
}

runTests().catch(console.error);