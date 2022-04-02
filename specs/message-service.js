const {
    startClientPC,
    startSatelite,
    stopClientPC,
    stopEarthServer,
    stopSatelite,
    stopMarsServer,
    startEarthServer,
    startMarsServer,
    sendMessage,
    assertResponse
} = require('./stubs/messageservice.stubs');


describe('Message Sending', function () {
    let startAllNodes;
    let stopAllNodes;

    before('prepare data', function() {
        startAllNodes = function startAllNodes() {
            startClientPC();
            const earthToken = startEarthServer();
            const marsToken = startMarsServer();
            startSatelite();
            return {
                earth: earthToken,
                mars: marsToken,
            }
        }

        stopAllNodes = function stopAllNodes(){
            stopMarsServer();
            stopEarthServer();
            stopSatelite();
            stopClientPC();
        }
    });

    context('Message Sending Succesfully', function () {
        // Succesfully sending messages to the Earth server
        it('should send message to Earth without error', function () {
            let tokens = startAllNodes();
            const response = sendMessage('Hello', 'Earth', tokens.earth);
            assertResponse(response, 'Success');
            stopAllNodes();
        });
        // Succesfully sending messages to the Mars server
         it('should send message to Mars without error', function () {
            let tokens = startAllNodes();
            const response = sendMessage('Hello', 'Mars', tokens.mars);
            assertResponse(response, 'Success');
            stopAllNodes()
        });
    });

    context('Message Sending with invalid token', function () {
        // Message Sending with invalid token to Earth
        it('should send message to Client from Earth with "Security Error"', function () {
            startAllNodes();
            const response = sendMessage('Hello', 'Earth', 'X0000');
            assertResponse(response, 'Security Error');
            stopAllNodes();
        });
        // Message Sending with invalid token to Mars
        it('should send message to Client from Mars with "Security Error"', function () {
            startAllNodes();
            const response = sendMessage('Hello', 'Mars', 'X0000');
            assertResponse(response, 'Security Error');
            stopAllNodes();
        });
    });

    context('Message Sending with disabled satellite', function () {
        // Message Sending to Mars with invalid token and disabled satellite
        it('valid token: should send message to Client from Mars with "Service is unavailable"', function () {
            startAllNodes();
            stopSatelite();
            const response = sendMessage('Hello', 'Mars', 'invalid000token');
            assertResponse(response, 'Service is unavailable');
            stopAllNodes();
        });
        // Message Sending to Mars with valid token and disabled satellite
        it('invalid token: should send message to Client from Mars with "Service is unavailable"', function () {
            let tokens = startAllNodes();
            stopSatelite();
            const response = sendMessage('Hello', 'Mars', tokens.mars);
            assertResponse(response, 'Service is unavailable');
            stopAllNodes();
        });
    });
    
    after('stop connection of servers', function () {
        stopAllNodes();
    });
})


// npx wdio wdio.conf.js --spec message-service.js