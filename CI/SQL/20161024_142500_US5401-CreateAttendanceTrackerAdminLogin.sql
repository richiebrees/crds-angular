USE [master]
GO
 CREATE LOGIN [AttendanceTrackerAdmin] WITH PASSWORD=N'QujM9nXRutum', DEFAULT_DATABASE=[AttendanceTracker], CHECK_EXPIRATION=ON, CHECK_POLICY=ON
GO
USE [AttendanceTracker]
GO
 CREATE USER [AttendanceTrackerAdmin] FOR LOGIN [AttendanceTrackerAdmin]
GO

USE [AttendanceTracker]
GO

GRANT CONTROL ON SCHEMA::[dbo] TO [AttendanceTrackerAdmin];
GRANT ALTER ON SCHEMA::[dbo] TO [AttendanceTrackerAdmin];
GRANT CREATE TABLE TO [dbo];

GO