using Coreplus.Sample.Api.Types;

namespace Coreplus.Sample.Api.Services;

public record ProfitabilityAnalysisDto(long practitioner_id, IEnumerable<RevenueByCostPerMonthDto> revenueByCostPerMonth);
public record RevenueByCostPerMonthDto(int year, int month, decimal totalRevenue, decimal totalCost);
public record AppointmentDto(long id, DateTime date, decimal cost, decimal revenue);
public record AppointmentDetailsDto(long id, DateTime date, decimal cost, decimal revenue, string client_name, string appointment_type, int duration);

public class AppointmentService
{
    private readonly IFileService<Appointment> _fileService;

    public AppointmentService(IFileService<Appointment> fileService)
    {
        _fileService = fileService;
    }
    
    public async Task<IEnumerable<ProfitabilityAnalysisDto>> GetProfitabilityAnalysis(long id, DateTime[]? range)
    {
        var data = await _fileService.ReadFileAsync(@"./Data/appointments.json");

        var query = data.Where(a => a.practitioner_id.Equals(id));

        if (range is {Length: > 1})
            query = query.Where(a => (a.date.Year > range[0].Year || (a.date.Year == range[0].Year && a.date.Month >= range[0].Month))
                                     && (a.date.Year < range[1].Year || (a.date.Year == range[1].Year && a.date.Month <= range[1].Month)));
       
        return from a in query
            group a by a.practitioner_id into g
            orderby g.Key
            select new ProfitabilityAnalysisDto(
                practitioner_id: g.Key,
                revenueByCostPerMonth: g
                    .GroupBy(entry => new { entry.date.Year, entry.date.Month })
                    .OrderByDescending(mg => mg.Key.Year)
                    .ThenByDescending(mg => mg.Key.Month)
                    .Select(mg => new RevenueByCostPerMonthDto(
                        year: mg.Key.Year,
                        month: mg.Key.Month,
                        totalRevenue: mg.Sum(a => a.revenue),
                        totalCost: mg.Sum(a => a.cost)
                    ))
            );
    }

    public async Task<IEnumerable<AppointmentDto>> GetByPractitionerId(long practitionerId)
    {
        var data = await _fileService.ReadFileAsync(@"./Data/appointments.json");
        
        return data.Where(a => a.practitioner_id.Equals(practitionerId))
            .OrderByDescending(a => a.date)
            .Select(a => new AppointmentDto(a.id, a.date, a.cost, a.revenue));
    }

    public async Task<AppointmentDetailsDto?> GetById(long id)
    {
        var data = await _fileService.ReadFileAsync(@"./Data/appointments.json");

        return data.Where(a => a.id.Equals(id))
            .Select(a => new AppointmentDetailsDto(a.id, a.date, a.cost, a.revenue, a.client_name, a.appointment_type, a.duration))
            .SingleOrDefault();
    }
}