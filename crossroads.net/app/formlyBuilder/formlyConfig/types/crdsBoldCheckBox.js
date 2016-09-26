export default ngModule => {
    ngModule.run(addBoldCheckbox);

    function addBoldCheckbox(formlyConfig) {
        formlyConfig.setType({
            name: 'crdsBoldcheckbox',
            template: require('./templates/crds-boldCheckbox.html'),
            wrapper: ['formlyBuilderHasError'],
            apiCheck: check => ({
                templateOptions: {
                    label: check.string
                }
            })
        });
    }
}