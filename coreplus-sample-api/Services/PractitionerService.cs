using System.Text.Json;
using Coreplus.Sample.Api.Types;

namespace Coreplus.Sample.Api.Services;

public record PractitionerDto(long id, string name);

public class PractitionerService
{
    public async Task<IEnumerable<PractitionerDto>> GetPractitioners()
    {
        await using var fileStream = File.OpenRead(@"./Data/practitioners.json");
        var data = await JsonSerializer.DeserializeAsync<Practitioner[]>(fileStream);
        if (data == null)
        {
            throw new Exception("Data read error");
        }

        return data.Select(prac => new PractitionerDto(prac.id, prac.name));
    }

    public async Task<IEnumerable<PractitionerDto>> GetSupervisorPractitioners()
    {
        await using var fileStream = File.OpenRead(@"./Data/practitioners.json");
        var data = await JsonSerializer.DeserializeAsync<Practitioner[]>(fileStream);
        if (data == null)
        {
            throw new Exception("Data read error");
        }

        return data.Where(practitioner => (int)practitioner.level >= 2).Select(prac => new PractitionerDto(prac.id, prac.name));
    }
}