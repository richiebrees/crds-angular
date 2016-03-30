using System.Collections.Generic;
using crds_angular.Models.Crossroads.GoVolunteer;

namespace crds_angular.Services.Interfaces
{
    public interface IGroupConnectorService
    {
        List<GroupConnector> GetGroupConnectorsByOrganization(int organization, int initiativeId);
        List<GroupConnector> GetGroupConnectorsForOpenOrganizations(int initiativeId);
    }
}