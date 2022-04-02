describe('Create new Manager', function () {
    const jsonData = require('./users.json');
    let login;
    let createUser;
    let users;
    

    before('prepering data', function() {
        login = async function login() {
            await browser.url('https://viktor-silakov.github.io/course-sut/index.html?quick');
            await $('#login').setValue('walker@jw.com');
            await $('#password').setValue('password');
            await $('button').click();
            await $('#spinner').waitForDisplayed({reverse: false, timeout: 5000});
            await $('#spinner').waitForDisplayed({reverse: true, timeout: 5000});}
        
        createUser = async function createUser(jsonData) {
            users = await JSON.parse(JSON.stringify(jsonData));
            for (const field in users) {
                await $(`#${field}`).setValue(users[field]);
            }
            await $('//*[@type="submit"][text()[contains(.,"Create")]]').click();
            await $('//*[text()[contains(.,"Users List")]]').waitForExist({reverse: false, timeout: 5000});
            let url = await browser.getUrl();
            url = await url.toString();
            await expect(url).toMatch('https://viktor-silakov.github.io/course-sut/Users.html');
        }
    });

    context('Fill and submit the form', async function () {
        it('should create new user', async function() {
            await login();
            await $('//a[text()[contains(.,"Create User")]]').click();
            let url = await browser.getUrl();
             url = await url.toString();
            await expect(url).toMatch('https://viktor-silakov.github.io/course-sut/formUser.html');
            await createUser(jsonData);   
        });
    });
});

// npx wdio wdio.conf.js --spec fill-submit-form_extra.js