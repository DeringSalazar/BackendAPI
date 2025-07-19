const axios = require('axios');
const url = 'https://apiintegrador-production-8ef8.up.railway.app';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiY29ycmVvIjoiZGVyaW5nQGdtYWlsLmNvbSIsInJvbCI6InVzdWFyaW8iLCJub21icmVVc3VhcmlvIjoiRGVyaW5nIFNhbGF6YXIiLCJpZE11bmljaXBhbGlkYWQiOjEsImlhdCI6MTc1MTkyMTk0MiwiZXhwIjoxNzUxOTM2MzQyfQ.J_V3YfhiOi1sghpHJEVf6muQKOgmde2P2znIzGM_OGs';

const postMethod = async (path, data) => {
  try {
    const response = await axios.post(`${url}/${path}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// const api = {
//   postMethod
// };

// module.exports = api;
