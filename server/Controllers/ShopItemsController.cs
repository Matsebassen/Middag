using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiddagApi.Models;

namespace MiddagApi.Controllers
{
    [Route("api/ShopItems")]
    [ApiController]
    public class ShopItemsController : ControllerBase
    {
        private readonly DinnerContext _context;

        public ShopItemsController(DinnerContext context)
        {
            _context = context;
        }

        // GET: api/ShopItems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShopItem>>> GetShopItems()
        {
            if (_context.ShopItems == null)
            {
                return NotFound();
            }
            return await _context.ShopItems
              .Include(item => item.Ingredient)
              .ThenInclude(ingredient => ingredient.ingredientType)
              .ToListAsync();
        }

        // GET: api/ShopItems/ingredientTypes
        [HttpGet("ingredientTypes")]
        public async Task<ActionResult<IEnumerable<IngredientType>>> GetIngredientTypes()
        {
            if (_context.IngredientItem == null)
            {
                return NotFound();
            }
            return await _context.IngredientTypes.OrderBy(i => i.order)
              .ToListAsync();
        }

        // GET: api/ShopItems/setIngredientType
        [HttpPatch("setIngredientType/{ingredientId}/{ingredientTypeId}")]
        public async Task<ActionResult<IngredientItem>> SetIngredientType(long ingredientId, long ingredientTypeId)
        {

            var ingredientItem = await _context.IngredientItem.FindAsync(ingredientId);
            if (ingredientItem == null)
            {
                return NotFound("Ingredient not found");
            }
            var ingredientType = await _context.IngredientTypes.FindAsync(ingredientTypeId);

            if (ingredientType == null)
            {
                return NotFound("Ingredient type not found");
            }
            ingredientItem.ingredientType = ingredientType;
            await _context.SaveChangesAsync();

            return ingredientItem;
        }

        // GET: api/ShopItems/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShopItem>> GetShopItem(long id)
        {
            if (_context.ShopItems == null)
            {
                return NotFound();
            }
            var shopItem = await _context.ShopItems.FindAsync(id);

            if (shopItem == null)
            {
                return NotFound();
            }

            return shopItem;
        }

        // PUT: api/ShopItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShopItem(long id, ShopItem shopItem)
        {
            if (id != shopItem.ID)
            {
                return BadRequest();
            }

            _context.Entry(shopItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShopItemExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(shopItem);
        }

        // PATCH: api/ShopItems/toggle/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("toggle/{id}")]
        public async Task<IActionResult> ToggleShopItem(long id)
        {
            var shopItem = await _context.ShopItems
              .Include(item => item.Ingredient)
              .SingleOrDefaultAsync(i => i.ID == id);
            if (shopItem == null)
            {
                return NotFound();
            }

            if (shopItem.RecentlyUsed > 0)
            {
                shopItem.RecentlyUsed = 0;
            }
            else
            {
                // Find next number for recentlyUsed
                var maxRecentlyUsed = await _context.ShopItems
                  .MaxAsync(s => s.RecentlyUsed);
                var nextRecentlyUsed = maxRecentlyUsed > 0 ? maxRecentlyUsed + 1 : 1;
                shopItem.RecentlyUsed = nextRecentlyUsed;

                // Delete the older recent item if more than 10 recent items exist
                var recentItems = await _context.ShopItems
                  .Where(s => s.RecentlyUsed > 0)
                  .ToArrayAsync();
                if (recentItems.Length > 10)
                {
                    var itemToDelete = recentItems
                      .First(item => item.RecentlyUsed == recentItems.Min(ri => ri.RecentlyUsed));
                    _context.ShopItems.Remove(itemToDelete);
                }

            }
            await _context.SaveChangesAsync();

            return Ok(shopItem);
        }

        // POST: api/ShopItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ShopItem>> PostShopItem(ShopItem shopItem)
        {
            if (_context.ShopItems == null)
            {
                return Problem("Entity set 'DinnerContext.ShopItems'  is null.");
            }

            if (shopItem.Ingredient == null)
            {
                return Problem("Ingredient name is empty");
            }
            var shopItemName = shopItem.Ingredient.Name;
            shopItem = await AddIngredientToList(shopItemName);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetShopItem", new { id = shopItem.ID }, shopItem);
        }

        private async Task<ShopItem> AddIngredientToList(string shopItemName)
        {
            var existingShopItem = await _context.ShopItems
            .Include(s => s.Ingredient)
            .SingleOrDefaultAsync(si => si.Ingredient.Name.Equals(shopItemName));
            if (existingShopItem != null)
            {
                // Already exists in shopping list
                if (existingShopItem.RecentlyUsed > 0)
                {
                    // It's in recently used section only. So revert to the "to buy" list and reset desc
                    existingShopItem.RecentlyUsed = 0;
                    existingShopItem.Description = "";
                }
                else
                {
                    // Add a + to the description if it already exists
                    existingShopItem.Description += " +";
                }
                return existingShopItem;
            }
            else
            {
                // new ingredient to shopping list
                var shopItem = new ShopItem();
                var ingredientItem = await _context.IngredientItem
                  .FirstOrDefaultAsync(i => i.Name == shopItemName);
                if (ingredientItem != null)
                {
                    shopItem.Ingredient = ingredientItem;
                }
                else
                {
                    shopItem.Ingredient = new IngredientItem();
                    shopItem.Ingredient.Name = shopItemName;
                }
                shopItem.RecentlyUsed = 0;
                shopItem.Description = "";
                _context.ShopItems.Add(shopItem);
                return shopItem;
            }
        }

        // POST: api/ShopItems/addDinner/5
        [HttpPost("addDinner/{id}")]
        public async Task<IActionResult> AddDinnerToList(long id)
        {
            if (_context.ShopItems == null)
            {
                return NotFound();
            }
            var dinnerItem = await _context.DinnerItems
              .AsNoTracking()
              .Include(d => d.Ingredients)
              .ThenInclude(ri => ri.Ingredient)
              .FirstOrDefaultAsync(d => d.ID == id);

            if (dinnerItem == null || dinnerItem.Ingredients == null)
            {
                return NotFound();
            }
            foreach (var recipeItem in dinnerItem.Ingredients)
            {
                if (recipeItem.Ingredient != null && recipeItem.Ingredient.Name != null)
                {
                    await AddIngredientToList(recipeItem.Ingredient.Name);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(dinnerItem.Name + " - added!");
        }

        // DELETE: api/ShopItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShopItem(long id)
        {
            if (_context.ShopItems == null)
            {
                return NotFound();
            }
            var shopItem = await _context.ShopItems.FindAsync(id);
            if (shopItem == null)
            {
                return NotFound();
            }

            _context.ShopItems.Remove(shopItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShopItemExists(long id)
        {
            return (_context.ShopItems?.Any(e => e.ID == id)).GetValueOrDefault();
        }
    }
}
