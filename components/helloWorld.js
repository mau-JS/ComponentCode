'use strict';
 
module.exports = {
  metadata: () => ({
    name: 'uploadfile',
    properties: {
      variable: { required: false, type: 'string' }
    },
    supportedActions: ['success', 'error']
  }),
  invoke: (conversation, done) => {
 
   const {variable} = conversation.properties();

	let attachment = conversation.attachment();
    let fileurl = attachment != null? attachment.url : null;
    conversation.logger().info('Attachment URL: ' + fileurl);
    
    if(fileurl != null){
      conversation.logger().info('Attachment URL type: ' + typeof fileurl); 
      conversation.variable(variable, fileurl);
      conversation.transition('success');  
      conversation.keepTurn(true);
      done();
    }
    else{
      conversation.transition('error');  
      conversation.keepTurn(true);
      done();    
    }
  }
};
