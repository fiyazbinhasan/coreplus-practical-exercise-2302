using Coreplus.Sample.Api.Services;
using Coreplus.Sample.Api.Types;
using NSubstitute;

namespace Coreplus.Sample.Api.Test;

public class PractitionerServiceTests
{
    [Theory]
    [MemberData(nameof(Data))]
    public async Task GetPractitioners_Should_Return_CorrectResult(
        IEnumerable<Practitioner> data, int expectedPractitioners,
        int expectedSupervisors)
    {
        var fileServiceMock = Substitute.For<IFileService<Practitioner>>();
        fileServiceMock.ReadFileAsync(Arg.Any<string>()).Returns(data);

        var service = new PractitionerService(fileServiceMock);
        
        var practitioners = await service.GetPractitioners();
        var supervisors = await service.GetSupervisorPractitioners();

        // Assert
        Assert.Equal(expectedPractitioners, practitioners.Count());
        Assert.Equal(expectedSupervisors, supervisors.Count());
    }
    
    public static IEnumerable<object[]> Data =>
        new List<object[]>
        {
            new object[] { Array.Empty<Practitioner>(), 0, 0 },
            new object[] { new Practitioner[]
            {
                new Practitioner(1, "John Doe", PractitionerLevel.PRACTITIONER),
                new Practitioner(2, "Jane Doe", PractitionerLevel.PRACTITIONER),
                new Practitioner(3, "Jonathan Doe", PractitionerLevel.ADMIN),
                new Practitioner(4, "Cookie Doe", PractitionerLevel.OWNER),
                new Practitioner(5, "Bread Doe", PractitionerLevel.CASE_MANAGER)
            }, 5, 2 },
            new object[] { new Practitioner[]
            {
                new Practitioner(1, "John Doe", PractitionerLevel.PRACTITIONER),
                new Practitioner(3, "Jonathan Doe", PractitionerLevel.ADMIN),
                new Practitioner(5, "Bread Doe", PractitionerLevel.CASE_MANAGER)
            }, 3, 1 }
        };
}