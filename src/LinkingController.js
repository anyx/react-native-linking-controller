import _ from 'lodash';
import url from 'url';

let defaultMatcher = (intentUrl) => {
    let parsedUrl = url.parse(intentUrl, true);

    if (_.has(parsedUrl.query, 'action')) {
        return {name: parsedUrl.query.action, params: parsedUrl.query};
    }
};

let matcher = defaultMatcher;

export default class LinkingController {

    actions = {};
    context = {};

    constructor(context, customMatcher) {
        this.context = context;
        if (_.isFunction(customMatcher)) {
            matcher = customMatcher;
        }

        this.run = this.run.bind(this);
    }

    /**
     * @param Linking linking
     */
    bindToLinking(linking) {
        linking.addEventListener('url', this.run);

        linking.getInitialURL().then(url => this.run({url})).catch(err => {
            throw Error('Intent router can not run action for url. Error:' + err);
        });
    }

    /**
     * @param Linking linking
     */
    unbindFromLinking(linking) {
        linking.removeEventListener('url', this.run);
    }

    findAction(intentUrl) {
        let actions = Object.keys(this.actions);

        for (let i = 0; i < actions.length; i++) {
            let actionName = actions[i];
            let actionParams = this.actions[actionName].match(intentUrl);

            if (actionParams) {
                return {
                    name: actionName,
                    params: actionParams
                };
            }
        }
    }

    run(event) {
        let intentUrl = _.isObjectLike(event) && _.has(event, 'url') ? event.url : null;
        if (!intentUrl) {
            return;
        }

        let actionParams = this.findAction(intentUrl);
        if (actionParams) {
            return this.runAction(actionParams.name, actionParams.params);
        }
    }

    registerAction(name, action) {
        let intentAction;
        let intentActionMatcher;

        if (_.isFunction(action)) {
            intentAction = action;
            intentActionMatcher = matcher;
        }

        if (_.isObjectLike(action)) {
            intentAction = action.action;
            intentActionMatcher = action.match;
        }

        if (!_.isFunction(intentAction)) {
            throw new Error('Action "' + name + '" must be function');
        }

        if (!_.isFunction(intentActionMatcher)) {
            throw new Error('Action matcher"' + name + '" must be function');
        }

        this.actions[name] = {
            match: intentActionMatcher,
            action: intentAction
        };
    }

    runAction(name, params) {
        if (!_.has(this.actions, name)) {
            throw new Error('Action "' + name + '"  is not registered');
        }

        let action = this.actions[name].action;

        return action(params, this.context);
    }
}
