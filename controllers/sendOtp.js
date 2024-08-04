const twilio = require('twilio');
const accountSid = 'ACa3642cee7acfabab4873067dd9649933';
const authToken = '6b5ee493dc2c2c4b1066c98dbee0366a';
const twilioPhoneNumber = '+17754312571';
//const recipientPhoneNumber = mobile;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

module.exports = {

    sendOtp: ((otpText, mobile) => {
        try {
            console.log("in send otp")
            return new Promise(async (resolve, reject) => {
                const client = new twilio(accountSid, authToken);
                client.messages.create({
                    body: otpText,
                    from: twilioPhoneNumber,
                    to: mobile//recipientPhoneNumber
                })

                .then(message => {
                    resolve (message.sid)
                })
                .catch(error => console.log('Error sending message:', error));
            })
        } catch (err) {
            logger.error("error", err)
        }
    })

}