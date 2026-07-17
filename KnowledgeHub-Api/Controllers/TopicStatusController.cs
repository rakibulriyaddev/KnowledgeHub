using KnowledgeHub_Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace KnowledgeHub_Api.Controllers;

[ApiController]
[Route("api/topic-status")]
public class TopicStatusController(TopicStatusService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetStatus([FromQuery] string topicId, [FromQuery] string email)
    {
        var status = await service.GetStatusAsync(topicId, email);
        return Ok(new { status });
    }

    [HttpPost("mark-read")]
    public async Task<IActionResult> MarkRead([FromBody] MarkReadRequest request)
    {
        await service.MarkReadAsync(request.TopicId, request.Email);
        return Ok(new { status = true });
    }

    [HttpPost("mark-unread")]
    public async Task<IActionResult> MarkUnread([FromBody] MarkReadRequest request)
    {
        await service.MarkUnreadAsync(request.TopicId, request.Email);
        return Ok(new { status = false });
    }
}

public record MarkReadRequest(string TopicId, string Email);
