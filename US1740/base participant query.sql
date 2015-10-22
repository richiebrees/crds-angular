/****** Script for SelectTopNRows command from SSMS  ******/
SELECT *
  FROM [MinistryPlatform].[dbo].[Event_Participants] ep
  inner join dbo.Participants p on ep.participant_id = p.participant_id and p.contact_id = 768379
  --inner join MinistryPlatform.dbo.Contacts c on p.contact_id = c.contact_id and c.contact_id = 768379
  inner join dbo.Pledge_Campaigns pc on ep.Event_ID = pc.Event_ID
  inner join dbo.Form_Responses fr on p.Contact_ID = fr.Contact_ID and pc.Pledge_Campaign_ID = fr.Pledge_Campaign_ID
  where ep.Event_ID = 1599781

  select * from dbo.Participants where Participant_ID = 2213526

  select * from dbo.Pledge_Campaigns p
  where p.event_id = 1599781

  select * from dbo.form_responses r
  where r.pledge_campaign_id = 178