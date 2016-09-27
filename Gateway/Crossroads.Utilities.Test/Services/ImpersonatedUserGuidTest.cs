﻿using Crossroads.Utilities.Services;
using NUnit.Framework;

namespace Crossroads.Utilities.Test.Services
{
    public class ImpersonatedUserGuidTest
    {
        [Test]
        public void TestImpersonatedUserGuid()
        {
            Assert.IsFalse(ImpersonatedUserGuid.HasValue());

            ImpersonatedUserGuid.Set("123", "abcdef");
            Assert.IsTrue(ImpersonatedUserGuid.HasValue());
            Assert.AreEqual("123", ImpersonatedUserGuid.Get());

            ImpersonatedUserGuid.Set("  ", "  ");
            Assert.IsFalse(ImpersonatedUserGuid.HasValue());

            ImpersonatedUserGuid.Set("123", "abcdef");
            ImpersonatedUserGuid.Clear();
            Assert.IsFalse(ImpersonatedUserGuid.HasValue());
        }
    }
}
