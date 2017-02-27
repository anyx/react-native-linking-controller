import LinkingController from './../src/LinkingController';

let fakeStore = {
    dispatch: () => {
    }
};

describe('LinkingController', () => {

    it('should run registered action with default matcher', () => {
        let url = 'http://some-domain.com?action=testAction&domain=sd&param=asd';

        let router = new LinkingController(fakeStore);

        router.registerAction('testAction', () => 'Done');

        let result = router.run({url});

        expect(result).toBe('Done');
        expect(router.run({url: 'http://another.com?param=asd'})).toBeUndefined();
    });

    it('should register action with custom matcher', () => {
        let url = 'http://my-domain.com#registration';

        let router = new LinkingController(fakeStore);

        router.registerAction('myAction', {
            match: (intentUrl) => {
                if (intentUrl === 'http://my-domain.com#registration') {
                    return {
                        param: 'My Action!'
                    };
                }

                return intentUrl === '';
            },
            action: (params) => {
                return params.param;
            }
        });

        let result = router.run({url});
        expect(result).toBe('My Action!');
        expect(router.run({url: 'http://another.com?param=asd'})).toBeUndefined();
    });
});
