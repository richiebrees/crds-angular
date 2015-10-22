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

SELECT c.First_Name, c.Middle_Name, c.Last_Name, c.Maiden_Name, c.Nickname, c.Email_Address, 
c.Date_of_Birth,
ms.Marital_Status,
g.Gender,
c.Employer_Name, p._First_Attendance_Ever, c.Mobile_Phone,
a.Address_Line_1, a.Address_Line_2, a.City, a.[State/Region], a.Postal_Code, a.County, a.Foreign_Country, h.Home_Phone,
cn.Congregation_Name
, (SELECT Attribute_Name FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_Type_ID = @TShirtSize) as TShirtSize
, (SELECT Attribute_Name FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_Type_ID = @ScrubSizeTop) as ScrubSizeTop
, (SELECT Attribute_Name FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_Type_ID = @ScrubSizeBottom) as ScrubSizeBottom
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
, (SELECT Attribute_Name FROM vw_crds_Contact_Single_Select_Attributes where Contact_ID = c.Contact_ID and Attribute_Type_ID = @AbuseVictim) as Abuse_Victim
FROM Contacts c
INNER JOIN Households h on c.Household_ID = h.Household_ID
INNER JOIN Addresses a on h.Address_ID = a.Address_ID
INNER JOIN Participants p on c.Participant_Record = p.Participant_ID
INNER JOIN Congregations cn on h.Congregation_ID = cn.Congregation_ID
INNER JOIN Genders g on c.Gender_ID = g.Gender_ID
INNER JOIN Marital_Statuses ms on c.Marital_Status_ID = ms.Marital_Status_ID
where c.Contact_ID = @ContactId