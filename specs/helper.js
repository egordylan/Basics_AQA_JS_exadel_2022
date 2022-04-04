describe('Check status', function () {
    let login;
    let waitForText;
    
    before('prepering data', function() {
        login = async function login() {
            await browser.url('https://viktor-silakov.github.io/course-sut/index.html?quick');
            await $('#login').setValue('walker@jw.com');
            await $('#password').setValue('password');
            await $('button').click();
            await $('#spinner').waitForDisplayed({reverse: false, timeout: 5000});
            await $('#spinner').waitForDisplayed({reverse: true, timeout: 5000});}

        waitForText = async function waitForText(selector, text, timeout) {
            await $(selector).waitUntil(async function () {
                return (await this.isDisplayed() && await this.getText()) === text}, {timeout: timeout})
        }
        login();
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