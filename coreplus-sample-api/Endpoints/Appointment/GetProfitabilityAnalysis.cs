using Coreplus.Sample.Api.Services;

namespace Coreplus.Sample.Api.Endpoints.Appointment;

public static class GetProfitabilityAnalysis
{
    public static RouteGroupBuilder MapGetProfitabilityAnalysis(this RouteGroupBuilder group)
    {
        group.MapGet("/profitability-analysis/{id:long}", async (AppointmentService appointmentService, long id,  DateTime[]? range) =>
        {
            var profitabilityAnalysis = await appointmentService.GetProfitabilityAnalysis(id, range);
            return Results.Ok(profitabilityAnalysis);
        });

        return group;
    }
}