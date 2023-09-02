namespace Coreplus.Sample.Api.Endpoints.Appointment;

public static class MapEndpoints
{
    public static RouteGroupBuilder MapAppointmentEndpoints(this RouteGroupBuilder group)
    {
        group.MapGetProfitabilityAnalysis();
        group.MapGetByPractitionerId();
        group.MapGetById();
        return group;
    }
}