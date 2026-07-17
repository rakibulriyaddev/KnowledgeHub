using MongoDB.Bson.Serialization.Attributes;

namespace KnowledgeHub_Api.Models;

public class TopicStatusDocument
{
    // "{lowercase email}_{topicId}" — naturally unique per user per topic, no compound index needed.
    [BsonId]
    public required string Id { get; set; }

    public required string TopicId { get; set; }

    public bool Status { get; set; }
}
