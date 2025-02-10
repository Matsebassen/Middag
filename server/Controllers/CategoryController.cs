
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiddagApi.Models;
using MiddagApi.Services;

namespace MiddagApi.Controllers
{
    [Route("api/category")]
    [ApiController]
    public class CategoryController(ICategoryService categoryService) : ControllerBase
    {
        // GET: api/ShopItems/categories
        [HttpGet("")]
        public async Task<ActionResult<IEnumerable<ShopCategory>>> GetCategories()
        {
            var categories = await categoryService.GetCategoriesAsync();
            return Ok(categories);
        }

        // POST: api/category
        [HttpPost("{categoryName}")]
        public async Task<ActionResult<ShopCategory>> PostCategory(string? categoryName)
        {
            if (categoryName == null)
            {
                return BadRequest("Category name is empty");
            }
            
            var category = await categoryService.CreateCategoryAsync(categoryName);
            return CreatedAtAction("PostCategory", new { id = category.id }, category);
        }

        // DELETE: api/category
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            if (id == "1")
            {
                return BadRequest("Not allowed to delete the default category");
            }

            var result = await categoryService.DeleteCategoryAsync(id);
            if (!result)
            {
                return NotFound("Category not found");
            }
            
            return NoContent();
        }

        // PUT: api/category
        [HttpPut]
        public async Task<ActionResult<ShopCategory>> UpdateCategory(ShopCategory? category)
        {
            if (category is null)
            {
                return BadRequest("Category is empty");
            }
            var result = await categoryService.UpdateCategoryAsync(category);
            if (result is null)
            {
                return Problem("Unable to update category");
            }
            return Ok(result);
        }
    }
}
