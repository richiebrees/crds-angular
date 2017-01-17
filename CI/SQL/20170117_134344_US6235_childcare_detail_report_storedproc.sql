USE [MinistryPlatform]
GO
/****** Object:  StoredProcedure [dbo].[report_CRDS_Childcare_Detail]    Script Date: 1/17/2017 10:48:29 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[report_CRDS_Childcare_Detail]

      @StartDate DATETIME,
	  @EndDate DATETIME,
	  @CongregationId INT
AS
    BEGIN
        SET NOCOUNT ON;
		SET @StartDate =  DATEADD(day, DATEDIFF(day, 0, @StartDate), '00:00:00');
		SET @EndDate =  DATEADD(day, DATEDIFF(day, 0, @EndDate), '23:59:00');

		SELECT  g.Group_Name,     
		        e.Event_Start_Date  EventDate, 
				e.Event_Start_Date  StartTime, 
				e.Event_End_Date EndTime, 
				parentscontact.Display_Name as 'GroupMemberName',
				childcontact.Display_name as 'ChildName',
				childcontact.__Age Age, 
				childcontact.Date_of_Birth,
				gradeg.Group_Name GradeGroup,
				childgp.Start_Date GroupParticipantStartDate,
				IIF(ep.Event_Participant_ID IS NOT NULL, 'Yes', 'No') AS 'Checkin'
		FROM dbo.Events e
		JOIN Event_Groups eg ON e.Event_ID = eg.Event_ID
		JOIN Group_Participants childgp ON childgp.Group_ID = eg.Group_ID 
		JOIN Group_Participants parentgp ON parentgp.Group_Participant_ID = childgp.Enrolled_By
		JOIN Groups g ON g.Group_ID = parentgp.Group_ID
		JOIN Participants p ON p.Participant_ID = childgp.Participant_ID
		JOIN Contacts childcontact ON childcontact.Contact_ID = p.Contact_ID
		JOIN Group_Participants gradegp ON gradegp.Participant_ID = p.Participant_ID AND gradegp.Group_ID IN (Select Group_ID from groups where Group_Type_ID = 4)
		JOIN Groups gradeg ON gradeg.Group_ID = gradegp.Group_ID
		JOIN Participants parentsparticipant ON parentsparticipant.Participant_ID = parentgp.Participant_ID
		JOIN Contacts parentscontact ON parentscontact.Contact_ID = parentsparticipant.Contact_ID
		JOIN Event_Participants ep on ep.Event_ID = e.Event_ID AND ep.Participant_ID = p.Participant_ID AND ep.Participation_Status_ID in (3, 4)
		WHERE (e.Event_Type_ID = 243
			AND e.Event_Start_Date BETWEEN @StartDate AND @EndDate
			AND e.Congregation_ID = @CongregationId
			AND childgp.End_Date is null)

		--UNION ALL

		--SELECT '' AS Group_Name, e.Event_Start_Date AS EventDate, e.Event_Start_Date AS StartTime, e.Event_End_Date AS EndTime, '' AS GroupMemberName, c.Display_name AS ChildName, c.__Age AS AGE, c.Date_of_Birth, 'No' AS 'RSVP Status', 'Yes' AS 'Checked In' FROM dbo.cr_Echeck_Registrations
		--	JOIN Contacts c ON c.Contact_ID = Child_ID
		--	JOIN Events e ON CONVERT(date, Checkin_Date) = CONVERT(date, e.Event_Start_Date) AND CONVERT(time, e.Event_Start_Date) = CONVERT(time, Service_Time) AND e.Cancelled != 1
		--	JOIN Congregations con ON con.Congregation_ID = e.Congregation_ID 
		--	WHERE e.Event_Type_ID = 243 
		--		AND Service_Day != 'Saturday'
		--		AND Service_Day != 'Sunday'
		--		AND e.Event_Start_Date BETWEEN @StartDate AND @EndDate
		--		AND e.Congregation_ID = @CongregationId
		--		AND con.Congregation_Name = Building_Name
		--		AND Child_ID NOT IN (SELECT Contact_ID FROM Group_Participants gp
		--			JOIN Event_Groups eg ON gp.Group_ID = eg.Group_ID
		--			JOIN Groups g ON g.Group_ID = gp.Group_ID
		--			JOIN Participants p ON gp.Participant_ID = p.Participant_ID
		--			WHERE g.Group_Type_ID = 27
		--			AND gp.End_Date IS NULL
		--			AND eg.Event_ID = e.Event_ID)
				
		ORDER BY e.Event_Start_Date, g.Group_name, childcontact.__Age
    END;




