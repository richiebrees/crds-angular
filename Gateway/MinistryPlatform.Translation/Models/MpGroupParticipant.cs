﻿using System;

namespace MinistryPlatform.Translation.Models
{
    public class MpGroupParticipant
    {
        public int GroupParticipantId { get; set; }
        public int ParticipantId { get; set; }
        public int ContactId { get; set; }
        public string NickName { get; set; }
        public string LastName { get; set; }
        public int GroupRoleId { get; set; }
        public string GroupRoleTitle { get; set; }
        public string Email { get; set; }
        public DateTime? StartDate { get; set; }
        public string Congregation { get; set; }
    }
}
