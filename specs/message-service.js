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
    let startEarth;
    let startMars;

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

        startEarth = function startEart() {
            startClientPC();
            const earthToken = startEarthServer();
            startSatelite();
            return {
                earth: earthToken,
            }
        }

        startMars = function startMars() {
            startClientPC();
            const marsToken = startMarsServer();
            startSatelite();
            return {
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
            let tokenE = startEarth();
            const response = sendMessage('Hello', 'Earth', tokenE.earth);
            assertResponse(response, 'Success');
        });
        // Succesfully sending messages to the Mars server
         it('should send message to Mars without error', function () {
            let tokenM = startMars();
            const response = sendMessage('Hello', 'Mars', tokenM.mars);
            assertResponse(response, 'Success');
        });
    });

    context('Message Sending with invalid token', function () {
        // Message Sending with invalid token to Earth
        it('should send message to Client from Earth with "Security Error"', function () {
            const response = sendMessage('Hello', 'Earth', 'X0000');
            assertResponse(response, 'Security Error');
        });
        // Message Sending with invalid token to Mars
        it('should send message to Client from Mars with "Security Error"', function () {
            const response = sendMessage('Hello', 'Mars', 'X0000');
            assertResponse(response, 'Security Error');
        });
    });

    context('Message Sending with disabled satellite', function () {
        // Message Sending to Mars with invalid token and disabled satellite
        it('valid token: should send message to Client from Mars with "Service is unavailable"', function () {
            startMars();
            stopSatelite();
            const response = sendMessage('Hello', 'Mars', 'invalid000token');
            assertResponse(response, 'Service is unavailable');
        });
        // Message Sending to Mars with valid token and disabled satellite
        it('invalid token: should send message to Client from Mars with "Service is unavailable"', function () {
            let tokenM =startMars();
            stopSatelite();
            const response = sendMessage('Hello', 'Mars', tokenM.mars);
            assertResponse(response, 'Service is unavailable');
        });
    });
    
    after('stop all nodes', function () {
        stopAllNodes();
    });
})


// npx wdio wdio.conf.js --spec message-service.js