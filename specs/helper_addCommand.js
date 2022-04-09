const {login} = require('./loginin.js');

describe('Check status', async function () {

    before('prepering data', async function() {
        browser.addCommand('waitForText', async function(text, timeout) {
            await this.waitUntil(async function () {
                return (await this.waitForDisplayed() && await this.getText()) === text}, {timeout: timeout})
        }, true);

        await login('https://viktor-silakov.github.io/course-sut/index.html?quick');
    });

    context('Check status with helper', async function () {
        it('should appear status', async function() {
            const elem = '#status';
            await $(elem).scrollIntoView();
            await $(elem).waitForDisplayed({reverse:false, timeout: 3000});
            await $(elem).waitForClickable({timeout: 5000, reverse:false});
            await $(elem).click();
            await $('#status').waitForText('Active', 4000);
        });
    });


});

// npx wdio wdio.conf.js --spec helper_addCommand.js