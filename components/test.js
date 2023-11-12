// Import your custom component
const uploadfile = require('C:/Users/icono/Desktop/ComponentCode/components/helloWorld.js');

// Create a mock conversation object
let conversation = {
  properties: () => ({ variable: 'testVariable' }),
  attachment: () => ({ payload: { url: 'https://cloudinary-marketing-res.cloudinary.com/images/w_1000,c_scale/v1679921049/Image_URL_header/Image_URL_header-png?_i=AA' } }),
  logger: () => console,
  variable: (name, value) => console.log(`Set variable ${name} to ${value}`),
  transition: action => console.log(`Transitioned to ${action}`),
  reply: message => console.log(`Replied with message: ${JSON.stringify(message)}`),
  keepTurn: keep => console.log(`Keep turn: ${keep}`)
};

// Invoke your custom component with the mock conversation object
uploadfile.invoke(conversation, () => console.log('Done'));
