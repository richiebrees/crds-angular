﻿using System.Collections.Generic;
using crds_angular.Models.Crossroads.Trip;

namespace crds_angular.Services.Interfaces
{
    public interface ITripService
    {
        TripFormResponseDto GetFormResponses(int selectionId, int selectionCount, int recordId);
        List<TripGroupDto> GetGroupsByEventId(int eventId);
        MyTripsDto GetMyTrips(int contactId, string token);
        List<TripParticipantDto> Search(string search);
        List<int> SaveParticipants(SaveTripParticipantsDto dto);
    }
}