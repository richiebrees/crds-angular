/****** Script for SelectTopNRows command from SSMS  ******/

SELECT *
  FROM [MinistryPlatform].[dbo].[Contact_Attributes] ca
  inner join MinistryPlatform.dbo.Attributes a on ca.attribute_id = a.attribute_id and a.Attribute_Type_ID = 65
  inner join MinistryPlatform.dbo.Attribute_Types at on a.attribute_type_id = at.attribute_type_Id
  where Contact_ID = 768379;

SELECT
    (SELECT attribute_name + ','
       FROM dbo.Contact_Attributes ca
	inner join MinistryPlatform.dbo.Attributes a on ca.attribute_id = a.attribute_id and a.Attribute_Type_ID = 65 where ca.contact_id = 768379
        FOR XML PATH(''),type).value('.','nvarchar(max)') AS [ACCOUNT NAMES]

SELECT STUFF(
    (SELECT '|' + attribute_name
       FROM dbo.Contact_Attributes ca
	inner join MinistryPlatform.dbo.Attributes a on ca.attribute_id = a.attribute_id and a.Attribute_Type_ID = 65 where ca.contact_id = 768379
        FOR XML PATH(''),type).value('.','nvarchar(max)'),1,1,'') AS [ACCOUNT NAMES]


