/****** Script for SelectTopNRows command from SSMS  ******/
SELECT TOP 1000 [Report_ID]
      ,[Report_Name]
      ,[Description]
      ,[Report_Path]
      ,[Pass_Selected_Records]
      ,[Pass_LinkTo_Records]
      ,[On_Reports_Tab]
  FROM [MinistryPlatform].[dbo].[dp_Reports] Where Report_Name = 'Childcare Summary'
