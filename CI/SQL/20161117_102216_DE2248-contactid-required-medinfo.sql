USE MinistryPlatform
GO

UPDATE [dbo].[Contacts] 
	SET [MedicalInformation_ID] = null
	WHERE [Contact_ID] in (
		SELECT c.Contact_ID as mcontactid from [dbo].[Contacts] c
		JOIN [dbo].[cr_Medical_Information] m on c.[MedicalInformation_ID] = m.[MedicalInformation_ID]
		WHERE m.Contact_ID is null
	)

DELETE FROM [dbo].[cr_Medical_Information_Allergies]
WHERE [Medical_Information_ID] in (
	SELECT MedicalInformation_ID FROM [dbo].[cr_Medical_Information]
WHERE Contact_ID  is null
)


DELETE FROM [dbo].[cr_Medical_Information_Medications]
WHERE [MedicalInformation_ID] in (
	SELECT MedicalInformation_ID FROM [dbo].[cr_Medical_Information]
WHERE Contact_ID  is null
)


DELETE FROM [dbo].[cr_Medical_Information]
WHERE Contact_ID  is null;

ALTER TABLE [dbo].[cr_Medical_Information]
	ALTER COLUMN  [Contact_ID] int not null