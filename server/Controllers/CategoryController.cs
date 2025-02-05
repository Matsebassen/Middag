
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiddagApi.Models;

namespace MiddagApi.Controllers
{
    [Route("api/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly DinnerContext _context;

        public CategoryController(DinnerContext context)
        {
            _context = context;
        }

        // GET: api/ShopItems/categories
        [HttpGet("")]
        public async Task<ActionResult<IEnumerable<ShopCategory>>> GetCategories()
        {
            return await _context.ShopCategories.OrderBy(i => i.Name)
                .ToListAsync();
        }

        // POST: api/category
        [HttpPost("")]
        public async Task<ActionResult<ShopCategory>> PostCategory(ShopCategory? category)
        {
            if (category == null)
            {
                return Problem("Category name is empty");
            }

            _context.ShopCategories.Add(category);

            await _context.SaveChangesAsync();

            return CreatedAtAction("PostCategory", new { id = category.ID }, category);
        }

        // DELETE: api/category
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(long? id)
        {
            if (id == null)
            {
                return Problem("Category id is empty");
            }

            if (id == 1)
            {
                return Problem("Not allowed to delete the default category");
            }

            var category = await _context.ShopCategories.FindAsync(id);
            if (category == null)
            {
                return NotFound("Category not found");
            }
            
            var shopItemsWithCategory =  _context.ShopItems.Where(shopItem => shopItem.Category != null && shopItem.Category.ID == id);
            foreach (var shopItem in shopItemsWithCategory)
            {
                shopItem.Category = null;
            }

            _context.Remove(category);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/category
        [HttpPut]
        public async Task<ActionResult<ShopCategory>> UpdateCategory(ShopCategory? category)
        {
            if (category == null)
            {
                return Problem("Category is empty");
            }

            var foundCategory = await _context.ShopCategories.FindAsync(category.ID);
            if (foundCategory == null)
            {
                return NotFound("Category not found");
            }

            foundCategory.Name = category.Name;
            await _context.SaveChangesAsync();
            return Ok(foundCategory);
        }
    }
}
