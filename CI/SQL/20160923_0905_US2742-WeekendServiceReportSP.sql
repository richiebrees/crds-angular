USE [MinistryPlatform]
GO

/****** Object:  StoredProcedure [dbo].[report_filter_groups_cong_Crossroads]    Script Date: 9/16/2016 6:03:15 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[report_filter_groups_cong_Crossroadst]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[report_filter_groups_cong_Crossroads]
GO


/****** Object:  StoredProcedure [dbo].[report_weekend_service_Crossroads]    Script Date: 9/16/2016 6:03:15 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[report_weekend_service_Crossroad]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[report_weekend_service_Crossroads]
GO


/****** Object:  StoredProcedure [dbo].[report_filter_groups_cong_Crossroads]    Script Date: 9/16/2016 5:37:42 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[report_filter_groups_cong_Crossroads]

	@DomainID varchar(40)
	,@UserID varchar(40)
	,@PageID Int
	,@GroupTypeID INT = NULL
	,@Congregation VARCHAR(MAX) = '0'

AS
BEGIN

SELECT G.Group_Name, G.Group_ID
FROM Groups G
 INNER JOIN dp_Domains ON dp_Domains.Domain_ID = G.Domain_ID

WHERE dp_Domains.Domain_GUID = @DomainID
 AND G.Group_Type_ID = ISNULL(@GroupTypeID, G.Group_Type_ID)
 AND CAST(GETDATE() AS DATE) BETWEEN CAST(G.Start_Date AS DATE) AND CAST(ISNULL(G.End_Date,GETDATE()) AS DATE) 
 AND (G.Congregation_ID IN (SELECT * FROM dp_Split(@Congregation, ',')) OR ISNULL(@Congregation,'0') = '0')
 AND G.Group_Name LIKE 'KC%'


END

/****** Object:  StoredProcedure [dbo].[report_weekend_service_Crossroads]    Script Date: 9/16/2016 5:34:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[report_weekend_service_Crossroads](
	@DomainID VARCHAR(40)
	,@UserID VARCHAR(40)
	,@PageID INT
	,@FromDate DATETIME
	,@ToDate DATETIME
	,@Congregation NVARCHAR(MAX)='0'
	,@NumOfColumns INT = 6
	,@NumOfRows INT = 26
	,@Groups NVARCHAR(MAX)='0'
	)
AS
/*declare 	@DomainID VARCHAR(40) = '0FDE7F32-37E3-4E0B-B020-622E0EBD6BF0'
	,@UserID VARCHAR(40) = 'DDADDBCB-8823-4F06-9250-6B245FA82755'
	,@PageID INT = 309
	,@FromDate DATETIME='2016-06-01'
	,@ToDate DATETIME = '2016-06-30'
	,@Congregation NVARCHAR(MAX)='1,2,3,4,5,6,7'

	--*/



/**** Get Congregations ****/
CREATE TABLE #Congregations (Congregation_ID INT)
INSERT  #Congregations (Congregation_ID)
        SELECT CAST(Item AS INT) FROM dp_Split(@Congregation, ',')
		UNION
		SELECT Congregation_ID FROM Congregations WHERE ISNULL(@Congregation,'0') = '0'

/**** Get Groups ****/
CREATE TABLE #G (Group_ID INT, Group_Name NVARCHAR(75))
INSERT  #G (Group_ID,Group_Name)
        SELECT CAST(Item AS INT),G.Group_Name FROM dp_Split(@Groups, ',') SG INNER JOIN Groups G ON CAST(Item AS INT) = G.Group_ID
		UNION
		SELECT Group_ID,Group_Name FROM Groups WHERE ISNULL(@Groups,'0') = '0'

SELECT E.Event_ID
	, E.Event_Title
	, E.Event_Start_Date
	, ET.Event_Type_Id
	, ET.Event_Type
	, G.Group_Name
	, O.Opportunity_Title
	, O.Program_ID
	, C.Contact_ID
	, RTRIM(COALESCE(C.Nickname + ' ','') +  COALESCE(C.Last_Name + ' ', '')) + CASE WHEN (SELECT DATEDIFF(HOUR,  C.Date_of_Birth, GETDATE())/8766) < 18 THEN ' (SV)' ELSE '' END AS FULLNAME
	, C.Nickname
	, C.Last_Name
	, C.Date_of_Birth
	, O.Opportunity_ID
    , ISNULL(O.Maximum_Needed,0) Max_Needed
    , ISNULL(O.Minimum_Needed,0) Min_Needed
    , O.Shift_Start
    , O.Shift_End
    , O.Room
    , G.Group_ID
    , Con.Congregation_Name
	, R.Response_ID
	, R.Response_Date
	, RowNum = ROW_NUMBER() OVER (PARTITION BY O.Opportunity_ID, E.Event_ID ORDER BY E.Event_ID,R.Response_Date)
	, Position = 'MAX'
	, DisplayColumn = CAST(0 AS INT)
INTO #ReportData
  FROM #G G
  INNER JOIN Opportunities O ON G.Group_ID = O.Add_to_Group AND O.Group_Role_ID IN (16,22)
  INNER JOIN Event_Types ET ON O.Event_Type_ID = ET.Event_Type_ID
  INNER JOIN Events E ON E.Event_Type_ID = ET.Event_Type_ID
  INNER JOIN #Congregations Cong ON Cong.Congregation_ID = E.Congregation_ID
  INNER JOIN Congregations Con ON Cong.Congregation_ID = Con.Congregation_ID
  LEFT JOIN Responses R ON R.Opportunity_ID = O.Opportunity_ID AND R.Event_ID = E.Event_ID AND R.response_result_id=1
  LEFT JOIN Participants P ON P.Participant_ID = R.Participant_ID
  LEFT JOIN Contacts C ON C.Contact_ID = P.Contact_ID
  WHERE CAST(Event_Start_Date AS DATE) BETWEEN CAST(@FromDate AS DATE) AND CAST(@ToDate AS DATE)
  ORDER BY E.Event_Start_Date, O.Opportunity_Title, C.Last_Name 
 
  --ADD PLACEHOLDER FOR NO VOLUNTEER
  
SELECT NumPosToAdd = Max_Needed - ISNULL((SELECT MAX(RowNum) FROM #ReportData RD WHERE #ReportData.Opportunity_ID = RD.Opportunity_ID AND #ReportData.Event_ID = RD.Event_ID),0)
	, Event_ID
	, Event_Title
	, Event_Start_Date
	, Event_Type_Id
	, Event_Type
	, Group_Name
	, Opportunity_Title
	, Program_ID
	, Opportunity_ID
    , Max_Needed
    , Min_Needed
    , Shift_Start
    , Shift_End
    , Room
    , Group_ID
    , Congregation_Name
INTO #AddPos
FROM #ReportData 
WHERE Max_Needed > ISNULL((SELECT MAX(RowNum) FROM #ReportData RD WHERE #ReportData.Opportunity_ID = RD.Opportunity_ID AND #ReportData.Event_ID = RD.Event_ID),0)
GROUP BY  Event_ID
	, Event_Title
	, Event_Start_Date
	, Event_Type_Id
	, Event_Type
	, Group_Name
	, Opportunity_Title
	, Program_ID
	, Opportunity_ID
    , Max_Needed
    , Min_Needed
    , Shift_Start
    , Shift_End
    , Room
    , Group_ID
    , Congregation_Name

DECLARE @i INT = 1
		,@NumPos INT = (SELECT MAX(NumPosToAdd) from #AddPos)+1

WHILE @i < @NumPos
BEGIN
 INSERT INTO #ReportData
			(Event_ID
			, Event_Title
			, Event_Start_Date
			, Event_Type_Id
			, Event_Type
			, Group_Name
			, Opportunity_Title
			, Program_ID
			, Contact_ID
			, FULLNAME
			, Nickname
			, Last_Name
			, Date_of_Birth
			, Opportunity_ID
			, Max_Needed
			, Min_Needed
			, Shift_Start
			, Shift_End
			, Room
			, Group_ID
			, Congregation_Name
			, Response_ID
			, Response_Date
			, RowNum
			, Position
			, DisplayColumn
			)
		SELECT Event_ID
			, Event_Title
			, Event_Start_Date
			, Event_Type_Id
			, Event_Type
			, Group_Name
			, Opportunity_Title
			, Program_ID
			, 0
			, ''
			, ''
			, ''
			, NULL
			, Opportunity_ID
			, Max_Needed
			, Min_Needed
			, Shift_Start
			, Shift_End
			, Room
			, Group_ID
			, Congregation_Name
			, 0
			, NULL
			, (Max_Needed + 1) - @i
			, 'MAX'
			, 0
		FROM #AddPos
		WHERE NumPosToAdd >= @i

 SET @i= @i + 1
END	



  UPDATE RD
  SET Position = 'MIN'
  FROM #ReportData RD
  WHERE RowNum <= Min_Needed

  UPDATE #ReportData
  SET DisplayColumn =  RD.DC
  FROM #ReportData
  INNER JOIN (SELECT Event_Type_ID,Event_ID,Group_Name
							,DC = (ROW_NUMBER() OVER (PARTITION BY Event_Type_ID,Event_ID ORDER BY Event_Type_ID,Event_ID,Group_Name) + @NumOfColumns - 1) % @NumOfColumns + 1 
						FROM #ReportData 
						GROUP BY Event_Type_ID,Event_ID,Group_Name
						) RD ON #ReportData.Event_Type_ID = RD.Event_Type_ID 
							AND #ReportData.Event_ID = RD.Event_ID
							AND #ReportData.Group_Name = RD.Group_Name
					
					



  SELECT Event_ID
			, Event_Title
			, Event_Start_Date
			, Event_Type_Id
			, Event_Type
			, Group_Name
			, Opportunity_Title
			, Program_ID
			, Contact_ID
			, FULLNAME
			, Nickname
			, Last_Name
			, Date_of_Birth
			, Opportunity_ID
			, Max_Needed
			, Min_Needed
			, Shift_Start
			, Shift_End
			, Room
			, Group_ID
			, Congregation_Name
			, Response_ID
			, Response_Date
			, RowNum
			, Position
			, DisplayColumn
			, DisplayRow = (ROW_NUMBER() OVER (PARTITION BY Event_Type ORDER BY Event_Type,DisplayColumn,Opportunity_Title, RowNum) + @NumOfRows - 1) % @NumOfRows + 1 
	FROM #ReportData
	ORDER BY Event_Type, Event_Start_Date, Group_Name, Opportunity_Title, RowNum, DisplayColumn

	DROP TABLE #Congregations
	DROP TABLE #G
	DROP TABLE #AddPos
	DROP TABLE #ReportData
	GO

