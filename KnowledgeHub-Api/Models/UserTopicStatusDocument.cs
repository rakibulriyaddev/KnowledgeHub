using MongoDB.Bson.Serialization.Attributes;

namespace KnowledgeHub_Api.Models;

public class UserTopicStatusDocument
{
    // Lowercase email — one document per user, holding every topic id they've read.
    [BsonId]
    public required string Id { get; set; }

    public List<string> ReadTopicIds { get; set; } = [];
}
