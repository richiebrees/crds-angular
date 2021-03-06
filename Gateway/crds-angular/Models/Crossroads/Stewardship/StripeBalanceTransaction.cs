﻿using System;
using crds_angular.Models.Json;
using Newtonsoft.Json;

namespace crds_angular.Models.Crossroads.Stewardship
{
    public class StripeBalanceTransaction : StripeObject
    {
        [JsonProperty("amount")]
        public int Amount { get; set; }

        [JsonProperty("net")]
        public int Net { get; set; }

        [JsonProperty("fee")]
        public int? Fee { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("created")]
        [JsonConverter(typeof(StripeDateTimeConverter))]
        public DateTime Created { get; set; }
    }
}