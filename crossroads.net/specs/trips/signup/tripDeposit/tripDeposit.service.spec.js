require('../../../../app/common/common.module');
require('../../../../app/trips/trips.module');

describe('Trip Deposit Service', () => {

  let tripDeposit,
      giveTransferService,
      giveFlow,
      session,
      state;

  beforeEach(angular.mock.module('crossroads.trips'));

  // injections
  beforeEach(inject(($injector) => {
    giveFlow = $injector.get('GiveFlow');
    giveTransferService = $injector.get('GiveTransferService');
    session = $injector.get('Session');
    state = $injector.get('$state');
    tripDeposit = $injector.get('TripDeposit');
  }));

  // spies
  beforeEach( () => {
    spyOn(giveTransferService, 'reset').and.callThrough();
    spyOn(giveFlow, 'reset').and.callThrough();
    spyOn(session, 'removeRedirectRoute').and.callThrough();
    spyOn(state, 'go');
  });

  it('should setup the default state', () => {
    let fakeProgram = { ProgramId: 1000, Name: 'test' };
    let fakeCampaign = { };

    tripDeposit.initDefaultState(fakeProgram, fakeCampaign, 300);

    expect(giveTransferService.reset).toHaveBeenCalled();
    expect(giveTransferService.program).toBe(fakeProgram);
    expect(giveTransferService.processing).toBe(false);
    expect(giveTransferService.givingType).toBe('one_time');
    expect(giveTransferService.amount).toBe(300);
    expect(giveTransferService.amountSubmitted).toBe(true);

    expect(giveFlow.reset).toHaveBeenCalledWith({
      account: 'tripdeposit.account',
      confirm: 'tripdeposit.confirm',
      change: 'tripdeposit.change',
      thankYou: 'tripdeposit.thanks'
    });

    expect(giveTransferService.initialized).toBe(true);
    expect(session.removeRedirectRoute).toHaveBeenCalled();
  });

});
