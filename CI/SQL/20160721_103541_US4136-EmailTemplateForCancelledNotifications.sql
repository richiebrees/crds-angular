USE [MinistryPlatform]
GO

IF NOT EXISTS(SELECT 1 FROM dbo.dp_Communications WHERE Communication_ID = 83)
BEGIN
	INSERT INTO [dbo].[dp_Communications]
           ([Author_User_ID]
           ,[Subject]
           ,[Body]
           ,[Domain_ID]
           ,[Start_Date]
           ,[From_Contact]
           ,[Reply_to_Contact]
           ,[Template]
           ,[Active])
     VALUES
           (5 --Church Administrator
           ,'Childcare Cancelled for [Group_Name] on [Childcare_Date]!'
           ,'Hey [Group_Member_Nickname]!

What a bummer!  We won’t be able to provide childcare for [Group_Name] on [Childcare_Day].  We were planning on hanging out with the following kiddos during that time:

[Child_List]

If you have any questions about this, please reply to this email and we''ll get back to you as soon as we can.'
           ,1
           ,'7/21/2016'
           ,1519180 --updates@crossroads.net
           ,1519180 --updates@crossroads.net
           ,1
           ,1)
END