USE [MinistryPlatform]
GO

declare @toolids table (id int);
declare @ToolName varchar(30) = 'KC Applicant Form'
declare @LaunchPage varchar(100) = 'http://demo.crossroads.net/#/mptools/kcapplicant'
declare @Description varchar(50) = 'Fill out the KC Application for a user'
declare @ToolId int

declare @PageToolAppearsOn int = 292 -- Contacts Page
declare @Role int = 60 -- Group Leader (Is this the right role?)

/* Integration Environment */
IF EXISTS (
  SELECT 1
  FROM [dbo].[dp_Tools]
  WHERE [dbo].[dp_Tools].[Tool_Name] = @ToolName
  )
  BEGIN

    -- Update the dp_Tools table with the new tool data
    UPDATE [dbo].[dp_Tools]
    SET  [Description] = @Description
      ,[Launch_Page] = @LaunchPage
    OUTPUT INSERTED.Tool_ID INTO @toolids
    WHERE [Tool_Name] = @ToolName
    select top 1 @ToolId = id from @toolids
  END
ELSE
  BEGIN
    INSERT INTO [dbo].[dp_Tools]
         ([Tool_Name]
         ,[Description]
         ,[Launch_Page])
     VALUES
         (@ToolName
         ,@Description
         ,@LaunchPage)
    set @ToolId = SCOPE_IDENTITY()
  END

IF NOT EXISTS (
  SELECT 1
  FROM [dbo].[dp_Tool_Pages]
  WHERE [dbo].[dp_Tool_Pages].[Tool_ID] = @ToolId
  AND [dbo].[dp_Tool_Pages].[Page_ID] = @PageToolAppearsOn
)
BEGIN
  INSERT INTO [dbo].[dp_Tool_Pages]
  ([Tool_ID],
   [Page_ID])
   VALUES (@ToolId, @PageToolAppearsOn)
END

-- Give a role permission to access the tool
IF NOT EXISTS
  ( SELECT 1
    FROM [dbo].[dp_Role_Tools]
    WHERE [dbo].[dp_Role_Tools].[Role_ID] = @Role AND [dbo].[dp_Role_Tools].[Tool_ID] = @ToolId )
BEGIN
  INSERT INTO [dbo].[dp_Role_Tools]
  ([Tool_ID], [Role_ID], [Domain_ID])
  VALUES (@ToolId, @Role, 1)
END

GO
