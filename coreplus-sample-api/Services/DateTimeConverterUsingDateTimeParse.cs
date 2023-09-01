using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Coreplus.Sample.Api.Services;

public class DateTimeConverterUsingDateTimeParse : JsonConverter<DateTime>
{
    public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        string[] formats = { "M/d/yyyy", "MM/dd/yyyy" };

        if (DateTime.TryParseExact(reader.GetString() ?? string.Empty, formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDate))
        {
            return parsedDate;
        }

        throw new ArgumentException("Failed to parse {}", reader.GetString());
    }

    public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(CultureInfo.InvariantCulture));
    }
}