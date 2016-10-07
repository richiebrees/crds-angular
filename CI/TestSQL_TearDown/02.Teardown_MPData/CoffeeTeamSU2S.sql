USE [MinistryPlatform]
GO

DELETE FROM RESPONSES WHERE OPPORTUNITY_ID IN (SELECT OPPORTUNITY_ID FROM OPPORTUNITIES WHERE Opportunity_Title like '(t) Coffee%');
DELETE FROM OPPORTUNITIES WHERE GROUP_ID IN (SELECT GROUP_ID FROM GROUPS WHERE GROUP_NAME = '(t) FI Oakley Coffee Team');

DELETE FROM GROUP_PARTICIPANTS WHERE GROUP_ID IN (SELECT GROUP_ID FROM GROUPS WHERE GROUP_NAME = '(t) FI Oakley Coffee Team');
DELETE FROM GROUPS WHERE GROUP_NAME = '(t) FI Oakley Coffee Team';