USE [MinistryPlatform]
GO

UPDATE [dbo].[dp_Reports]
   SET [Report_Path] = '/MPReports/Crossroads/CRDSChildcareSummary' 
 Where Report_Name = 'Childcare Summary'
GO