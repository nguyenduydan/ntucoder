using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Infrashtructure.Services;
using api.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TopicController : ControllerBase
    {
        private readonly TopicService _service;

        public TopicController(TopicService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> getList([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            var result = await _service.GetListAsync(query, sortField, ascending);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> getById (int id)
        {
            var result = await _service.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TopicDTO topic)
        {
            var result = await _service.CreateAsync(topic);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] TopicDetailDTO topic)
        {
            var result = await _service.UpdateAsync(id, topic); 
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok();
        }
    }
}
