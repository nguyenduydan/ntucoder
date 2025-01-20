using AddressManagementSystem.Infrashtructure.Helpers;
using api.Infrashtructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    public class CoderController : ControllerBase
    {
        private readonly ICoderService _coderService;

        public CoderController(ICoderService coderService)
        {
            _coderService = coderService;
        }


        [Route("api/coder")]
        [HttpGet]
        public async Task<IActionResult> GetAllCoders([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            try
            {
                var result = await _coderService.GetAllCoderAsync(query, sortField, ascending);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
