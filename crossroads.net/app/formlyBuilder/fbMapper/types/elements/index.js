import addLastName from './lastName';
import addFirstName from './firstName';
import addNickName from './nickName';
import addGender from './gender';
import addSite from './site';
import addMiddleName from './middleName.js'

export default ngModule => {
    ngModule.run(addLastName);
    ngModule.run(addFirstName);
    ngModule.run(addNickName);
    ngModule.run(addGender);
    ngModule.run(addSite);
    ngModule.run(addMiddleName);
}