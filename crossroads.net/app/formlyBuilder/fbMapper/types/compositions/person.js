import CONSTANTS from '../../../../constants';

export default function Person(fbMapperConfig, $resource) {
    fbMapperConfig.setComposition({
        name: 'person',
        elements: [
            "firstName", "lastName", "nickName", "gender", "site", "middleName"
        ],
        prePopulate: $resource(__API_ENDPOINT__ +  'api/profile')
    });
}