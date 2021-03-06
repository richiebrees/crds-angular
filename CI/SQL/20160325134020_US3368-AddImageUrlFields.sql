USE [MinistryPlatform]
GO

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE  TABLE_NAME = 'cr_Project_Types' AND COLUMN_NAME = 'Image_URL')
	BEGIN
		ALTER TABLE [dbo].[cr_Project_Types]
		ADD Image_URL nvarchar(255) null;
	END

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE  TABLE_NAME = 'Locations' AND COLUMN_NAME = 'Image_URL')
	BEGIN
		ALTER TABLE [dbo].[Locations]
		ADD Image_URL nvarchar(255) null;
	END