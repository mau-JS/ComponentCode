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
   conversation.logger().info('Variable: ' + variable);

   let attachment = conversation.attachment();
   conversation.logger().info('Attachment: ' + JSON.stringify(attachment));
   
   // If the attachment is from Facebook Messenger, get the URL from the payload
   let fileurl = attachment && attachment.payload ? attachment.payload.url : null;
   conversation.logger().info('Attachment URL: ' + fileurl);
    
   if(fileurl != null){
     conversation.logger().info('Attachment URL type: ' + typeof fileurl); 
     conversation.variable(variable, fileurl);
     conversation.transition('success');  
     conversation.keepTurn(true);
     conversation.reply({text: 'Success'}); // Send a success message to the user
     done();
   }
   else{
     conversation.logger().error('No attachment found or URL is null');  
     conversation.transition('error');  
     conversation.keepTurn(true);
     done();    
   }
  }
};
