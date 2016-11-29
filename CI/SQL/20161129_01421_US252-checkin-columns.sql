-- ===============================================================
-- Authors: John Cleaver <john.cleaver@ingagepartners.com>
-- Create date: 11/29/2016
-- Description:	Add Checkin_Phone and Checkin_Household_ID columns to Event_Participants to track the Phone Number
-- and Household ID they were signed in under. 
-- ===============================================================

USE [MinistryPlatform]
GO

IF NOT EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'Checkin_Phone' AND Object_ID = Object_ID(N'dbo.Event_Participants'))
BEGIN
	ALTER TABLE dbo.Event_Participants ADD
		Checkin_Phone VARCHAR(50) NULL
	
	DECLARE @v1 sql_variant 
	SET @v1 = N'The phone number under which this event participant was checked in.'
	EXECUTE sp_addextendedproperty N'MS_Description', @v1, N'SCHEMA', N'dbo', N'TABLE', N'Event_Participants', N'COLUMN', N'Checkin_Phone'
END

IF NOT EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'Checkin_Household_ID' AND Object_ID = Object_ID(N'dbo.Event_Participants'))
BEGIN
	ALTER TABLE dbo.Event_Participants ADD
		Checkin_Household_ID int NULL
	
	DECLARE @v2 sql_variant 
	SET @v2 = N'The household id under which this event participant was checked in.'
	EXECUTE sp_addextendedproperty N'MS_Description', @v2, N'SCHEMA', N'dbo', N'TABLE', N'Event_Participants', N'COLUMN', N'Checkin_Household_ID'
	
	IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Event_Participant_Household_ID]') AND parent_object_id = OBJECT_ID(N'[dbo].[Event_Participants]'))
	ALTER TABLE [dbo].[Event_Participants]  WITH CHECK ADD  CONSTRAINT [FK_Event_Participant_Household_ID] FOREIGN KEY(Checkin_Household_ID)
	REFERENCES [dbo].[Households] ([Household_ID])
	
	IF  EXISTS (SELECT * FROM sys.foreign_keys WHERE object_id = OBJECT_ID(N'[dbo].[FK_Event_Participant_Household_ID]') AND parent_object_id = OBJECT_ID(N'[dbo].[Event_Participants]'))
	ALTER TABLE [dbo].[Event_Participants] CHECK CONSTRAINT [FK_Event_Participant_Household_ID]
END