using System;
using System.Collections.Generic;
using System.Linq;
using crds_angular.Exceptions;
using crds_angular.Models.Crossroads.Payment;
using crds_angular.Models.Crossroads.Stewardship;
using crds_angular.Services.Interfaces;
using Crossroads.Utilities;
using Crossroads.Utilities.Interfaces;
using log4net;
using MinistryPlatform.Translation.Exceptions;
using MinistryPlatform.Translation.Models;
using MinistryPlatform.Translation.Models.Payments;
using MinistryPlatform.Translation.Repositories.Interfaces;
using PaymentType = MinistryPlatform.Translation.Enum.PaymentType;

namespace crds_angular.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ILog _logger = LogManager.GetLogger(typeof(DonationService));

        private readonly IInvoiceRepository _invoiceRepository;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IContactRepository _contactRepository;
        private readonly IPaymentTypeRepository _paymentTypeRepository;
        private readonly IEventRepository _eventPRepository;
        private readonly ICommunicationRepository _communicationRepository;
        private readonly IConfigurationWrapper _configWrapper;

        private readonly int _paidinfullStatus;
        private readonly int _somepaidStatus;
        private readonly int _nonePaidStatus;
        private readonly int _defaultPaymentStatus;
        private readonly int _declinedPaymentStatus;
        private readonly int _bankErrorRefundContactId;
        private readonly int _paymentTypeReimbursement;

        public PaymentService(IInvoiceRepository invoiceRepository, 
            IPaymentRepository paymentRepository, 
            IConfigurationWrapper configurationWrapper, 
            IContactRepository contactRepository, 
            IPaymentTypeRepository paymentTypeRepository, 
            IEventRepository eventRepository,
            ICommunicationRepository communicationRepository)
        {
            _invoiceRepository = invoiceRepository;
            _paymentRepository = paymentRepository;
            _contactRepository = contactRepository;
            _paymentTypeRepository = paymentTypeRepository;
            _communicationRepository = communicationRepository;
            _configWrapper = configurationWrapper;
            _eventPRepository = eventRepository;

            _paidinfullStatus = configurationWrapper.GetConfigIntValue("PaidInFull");
            _somepaidStatus = configurationWrapper.GetConfigIntValue("SomePaid");
            _nonePaidStatus = configurationWrapper.GetConfigIntValue("NonePaid");
            _defaultPaymentStatus = configurationWrapper.GetConfigIntValue("DonationStatusPending");
            _declinedPaymentStatus = configurationWrapper.GetConfigIntValue("DonationStatusDeclined");
            _bankErrorRefundContactId = configurationWrapper.GetConfigIntValue("ContactIdForBankErrorRefund");
            _paymentTypeReimbursement = configurationWrapper.GetConfigIntValue("PaymentTypeReimbursement");
        }

        public MpPaymentDetailReturn PostPayment(MpDonationAndDistributionRecord paymentRecord)
        {
            //check if invoice exists
            if (!_invoiceRepository.InvoiceExists(paymentRecord.InvoiceId))
            {
                throw new InvoiceNotFoundException(paymentRecord.InvoiceId);
            }

            //check if contact exists
            if (_contactRepository.GetContactById(paymentRecord.ContactId) == null)
            {
                throw new ContactNotFoundException(paymentRecord.ContactId);
            }

            if (paymentRecord.ProcessorId.Length > 50)
            {
                throw new Exception("Max length of 50 exceeded for transaction code");
            }

            var pymtId = PaymentType.GetPaymentType(paymentRecord.PymtType).id;
            var fee = paymentRecord.FeeAmt.HasValue ? paymentRecord.FeeAmt / Constants.StripeDecimalConversionValue : null;

            //check if payment type exists
            if (!_paymentTypeRepository.PaymentTypeExists(pymtId))
            {
                throw new PaymentTypeNotFoundException(pymtId);
            }            

            //create payment -- send model
            var payment = new MpPayment
            {
                InvoiceNumber = paymentRecord.InvoiceId.ToString(),
                ContactId = paymentRecord.ContactId,
                TransactionCode = paymentRecord.ProcessorId,
                PaymentDate = DateTime.Now,
                PaymentTotal = paymentRecord.DonationAmt,
                PaymentTypeId = pymtId,
                PaymentStatus = _defaultPaymentStatus,
                ProcessorFeeAmount = fee
            };
            var paymentDetail = new MpPaymentDetail
            {
                Payment = payment,
                PaymentAmount = paymentRecord.DonationAmt,
                InvoiceDetailId = _invoiceRepository.GetInvoiceDetailForInvoice(paymentRecord.InvoiceId).InvoiceDetailId
                
            };

            var result = _paymentRepository.CreatePaymentAndDetail(paymentDetail);
            if (result.Status)
            {
                //update invoice payment status
                var invoice = _invoiceRepository.GetInvoice(paymentRecord.InvoiceId);
                var payments = _paymentRepository.GetPaymentsForInvoice(paymentRecord.InvoiceId);
                payments = payments.Where(p => p.PaymentStatus != _declinedPaymentStatus).ToList();
                var paymentTotal = payments.Sum(p => p.PaymentTotal);
            
                _invoiceRepository.SetInvoiceStatus(paymentRecord.InvoiceId, paymentTotal >= invoice.InvoiceTotal ? _paidinfullStatus : _somepaidStatus);
                return result.Value;
            }
            else
            {
                throw new Exception("Unable to save payment data");
            }
        }

        public PaymentDetailDTO GetPaymentDetails(int paymentId, int invoiceId, string token)
        {
            var me = _contactRepository.GetMyProfile(token);
            var invoice = _invoiceRepository.GetInvoice(invoiceId);
            var payments = _paymentRepository.GetPaymentsForInvoice(invoiceId);
            
            var currentPayment = payments.Where(p => p.PaymentId == paymentId && p.ContactId == me.Contact_ID).ToList();

            if (currentPayment.Any() || paymentId == 0)
            {
                var totalPaymentsMade = payments.Sum(p => p.PaymentTotal);
                var leftToPay = invoice.InvoiceTotal - totalPaymentsMade;
                return new PaymentDetailDTO()
                {
                    PaymentAmount = currentPayment.Any() ? currentPayment.First().PaymentTotal : 0M,
                    RecipientEmail = me.Email_Address,
                    TotalToPay = leftToPay,
                    InvoiceTotal = invoice.InvoiceTotal
                };
            }
            throw new Exception("No Payment found for " + me.Email_Address + " with id " + paymentId);
        }


        public DonationBatchDTO CreatePaymentBatch(DonationBatchDTO batch)
        {
            var batchId = _paymentRepository.CreatePaymentBatch(batch.BatchName, batch.SetupDateTime, batch.BatchTotalAmount, batch.ItemCount, batch.BatchEntryType, batch.DepositId, batch.FinalizedDateTime, batch.ProcessorTransferId);

            batch.Id = batchId;

            foreach (var payment in batch.Payments)
            {
                _paymentRepository.AddPaymentToBatch(batchId, payment.PaymentId);
            }

            return (batch);
        }

        public PaymentDTO GetPaymentByTransactionCode(string stripePaymentId)
        {
            try
            {
                var payment = _paymentRepository.GetPaymentByTransactionCode(stripePaymentId);

                return new PaymentDTO
                {
                    Amount = (double) payment.PaymentTotal,
                    ContactId = payment.ContactId,
                    InvoiceId = int.Parse(payment.InvoiceNumber),
                    PaymentId = payment.PaymentId,
                    PaymentTypeId = payment.PaymentTypeId,
                    StripeTransactionId = payment.TransactionCode,
                    BatchId = payment.BatchId
                };
            }
            catch (Exception e)
            {
                throw new PaymentNotFoundException(stripePaymentId);
            }
        }

        public int UpdatePaymentStatus(int paymentId, int statusId, DateTime? statusDate, string statusNote = null)
        {
            var retVal = _paymentRepository.UpdatePaymentStatus(paymentId, statusId);
            if (statusId == _declinedPaymentStatus)
            {
                var invoiceId = _invoiceRepository.GetInvoiceIdForPayment(paymentId);
                UpdateInvoiceStatusAfterDecline(invoiceId);
            }
            return retVal;
        }

        public DonationBatchDTO GetPaymentBatch(int batchId)
        {
            var batch = _paymentRepository.GetPaymentBatch(batchId);
            return new DonationBatchDTO
            {
                Id = batch.BatchId,
                BatchEntryType = batch.BatchEntryTypeId,
                BatchName = batch.BatchName,
                BatchTotalAmount = batch.BatchTotal,
                DepositId = batch.DepositId,
                FinalizedDateTime = batch.FinalizeDate,
                ItemCount = batch.ItemCount,
                ProcessorTransferId = batch.ProcessorTransferId,
                SetupDateTime = batch.SetupDate
            };
        }

        public int? CreatePaymentForBankAccountErrorRefund(StripeRefund refund)
        {
            if (refund.Data[0].BalanceTransaction == null || !"payment_failure_refund".Equals(refund.Data[0].BalanceTransaction.Type))
            {
                _logger.Error($"Balance transaction was not set, or was not a payment_failure_refund for refund ID {refund.Data[0].Id}");
                return (null);
            }

            if (string.IsNullOrWhiteSpace(refund.Data[0].Charge?.Id))
            {
                _logger.Error($"No associated Charge for Refund {refund.Data[0].Id}");
                return (null);
            }

            MpPayment payment;
            try
            {
                payment = _paymentRepository.GetPaymentByTransactionCode(refund.Data[0].Charge.Id);
            }
            catch (PaymentNotFoundException)
            {
                _logger.Error($"No Payment with payment processor ID {refund.Data[0].Charge.Id} in MP for Refund {refund.Data[0].Id}");
                return (null);
            }

            var paymentReverse = new MpPayment
            {
                InvoiceNumber = payment.InvoiceNumber,
                PaymentDate = DateTime.Now,
                PaymentStatus = (int) DonationStatus.Declined,
                ContactId = _bankErrorRefundContactId, 
                ProcessorFeeAmount = refund.Data[0].BalanceTransaction.Fee / Constants.StripeDecimalConversionValue,
                Notes = "Payment created for Stripe Refund",
                PaymentTypeId = _paymentTypeReimbursement,
                TransactionCode = refund.Data[0].Id,
                PaymentTotal = -(int.Parse(refund.Data[0].Amount) / Constants.StripeDecimalConversionValue),
                BatchId = payment.BatchId
            };

            var invoicedetail = _invoiceRepository.GetInvoiceDetailForInvoice(Convert.ToInt32(payment.InvoiceNumber));

            var detail = new MpPaymentDetail
            {
                PaymentAmount = -(int.Parse(refund.Data[0].Amount)/Constants.StripeDecimalConversionValue),
                InvoiceDetailId = invoicedetail.InvoiceDetailId,
                Payment = paymentReverse
            };
            
            return (_paymentRepository.CreatePaymentAndDetail(detail).Value.PaymentId);
        }

        public void UpdateInvoiceStatusAfterDecline(int invoiceId)
        {
            var payments = _paymentRepository.GetPaymentsForInvoice(invoiceId);
            payments = payments.Where(p => p.PaymentStatus != _declinedPaymentStatus).ToList();
            var paymentTotal = payments.Sum(p => p.PaymentTotal);

            _invoiceRepository.SetInvoiceStatus(invoiceId, paymentTotal > 0 ? _somepaidStatus : _nonePaidStatus);
        }

        public bool DepositExists(int invoiceId, string token)
        {
            var me = _contactRepository.GetMyProfile(token);
            var payments = _paymentRepository.GetPaymentsForInvoice(invoiceId);
            payments = payments.Where(p => p.ContactId == me.Contact_ID).ToList();
            return payments.Any();
        }

        public void SendPaymentConfirmation(int paymentId , int eventId , string token )
        {
            var payment = _paymentRepository.GetPaymentById(paymentId);
            var mpEvent = _eventPRepository.GetEvent(eventId);
            var me = _contactRepository.GetMyProfile(token);

            var templateIdResult = _eventPRepository.GetProductEmailTemplate(eventId);
            var templateId = (templateIdResult.Status) ? templateIdResult.Value : _configWrapper.GetConfigIntValue("DefaultPaymentEmailTemplate");
            var mergeData = new Dictionary<string, object>
            {
                {"Event_Title", mpEvent.EventTitle},
                {"Payment_Total", payment.PaymentTotal.ToString(".00") },
                {"Primary_Contact_Email", mpEvent.PrimaryContact.EmailAddress },
                {"Primary_Contact_Display_Name", mpEvent.PrimaryContact.PreferredName},
                {"Base_Url", _configWrapper.GetConfigValue("BaseUrl") }
            };

            var comm = _communicationRepository.GetTemplateAsCommunication(templateId,
                                                                mpEvent.PrimaryContactId,
                                                                mpEvent.PrimaryContact.EmailAddress,
                                                                mpEvent.PrimaryContactId,
                                                                mpEvent.PrimaryContact.EmailAddress,
                                                                me.Contact_ID,
                                                                me.Email_Address,
                                                                mergeData);
            _communicationRepository.SendMessage(comm);
        }
    }
}
