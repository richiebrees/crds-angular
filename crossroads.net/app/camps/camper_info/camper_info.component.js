import CamperInfoController from './camper_info.controller';
import InfoTemplate from './camper_info.html';

let CamperInfo = {
  bindings: {},
  template: InfoTemplate,
  controller: CamperInfoController,
  controllerAs: 'camperInfo'
};

export default CamperInfo;
