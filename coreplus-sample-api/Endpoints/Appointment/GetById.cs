using Coreplus.Sample.Api.Services;

namespace Coreplus.Sample.Api.Endpoints.Appointment;

public static class GetById
{
    public static RouteGroupBuilder MapGetById(this RouteGroupBuilder group)
    {
        group.MapGet("/{id:long}", async (AppointmentService appointmentService, long id) =>
        {
            var practitioners = await appointmentService.GetById(id);
            return Results.Ok(practitioners);
        });

        return group;
    }
}