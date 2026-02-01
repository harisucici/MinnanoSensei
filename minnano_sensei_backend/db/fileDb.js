const fs = require('fs').promises;
const path = require('path');

class FileDB {
  constructor(filePath) {
    this.filePath = filePath;
    this.ensureFileExists();
  }

  async ensureFileExists() {
    try {
      await fs.access(this.filePath);
    } catch (error) {
      // File doesn't exist, create it with empty data
      await fs.writeFile(this.filePath, JSON.stringify({ users: [] }));
    }
  }

  async read() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading file DB:', error);
      return { users: [] };
    }
  }

  async write(data) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing to file DB:', error);
    }
  }

  async findUserByEmail(email) {
    const data = await this.read();
    return data.users.find(user => user.email === email);
  }

  async findUserById(id) {
    const data = await this.read();
    return data.users.find(user => user.id === id);
  }

  async createUser(userData) {
    const data = await this.read();
    
    // Check if user already exists
    if (data.users.find(user => user.email === userData.email)) {
      throw new Error('User already exists');
    }
    
    // Create new user with ID
    const newUser = {
      id: Date.now().toString(), // Simple ID generation
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.users.push(newUser);
    await this.write(data);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async updateUser(id, updateData) {
    const data = await this.read();
    const userIndex = data.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }
    
    // Update user data
    data.users[userIndex] = {
      ...data.users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await this.write(data);
    return data.users[userIndex];
  }
}

module.exports = FileDB;