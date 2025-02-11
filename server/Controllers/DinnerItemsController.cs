using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MiddagApi.Models;
using MiddagApi.Services;

namespace MiddagApi.Controllers
{
    [Route("api/DinnerItems")]
    [ApiController]
    public class DinnerItemsController(IDinnerService dinnerService) : ControllerBase
    {
        // GET: api/DinnerItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DinnerItem>>> GetDinnerItems()
        {
            var dinners = await dinnerService.GetAllDinnersAsync();
            return Ok(dinners);
        }

        // GET: api/DinnerItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DinnerItem>> GetDinnerItem(string id)
        {
            var dinnerItem = await dinnerService.GetDinnerAsync(id);

            if (dinnerItem == null)
            {
                return NotFound("Dinner not found");
            }
            return dinnerItem;
        }

        // GET: api/DinnerItems/search/potet
        [HttpGet("search/{search}")]
        public async Task<ActionResult<IEnumerable<DinnerItem>>> GetDinnerItems(string search)
        {
            var dinners = await dinnerService.GetDinnersAsync(search);
            return Ok(dinners);
        }

        // GET: api/DinnerItems/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<DinnerItem>>> GetAllDinnerItems()
        {
            var dinners = await dinnerService.GetAllDinnersAsync();
            return Ok(dinners);
        }

        // PUT: api/DinnerItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<DinnerItem>> PutDinnerItem(string id, DinnerItem dinnerItem)
        {
            if (id != dinnerItem.id)
            {
                return BadRequest();
            }
            var dinner = await dinnerService.UpdateDinnerAsync(dinnerItem);
            if (dinner is null)
            {
                return NotFound("Dinner not found");
            }

            return Ok(dinner);
        }

        // POST: api/DinnerItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DinnerItem>> PostDinnerItem(DinnerItem dinnerItem)
        {
            var dinner = await dinnerService.CreateDinnerAsync(dinnerItem);
            if (dinner is null)
            {
                return BadRequest("Dinner not created");
            }
            return CreatedAtAction(nameof(GetDinnerItem), new { id = dinnerItem.id }, dinnerItem);
        }

        // DELETE: api/DinnerItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDinnerItem(string id)
        {
            var result = await dinnerService.DeleteDinnerAsync(id);
            if (!result)
            {
                return NotFound("Dinner not found");
            }
            return NoContent();
        }
    }
}
