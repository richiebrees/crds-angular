USE [MinistryPlatform]
GO

/****** Object:  StoredProcedure [dbo].[report_CRDS_Childcare_Summary]    Script Date: 2/8/2017 2:59:29 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[report_CRDS_Childcare_Summary]') AND type in (N'P', N'PC'))
BEGIN
EXEC dbo.sp_executesql @statement = N'


ALTER PROCEDURE [dbo].[report_CRDS_Childcare_Summary]

      @StartDate DATETIME,
	  @EndDate DATETIME,
	  @CongregationId INT

AS
    BEGIN
        SET NOCOUNT ON;
		SET @StartDate =  DATEADD(day, DATEDIFF(day, 0, @StartDate), ''00:00:00'');
		SET @EndDate =  DATEADD(day, DATEDIFF(day, 0, @EndDate), ''23:59:00'');
		
		DECLARE @AGE_GROUP_TYPE_ID int = 4;
		
		DECLARE @ChildcareSummary TABLE
		(
			Group_Name varchar(255),
			EventDate datetime,
			StartTime datetime, 
			EndTime datetime,
			ParticipantID int,
			Age nvarchar(200),
			RSVP int,
			Checkin int,
			RSVPOnline int,
			RSVPOverride int
		)

		BEGIN		
			INSERT INTO @ChildcareSummary
				SELECT  g.Group_Name Group_Name,  
					e.Event_Start_Date  EventDate, 
					e.Event_Start_Date  StartTime, 
					e.Event_End_Date EndTime, 
					p.Participant_ID ParticipantID,
					'''' as Age,
					1 AS ''RSVP'',
					IIF(ep.Event_Participant_ID IS NOT NULL, 1, 0) AS ''Checkin'',
					IIF(childgp.[Start_Date] <= DATEADD(day, -6, CONVERT(DATE, e.Event_Start_Date, 101)), 1, 0) AS ''RSVPOnline'',
					IIF(childgp.[Start_Date] > DATEADD(day, -6, CONVERT(DATE, e.Event_Start_Date, 101)), 1, 0) AS ''RSVPOverride''
				FROM dbo.Events e
				JOIN Event_Groups eg ON e.Event_ID = eg.Event_ID
				JOIN Group_Participants childgp ON childgp.Group_ID = eg.Group_ID 
				JOIN Group_Participants parentgp ON parentgp.Group_Participant_ID = childgp.Enrolled_By
				JOIN Groups g ON g.Group_ID = parentgp.Group_ID
				JOIN Participants p ON p.Participant_ID = childgp.Participant_ID
				JOIN Contacts c on c.Contact_ID = p.Contact_ID		
				LEFT JOIN Event_Participants ep on ep.Event_ID = e.Event_ID AND ep.Participant_ID = p.Participant_ID AND ep.Participation_Status_ID in (3, 4) 
				LEFT JOIN cr_Echeck_Registrations er ON er.Child_ID = c.Contact_ID AND CONVERT(date, er.Checkin_Date) = CONVERT(date, e.Event_Start_Date) AND CONVERT(time, e.Event_Start_Date) = CONVERT(time, er.Service_Time)
				WHERE e.Event_Type_ID = 243
					AND e.Event_Start_Date BETWEEN @StartDate AND @EndDate
					AND e.Congregation_ID = @CongregationId
					AND childgp.End_Date is null
					-- AND childgp.[Start_Date] <= DATEADD(day, -6, CONVERT(DATE, e.Event_Start_Date, 101))

		END

		BEGIN
			INSERT INTO @ChildcareSummary
				SELECT '''' AS Group_Name, 
					e.Event_Start_Date AS EventDate, 
					e.Event_Start_Date AS StartTime, 
					e.Event_End_Date AS EndTime, 
					p.Participant_ID ParticipantID,
					'''' AS Age, 
					0 AS ''RSVP'', 
					1 AS ''Checkin'',
					0 AS ''RSVPOnline'',
					1 AS ''RSVPOverride''
				FROM dbo.Event_Participants ep
				JOIN Participants p on p.Participant_ID = ep.Participant_ID AND ep.Participation_Status_ID in (3, 4) 
				JOIN Contacts c ON c.Contact_ID = p.Contact_ID
				JOIN Events e ON e.Event_ID = ep.Event_ID		
				WHERE e.Event_Type_ID = 243 
					AND e.Event_Start_Date BETWEEN @StartDate AND @EndDate
					AND e.Congregation_ID = @CongregationId
					AND e.Congregation_ID = @CongregationId
					AND c.Contact_ID NOT IN (SELECT Contact_ID FROM Group_Participants gp
						JOIN Event_Groups eg ON gp.Group_ID = eg.Group_ID
						JOIN Groups g ON g.Group_ID = gp.Group_ID
						JOIN Participants p ON gp.Participant_ID = p.Participant_ID
						WHERE g.Group_Type_ID = 27
						AND gp.End_Date IS NULL
						AND eg.Event_ID = e.Event_ID)
		END

		DECLARE @participantid int
		DECLARE cur CURSOR FOR SELECT ParticipantID FROM @ChildcareSummary
		OPEN cur
		FETCH NEXT FROM cur INTO @participantid
		WHILE @@FETCH_STATUS = 0 BEGIN
		   -- get age group for participant and update current row
		   DECLARE @groupname nvarchar(200) = null;
		   SELECT TOP 1 @groupname = g.Group_Name FROM Groups g
		   JOIN Group_Participants gp on g.Group_ID = gp.Group_ID AND gp.Participant_ID = @participantid
		   WHERE g.Group_Type_ID = @AGE_GROUP_TYPE_ID
		   AND ( @StartDate between gp.Start_Date and gp.End_Date
					OR 
				 @StartDate >= gp.Start_Date )
			ORDER BY gp.Start_Date ASC

		   UPDATE @ChildcareSummary SET [Age] = @groupname where ParticipantID = @participantid

		   FETCH NEXT FROM cur INTO @participantid
		END

		CLOSE cur    
		DEALLOCATE cur

		SELECT Group_Name,
			EventDate,
			StartTime, 
			EndTime,
			Age,
			sum(RSVP) AS ''Total RSVP'',
			sum(Checkin) AS ''Total Check In'',
			sum(RSVPOnline) AS ''Rsvp Online'',
			sum(RSVPOverride) AS ''Rsvp Override''
		FROM @ChildcareSummary
		GROUP BY Group_Name, EventDate, StartTime, EndTime, Age
		ORDER BY EventDate,Group_name, Age
    END;
' 
END
GO


