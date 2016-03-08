USE [MinistryPlatform]
GO

IF EXISTS(SELECT * FROM sys.columns WHERE Name = N'Open_Signup' AND Object_ID = Object_ID(N'cr_Organizations'))
BEGIN
EXEC sys.sp_updateextendedproperty @name=N'MS_Description', @value=N'Allow other Organizations to participate in this Organization''s Intitatives' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'cr_Organizations', @level2type=N'COLUMN',@level2name=N'Open_Signup'
END
