
USE MinistryPlatform
GO

DECLARE @ReportName Varchar(50)
SET @ReportName = 'Weekend Service Crossroads'

	IF NOT EXISTS (SELECT 1 FROM dp_Reports WHERE Report_Name = @ReportName)
	BEGIN
		DECLARE	@return_value int

		EXEC	@return_value = [dbo].[util_CreateMPReport]
				@DomainID = 1,
				@ReportName = @ReportName,
				@ReportDescription = N'Provides a Weekend Service report by Event Type, Event Start Date, Group Name, and Opportunity Title of the volunteers.',
				@ReportPath = N'/MPReports/Crossroads/Weekend Service Crossroads',
				@PassSelected = 0,
				@PassLinkTo = 0,
				@OnReports = 0,
				@SelectedContactReport = 0,
				@SinglePageDisplayName = N'Groups',
				@BasicReport = 0,
				@RoleToGrantReport = 'Staff - CRDS'

		SELECT	'Return Value' = @return_value
	END

	ELSE
	BEGIN
		PRINT @ReportName + ' Already Exists'
	END
GO


select * from dp_reports