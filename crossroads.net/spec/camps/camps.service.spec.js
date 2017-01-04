import campsModule from '../../app/camps/camps.module';

describe('Camp Service', () => {
  // eslint-disable-next-line no-underscore-dangle
  const endpoint = `${window.__env__.CRDS_API_ENDPOINT}api`;
  let campsService;
  let httpBackend;

  beforeEach(angular.mock.module(campsModule));

  beforeEach(inject((_CampsService_, _$httpBackend_) => {
    campsService = _CampsService_;
    httpBackend = _$httpBackend_;
  }));

  it('Should make the API call to Camp Service', () => {
    const eventId = 4525285;
    httpBackend.expectGET(`${endpoint}/camps/${eventId}`)
      .respond(200, {});
    campsService.getCampInfo(eventId);

    httpBackend.flush();
  });

  it('Should make the API call to get a Camper', () => {
    const eventId = 4525285;
    const camperId = 1234;
    httpBackend.expectGET(`${endpoint}/camps/${eventId}/campers/${camperId}`)
      .respond(200, {});
    campsService.getCamperInfo(eventId, camperId);

    httpBackend.flush();
  });

  it('should make the API call to get my dashboard', () => {
    httpBackend.expectGET(`${endpoint}/v1.0.0/camps/my-camp`).respond(200, []);
    campsService.getCampDashboard();
    httpBackend.flush();
  });

  it('should make the API call to get my dashboard and handle error', () => {
    httpBackend.expectGET(`${endpoint}/v1.0.0/camps/my-camp`).respond(500, []);
    campsService.getCampDashboard();
    httpBackend.flush();
  });

  it('should make the API call to get my camp family', () => {
    const campId = 21312;
    expect(campsService.family).toEqual([]);
    httpBackend.expectGET(`${endpoint}/v1.0.0/camps/${campId}/family`).respond(200, []);
    campsService.getCampFamily(campId);
    httpBackend.flush();
    expect(campsService.family).toBeDefined();
  });

  it('should make the API call to get my camp family and handle error', () => {
    const campId = 21312;
    expect(campsService.family).toEqual([]);
    httpBackend.expectGET(`${endpoint}/v1.0.0/camps/${campId}/family`).respond(500, []);
    campsService.getCampFamily(campId);
    httpBackend.flush();
    expect(campsService.family).toEqual([]);
  });

  it('should make the API call to get my camp payment', () => {
    const invoiceId = 111;
    const paymentId = 222;
    expect(campsService.payment).toEqual({});

    httpBackend.expectGET(`${endpoint}/v1.0.0/invoice/${invoiceId}/payment/${paymentId}`).respond(200, []);
    campsService.getCampPayment(invoiceId, paymentId);
    httpBackend.flush();
    expect(campsService.payment).toBeDefined();
  });

  it('should make the API call to get my camp payment and handle error', () => {
    const invoiceId = 111;
    const paymentId = 222;

    expect(campsService.payment).toEqual({});
    httpBackend.expectGET(`${endpoint}/v1.0.0/invoice/${invoiceId}/payment/${paymentId}`).respond(500, []);
    campsService.getCampPayment(invoiceId, paymentId);
    httpBackend.flush();
    expect(campsService.payment).toEqual({});
  });

  it('should only get camp product info', () => {
    const campId = 123456;
    const camperId = 654321;
    const productInfo = {
      invoiceId: 123
    };

    httpBackend.expectGET(`${endpoint}/camps/${campId}/product/${camperId}?cache=false`).respond(200, productInfo);
    expect(campsService.getCampProductInfo(campId, camperId));
    httpBackend.flush();
    expect(campsService.productInfo.invoiceId).toEqual(123);
  });

  it('should get camp product info and check for deposit', () => {
    const campId = 123456;
    const camperId = 654321;
    const productInfo = {
      invoiceId: 123
    };

    httpBackend.expectGET(`${endpoint}/camps/${campId}/product/${camperId}?cache=false`).respond(200, productInfo);
    httpBackend.whenGET(`${endpoint}/v1.0.0/invoice/${productInfo.invoiceId}/has-payment`).respond(200, {});
    expect(campsService.getCampProductInfo(campId, camperId, true));
    httpBackend.flush();
    expect(campsService.productInfo.invoiceId).toEqual(123);
  });

  it('should get camp product info and have cached whether there was a deposit', () => {
    const campId = 123456;
    const camperId = 654321;
    const productInfo = {
      invoiceId: 123
    };

    campsService.sessionStorage.campDeposits = undefined;

    httpBackend.expectGET(`${endpoint}/camps/${campId}/product/${camperId}?cache=false`).respond(200, productInfo);
    httpBackend.expectGET(`${endpoint}/v1.0.0/invoice/${productInfo.invoiceId}/has-payment?cache=false&method=GET`).respond(302, { status: 302 });
    expect(campsService.getCampProductInfo(campId, camperId, true));
    httpBackend.flush();

    expect(campsService.productInfo.invoiceId).toEqual(123);
    expect(campsService.sessionStorage.campDeposits[`${campId}+${camperId}`]).toEqual(true);
  });

  it('should get camp product info and not check for deposit because of the cache', () => {
    const campId = 123456;
    const camperId = 654321;
    const productInfo = {
      invoiceId: 123
    };

    campsService.sessionStorage.campDeposits = {};
    campsService.sessionStorage.campDeposits[`${campId}+${camperId}`] = true;
    let checkedForDeposit = false;

    httpBackend.expectGET(`${endpoint}/camps/${campId}/product/${camperId}?cache=false`).respond(200, productInfo);
    httpBackend.whenGET(`${endpoint}/v1.0.0/invoice/${productInfo.invoiceId}/has-payment?cache=false&method=GET`).respond(() => {
      checkedForDeposit = true;
      return [400, ''];
    });
    expect(campsService.getCampProductInfo(campId, camperId, true));
    httpBackend.flush();

    expect(campsService.productInfo.invoiceId).toEqual(123);
    expect(checkedForDeposit).toEqual(false);
  });

  it('should confirm a payment', () => {
    const invoiceId = 123;
    const contactId = 456789;
    const eventId = 654321;
    const paymentId = 1234;

    httpBackend.whenPOST(`${endpoint}/v1.0.0/payment/:paymentId/confirmation`).respond(200, {});
    expect(campsService.sendPaymentConfirmation(invoiceId, paymentId, eventId, contactId));
  });

  // FIXME: there is no test for `getShirtSizes()`
  it('should get shirt sizes', () => {

  });

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });
});
