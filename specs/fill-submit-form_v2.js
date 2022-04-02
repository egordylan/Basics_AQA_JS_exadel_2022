describe('Create new Manager', function () {
    let login;
    let createManager;
    const states = {'CA': 'Canada', 'IN': 'India', 'US': 'United States', 'Ge': 'Georgia',};
    const managers = [{
        email: 'test@mail.com', 
        password: 'password1',
        address1: '12 Central street', 
        address2: 'Appartment 12, floor 3', 
        state: 'CA', 
        zip: '0002', 
        description: 'Brand new manager from Canada', 
        city: 'Toronto',
        }, 
    {
        email: 'manager@mail.com', 
        password: 'password123',
        address1: '17 Mapple road', 
        address2: 'Appartment 47, floor 5', 
        state: 'IN', 
        zip: '4568', 
        description: 'Manager from India', 
        city: 'Delhi',
        }];

    before('prepering data', function() {
        login = async function login() {
            await browser.url('https://viktor-silakov.github.io/course-sut/index.html?quick');
            await $('#login').setValue('walker@jw.com');
            await $('#password').setValue('password');
            await $('button').click();
            await $('#spinner').waitForDisplayed({reverse: false, timeout: 5000});
            await $('#spinner').waitForDisplayed({reverse: true, timeout: 5000});}
        
        createManager = async function createManager(email, password, address1, address2, state,
                                                     zip, description, city) {
            await $('#email').setValue(email);
            await $('#password').setValue(password);
            await $('#address1').setValue(address1);
            await $('#address2').setValue(address2);
            await $('#state').click();
            await $('//*[@id="state"]/option[1]').waitForDisplayed({reverse: false, timeout: 5000});
                
            const stateMenu = await $$('//*[@id="state"]//child::option');
            for (const opt of stateMenu) {
                const stateAuto = await opt.getValue();
                if (state === stateAuto) {
                    await $(opt).moveTo();
                    await $(opt).click();
                }
            }
            await $('#zip').setValue(zip);
            await $('#description').setValue(description);
            await $('#demo-balance').click();
            await $('#wait-supervisor').click();
            await $('//input[@value="country"]').click();
            await $('#city').setValue(city);
            await $('//*[@id="autoComplete_list_1"]').waitForDisplayed({reverse: false, timeout: 5000});
                
            const autoCompleteCity = await $$('//*[@id="autoComplete_list_1"]//child::li');
            for (const bar of autoCompleteCity) {
                await $(bar).moveTo();
                const autoCityCountry = await $(bar).getText();
                for (const st in states) {
                    if (st === state && autoCityCountry.includes(states[st])) {
                        await $(bar).click();
                    }
                }
            }
            await $('//*[@type="submit"][text()[contains(.,"Create")]]').click();

            await $('//*[text()[contains(.,"Users List")]]').waitForExist({reverse: false, timeout: 5000});
            let url = await browser.getUrl();
            url = await url.toString();
            await expect(url).toMatch('https://viktor-silakov.github.io/course-sut/Users.html');
        }
    });

    context('Fill and submit the form', async function () {
        it('should create new manager', async function() {
            await login();
            
            for (const manager of managers) {
                await $('//a[text()[contains(.,"Create Manager")]]').click();
                let url = await browser.getUrl();
                url = await url.toString();
                await expect(url).toMatch('https://viktor-silakov.github.io/course-sut/formManager.html');
                
                await createManager(manager.email, manager.password, 
                                    manager.address1, manager.address2, manager.state,
                                    manager.zip, manager.description, manager.city);   
            } 
        });
    });

    context('Checking correctness', async function () {
        it('should check the correctness of data in User table', async function() {
            let url = await browser.getUrl();
            url = await url.toString();
            await expect(url).toMatch('https://viktor-silakov.github.io/course-sut/Users.html');

            const row = await $$('//div[contains(@class, "tabulator-row")]').splice(1);
            for (const m of managers) {
                for (const r of row) {
                    let mail = await r.$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "email")]`);
                    mail = await mail.getText();
                    if (mail === m.email) {
                        await expect(mail).toMatch(m.email);

                        let addr1 = await r.$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "address1")]`);
                        addr1 = await addr1.getText();
                        await expect(addr1).toMatch(m.address1);

                        let addr2 = await r.$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "address2")]`);
                        addr2 = await addr2.getText();
                        await expect(addr2).toMatch(m.address2);

                        let cityData = await r.$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "city")]`);
                        cityData = await cityData.getText();
                        await expect(cityData).toMatch(m.city);

                        let stateData = await r.$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "state")]`);
                        stateData = await stateData.getText();
                        await expect(stateData).toMatch(m.state);

                        let zipData = await r.$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "zip")]`);
                        zipData = await zipData.getText();
                        await expect(zipData).toMatch(m.zip);

                        let descr = await r.$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "description")]`);
                        descr = await descr.getText();
                        await expect(descr).toMatch(m.description);
                        } 
                        else {continue;} 
                }     
            }

        });
    });

});

// npx wdio wdio.conf.js --spec fill-submit-form_v2.js