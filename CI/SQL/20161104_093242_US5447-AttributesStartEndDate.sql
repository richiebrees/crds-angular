USE [MinistryPlatform]
GO

BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT

IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'Start_Date' AND Object_ID = Object_ID(N'Attributes'))
BEGIN

BEGIN TRANSACTION
ALTER TABLE dbo.Attributes ADD
	Start_Date datetime NULL,
	End_Date datetime NULL
COMMIT
END
