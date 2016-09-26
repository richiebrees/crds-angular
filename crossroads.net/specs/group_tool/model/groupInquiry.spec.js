
import GroupInquiry from '../../../app/group_tool/model/groupInquiry';

describe('Group Inquiry', () => {

  let inquiry,
    mockJson;

  beforeEach(() => {
    mockJson = {
      "groupId": 172286,
      "emailAddress": "jim.kriz@ingagepartners.com",
      "phoneNumber": "513-432-1973",
      "firstName": "Dustin",
      "lastName": "Kocher",
      "requestDate": "2016-07-14T10:00:00",
      "placed": false,
      "inquiryId": 19,
      "contactId": 1219
    };

    inquiry = new GroupInquiry(mockJson);
  });

  describe('creation', () => {
    it('should have the following values with JSON source', () => {
      expect(inquiry.groupId).toEqual(mockJson.groupId);
      expect(inquiry.emailAddress).toEqual(mockJson.emailAddress);
      expect(inquiry.phoneNumber).toEqual(mockJson.phoneNumber);
      expect(inquiry.firstName).toEqual(mockJson.firstName);
      expect(inquiry.lastName).toEqual(mockJson.lastName);
      expect(inquiry.requestDate).toEqual(mockJson.requestDate);
      expect(inquiry.placed).toEqual(mockJson.placed);
      expect(inquiry.inquiryId).toEqual(mockJson.inquiryId);
      expect(inquiry.contactId).toEqual(mockJson.contactId);
    });

    it('should have the following values with no source', () => {
      inquiry = new GroupInquiry();
      expect(inquiry.groupId).toBeUndefined();
      expect(inquiry.emailAddress).toBeUndefined();
      expect(inquiry.phoneNumber).toBeUndefined();
      expect(inquiry.firstName).toEqual('');
      expect(inquiry.lastName).toEqual('');
      expect(inquiry.requestDate).toBeUndefined();
      expect(inquiry.placed).toBeUndefined();
      expect(inquiry.inquiryId).toBeUndefined();
      expect(inquiry.contactId).toBeUndefined();
    });
    
  });

  describe('recipientName', () => {
    it('should display first then last name', () => {
      expect(inquiry.recipientName()).toEqual('Dustin Kocher');
    });
  });
});