using Coreplus.Sample.Api.Types;

namespace Coreplus.Sample.Api.Services;

public record PractitionerDto(long id, string name);

public class PractitionerService
{
    private readonly IFileService<Practitioner> _fileService;
    public PractitionerService(IFileService<Practitioner> fileService)
    {
        _fileService = fileService;
    }
    
    public async Task<IEnumerable<PractitionerDto>> GetPractitioners()
    {
        var data = await _fileService.ReadFileAsync(@"./Data/practitioners.json");
        return data.Select(prac => new PractitionerDto(prac.id, prac.name));
    }

    public async Task<IEnumerable<PractitionerDto>> GetSupervisorPractitioners()
    {
        var data = await _fileService.ReadFileAsync(@"./Data/practitioners.json");
        return data.Where(practitioner => (int)practitioner.level < 2).Select(prac => new PractitionerDto(prac.id, prac.name));
    }
}