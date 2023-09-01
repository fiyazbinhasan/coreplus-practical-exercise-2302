using System.Text.Json;
using Coreplus.Sample.Api.Types;

namespace Coreplus.Sample.Api.Services;

public record ProfitabilityAnalysisDto(long practitioner_id, IEnumerable<RevenueByCostPerMonthDto> revenueByCostPerMonth);
public record RevenueByCostPerMonthDto(int year, int month, decimal totalRevenue, decimal totalCost);
public record AppointmentDto(DateTime date, decimal cost, decimal revenue);
public class AppointmentService
{
    public async Task<IEnumerable<ProfitabilityAnalysisDto>> GetProfitabilityAnalysis(long id, DateTime[]? range)
    {
        var options = new JsonSerializerOptions();
        options.Converters.Add(new DateTimeConverterUsingDateTimeParse());

        await using var fileStream = File.OpenRead(@"./Data/appointments.json");
        var data = await JsonSerializer.DeserializeAsync<Appointment[]>(fileStream, options);

        if (data == null)
            throw new Exception("Data read error");

        var query = data.Where(a => a.practitioner_id.Equals(id));

        if (range is {Length: > 1})
            query = query.Where(a => (a.date.Year > range[0].Year || (a.date.Year == range[0].Year && a.date.Month >= range[0].Month))
                                     && (a.date.Year < range[1].Year || (a.date.Year == range[1].Year && a.date.Month <= range[1].Month)));
       
        return from a in query
            group a by a.practitioner_id into practitionerGroup
            orderby practitionerGroup.Key
            select new ProfitabilityAnalysisDto(
                practitioner_id: practitionerGroup.Key,
                revenueByCostPerMonth: practitionerGroup
                    .GroupBy(entry => new { entry.date.Year, entry.date.Month })
                    .OrderByDescending(monthlyGroup => monthlyGroup.Key.Year)
                    .ThenByDescending(monthlyGroup => monthlyGroup.Key.Month)
                    .Select(monthlyGroup => new RevenueByCostPerMonthDto(
                        year: monthlyGroup.Key.Year,
                        month: monthlyGroup.Key.Month,
                        totalRevenue: monthlyGroup.Sum(a => a.revenue),
                        totalCost: monthlyGroup.Sum(a => a.cost)
                    ))
            );
    }

    public async Task<IEnumerable<AppointmentDto>> GetByPractitionerId(long practitionerId)
    {
        var options = new JsonSerializerOptions();
        options.Converters.Add(new DateTimeConverterUsingDateTimeParse());

        await using var fileStream = File.OpenRead(@"./Data/appointments.json");
        var data = await JsonSerializer.DeserializeAsync<Appointment[]>(fileStream, options);

        if (data == null)
            throw new Exception("Data read error");

        return data.Where(a => a.practitioner_id.Equals(practitionerId)).Select(a => new AppointmentDto(a.date, a.cost, a.revenue));
    }
}