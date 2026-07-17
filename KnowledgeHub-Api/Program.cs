using KnowledgeHub_Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<KnowledgeHub_Api.Models.MongoSettings>(builder.Configuration.GetSection("Mongo"));
builder.Services.AddSingleton<TopicStatusService>();
builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

app.Run();
