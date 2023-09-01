using Coreplus.Sample.Api.Services;

namespace Coreplus.Sample.Api.Endpoints.Appointment;

public static class GetByPractitionerId
{
    public static RouteGroupBuilder MapGetByPractitionerId(this RouteGroupBuilder group)
    {
        group.MapGet("/", async (AppointmentService appointmentService, long practitionerId) =>
        {
            var practitioners = await appointmentService.GetByPractitionerId(practitionerId);
            return Results.Ok(practitioners);
        });

        return group;
    }
}