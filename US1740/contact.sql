/****** Script for SelectTopNRows command from SSMS  ******/
--/*
USE MinistryPlatform

DECLARE @ContactId INT = 768379
DECLARE @TShirtSize INT = 21
DECLARE @ScrubSizeTop INT = 22
DECLARE @ScrubSizeBottom INT = 23
DECLARE @DietaryRestrictions INT = 65
DECLARE @Allergies INT = 67
DECLARE @SpritualLife INT = 60
DECLARE @PreviousTripExperience INT = 62
DECLARE @Profession INT = 61
DECLARE @FrequentFlyerDelta INT = 3958
DECLARE @FrequentFlyerSouthAfrica INT = 3959
DECLARE @FrequentFlyerUnited INT = 3960
DECLARE @FrequentFlyerUsAir INT = 3980
DECLARE @InternationalTravelExperience INT = 66
DECLARE @ExperienceServingAbroad INT = 68
DECLARE @AbuseVictim INT = 69
DECLARE @Why INT = 1434
DECLARE @EmergencyContactFirstName INT = 1439
DECLARE @EmergencyContactLastName INT = 1440
DECLARE @EmergencyContactPrimaryPhone INT = 1441
DECLARE @EmergencyContactSecondaryPhone INT = 1442
DECLARE @EmergencyContactEmailAddress INT = 1443
DECLARE @LotteryPreference INT = 1444
DECLARE @CommonName INT = 1445
DECLARE @RequestedRoommate1 INT = 1446
DECLARE @RequestedRoommate2 INT = 1447
DECLARE @SupportPersonEmail INT = 1448
DECLARE @GoGroupLeaderInterest INT = 1449
DECLARE @TripGuardianFirstName INT = 1426
DECLARE @TripGuardianLastName INT = 1427
DECLARE @HowDidYouHearAboutTrip INT = 1433
DECLARE @MedicalConditions INT = 1432
DECLARE @WorkTeamPreference1 INT = 1423
DECLARE @WorkTeamPreference2 INT = 1425
DECLARE @WorkTeamExperience INT = 1424

SELECT c.First_Name, c.Middle_Name, c.Last_Name, c.Maiden_Name, c.Nickname, c.Email_Address, 
c.Date_of_Birth,
ms.Marital_Status,
g.Gender,
c.Employer_Name, p._First_Attendance_Ever, c.Mobile_Phone,
a.Address_Line_1, a.Address_Line_2, a.City, a.[State/Region], a.Postal_Code, a.County, a.Foreign_Country, h.Home_Phone,
cn.Congregation_Name
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @TripGuardianFirstName and r.Form_Response_ID = fr.Form_Response_ID) TripGuardianFirstName
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @TripGuardianLastName and r.Form_Response_ID = fr.Form_Response_ID) TripGuardianLastName
, (SELECT Attribute_Name FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_Type_ID = @TShirtSize) as TShirtSize
, (SELECT Attribute_Name FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_Type_ID = @ScrubSizeTop) as ScrubSizeTop
, (SELECT Attribute_Name FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_Type_ID = @ScrubSizeBottom) as ScrubSizeBottom
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @ScrubSizeTop and r.Form_Response_ID = fr.Form_Response_ID) ScrubSizeTop
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @ScrubSizeBottom and r.Form_Response_ID = fr.Form_Response_ID) ScrubSizeBottom
, (SELECT STUFF((
    SELECT '|'+attribute_name
    FROM dbo.vw_crds_Contact_Single_Select_Attributes AS ca
    WHERE ca.contact_id=c.Contact_ID and ca.Attribute_Type_ID = @DietaryRestrictions
    FOR XML PATH(''), TYPE).value('.', 'nvarchar(max)'), 1, 1, '')) AS Dietary_Restrictions
, (SELECT Notes FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_Type_ID = @Allergies) as Allergies
, (SELECT STUFF((
    SELECT '|'+attribute_name
    FROM dbo.vw_crds_Contact_Single_Select_Attributes AS ca
    WHERE ca.contact_id=c.Contact_ID and ca.Attribute_Type_ID = @SpritualLife
    FOR XML PATH(''), TYPE).value('.', 'nvarchar(max)'), 1, 1, '')) AS Spritual_Life
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @Why and r.Form_Response_ID = fr.Form_Response_ID) WhyGoOnTrip
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @EmergencyContactFirstName and r.Form_Response_ID = fr.Form_Response_ID) EmergencyContactFirstName
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @EmergencyContactLastName and r.Form_Response_ID = fr.Form_Response_ID) EmergencyContactLastName
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @EmergencyContactPrimaryPhone and r.Form_Response_ID = fr.Form_Response_ID) EmergencyContactPrimaryPhone
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @EmergencyContactSecondaryPhone and r.Form_Response_ID = fr.Form_Response_ID) EmergencyContactPrimaryPhone
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @EmergencyContactEmailAddress and r.Form_Response_ID = fr.Form_Response_ID) EmergencyContactEmailAddress
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @LotteryPreference and r.Form_Response_ID = fr.Form_Response_ID) LotteryPreference
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @CommonName and r.Form_Response_ID = fr.Form_Response_ID) CommonName
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @RequestedRoommate1 and r.Form_Response_ID = fr.Form_Response_ID) RequestedRoommate1
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @RequestedRoommate2 and r.Form_Response_ID = fr.Form_Response_ID) RequestedRoommate2
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @SupportPersonEmail and r.Form_Response_ID = fr.Form_Response_ID) SupportPersonEmail
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @GoGroupLeaderInterest and r.Form_Response_ID = fr.Form_Response_ID) GoGroupLeaderInterest

, (SELECT Notes FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_Type_ID = @PreviousTripExperience) as Previous_Trip_Experience
, (SELECT STUFF((
    SELECT '|'+attribute_name
    FROM dbo.vw_crds_Contact_Single_Select_Attributes AS ca
    WHERE ca.contact_id=c.Contact_ID and ca.Attribute_Type_ID = @Profession
    FOR XML PATH(''), TYPE).value('.', 'nvarchar(max)'), 1, 1, '')) AS Profession
, (SELECT Notes FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_ID = @FrequentFlyerDelta) as FF_Delta
, (SELECT Notes FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_ID = @FrequentFlyerSouthAfrica) as FF_South_African_Airlines
, (SELECT Notes FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_ID = @FrequentFlyerUnited) as FF_United
, (SELECT Notes FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_ID = @FrequentFlyerUsAir) as FF_USAir
, (SELECT Attribute_Name FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_Type_ID = @InternationalTravelExperience) as International_Travel_Experience
, (SELECT Notes FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_Type_ID = @ExperienceServingAbroad) as Experience_Serving_Abroad
, (CONVERT(VARCHAR(10), fr.Response_Date, 101)) SignUpDate
, (SELECT Attribute_Name FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_Type_ID = @AbuseVictim) as Abuse_Victim
, 'need to find...' PreviousTrips
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @WorkTeamPreference1 and r.Form_Response_ID = fr.Form_Response_ID) WorkTeamPreference1
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @WorkTeamPreference2 and r.Form_Response_ID = fr.Form_Response_ID) WorkTeamPreference2
, (SELECT Response FROM [MinistryPlatform].[dbo].[Form_Response_Answers] r where r.Form_Field_ID = @WorkTeamExperience and r.Form_Response_ID = fr.Form_Response_ID) WorkTeamExperience
FROM [MinistryPlatform].[dbo].[Event_Participants] ep
  inner join dbo.Participants p on ep.participant_id = p.participant_id --and p.contact_id = 768379
  inner join dbo.Pledge_Campaigns pc on ep.Event_ID = pc.Event_ID
  inner join dbo.Form_Responses fr on p.Contact_ID = fr.Contact_ID and pc.Pledge_Campaign_ID = fr.Pledge_Campaign_ID
inner join dbo.Contacts c on p.Contact_ID = c.Contact_ID
INNER JOIN Households h on c.Household_ID = h.Household_ID
INNER JOIN Addresses a on h.Address_ID = a.Address_ID
--INNER JOIN Participants p on c.Participant_Record = p.Participant_ID
INNER JOIN Congregations cn on h.Congregation_ID = cn.Congregation_ID
INNER JOIN Genders g on c.Gender_ID = g.Gender_ID
INNER JOIN Marital_Statuses ms on c.Marital_Status_ID = ms.Marital_Status_ID
where ep.Event_ID = 1599781