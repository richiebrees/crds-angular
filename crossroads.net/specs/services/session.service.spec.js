

describe('Session Service', function() {

  var $cookies, $cookieStore, Session;

  var family = [0, 1, 2, 3, 4];

  beforeEach(angular.mock.module('crossroads.core'));

  beforeEach(inject(function(_$cookies_, _Session_){
    $cookies = _$cookies_;
    Session = _Session_;
  }));

  it("should save an array of family members", function(){
    Session.addFamilyMembers(family);
    expect($cookies.get("family")).toBe(family.join(','));
  });

  it("should return an array of family members", function(){
    Session.addFamilyMembers(family);
    expect(Session.getFamilyMembers()[0]).toBe(family[0]);
    expect(Session.getFamilyMembers()[1]).toBe(family[1]);
    expect(Session.getFamilyMembers()[4]).toBe(family[4]);
  });

  it("should add a family member to an existing family", function(){
    Session.addFamilyMembers(family);
    expect(Session.getFamilyMembers()[0]).toBe(family[0]);
    expect(Session.getFamilyMembers()[1]).toBe(family[1]);
    expect(Session.getFamilyMembers()[4]).toBe(family[4]);
    family.push(5);
    Session.addFamilyMembers(family);
    expect(Session.getFamilyMembers()[5]).toBe(family[5]);
  });

  describe("function addRedirectRoute", function() {
    it("should add redirectUrl and params cookies", function() {
      var params = {
        p1: 2,
        p3: "4"
      };
      Session.addRedirectRoute("new.state", params);
      expect($cookies.get("redirectUrl")).toBe("new.state");
      expect($cookies.get("params")).toBe(JSON.stringify(params));
    });
  });


});
