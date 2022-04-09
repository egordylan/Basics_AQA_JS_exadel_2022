const {login} = require('./loginin.js');

describe('Check status', async function () {
    let waitForText;
    
    before('prepering data', async function() {
        waitForText = async function waitForText(selector, text, timeout) {
            await $(selector).waitUntil(async function () {
                return (await this.isDisplayed() && await this.getText()) === text}, {timeout: timeout})
        }
        
        await login('https://viktor-silakov.github.io/course-sut/index.html?quick');
    });

    context('Check status with helper', async function () {
        it('should appear status', async function() {
            const elem = '#status';
            await $(elem).scrollIntoView();
            await $(elem).waitForDisplayed({reverse:false, timeout: 3000});
            await $(elem).waitForClickable({timeout: 5000, reverse:false});
            await $(elem).click();
            await waitForText(elem,'Active', 4000);
        });
    });
});

// npx wdio wdio.conf.js --spec helper.js