export default ngModule => {
    ngModule.config(addCrdsCheckbox);

    function addCrdsCheckbox(formlyConfigProvider) {
        formlyConfigProvider.setType({
            name: 'crdsInput',
            template: '<input class="form-control" ng-model="model[options.key]">',
            wrapper: ['formlyBuilderHasError', 'formlyBuilderLabel']
        });
    }
}

