using Coreplus.Sample.Api.Endpoints.Appointment;
using Coreplus.Sample.Api.Endpoints.Practitioner;
using Coreplus.Sample.Api.Services;

var AllowSpecificOrigins = "_allowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(AllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddSingleton<PractitionerService>();
builder.Services.AddSingleton<AppointmentService>();

var app = builder.Build();

app.UseCors(AllowSpecificOrigins);

var practitionerEndpoints = app.MapGroup("/practitioners");
var appointmentEndpoints = app.MapGroup("/appointments");

practitionerEndpoints.MapPractitionerEndpoints();
appointmentEndpoints.MapAppointmentEndpoints();

app.Run();
