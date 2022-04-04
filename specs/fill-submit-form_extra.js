describe('Create new Manager', function () {
    const jsonData = require('./users.json');
    let login;
    let createUser;
    

    before('prepering data', function() {
        login = async function login() {
            await browser.url('https://viktor-silakov.github.io/course-sut/index.html?quick');
            await $('#login').setValue('walker@jw.com');
            await $('#password').setValue('password');
            await $('button').click();
            await $('#spinner').waitForDisplayed({reverse: false, timeout: 5000});
            await $('#spinner').waitForDisplayed({reverse: true, timeout: 5000});}
        
        createUser = async function createUser(jsonData) {
            for (const field in jsonData) {
                await $(`#${field}`).setValue(jsonData[field]);
            }
            await $('//*[@type="submit"][text()[contains(.,"Create")]]').click();
            await $('//*[text()[contains(.,"Users List")]]').waitForExist({reverse: false, timeout: 5000});
            const url = await browser.getUrl();
            await expect(url).toMatch('https://viktor-silakov.github.io/course-sut/Users.html');
        }
        login();
    });

    context('Fill and submit the form', async function () {
        it('should create new user', async function() {
            await $('//a[text()[contains(.,"Create User")]]').waitForDisplayed({reverse: false, timeout: 5000});
            await $('//a[text()[contains(.,"Create User")]]').click();
            const url = await browser.getUrl();
            await expect(url).toMatch('https://viktor-silakov.github.io/course-sut/formUser.html');
            await createUser(jsonData);   
        });
    });
});

// npx wdio wdio.conf.js --spec fill-submit-form_extra.js