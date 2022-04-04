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
            await $('#spinner').waitForDisplayed({reverse: true, timeout: 5000});
            await expect(url).toMatch('https://viktor-silakov.github.io/course-sut/index.html');
        }

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
                        await $(bar).click();}
                }
            }
            await $('//*[@type="submit"][text()[contains(.,"Create")]]').click();
            await $('//*[text()[contains(.,"Users List")]]').waitForExist({reverse: false, timeout: 5000});
            const url = await browser.getUrl();
            await expect(url).toMatch('https://viktor-silakov.github.io/course-sut/Users.html');
        }
        login();
    });

    context('Fill and submit the form', async function () {
        it('should create new manager', async function() {
            for (const manager of managers) {
                await $('//a[text()[contains(.,"Create Manager")]]')
                        .waitForDisplayed({reverse: false, timeout: 5000});
                await $('//a[text()[contains(.,"Create Manager")]]').click();
                const url = await browser.getUrl();
                await expect(url).toMatch('https://viktor-silakov.github.io/course-sut/formManager.html');
                await createManager(manager.email, manager.password, manager.address1, manager.address2, 
                                    manager.state, manager.zip, manager.description, manager.city);   
            } 
        });
    });

    context('Checking correctness', async function () {
        it('should check the correctness of data in User table', async function() {
            await $('//a[text()[contains(.,"List of users")]]').click();
            const url = await browser.getUrl();
            await expect(url).toMatch('https://viktor-silakov.github.io/course-sut/Users.html');

            // Check the first manager
            const email1 = await $('#users-table > div.tabulator-tableholder > div > div:nth-child(2)')
                                .$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "email")]`);
            const email1Text = await email1.getText();
            await expect('test@mail.com').toMatch(email1Text)

            const addr1Manager1 = await $('#users-table > div.tabulator-tableholder > div > div:nth-child(2)')
                                        .$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "address1")]`);
            const addr1Manager1Text = await addr1Manager1.getText();
            await expect('12 Central street').toMatch(addr1Manager1Text);

            const addr2Manager1 = await $('#users-table > div.tabulator-tableholder > div > div:nth-child(2)')
                                        .$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "address2")]`);
            const addr2Manager1Text = await addr2Manager1.getText();
            await expect('Appartment 12, floor 3').toMatch(addr2Manager1Text);

            const city1Data = await $('#users-table > div.tabulator-tableholder > div > div:nth-child(2)')
                                    .$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "city")]`);
            const city1DataText = await city1Data.getText();
            await expect('Toronto').toMatch(city1DataText);

            const state1 = await $('#users-table > div.tabulator-tableholder > div > div:nth-child(2)')
                                .$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "state")]`);
            const state1Text = await state1.getText();
            await expect('CA').toMatch(state1Text);

            const zip1 = await $('#users-table > div.tabulator-tableholder > div > div:nth-child(2)')
                                .$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "zip")]`);
            const zip1Text = await zip1.getText();
            await expect('0002').toMatch(zip1Text);

            const description1 = await $('#users-table > div.tabulator-tableholder > div > div:nth-child(2)')
                                        .$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "description")]`);
            const description1Text = await description1.getText();
            await expect('Brand new manager from Canada').toMatch(description1Text);
             
                        
            // Check the second manager
            const email2 = await $('#users-table > div.tabulator-tableholder > div > div:nth-child(3)')
                                .$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "email")]`);
            const email2Text = await email2.getText();
            await expect('manager@mail.com').toMatch(email2Text)

            const addr1Manager2 = await $('#users-table > div.tabulator-tableholder > div > div:nth-child(3)')
                                        .$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "address1")]`);
            const addr1Manager2Text = await addr1Manager2.getText();
            await expect('17 Mapple road').toMatch(addr1Manager2Text);

            const addr2Manager2 = await $('#users-table > div.tabulator-tableholder > div > div:nth-child(3)')
                                        .$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "address2")]`);
            const addr2Manager2Text = await addr2Manager2.getText();
            await expect('Appartment 47, floor 5').toMatch(addr2Manager2Text);

            const city2Data = await $('#users-table > div.tabulator-tableholder > div > div:nth-child(3)')
                                    .$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "city")]`);
            const city2DataText = await city2Data.getText();
            await expect('Delhi').toMatch(city2DataText);

            const state2 = await $('#users-table > div.tabulator-tableholder > div > div:nth-child(3)')
                                .$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "state")]`);
            const state2Text = await state2.getText();
            await expect('IN').toMatch(state2Text);

            const zip2 = await $('#users-table > div.tabulator-tableholder > div > div:nth-child(3)')
                                .$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "zip")]`);
            const zip2Text = await zip2.getText();
            await expect('4568').toMatch(zip2Text);

            const description2 = await $('#users-table > div.tabulator-tableholder > div > div:nth-child(3)')
                                        .$(`.//div[@class="tabulator-cell"][contains(@tabulator-field, "description")]`);
            const description2Text = await description2.getText();
            await expect('Manager from India').toMatch(description2Text);

        });
    });

});

// npx wdio wdio.conf.js --spec fill-submit-form_v2.js