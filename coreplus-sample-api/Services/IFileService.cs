using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Coreplus.Sample.Api.Services;

public interface IFileService<T>
{
    Task<IEnumerable<T>> ReadFileAsync(string filePath);
}

public class FileService<T> : IFileService<T>
{
    public async Task<IEnumerable<T>> ReadFileAsync(string filePath)
    {
        var options = new JsonSerializerOptions();
        options.Converters.Add(new DateTimeConverterUsingDateTimeParse());

        await using var fileStream = File.OpenRead(filePath);
        var data = await JsonSerializer.DeserializeAsync<T[]>(fileStream, options);

        if (data == null)
            throw new Exception("Data read error");

        return data;
    }
}

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