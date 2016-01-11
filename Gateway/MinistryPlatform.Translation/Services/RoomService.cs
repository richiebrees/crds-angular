﻿using System.Collections.Generic;
using System.Linq;
using Crossroads.Utilities.Interfaces;
using MinistryPlatform.Translation.Extensions;
using MinistryPlatform.Translation.Models;
using MinistryPlatform.Translation.Services.Interfaces;

namespace MinistryPlatform.Translation.Services
{
    public class RoomService : BaseService, IRoomService
    {
        private readonly IMinistryPlatformService _ministryPlatformService;

        public RoomService(IMinistryPlatformService ministryPlatformService, IAuthenticationService authenticationService, IConfigurationWrapper configuration)
            : base(authenticationService, configuration)
        {
            _ministryPlatformService = ministryPlatformService;
        }

        public List<Room> GetRoomsByLocationId(int locationId, string token)
        {
            var search = string.Format(",,,,{0}", locationId);
            var records = _ministryPlatformService.GetPageViewRecords("RoomsByLocationId", token, search);

            return records.Select(record => new Room
            {
                BuildingId = record.ToInt("Building_ID"),
                LocationId = record.ToInt("Location_ID"),
                RoomId = record.ToInt("Room_ID"),
                RoomName = record.ToString("Room_Name"),
                RoomNumber = record.ToString("Room_Number")
            }).ToList();
        }
    }
}