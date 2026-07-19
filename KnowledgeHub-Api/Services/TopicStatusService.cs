using KnowledgeHub_Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace KnowledgeHub_Api.Services;

public class TopicStatusService
{
    private readonly IMongoCollection<UserTopicStatusDocument> _collection;

    public TopicStatusService(IOptions<MongoSettings> options)
    {
        var settings = options.Value;
        var client = new MongoClient(settings.ConnectionString);
        var database = client.GetDatabase(settings.Database);
        _collection = database.GetCollection<UserTopicStatusDocument>("topic_status");
    }

    public async Task<List<string>> GetReadTopicIdsAsync(string email)
    {
        var id = BuildId(email);
        var document = await _collection.Find(d => d.Id == id).FirstOrDefaultAsync();
        return document?.ReadTopicIds ?? [];
    }

    public async Task MarkReadAsync(string topicId, string email)
    {
        var id = BuildId(email);
        var update = Builders<UserTopicStatusDocument>.Update.AddToSet(d => d.ReadTopicIds, topicId);
        await _collection.UpdateOneAsync(d => d.Id == id, update, new UpdateOptions { IsUpsert = true });
    }

    public async Task MarkUnreadAsync(string topicId, string email)
    {
        var id = BuildId(email);
        var update = Builders<UserTopicStatusDocument>.Update.Pull(d => d.ReadTopicIds, topicId);
        await _collection.UpdateOneAsync(d => d.Id == id, update, new UpdateOptions { IsUpsert = true });
    }

    private static string BuildId(string email) => email.ToLowerInvariant();
}
