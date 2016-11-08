/* ngInject */
class MedicalInfoForm {

  constructor(CampsService, $resource) {
    this.campsService = CampsService;
    this.allergies = [];
    this.medicineAllergyId = undefined;
    this.foodAllergyId = undefined;
    this.environmentalAllergyId = undefined;
    this.otherAllergyId = undefined;
    this.formModel = {
      contactId: this.campsService.campMedical.contactId || undefined,
      insuranceCompany: this.campsService.campMedical.insuranceCompany || undefined,
      policyHolder: this.campsService.campMedical.policyHolder || undefined,
      physicianName: this.campsService.campMedical.physicianName || undefined,
      physicianPhone: this.campsService.campMedical.physicianPhone || undefined,
      showAllergies: this.campsService.campMedical.showAllergies || false,
      medicineAllergies: this.medicineAllergies() || undefined,
      foodAllergies: this.foodAllergies() || undefined,
      environmentalAllergies: this.environmentalAllergies() || undefined,
      otherAllergies: this.otherAllergies() || undefined,
    };

    this.medicalInfoResource = $resource(`${__API_ENDPOINT__}api/camps/medical/:contactId`);
  }

  save(contactId) {
    return this.medicalInfoResource.save({ contactId }, this.saveDto()).$promise;
  }

  saveDto() {
    const dto = {
      contactId: this.formModel.contactId,
      medicalInformationId: this.campsService.campMedical.medicalInformationId,
      insuranceCompany: this.formModel.insuranceCompany,
      policyHolder: this.formModel.policyHolder,
      physicianName: this.formModel.physicianName,
      physicianPhone: this.formModel.physicianPhone,
      allergies: [
        { allergyType: 'Medicine',
          allergyDescription: this.formModel.medicineAllergies
        },
        { allergyType: 'Food',
          allergyDescription: this.formModel.foodAllergies
        },
        { allergyType: 'Environmental',
          allergyDescription: this.formModel.environmentalAllergies
        },
        { allergyType: 'Other',
          allergyDescription: this.formModel.otherAllergies
        }]
    };
    return dto;
  }

  medicineAllergies() {
    this.medicineAllergies = _.find(this.campsService.campMedical.allergies, allergy => (allergy.allergyType === 'Medicine'));
    if (this.medicineAllergies !== undefined) {
      this.medicineAllergyId = this.medicineAllergies.allergyId;
      return this.medicineAllergies.allergyDescription;
    }
    return null;
  }

  foodAllergies() {
    this.foodAllergies = _.find(this.campsService.campMedical.allergies, allergy => (allergy.allergyType === 'Food'));
    if (this.foodAllergies !== undefined) {
      this.foodAllergyId = this.foodAllergies.allergyId;
      return this.foodAllergies.allergyDescription;
    }
    return null;
  }

  environmentalAllergies() {
    this.environmentalAllergies = _.find(this.campsService.campMedical.allergies, allergy => (allergy.allergyType === 'Environmental'));
    if (this.environmentalAllergies !== undefined) {
      this.environmentalAllergyId = this.environmentalAllergies.allergyId;
      return this.environmentalAllergies.allergyDescription;
    }
    return null;
  }

  otherAllergies() {
    this.otherAllergies = _.find(this.campsService.campMedical.allergies, allergy => (allergy.allergyType === 'Other'));
    if (this.otherAllergies !== undefined) {
      this.otherAllergyId = this.otherAllergies.allergyId;
      return this.otherAllergies.allergyDescription;
    }
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  getFields() {
    return [
      {
        className: 'row',
        fieldGroup: [{
          className: 'form-group col-xs-6',
          key: 'insuranceCompany',
          type: 'crdsInput',
          templateOptions: {
            label: 'Insurance Company Name',
            required: false
          }
        }, {
          className: 'form-group col-xs-6',
          key: 'policyHolder',
          type: 'crdsInput',
          templateOptions: {
            label: 'Policy Holder Name',
            required: false
          }
        }]
      },
      {
        className: 'row',
        fieldGroup: [{
          className: 'form-group col-xs-6',
          key: 'physicianName',
          type: 'crdsInput',
          templateOptions: {
            label: 'Physician Name',
            required: false
          }
        }, {
          className: 'form-group col-xs-6',
          key: 'physicianPhone',
          type: 'crdsInput',
          optionsTypes: ['phoneNumber'],
          templateOptions: {
            label: 'Physician Phone Number',
            required: false
          }
        }]
      },
      {
        className: 'row',
        fieldGroup: [{
          className: 'form-group col-xs-6',
          key: 'showAllergies',
          type: 'crdsRadio',
          templateOptions: {
            label: 'Are there any Allergy/Dietary Needs?',
            required: true,
            inline: true,
            labelProp: 'label',
            valueProp: 'id',
            options: [{
              label: 'Yes',
              id: true
            }, {
              label: 'No',
              id: false
            }]
          }
        }]
      },
      {
        className: 'row',
        hideExpression: () => !this.formModel.showAllergies,
        fieldGroup: [{
          className: 'col-xs-12',
          template: '<p>List all allergies, reactions and treatments to allergies.</p>'
        }, {
          className: 'form-group col-xs-12',
          key: 'medicineAllergies',
          type: 'crdsTextArea',
          templateOptions: {
            label: 'Medicine Allergies',
            required: false
          }
        }, {
          className: 'form-group col-xs-12',
          key: 'foodAllergies',
          type: 'crdsTextArea',
          templateOptions: {
            label: 'Food Allergies',
            required: false
          }
        }, {
          className: 'form-group col-xs-12',
          key: 'environmentalAllergies',
          type: 'crdsTextArea',
          templateOptions: {
            label: 'Environmental Allergies',
            required: false
          }
        }, {
          className: 'form-group col-xs-12',
          key: 'otherAllergies',
          type: 'crdsTextArea',
          templateOptions: {
            label: 'Other Allergies',
            required: false
          }
        }]
      }
    ];
  }

  getModel() {
    return this.formModel;
  }
}

export default MedicalInfoForm;
