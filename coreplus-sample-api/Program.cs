using Coreplus.Sample.Api.Endpoints.Appointment;
using Coreplus.Sample.Api.Endpoints.Practitioner;
using Coreplus.Sample.Api.Services;

const string allowSpecificOrigins = "_allowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(allowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddSingleton(typeof(IFileService<>), typeof(FileService<>));
builder.Services.AddSingleton<PractitionerService>();
builder.Services.AddSingleton<AppointmentService>();

var app = builder.Build();

app.UseCors(allowSpecificOrigins);

var practitionerEndpoints = app.MapGroup("/practitioners");
var appointmentEndpoints = app.MapGroup("/appointments");

practitionerEndpoints.MapPractitionerEndpoints();
appointmentEndpoints.MapAppointmentEndpoints();

app.Run();
