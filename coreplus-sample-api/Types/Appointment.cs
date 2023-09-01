namespace Coreplus.Sample.Api.Types;

public record Appointment(long id, DateTime date, string client_name, string appointment_type, int duration, decimal revenue, decimal cost, long practitioner_id);
