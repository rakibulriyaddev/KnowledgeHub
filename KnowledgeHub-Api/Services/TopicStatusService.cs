using KnowledgeHub_Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace KnowledgeHub_Api.Services;

public class TopicStatusService
{
    private readonly IMongoCollection<TopicStatusDocument> _collection;

    public TopicStatusService(IOptions<MongoSettings> options)
    {
        var settings = options.Value;
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.Database);
        _collection = database.GetCollection<TopicStatusDocument>("topic_status");
    }

    public async Task<bool> GetStatusAsync(string topicId, string email)
    {
        var id = BuildId(topicId, email);
        var document = await _collection.Find(d => d.Id == id).FirstOrDefaultAsync();
        return document?.Status ?? false;
    }

    public async Task MarkReadAsync(string topicId, string email)
    {
        var id = BuildId(topicId, email);
        var document = new TopicStatusDocument { Id = id, TopicId = topicId, Status = true };
        await _collection.ReplaceOneAsync(d => d.Id == id, document, new ReplaceOptions { IsUpsert = true });
    }

    private static string BuildId(string topicId, string email) => $"{email.ToLowerInvariant()}_{topicId}";
}
