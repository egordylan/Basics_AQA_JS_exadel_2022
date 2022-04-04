async function login() {
    await browser.url('https://viktor-silakov.github.io/course-sut/index.html?quick');
    await $('#login').setValue('walker@jw.com');
    await $('#password').setValue('password');
    await $('button').click();
    await $('#spinner').waitForDisplayed({reverse: false, timeout: 5000});
    await $('#spinner').waitForDisplayed({reverse: true, timeout: 5000});
}

export default login;