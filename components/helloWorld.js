'use strict';
const axios = require('axios');
const oci = require('oci-sdk');
const uuid = require('uuid');

oci.config = {
  logger: console,
  logLevel: 'trace'
};

module.exports = {
  metadata: () => ({
    name: 'uploadfile',
    properties: {
      variable: { required: false, type: 'string' }
    },
    supportedActions: ['success', 'error']
  }),
  invoke: async (conversation, done) => {
    const { variable } = conversation.properties();
    conversation.logger().info('Variable: ' + variable);

    let attachment = conversation.attachment();
    conversation.logger().info('Attachment: ' + JSON.stringify(attachment));

    let fileurl = attachment && attachment.payload ? attachment.payload.url : null;
    conversation.logger().info('Attachment URL: ' + fileurl);

    if (fileurl != null) {
      try {
        // Download the file using axios
        const response = await axios.get(fileurl, { responseType: 'arraybuffer' });

        // Create an Object Storage client
        const provider = new oci.common.SimpleAuthenticationDetailsProvider({
          tenancyId: 'ocid1.tenancy.oc1..aaaaaaaafxt75eq7ntjt7z7trlw7eu7rogkj6qxamnt3zlexruxhwukrwigq',
          userId: 'ocid1.user.oc1..aaaaaaaauqfzfyd7klu6fbl2b5yw5ugifpogyykc5gfcqv5xqybewknkygyq',
          fingerprint: '70:cd:b3:51:f9:6f:3e:36:03:3d:d1:13:a5:6a:24:c1',
          privateKey: '-----BEGIN PRIVATE KEY----- MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFZJShfe/6m+E9 gehWeV0FFG6lINZx+4C8XKlFa9iWuwrHBmKVVf3zCHSSK8a5VurAB38Lxhi1JthP 3zAU0emutvJgR821fD061f/OW9OY2ArFbhwvfzSEDtt/kzp7ZSiKcZOcBuQKonUN BvCImWIh/ggp6ZRCwvvLZWG8qivuMw6XRjv73UuvhLGScU8374hYBGk2Ccfcuva4 sk1UlCSx3IZKFXCJ96wGHnPtTxD21j0hDaDP/cy+ESUQb1jqFKQgy2IdMi9T78qy 3ZsROkedqEPKyfYeZdAVzCrEwYo7iRdPqkZAE5NKFID4Aga67ojVh+dwSxnBhBb+ rpeUNLR1AgMBAAECggEABV7rDl57WOxvMKRoD8ZF6if3/2Uz1dkb08Q0/4RjhG0Q FNc5zR9lr/xTE6Zo8KJf88agcHpnh1zzC2/4AnEDCd5vcircpYCnt9dFGmEe55c6 lSGdrGB/1iIDWzwZyMFkB373SbUESmfI2zMM+LfXrDNvFxjZuwahdujKGSng1R52 nAC6RLYgIjEeeyUNyeyOXuxePpyfsUmjP9dwBkfuylq1zkCv2R3JivaiTMuhfXRh H3FcflMyPz0EJeoRWrsCh+Cbt7D/sBs8bOQt5hTTiF0JdVXiO7SmEWZESUc5HPl/ QKdMrm7U6ArPy7hJQwQfeHE0yQpb09FqRuUYXQFkoQKBgQDpv/2hgX792CCe4psK HF/sc4q6joAtjOZ/WfEeq438xiHRs38oIScqk6nMWoeOBEthTb859ZygvDbY+8RI vIA2n2obaj6WXnk0zFmkiJ3ypUkzyoE6bV2DaRkftvM1gTd89hWiArvY+vrSD+hY bgtWdaCuEARc/FSweLP6JrWH5QKBgQDYLqRsCyURYQJmcWe8DeWP3CNgLNs5OhSQ CtaLd6r1ReNPsQEIYkNJa7sJCkJWjLnRNAX7gvgetoPjMVOFmF0YB1qWNwAIflz6 hWcc2hloiiCjLGGVfY61bBIzMqEHJobhdvTCCzZ3vKgljvVu8eJKGfAXrLpTdsmx 8jKFMtyRUQKBgCguqukSm8QDXUgy6DgKvKqnChgb2wj5ib4mtf5xu0zSuomT863w VQ1KqQvKHDdboaGufcr239/5uuv+C7X9QYUiTlk8IFo1D1z2LArOuWg25aiTjTeA CW1Hqdv71T9DYUiH/RwGoEgijO+DcIuTDzvjqKWDd1yMu/pCJZ5A/T/JAoGBAMTz gXK5mJTDt8cTDHoEgx9UZJpLY5I4euFcLmgzpvn8KQLCdPlpZHnwfx7WTOfDH8sb xVOF131LtM54cupkjHPGx13RT+NtFFJc1Tsw7DMUnHVsip8CG9DnW5FvT8tO61Vf 5c8fHglqRBqrqqjgD9SI2vcGs140+751tFcrpk1xAoGAHR1y49w1MYwb05I8YDEq qkkQfC4YL/k1xeRWizAld3owI1mCXo6yFnmDH+663pCWaOJsa0tm7yR8Lq+Y13Ug CnfI+drs/kW5hAUDPPVRh54VichcHD4EZB+5srEpqf16CsgJILOnLDYEuVFYCg7N 3JrADuRZqo+4ajTYssAVvU4= -----END PRIVATE KEY-----',
          region: 'us-phoenix-1'
        });
        const client = new oci.objectstorage.ObjectStorageClient({ authenticationDetailsProvider: provider });

        // Generate a unique object name using UUID
        const objectName = `uploads/${uuid.v4()}.txt`;

        // Upload the file to an OCI bucket
        const uploadDetails = {
          bucketName: 'bucket-20231106-1838',
          namespaceName: 'ax5dyyuncbga',
          objectName: objectName,
          putObjectBody: response.data // Use the arraybuffer directly
        };
        await client.putObject(uploadDetails);

        conversation.variable(variable, fileurl);
        conversation.transition('success');
        conversation.keepTurn(true);
        conversation.reply({ text: 'Success' }); // Send a success message to the user
        done();
      } catch (error) {
        conversation.logger().error('Error processing file: ' + error.message);
        conversation.transition('error');
        conversation.keepTurn(true);
        done();
      }
    } else {
      conversation.logger().error('No attachment found or URL is null');
      conversation.transition('error');
      conversation.keepTurn(true);
      done();
    }
  }
};
