using System.Collections.Generic;
using crds_angular.Models.Crossroads.GoVolunteer;
using MinistryPlatform.Translation.Models.GoCincinnati;

namespace crds_angular.Services.Interfaces
{
    public interface IGroupConnectorService
    {
        GroupConnector GetGroupConnectorById(int groupConnectorId);
        List<GroupConnector> GetGroupConnectorsByOrganization(int organization, int initiativeId);
        List<GroupConnector> GetGroupConnectorsForOpenOrganizations(int initiativeId);
    }
}