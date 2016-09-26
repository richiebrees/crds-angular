export default ngModule => {
    ngModule.config(addCrdsCheckbox);

    function addCrdsCheckbox(formlyConfigProvider) {
        formlyConfigProvider.setType({
            name: 'crdsCheckbox',
            template: require('./templates/crds-checkbox.html'),
            wrapper: ['formlyBuilderHasError'],
            apiCheck: check => ({
                templateOptions: {
                    label: check.string
                }
            })
        });
    }
}

