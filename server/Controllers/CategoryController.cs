using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
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
            if (_context.ShopCategories == null)
            {
                return NotFound();
            }
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
        public async Task<ActionResult> DeleteCategory(long? id)
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
                return Problem("Category not found");
            }

            long defaultCategoryId = 1;
            var defaultCategory = await _context.ShopCategories.FindAsync(defaultCategoryId);
            var shopItemsWithCategory =  _context.ShopItems.Where(shopItem => shopItem.Category.ID == id);
            foreach (var shopItem in shopItemsWithCategory)
            {
                shopItem.Category = defaultCategory;
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
                return Problem("Category not found");
            }

            foundCategory.Name = category.Name;
            await _context.SaveChangesAsync();
            return foundCategory;
        }
    }
}
