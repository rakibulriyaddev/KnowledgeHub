using KnowledgeHub_Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<KnowledgeHub_Api.Models.MongoSettings>(builder.Configuration.GetSection("Mongo"));
builder.Services.AddSingleton<TopicStatusService>();

var app = builder.Build();

app.MapGet("/api/topic-status", async (string topicId, string email, TopicStatusService service) =>
{
    var status = await service.GetStatusAsync(topicId, email);
    return Results.Ok(new { status });
});

app.MapPost("/api/topic-status/mark-read", async (MarkReadRequest request, TopicStatusService service) =>
{
    await service.MarkReadAsync(request.TopicId, request.Email);
    return Results.Ok(new { status = true });
});

app.Run();

record MarkReadRequest(string TopicId, string Email);
