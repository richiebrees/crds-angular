using System.Collections.Generic;
using MinistryPlatform.Translation.Models;

namespace MinistryPlatform.Translation.Repositories.Interfaces
{
    public interface IAttributeRepository
    {
        List<MpAttribute> GetAttributes(int? attributeTypeId);
        List<MpAttribute> CreateMissingAttributesReturnAttributeIds(List<MpAttribute> attributes, int attributeType);
    }
}