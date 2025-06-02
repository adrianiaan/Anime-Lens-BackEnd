const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

async function testUpload() {
  try {
    const form = new FormData();
    const filePath = path.join(__dirname, 'README.md');
    form.append('image', fs.createReadStream(filePath));

    const response = await axios.post(`${BASE_URL}/upload`, form, {
      headers: form.getHeaders(),
    });
    console.log('Upload response:', response.data);
    return response.data.filename;
  } catch (error) {
    console.error('Upload error:', error.response ? error.response.data : error.message);
  }
}

async function testDetect(filename) {
  try {
    const form = new FormData();
    const filePath = path.join(__dirname, 'uploads', filename);
    form.append('image', fs.createReadStream(filePath));

    const response = await axios.post(`${BASE_URL}/detect`, form, {
      headers: form.getHeaders(),
    });
    console.log('Detect response:', response.data);
  } catch (error) {
    console.error('Detect error:', error.response ? error.response.data : error.message);
  }
}

async function testGetImage(filename) {
  try {
    const response = await axios.get(`${BASE_URL}/uploads/${filename}`, {
      responseType: 'stream',
    });
    console.log('Get image response status:', response.status);
  } catch (error) {
    console.error('Get image error:', error.response ? error.response.data : error.message);
  }
}

async function testDeleteImage(filename) {
  try {
    const response = await axios.delete(`${BASE_URL}/upload/${filename}`);
    console.log('Delete response:', response.data);
  } catch (error) {
    console.error('Delete error:', error.response ? error.response.data : error.message);
  }
}

async function testDeleteNonExistent() {
  try {
    const response = await axios.delete(`${BASE_URL}/upload/nonexistentfile.jpg`);
    console.log('Delete non-existent response:', response.data);
  } catch (error) {
    console.error('Delete non-existent error:', error.response ? error.response.data : error.message);
  }
}

async function runTests() {
  const filename = await testUpload();
  if (filename) {
    await testDetect(filename);
    await testGetImage(filename);
    await testDeleteImage(filename);
    await testDeleteNonExistent();
  }
}

runTests();
