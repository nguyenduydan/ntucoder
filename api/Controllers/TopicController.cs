using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Infrashtructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TopicController : ControllerBase
    {
        private readonly TopicRepository _Repository;

        public TopicController(TopicRepository Repository)
        {
            _Repository = Repository;
        }

        [HttpGet]
        public async Task<IActionResult> getList([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            var result = await _Repository.GetListAsync(query, sortField, ascending);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> getById (int id)
        {
            var result = await _Repository.GetById(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] TopicDTO topic)
        {
            var result = await _Repository.CreateAsync(topic);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] TopicDetailDTO topic)
        {
            var result = await _Repository.UpdateAsync(id, topic); 
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _Repository.DeleteAsync(id);
            return Ok();
        }
    }
}
