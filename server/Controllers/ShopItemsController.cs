using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MiddagApi.Models;

namespace MiddagApi.Controllers
{
    [Route("api/ShopItems")]
    [ApiController]
    public class ShopItemsController : ControllerBase
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly DinnerContext _context;

        public ShopItemsController(DinnerContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // GET: api/ShopItems
        [HttpGet("{categoryId}")]
        public async Task<ActionResult<IEnumerable<ShopItemResponse>>> GetShopItems(long categoryId)
        {
            var shopItems= await _context.ShopItems.Include(item => item.Category)
              .Include(item => item.Ingredient)
              .ThenInclude(ingredient => ingredient.ingredientType)
              .Where(item => item.Category != null && item.Category.ID == categoryId)
              .ToListAsync();

            var shopItemsDto = shopItems.Adapt<List<ShopItemResponse>>();
            return Ok(shopItemsDto);
        }

        // GET: api/ShopItems/ingredientTypes
        [HttpGet("ingredientTypes")]
        public async Task<ActionResult<IEnumerable<IngredientType>>> GetIngredientTypes()
        {
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

        // PUT: api/ShopItems/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<ActionResult<ShopItemResponse>> PutShopItem(long id, ShopItemResponse item)
        {
            if (id != item.ID)
            {
                return BadRequest();
            }

            var shopItem = item.Adapt<ShopItem>();

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

            var response = shopItem.Adapt<ShopItemResponse>();
            await _hubContext.Clients.All.SendAsync("ToggleShopItem", response);
            return Ok(response);
        }

        // PATCH: api/ShopItems/toggle/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("toggle/{id}")]
        public async Task<ActionResult<ShopItemResponse>> ToggleShopItem(long id)
        {
            var shopItem = await _context.ShopItems
              .Include(item => item.Ingredient)
              .Include(item => item.Category)
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
                var shopItemCategory = shopItem.Category;
                
                
                // Delete the older recent item if more than 10 recent items exist
                var recentItems = await _context.ShopItems
                    .Where(s => s.Category == shopItemCategory || s.Category == null)
                    .Where(s => s.RecentlyUsed > 0)
                    .OrderBy(s => -s.RecentlyUsed) // Order by RecentlyUsed ascending
                    .ToListAsync();

                if (recentItems.Count > 9)
                {
                    var itemsToDelete = recentItems.Skip(9); // Skip the first 9 items
                    _context.ShopItems.RemoveRange(itemsToDelete); // Remove the rest
                }

            }
            await _context.SaveChangesAsync();
            var response = shopItem.Adapt<ShopItemResponse>();
            await _hubContext.Clients.All.SendAsync("ToggleShopItem", response);
            return Ok(response);
        }

        // POST: api/ShopItems
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ShopItemResponse>> PostShopItem(ShopItemResponse item)
        {
            if (item.Name == null)
            {
                return BadRequest("Name cannot be empty");
            }
            
            var shopItem = await AddIngredientToList(item.Name, item.CategoryId);
            await _context.SaveChangesAsync();
            var response = shopItem.Adapt<ShopItemResponse>();
            await _hubContext.Clients.All.SendAsync("ToggleShopItem", response);
            return CreatedAtAction("PostShopItem", new { id = response.ID }, response);
        }

        private async Task<ShopItem> AddIngredientToList(string shopItemName, long? categoryId)
        {
            var existingShopItem = await _context.ShopItems
            .Include(s => s.Ingredient)
            .Include(s => s.Category)
            .SingleOrDefaultAsync(si => si.Ingredient.Name.Equals(shopItemName) && si.Category.ID == categoryId);
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
                shopItem.Category = await _context.ShopCategories.FindAsync(categoryId);
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
                    await AddIngredientToList(recipeItem.Ingredient.Name, 1);
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
