async function login (link) {
    await browser.url(link);
    await $('#login').setValue('walker@jw.com');
    await $('#password').setValue('password');
    await $('button').click();
    await $('#spinner').waitForDisplayed({reverse: false, timeout: 5000});
    await $('#spinner').waitForDisplayed({reverse: true, timeout: 5000});
}   


module.exports = {login};