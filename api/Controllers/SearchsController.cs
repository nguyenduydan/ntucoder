using api.Infrashtructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchsController : ControllerBase
    {
        private readonly SearchAllService _searchService;

        public SearchsController(SearchAllService searchService)
        {
            _searchService = searchService;
        }

        // GET api/search/suggestions?keyword=abc&maxResults=10
        [HttpGet("suggestions")]
        public async Task<IActionResult> GetSuggestions([FromQuery] string keyword, [FromQuery] int maxResults = 10)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return BadRequest("Keyword is required.");

            var suggestions = await _searchService.SearchSuggestionsAsync(keyword, maxResults);

            return Ok(suggestions);
        }
    }
}
