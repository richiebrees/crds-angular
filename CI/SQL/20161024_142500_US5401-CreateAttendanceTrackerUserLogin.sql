USE [master]
GO
 CREATE LOGIN [AttendanceTrackerUser] WITH PASSWORD=N'9jTReUbz8Bpt', DEFAULT_DATABASE=[AttendanceTracker], CHECK_EXPIRATION=ON, CHECK_POLICY=ON
GO
USE [AttendanceTracker]
GO
  CREATE USER [AttendanceTrackerUser] FOR LOGIN [AttendanceTrackerUser]
GO


USE [AttendanceTracker]
GO

GRANT INSERT ON SCHEMA::[dbo] TO [AttendanceTrackerUser];
GRANT UPDATE ON SCHEMA::[dbo] TO [AttendanceTrackerUser];
GRANT DELETE ON SCHEMA::[dbo] TO [AttendanceTrackerUser];
GRANT SELECT ON SCHEMA::[dbo] TO [AttendanceTrackerUser];
GRANT EXECUTE ON SCHEMA::[dbo] TO [AttendanceTrackerUser];

GO