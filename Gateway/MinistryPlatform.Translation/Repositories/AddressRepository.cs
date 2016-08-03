﻿using System;
using System.Linq;
using System.Collections.Generic;
using Crossroads.Utilities.Interfaces;
using MinistryPlatform.Translation.Extensions;
using MinistryPlatform.Translation.Models;
using MinistryPlatform.Translation.Repositories.Interfaces;

namespace MinistryPlatform.Translation.Repositories
{
    public class AddressRepository : IAddressRepository
    {
        private readonly IMinistryPlatformService _ministryPlatformService;
        private readonly IApiUserRepository _apiUserService;
        private readonly int AddressPageId;

        public AddressRepository(IConfigurationWrapper configurationWrapper, IMinistryPlatformService ministryPlatformService, IApiUserRepository apiUserService)
        {
            _ministryPlatformService = ministryPlatformService;
            _apiUserService = apiUserService;
            AddressPageId = configurationWrapper.GetConfigIntValue("Addresses");
        }

        public int Create(MpAddress address)
        {
            var apiToken = _apiUserService.GetToken();

            var values = MapAddressDictionary(address);

            var addressId = _ministryPlatformService.CreateRecord(AddressPageId, values, apiToken);

            return addressId;
        }

        public int Update(MpAddress address)
        {
            var apiToken = _apiUserService.GetToken();

            var values = MapAddressDictionary(address);
            values.Add("dp_RecordID", address.Address_ID.Value);
            values.Add("Address_ID", address.Address_ID.Value);

            _ministryPlatformService.UpdateRecord(AddressPageId, values, apiToken);

            return address.Address_ID.Value;
        }

        private static Dictionary<string, object> MapAddressDictionary(MpAddress address)
        {
            var values = new Dictionary<string, object>()
            {
                {"Address_Line_1", address.Address_Line_1},
                {"Address_Line_2", address.Address_Line_2},
                {"City", address.City},
                {"State/Region", address.State},
                {"Postal_Code", address.Postal_Code},
                {"Foreign_Country", address.Foreign_Country},
                {"County", address.County},
                {"Longitude", address.Longitude },
                {"Latitude", address.Latitude }
            };

            return values;
        }

        public List<MpAddress> FindMatches(MpAddress address)
        {
            var apiToken = _apiUserService.GetToken();
            var search = string.Format("{0}, {1}, {2}, {3}, {4}, {5}",
                                       AddQuotesIfNotEmpty(address.Address_Line_1),
                                       AddQuotesIfNotEmpty(address.Address_Line_2),
                                       AddQuotesIfNotEmpty(address.City),
                                       AddQuotesIfNotEmpty(address.State),
                                       AddQuotesIfNotEmpty(address.Postal_Code),
                                       AddQuotesIfNotEmpty(address.Foreign_Country));

            var records = _ministryPlatformService.GetRecordsDict(AddressPageId, apiToken, search);

            object longitude;
            object latitude;
            var addresses = records.Select(record => new MpAddress()
            {
                Address_ID = record.ToInt("dp_RecordID"),
                Address_Line_1 = record.ToString("Address_Line_1"),
                Address_Line_2 = record.ToString("Address_Line_2"),
                City = record.ToString("City"),
                State = record.ToString("State/Region"),
                Postal_Code = record.ToString("Postal_Code"),
                Foreign_Country = record.ToString("Foreign_Country"),
                Latitude = record.TryGetValue("Latitude", out latitude) ? (long)latitude : (long?)null,
                Longitude = record.TryGetValue("Longitude", out longitude) ? (long)longitude : (long?)null
            }).ToList();

            return addresses;
        }

        private string AddQuotesIfNotEmpty(string input)
        {
            if (String.IsNullOrEmpty(input))
            {
                return input;
            }

            return string.Format("\"{0}\"", input);
        }

        public MpAddress GetAddressById(string token, int id)
        {
            var record = _ministryPlatformService.GetRecordDict(AddressPageId, id, token);

            var address = new MpAddress()
            {
                Address_ID = record.ToInt("Address_ID"),
                Address_Line_1 = record.ToString("Address_Line_1"),
                Address_Line_2 = record.ToString("Address_Line_2"),
                City = record.ToString("City"),
                State = record.ToString("State/Region"),
                Postal_Code = record.ToString("Postal_Code")
            };

            return address;
        }
}
}